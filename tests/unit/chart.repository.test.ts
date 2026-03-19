import chartRepository, {
  PieChartData,
  LineChartData,
  BarChartData,
  DashboardSummary,
} from '../../src/repositories/chart.repository';
import prisma from '../../src/config/database';
import { DateFilter } from '../../src/validators/chart.validator';

// Mock Prisma
jest.mock('../../src/config/database', () => ({
  __esModule: true,
  default: {
    sale: {
      findMany: jest.fn(),
    },
  },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('Chart Repository', () => {
  const mockFilter: DateFilter = {
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPieChartData', () => {
    it('should return pie chart data grouped by category', async () => {
      const mockSales = [
        { category: 'Electronics', amount: 5000 },
        { category: 'Electronics', amount: 3000 },
        { category: 'Clothing', amount: 2000 },
        { category: 'Clothing', amount: 1500 },
        { category: 'Home', amount: 1000 },
      ];
      mockPrisma.sale.findMany.mockResolvedValue(mockSales as any);

      const result = await chartRepository.getPieChartData(mockFilter, 'category');

      expect(mockPrisma.sale.findMany).toHaveBeenCalledWith({
        where: {
          createdAt: {
            gte: mockFilter.startDate,
            lte: mockFilter.endDate,
          },
        },
        select: {
          category: true,
          amount: true,
        },
      });
      expect(result).toEqual([
        { label: 'Electronics', value: 8000 },
        { label: 'Clothing', value: 3500 },
        { label: 'Home', value: 1000 },
      ]);
    });

    it('should return pie chart data grouped by product', async () => {
      const mockSales = [
        { product: 'Product A', amount: 3000 },
        { product: 'Product B', amount: 2000 },
        { product: 'Product A', amount: 1500 },
      ];
      mockPrisma.sale.findMany.mockResolvedValue(mockSales as any);

      const result = await chartRepository.getPieChartData(mockFilter, 'product');

      expect(mockPrisma.sale.findMany).toHaveBeenCalledWith({
        where: {
          createdAt: {
            gte: mockFilter.startDate,
            lte: mockFilter.endDate,
          },
        },
        select: {
          product: true,
          amount: true,
        },
      });
      expect(result).toEqual([
        { label: 'Product A', value: 4500 },
        { label: 'Product B', value: 2000 },
      ]);
    });

    it('should use default groupBy (category) when not provided', async () => {
      const mockSales = [
        { category: 'Electronics', amount: 5000 },
      ];
      mockPrisma.sale.findMany.mockResolvedValue(mockSales as any);

      await chartRepository.getPieChartData(mockFilter);

      expect(mockPrisma.sale.findMany).toHaveBeenCalledWith({
        where: {
          createdAt: {
            gte: mockFilter.startDate,
            lte: mockFilter.endDate,
          },
        },
        select: {
          category: true,
          amount: true,
        },
      });
    });

    it('should return empty array when no sales found', async () => {
      mockPrisma.sale.findMany.mockResolvedValue([]);

      const result = await chartRepository.getPieChartData(mockFilter, 'category');

      expect(result).toEqual([]);
    });

    it('should handle single sale record', async () => {
      const mockSales = [{ category: 'Electronics', amount: 1000 }];
      mockPrisma.sale.findMany.mockResolvedValue(mockSales as any);

      const result = await chartRepository.getPieChartData(mockFilter, 'category');

      expect(result).toEqual([{ label: 'Electronics', value: 1000 }]);
    });

    it('should handle multiple sales with same category', async () => {
      const mockSales = [
        { category: 'Electronics', amount: 1000 },
        { category: 'Electronics', amount: 2000 },
        { category: 'Electronics', amount: 3000 },
      ];
      mockPrisma.sale.findMany.mockResolvedValue(mockSales as any);

      const result = await chartRepository.getPieChartData(mockFilter, 'category');

      expect(result).toEqual([{ label: 'Electronics', value: 6000 }]);
    });
  });

  describe('getLineChartData', () => {
    it('should return line chart data grouped by date', async () => {
      const mockSales = [
        { createdAt: new Date('2024-01-15'), amount: 1000, product: 'Product A' },
        { createdAt: new Date('2024-02-20'), amount: 1500, product: 'Product B' },
        { createdAt: new Date('2024-03-10'), amount: 2000, product: 'Product A' },
      ];
      mockPrisma.sale.findMany.mockResolvedValue(mockSales as any);

      const result = await chartRepository.getLineChartData(mockFilter, 'date');

      expect(result).toEqual([
        { date: '2024-01-15', value: 1000 },
        { date: '2024-02-20', value: 1500 },
        { date: '2024-03-10', value: 2000 },
      ]);
    });

    it('should return line chart data grouped by week', async () => {
      const mockSales = [
        { createdAt: new Date('2024-01-08'), amount: 1000, product: 'Product A' },
        { createdAt: new Date('2024-01-09'), amount: 1500, product: 'Product B' },
      ];
      mockPrisma.sale.findMany.mockResolvedValue(mockSales as any);

      const result = await chartRepository.getLineChartData(mockFilter, 'week');

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].date).toMatch(/Week \d+/);
    });

    it('should return line chart data grouped by month', async () => {
      const mockSales = [
        { createdAt: new Date('2024-01-15'), amount: 1000, product: 'Product A' },
        { createdAt: new Date('2024-01-20'), amount: 1500, product: 'Product B' },
        { createdAt: new Date('2024-02-10'), amount: 2000, product: 'Product A' },
      ];
      mockPrisma.sale.findMany.mockResolvedValue(mockSales as any);

      const result = await chartRepository.getLineChartData(mockFilter, 'month');

      expect(result).toEqual([
        { date: '2024-01', value: 2500 },
        { date: '2024-02', value: 2000 },
      ]);
    });

    it('should return data sorted by date', async () => {
      const mockSales = [
        { createdAt: new Date('2024-03-10'), amount: 2000, product: 'Product A' },
        { createdAt: new Date('2024-01-15'), amount: 1000, product: 'Product B' },
        { createdAt: new Date('2024-02-20'), amount: 1500, product: 'Product A' },
      ];
      mockPrisma.sale.findMany.mockResolvedValue(mockSales as any);

      const result = await chartRepository.getLineChartData(mockFilter, 'date');

      expect(result.map(r => r.date)).toEqual(['2024-01-15', '2024-02-20', '2024-03-10']);
    });

    it('should return empty array when no sales found', async () => {
      mockPrisma.sale.findMany.mockResolvedValue([]);

      const result = await chartRepository.getLineChartData(mockFilter, 'month');

      expect(result).toEqual([]);
    });

    it('should use default groupBy (date) when not provided', async () => {
      const mockSales = [
        { createdAt: new Date('2024-01-15'), amount: 1000, product: 'Product A' },
      ];
      mockPrisma.sale.findMany.mockResolvedValue(mockSales as any);

      await chartRepository.getLineChartData(mockFilter);

      expect(mockPrisma.sale.findMany).toHaveBeenCalledWith({
        where: {
          createdAt: {
            gte: mockFilter.startDate,
            lte: mockFilter.endDate,
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
      });
    });

    it('should aggregate values for same time period', async () => {
      const mockSales = [
        { createdAt: new Date('2024-01-10'), amount: 1000, product: 'Product A' },
        { createdAt: new Date('2024-01-15'), amount: 2000, product: 'Product B' },
      ];
      mockPrisma.sale.findMany.mockResolvedValue(mockSales as any);

      const result = await chartRepository.getLineChartData(mockFilter, 'month');

      expect(result).toEqual([{ date: '2024-01', value: 3000 }]);
    });
  });

  describe('getBarChartData', () => {
    it('should return bar chart data grouped by category', async () => {
      const mockSales = [
        { category: 'Electronics', amount: 5000, quantity: 10 },
        { category: 'Clothing', amount: 3000, quantity: 20 },
        { category: 'Electronics', amount: 2000, quantity: 5 },
      ];
      mockPrisma.sale.findMany.mockResolvedValue(mockSales as any);

      const result = await chartRepository.getBarChartData(mockFilter, 'category');

      expect(mockPrisma.sale.findMany).toHaveBeenCalledWith({
        where: {
          createdAt: {
            gte: mockFilter.startDate,
            lte: mockFilter.endDate,
          },
        },
        select: {
          category: true,
          amount: true,
          quantity: true,
        },
      });
      expect(result).toEqual([
        { label: 'Electronics', value: 7000 },
        { label: 'Clothing', value: 3000 },
      ]);
    });

    it('should return bar chart data grouped by product', async () => {
      const mockSales = [
        { product: 'Product A', amount: 3000, quantity: 10 },
        { product: 'Product B', amount: 2000, quantity: 15 },
        { product: 'Product A', amount: 1500, quantity: 5 },
      ];
      mockPrisma.sale.findMany.mockResolvedValue(mockSales as any);

      const result = await chartRepository.getBarChartData(mockFilter, 'product');

      expect(result).toEqual([
        { label: 'Product A', value: 4500 },
        { label: 'Product B', value: 2000 },
      ]);
    });

    it('should use default groupBy (category) when not provided', async () => {
      const mockSales = [
        { category: 'Electronics', amount: 5000, quantity: 10 },
      ];
      mockPrisma.sale.findMany.mockResolvedValue(mockSales as any);

      await chartRepository.getBarChartData(mockFilter);

      expect(mockPrisma.sale.findMany).toHaveBeenCalledWith({
        where: {
          createdAt: {
            gte: mockFilter.startDate,
            lte: mockFilter.endDate,
          },
        },
        select: {
          category: true,
          amount: true,
          quantity: true,
        },
      });
    });

    it('should return empty array when no sales found', async () => {
      mockPrisma.sale.findMany.mockResolvedValue([]);

      const result = await chartRepository.getBarChartData(mockFilter, 'category');

      expect(result).toEqual([]);
    });

    it('should handle single sale record', async () => {
      const mockSales = [{ category: 'Electronics', amount: 1000, quantity: 5 }];
      mockPrisma.sale.findMany.mockResolvedValue(mockSales as any);

      const result = await chartRepository.getBarChartData(mockFilter, 'category');

      expect(result).toEqual([{ label: 'Electronics', value: 1000 }]);
    });
  });

  describe('getDashboardSummary', () => {
    it('should return dashboard summary with correct calculations', async () => {
      const mockSales = [
        { amount: 5000, quantity: 10 },
        { amount: 3000, quantity: 5 },
        { amount: 2000, quantity: 3 },
      ];
      mockPrisma.sale.findMany.mockResolvedValue(mockSales as any);

      const result = await chartRepository.getDashboardSummary(mockFilter);

      expect(mockPrisma.sale.findMany).toHaveBeenCalledWith({
        where: {
          createdAt: {
            gte: mockFilter.startDate,
            lte: mockFilter.endDate,
          },
        },
        select: {
          amount: true,
          quantity: true,
        },
      });
      expect(result).toEqual({
        totalSales: 18,
        totalRevenue: 10000,
        totalOrders: 3,
        averageOrderValue: 3333.3333333333335,
      });
    });

    it('should return zeros when no sales found', async () => {
      mockPrisma.sale.findMany.mockResolvedValue([]);

      const result = await chartRepository.getDashboardSummary(mockFilter);

      expect(result).toEqual({
        totalSales: 0,
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0,
      });
    });

    it('should handle single sale record', async () => {
      const mockSales = [{ amount: 1000, quantity: 5 }];
      mockPrisma.sale.findMany.mockResolvedValue(mockSales as any);

      const result = await chartRepository.getDashboardSummary(mockFilter);

      expect(result).toEqual({
        totalSales: 5,
        totalRevenue: 1000,
        totalOrders: 1,
        averageOrderValue: 1000,
      });
    });

    it('should handle multiple sale records with same amounts', async () => {
      const mockSales = [
        { amount: 1000, quantity: 5 },
        { amount: 1000, quantity: 5 },
        { amount: 1000, quantity: 5 },
      ];
      mockPrisma.sale.findMany.mockResolvedValue(mockSales as any);

      const result = await chartRepository.getDashboardSummary(mockFilter);

      expect(result).toEqual({
        totalSales: 15,
        totalRevenue: 3000,
        totalOrders: 3,
        averageOrderValue: 1000,
      });
    });

    it('should calculate average order value correctly', async () => {
      const mockSales = [
        { amount: 100, quantity: 1 },
        { amount: 200, quantity: 2 },
        { amount: 300, quantity: 3 },
        { amount: 400, quantity: 4 },
      ];
      mockPrisma.sale.findMany.mockResolvedValue(mockSales as any);

      const result = await chartRepository.getDashboardSummary(mockFilter);

      expect(result.averageOrderValue).toBe(250);
    });
  });

  describe('getTrendData', () => {
    it('should return trend data using getLineChartData', async () => {
      const mockSales = [
        { createdAt: new Date('2024-01-15'), amount: 1000, product: 'Product A' },
        { createdAt: new Date('2024-02-20'), amount: 1500, product: 'Product B' },
      ];
      mockPrisma.sale.findMany.mockResolvedValue(mockSales as any);

      const result = await chartRepository.getTrendData(mockFilter);

      expect(result).toEqual([
        { date: '2024-01-15', value: 1000 },
        { date: '2024-02-20', value: 1500 },
      ]);
    });

    it('should return empty array when no sales found', async () => {
      mockPrisma.sale.findMany.mockResolvedValue([]);

      const result = await chartRepository.getTrendData(mockFilter);

      expect(result).toEqual([]);
    });
  });

  describe('Date Filter Validation', () => {
    it('should filter sales within date range correctly', async () => {
      const specificFilter: DateFilter = {
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-06-30'),
      };

      const mockSales = [
        { category: 'Electronics', amount: 5000, quantity: 10 },
      ];
      mockPrisma.sale.findMany.mockResolvedValue(mockSales as any);

      await chartRepository.getBarChartData(specificFilter, 'category');

      expect(mockPrisma.sale.findMany).toHaveBeenCalledWith({
        where: {
          createdAt: {
            gte: specificFilter.startDate,
            lte: specificFilter.endDate,
          },
        },
        select: {
          category: true,
          amount: true,
          quantity: true,
        },
      });
    });

    it('should handle full year date range', async () => {
      const yearFilter: DateFilter = {
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
      };

      const mockSales = [
        { category: 'Electronics', amount: 5000, quantity: 10 },
      ];
      mockPrisma.sale.findMany.mockResolvedValue(mockSales as any);

      await chartRepository.getPieChartData(yearFilter, 'category');

      expect(mockPrisma.sale.findMany).toHaveBeenCalledWith({
        where: {
          createdAt: {
            gte: yearFilter.startDate,
            lte: yearFilter.endDate,
          },
        },
        select: {
          category: true,
          amount: true,
        },
      });
    });
  });
});
