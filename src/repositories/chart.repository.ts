import prisma from '../config/database';
import { DateFilter } from '../validators/chart.validator';

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
  [key: string]: any;
  amount: number;
  quantity: number;
  createdAt: Date;
  category?: string;
  product?: string;
}

export class ChartRepository {
  async getPieChartData(filter: DateFilter, groupBy?: string): Promise<PieChartData[]> {
    const groupField = groupBy || 'category';
    const sales = await prisma.sale.findMany({
      where: {
        createdAt: {
          gte: filter.startDate,
          lte: filter.endDate,
        },
      },
      select: {
        [groupField]: true,
        amount: true,
      },
    }) as SaleRecord[];

    const grouped = sales.reduce((acc, sale) => {
      const label = sale[groupField] as string;
      acc[label] = (acc[label] || 0) + sale.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped).map(([label, value]) => ({ label, value }));
  }

  async getLineChartData(filter: DateFilter, groupBy?: string): Promise<LineChartData[]> {
    const groupField = groupBy || 'date';
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

    const grouped = sales.reduce((acc: Record<string, number>, sale: SaleRecord) => {
      let key: string;

      if (groupBy === 'date') {
        key = sale.createdAt.toISOString().split('T')[0];
      } else if (groupBy === 'week') {
        const date = sale.createdAt;
        const startOfYear = new Date(date.getFullYear(), 0, 1);
        const weekNumber = Math.ceil((((date.getTime() - startOfYear.getTime()) / 86400000) + startOfYear.getDay() + 1) / 7);
        key = `Week ${weekNumber}`;
      } else if (groupBy === 'month') {
        key = sale.createdAt.toISOString().slice(0, 7);
      } else {
        key = sale[groupBy as keyof typeof sale] as string || 'Unknown';
      }

      acc[key] = (acc[key] || 0) + sale.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  async getBarChartData(filter: DateFilter, groupBy?: string): Promise<BarChartData[]> {
    const groupField = groupBy || 'category';
    const sales = await prisma.sale.findMany({
      where: {
        createdAt: {
          gte: filter.startDate,
          lte: filter.endDate,
        },
      },
      select: {
        [groupField]: true,
        amount: true,
        quantity: true,
      },
    }) as SaleRecord[];

    const grouped = sales.reduce((acc: Record<string, { amount: number; quantity: number }>, sale: SaleRecord) => {
      const label = sale[groupField] as string;
      if (!acc[label]) {
        acc[label] = { amount: 0, quantity: 0 };
      }
      acc[label].amount += sale.amount;
      acc[label].quantity += sale.quantity;
      return acc;
    }, {} as Record<string, { amount: number; quantity: number }>);

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
    }) as SaleRecord[];

    const totalRevenue = sales.reduce((sum: number, sale: SaleRecord) => sum + sale.amount, 0);
    const totalOrders = sales.length;
    const totalSales = sales.reduce((sum: number, sale: SaleRecord) => sum + sale.quantity, 0);
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
