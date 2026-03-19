import prisma from '../config/database';
import type { DateFilter, ChartQuery } from '../validators/chart.validator';

export interface PieChartData {
  label: string;
  value: number;
}

export interface LineChartData {
  date: string;
  value: number;
  label?: string;
}

export interface BarChartData {
  label: string;
  value: number;
}

export interface DashboardSummary {
  totalSales: number;
  totalRevenue: number;
  averageOrderValue: number;
  totalOrders: number;
}

interface SaleRecord {
  amount: number;
  quantity?: number;
  createdAt?: Date;
  category?: string;
  product?: string;
}

export class ChartRepository {
  private getISOWeek(date: Date): { year: number; week: number } {
    const tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = tmp.getUTCDay() || 7; // Monday=1, Sunday=7
    tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
    const week = Math.ceil((((tmp.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return { year: tmp.getUTCFullYear(), week };
  }

  async getPieChartData(filter: DateFilter, groupBy?: ChartQuery['groupBy']): Promise<PieChartData[]> {
    const groupField = groupBy === 'product' ? 'product' : 'category';

    const pieSelect = groupField === 'product'
      ? { product: true, amount: true }
      : { category: true, amount: true };

    const sales = await prisma.sale.findMany({
      where: {
        createdAt: {
          gte: filter.startDate,
          lte: filter.endDate,
        },
      },
      select: pieSelect,
    }) as SaleRecord[];

    const grouped = sales.reduce((acc: Record<string, number>, sale) => {
      const label = (sale[groupField as 'category' | 'product'] ?? 'Unknown') as string;
      acc[label] = (acc[label] || 0) + sale.amount;
      return acc;
    }, {});

    return Object.entries(grouped).map(([label, value]) => ({ label, value }));
  }

  async getLineChartData(
    filter: DateFilter,
    groupBy?: ChartQuery['groupBy']
  ): Promise<LineChartData[]> {
    const sales = await prisma.sale.findMany({
      where: {
        createdAt: {
          gte: filter.startDate,
          lte: filter.endDate,
        },
      },
      select: {
        createdAt: true,
        amount: true,
        product: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    }) as SaleRecord[];

    const grouped = sales.reduce((acc: Record<string, number>, sale) => {
      let key: string;

      if (!groupBy || groupBy === 'date') {
        key = sale.createdAt!.toISOString().split('T')[0];
      } else if (groupBy === 'week') {
        const { week } = this.getISOWeek(sale.createdAt!);
        key = `Week ${week}`;
      } else if (groupBy === 'month') {
        key = sale.createdAt!.toISOString().slice(0, 7);
      } else {
        key = (sale[groupBy as 'category' | 'product'] ?? 'Unknown') as string;
      }

      acc[key] = (acc[key] || 0) + sale.amount;
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  async getBarChartData(filter: DateFilter, groupBy?: ChartQuery['groupBy']): Promise<BarChartData[]> {
    const groupField = groupBy === 'product' ? 'product' : 'category';

    const barSelect = groupField === 'product'
      ? { product: true, amount: true, quantity: true }
      : { category: true, amount: true, quantity: true };

    const sales = await prisma.sale.findMany({
      where: {
        createdAt: {
          gte: filter.startDate,
          lte: filter.endDate,
        },
      },
      select: barSelect,
    }) as SaleRecord[];

    const grouped = sales.reduce((acc: Record<string, { amount: number; quantity: number }>, sale) => {
      const label = (sale[groupField as 'category' | 'product'] ?? 'Unknown') as string;
      if (!acc[label]) {
        acc[label] = { amount: 0, quantity: 0 };
      }
      acc[label].amount += sale.amount;
      acc[label].quantity += sale.quantity!;
      return acc;
    }, {});

    return Object.entries(grouped).map(([label, data]) => ({ label, value: data.amount }));
  }

  async getDashboardSummary(filter: DateFilter): Promise<DashboardSummary> {
    const sales = await prisma.sale.findMany({
      where: {
        createdAt: {
          gte: filter.startDate,
          lte: filter.endDate,
        },
      },
      select: {
        amount: true,
        quantity: true,
      },
    }) as Array<{ amount: number; quantity: number }>;

    const totalRevenue = sales.reduce((sum, s) => sum + s.amount, 0);
    const totalOrders = sales.length;
    const totalSales = sales.reduce((sum, s) => sum + s.quantity, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalSales,
      totalRevenue,
      averageOrderValue,
      totalOrders,
    };
  }

  async getTrendData(filter: DateFilter): Promise<LineChartData[]> {
    return this.getLineChartData(filter, 'date');
  }
}

export default new ChartRepository();
