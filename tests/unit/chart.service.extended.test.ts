import chartService from '../../src/services/chart.service';
import chartRepository from '../../src/repositories/chart.repository';
import { DateFilter } from '../../src/validators/chart.validator';

// Mock the repository
jest.mock('../../src/repositories/chart.repository', () => ({
  __esModule: true,
  default: {
    getPieChartData: jest.fn(),
    getLineChartData: jest.fn(),
    getBarChartData: jest.fn(),
    getDashboardSummary: jest.fn(),
    getTrendData: jest.fn(),
  },
}));

const mockChartRepository = chartRepository as jest.Mocked<typeof chartRepository>;

describe('Chart Service - Extended Tests', () => {
  const mockFilter: DateFilter = {
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPieChartData - Extended', () => {
    it('should return empty array when repository returns empty', async () => {
      mockChartRepository.getPieChartData.mockResolvedValue([]);

      const result = await chartService.getPieChartData(mockFilter, 'category');

      expect(result).toEqual([]);
      expect(mockChartRepository.getPieChartData).toHaveBeenCalledWith(mockFilter, 'category');
    });

    it('should handle multiple categories', async () => {
      const mockData = [
        { label: 'Electronics', value: 5000 },
        { label: 'Clothing', value: 3000 },
        { label: 'Home', value: 2000 },
        { label: 'Sports', value: 1500 },
        { label: 'Books', value: 1000 },
      ];
      mockChartRepository.getPieChartData.mockResolvedValue(mockData);

      const result = await chartService.getPieChartData(mockFilter, 'category');

      expect(result).toHaveLength(5);
      expect(result[0].label).toBe('Electronics');
      expect(result[4].label).toBe('Books');
    });

    it('should handle large values', async () => {
      const mockData = [
        { label: 'Category A', value: 999999999 },
        { label: 'Category B', value: 888888888 },
      ];
      mockChartRepository.getPieChartData.mockResolvedValue(mockData);

      const result = await chartService.getPieChartData(mockFilter, 'category');

      expect(result[0].value).toBe(999999999);
      expect(result[1].value).toBe(888888888);
    });

    it('should handle zero values', async () => {
      const mockData = [
        { label: 'Category A', value: 0 },
        { label: 'Category B', value: 1000 },
      ];
      mockChartRepository.getPieChartData.mockResolvedValue(mockData);

      const result = await chartService.getPieChartData(mockFilter, 'category');

      expect(result[0].value).toBe(0);
    });

    it('should handle negative values if returned', async () => {
      const mockData = [
        { label: 'Category A', value: -1000 },
        { label: 'Category B', value: 2000 },
      ];
      mockChartRepository.getPieChartData.mockResolvedValue(mockData);

      const result = await chartService.getPieChartData(mockFilter, 'category');

      expect(result[0].value).toBe(-1000);
    });

    it('should handle single category', async () => {
      const mockData = [{ label: 'Only Category', value: 5000 }];
      mockChartRepository.getPieChartData.mockResolvedValue(mockData);

      const result = await chartService.getPieChartData(mockFilter, 'category');

      expect(result).toHaveLength(1);
      expect(result[0].label).toBe('Only Category');
    });

    it('should handle special characters in labels', async () => {
      const mockData = [
        { label: 'Category & More', value: 1000 },
        { label: "Product's Name", value: 2000 },
        { label: 'Item "Deluxe"', value: 3000 },
      ];
      mockChartRepository.getPieChartData.mockResolvedValue(mockData);

      const result = await chartService.getPieChartData(mockFilter, 'category');

      expect(result[0].label).toBe('Category & More');
      expect(result[1].label).toBe("Product's Name");
    });

    it('should handle unicode characters in labels', async () => {
      const mockData = [
        { label: 'Café', value: 1000 },
        { label: '日本語', value: 2000 },
        { label: 'Español', value: 3000 },
      ];
      mockChartRepository.getPieChartData.mockResolvedValue(mockData);

      const result = await chartService.getPieChartData(mockFilter, 'category');

      expect(result[0].label).toBe('Café');
      expect(result[1].label).toBe('日本語');
    });
  });

  describe('getLineChartData - Extended', () => {
    it('should return empty array when repository returns empty', async () => {
      mockChartRepository.getLineChartData.mockResolvedValue([]);

      const result = await chartService.getLineChartData(mockFilter, 'date');

      expect(result).toEqual([]);
    });

    it('should handle multiple data points', async () => {
      const mockData = [
        { date: '2024-01', value: 1000 },
        { date: '2024-02', value: 1500 },
        { date: '2024-03', value: 2000 },
        { date: '2024-04', value: 2500 },
        { date: '2024-05', value: 3000 },
      ];
      mockChartRepository.getLineChartData.mockResolvedValue(mockData);

      const result = await chartService.getLineChartData(mockFilter, 'month');

      expect(result).toHaveLength(5);
      expect(result[0].date).toBe('2024-01');
      expect(result[4].date).toBe('2024-05');
    });

    it('should handle week grouping', async () => {
      const mockData = [
        { date: 'Week 1', value: 1000 },
        { date: 'Week 2', value: 1500 },
        { date: 'Week 3', value: 2000 },
      ];
      mockChartRepository.getLineChartData.mockResolvedValue(mockData);

      const result = await chartService.getLineChartData(mockFilter, 'week');

      expect(result[0].date).toBe('Week 1');
      expect(result[2].date).toBe('Week 3');
    });

    it('should handle single data point', async () => {
      const mockData = [{ date: '2024-06', value: 5000 }];
      mockChartRepository.getLineChartData.mockResolvedValue(mockData);

      const result = await chartService.getLineChartData(mockFilter, 'month');

      expect(result).toHaveLength(1);
    });

    it('should handle zero values', async () => {
      const mockData = [
        { date: '2024-01', value: 0 },
        { date: '2024-02', value: 1000 },
      ];
      mockChartRepository.getLineChartData.mockResolvedValue(mockData);

      const result = await chartService.getLineChartData(mockFilter, 'month');

      expect(result[0].value).toBe(0);
    });

    it('should handle descending values', async () => {
      const mockData = [
        { date: '2024-01', value: 5000 },
        { date: '2024-02', value: 3000 },
        { date: '2024-03', value: 1000 },
      ];
      mockChartRepository.getLineChartData.mockResolvedValue(mockData);

      const result = await chartService.getLineChartData(mockFilter, 'month');

      expect(result[0].value).toBe(5000);
      expect(result[2].value).toBe(1000);
    });

    it('should handle fluctuating values', async () => {
      const mockData = [
        { date: '2024-01', value: 1000 },
        { date: '2024-02', value: 3000 },
        { date: '2024-03', value: 1500 },
        { date: '2024-04', value: 4000 },
      ];
      mockChartRepository.getLineChartData.mockResolvedValue(mockData);

      const result = await chartService.getLineChartData(mockFilter, 'month');

      expect(result).toHaveLength(4);
    });
  });

  describe('getBarChartData - Extended', () => {
    it('should return empty array when repository returns empty', async () => {
      mockChartRepository.getBarChartData.mockResolvedValue([]);

      const result = await chartService.getBarChartData(mockFilter, 'category');

      expect(result).toEqual([]);
    });

    it('should handle multiple categories', async () => {
      const mockData = [
        { label: 'Electronics', value: 5000 },
        { label: 'Clothing', value: 3000 },
        { label: 'Home', value: 2000 },
      ];
      mockChartRepository.getBarChartData.mockResolvedValue(mockData);

      const result = await chartService.getBarChartData(mockFilter, 'category');

      expect(result).toHaveLength(3);
    });

    it('should handle product grouping', async () => {
      const mockData = [
        { label: 'Product A', value: 3000 },
        { label: 'Product B', value: 2000 },
      ];
      mockChartRepository.getBarChartData.mockResolvedValue(mockData);

      const result = await chartService.getBarChartData(mockFilter, 'product');

      expect(result[0].label).toBe('Product A');
    });

    it('should handle single bar', async () => {
      const mockData = [{ label: 'Only Category', value: 5000 }];
      mockChartRepository.getBarChartData.mockResolvedValue(mockData);

      const result = await chartService.getBarChartData(mockFilter, 'category');

      expect(result).toHaveLength(1);
    });

    it('should handle equal values', async () => {
      const mockData = [
        { label: 'Category A', value: 1000 },
        { label: 'Category B', value: 1000 },
        { label: 'Category C', value: 1000 },
      ];
      mockChartRepository.getBarChartData.mockResolvedValue(mockData);

      const result = await chartService.getBarChartData(mockFilter, 'category');

      expect(result.every(r => r.value === 1000)).toBe(true);
    });
  });

  describe('getDashboardSummary - Extended', () => {
    it('should return summary with all required fields', async () => {
      const mockSummary = {
        totalSales: 100,
        totalRevenue: 50000,
        averageOrderValue: 500,
        totalOrders: 100,
      };
      mockChartRepository.getDashboardSummary.mockResolvedValue(mockSummary);

      const result = await chartService.getDashboardSummary(mockFilter);

      expect(result).toHaveProperty('totalSales');
      expect(result).toHaveProperty('totalRevenue');
      expect(result).toHaveProperty('averageOrderValue');
      expect(result).toHaveProperty('totalOrders');
    });

    it('should handle zero summary', async () => {
      const mockSummary = {
        totalSales: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        totalOrders: 0,
      };
      mockChartRepository.getDashboardSummary.mockResolvedValue(mockSummary);

      const result = await chartService.getDashboardSummary(mockFilter);

      expect(result.totalSales).toBe(0);
      expect(result.totalRevenue).toBe(0);
    });

    it('should handle large numbers', async () => {
      const mockSummary = {
        totalSales: 1000000,
        totalRevenue: 999999999.99,
        averageOrderValue: 9999.99,
        totalOrders: 100000,
      };
      mockChartRepository.getDashboardSummary.mockResolvedValue(mockSummary);

      const result = await chartService.getDashboardSummary(mockFilter);

      expect(result.totalRevenue).toBe(999999999.99);
    });

    it('should handle high average order value', async () => {
      const mockSummary = {
        totalSales: 10,
        totalRevenue: 1000000,
        averageOrderValue: 100000,
        totalOrders: 10,
      };
      mockChartRepository.getDashboardSummary.mockResolvedValue(mockSummary);

      const result = await chartService.getDashboardSummary(mockFilter);

      expect(result.averageOrderValue).toBe(100000);
    });
  });

  describe('getChartDataByType - Extended', () => {
    it('should handle uppercase chart type PIE', async () => {
      const mockData = [{ label: 'Category', value: 1000 }];
      mockChartRepository.getPieChartData.mockResolvedValue(mockData);

      const result = await chartService.getChartDataByType('PIE', mockFilter);

      expect(result).toEqual(mockData);
    });

    it('should handle mixed case chart type PiE', async () => {
      const mockData = [{ label: 'Category', value: 1000 }];
      mockChartRepository.getPieChartData.mockResolvedValue(mockData);

      const result = await chartService.getChartDataByType('PiE', mockFilter);

      expect(result).toEqual(mockData);
    });

    it('should handle lowercase chart type pie', async () => {
      const mockData = [{ label: 'Category', value: 1000 }];
      mockChartRepository.getPieChartData.mockResolvedValue(mockData);

      const result = await chartService.getChartDataByType('pie', mockFilter);

      expect(result).toEqual(mockData);
    });

    it('should handle LINE chart type', async () => {
      const mockData = [{ date: '2024-01', value: 1000 }];
      mockChartRepository.getLineChartData.mockResolvedValue(mockData);

      const result = await chartService.getChartDataByType('LINE', mockFilter);

      expect(result).toEqual(mockData);
    });

    it('should handle BAR chart type', async () => {
      const mockData = [{ label: 'Category', value: 1000 }];
      mockChartRepository.getBarChartData.mockResolvedValue(mockData);

      const result = await chartService.getChartDataByType('BAR', mockFilter);

      expect(result).toEqual(mockData);
    });

    it('should handle SUMMARY chart type', async () => {
      const mockSummary = {
        totalSales: 100,
        totalRevenue: 50000,
        averageOrderValue: 500,
        totalOrders: 100,
      };
      mockChartRepository.getDashboardSummary.mockResolvedValue(mockSummary);

      const result = await chartService.getChartDataByType('SUMMARY', mockFilter);

      expect(result).toEqual(mockSummary);
    });

    it('should handle TREND chart type', async () => {
      const mockData = [{ date: '2024-01', value: 1000 }];
      mockChartRepository.getLineChartData.mockResolvedValue(mockData);

      const result = await chartService.getChartDataByType('TREND', mockFilter);

      expect(result).toEqual(mockData);
    });

    it('should throw error for completely unknown chart type', async () => {
      await expect(
        chartService.getChartDataByType('unknown_chart', mockFilter)
      ).rejects.toThrow('Unsupported chart type: unknown_chart');
    });

    it('should throw error for empty string chart type', async () => {
      await expect(
        chartService.getChartDataByType('', mockFilter)
      ).rejects.toThrow('Unsupported chart type: ');
    });

    it('should throw error for numeric string chart type', async () => {
      await expect(
        chartService.getChartDataByType('123', mockFilter)
      ).rejects.toThrow('Unsupported chart type: 123');
    });

    it('should handle groupBy parameter for pie chart', async () => {
      const mockData = [{ label: 'Product', value: 1000 }];
      mockChartRepository.getPieChartData.mockResolvedValue(mockData);

      await chartService.getChartDataByType('pie', mockFilter, 'product');

      expect(mockChartRepository.getPieChartData).toHaveBeenCalledWith(mockFilter, 'product');
    });

    it('should handle groupBy parameter for line chart', async () => {
      const mockData = [{ date: '2024-01', value: 1000 }];
      mockChartRepository.getLineChartData.mockResolvedValue(mockData);

      await chartService.getChartDataByType('line', mockFilter, 'month');

      expect(mockChartRepository.getLineChartData).toHaveBeenCalledWith(mockFilter, 'month');
    });

    it('should handle groupBy parameter for bar chart', async () => {
      const mockData = [{ label: 'Category', value: 1000 }];
      mockChartRepository.getBarChartData.mockResolvedValue(mockData);

      await chartService.getChartDataByType('bar', mockFilter, 'product');

      expect(mockChartRepository.getBarChartData).toHaveBeenCalledWith(mockFilter, 'product');
    });

    it('should ignore groupBy for summary chart type', async () => {
      const mockSummary = {
        totalSales: 100,
        totalRevenue: 50000,
        averageOrderValue: 500,
        totalOrders: 100,
      };
      mockChartRepository.getDashboardSummary.mockResolvedValue(mockSummary);

      await chartService.getChartDataByType('summary', mockFilter, 'category');

      expect(mockChartRepository.getDashboardSummary).toHaveBeenCalledWith(mockFilter);
    });

    it('should handle non-string groupBy (number)', async () => {
      const mockData = [{ label: 'Category', value: 1000 }];
      mockChartRepository.getPieChartData.mockResolvedValue(mockData);

      await chartService.getChartDataByType('pie', mockFilter, 123 as any);

      expect(mockChartRepository.getPieChartData).toHaveBeenCalledWith(mockFilter, undefined);
    });

    it('should handle non-string groupBy (object)', async () => {
      const mockData = [{ label: 'Category', value: 1000 }];
      mockChartRepository.getPieChartData.mockResolvedValue(mockData);

      await chartService.getChartDataByType('pie', mockFilter, {} as any);

      expect(mockChartRepository.getPieChartData).toHaveBeenCalledWith(mockFilter, undefined);
    });

    it('should handle non-string groupBy (array)', async () => {
      const mockData = [{ label: 'Category', value: 1000 }];
      mockChartRepository.getPieChartData.mockResolvedValue(mockData);

      await chartService.getChartDataByType('pie', mockFilter, [] as any);

      expect(mockChartRepository.getPieChartData).toHaveBeenCalledWith(mockFilter, undefined);
    });

    it('should handle null groupBy', async () => {
      const mockData = [{ label: 'Category', value: 1000 }];
      mockChartRepository.getPieChartData.mockResolvedValue(mockData);

      await chartService.getChartDataByType('pie', mockFilter, null as any);

      expect(mockChartRepository.getPieChartData).toHaveBeenCalledWith(mockFilter, undefined);
    });
  });

  describe('Service Method Independence', () => {
    it('should not call other methods when getPieChartData is called', async () => {
      mockChartRepository.getPieChartData.mockResolvedValue([]);

      await chartService.getPieChartData(mockFilter, 'category');

      expect(mockChartRepository.getLineChartData).not.toHaveBeenCalled();
      expect(mockChartRepository.getBarChartData).not.toHaveBeenCalled();
      expect(mockChartRepository.getDashboardSummary).not.toHaveBeenCalled();
    });

    it('should not call other methods when getLineChartData is called', async () => {
      mockChartRepository.getLineChartData.mockResolvedValue([]);

      await chartService.getLineChartData(mockFilter, 'date');

      expect(mockChartRepository.getPieChartData).not.toHaveBeenCalled();
      expect(mockChartRepository.getBarChartData).not.toHaveBeenCalled();
      expect(mockChartRepository.getDashboardSummary).not.toHaveBeenCalled();
    });

    it('should not call other methods when getBarChartData is called', async () => {
      mockChartRepository.getBarChartData.mockResolvedValue([]);

      await chartService.getBarChartData(mockFilter, 'category');

      expect(mockChartRepository.getPieChartData).not.toHaveBeenCalled();
      expect(mockChartRepository.getLineChartData).not.toHaveBeenCalled();
      expect(mockChartRepository.getDashboardSummary).not.toHaveBeenCalled();
    });

    it('should not call other methods when getDashboardSummary is called', async () => {
      mockChartRepository.getDashboardSummary.mockResolvedValue({
        totalSales: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        totalOrders: 0,
      });

      await chartService.getDashboardSummary(mockFilter);

      expect(mockChartRepository.getPieChartData).not.toHaveBeenCalled();
      expect(mockChartRepository.getLineChartData).not.toHaveBeenCalled();
      expect(mockChartRepository.getBarChartData).not.toHaveBeenCalled();
    });
  });

  describe('Concurrent Calls', () => {
    it('should handle multiple concurrent calls to same method', async () => {
      mockChartRepository.getPieChartData.mockResolvedValue([{ label: 'Cat', value: 1000 }]);

      const [result1, result2, result3] = await Promise.all([
        chartService.getPieChartData(mockFilter, 'category'),
        chartService.getPieChartData(mockFilter, 'product'),
        chartService.getPieChartData(mockFilter, 'category'),
      ]);

      expect(result1).toBeDefined();
      expect(result2).toBeDefined();
      expect(result3).toBeDefined();
      expect(mockChartRepository.getPieChartData).toHaveBeenCalledTimes(3);
    });

    it('should handle multiple concurrent calls to different methods', async () => {
      mockChartRepository.getPieChartData.mockResolvedValue([{ label: 'Cat', value: 1000 }]);
      mockChartRepository.getLineChartData.mockResolvedValue([{ date: '2024-01', value: 1000 }]);
      mockChartRepository.getBarChartData.mockResolvedValue([{ label: 'Bar', value: 1000 }]);
      mockChartRepository.getDashboardSummary.mockResolvedValue({
        totalSales: 100,
        totalRevenue: 1000,
        averageOrderValue: 10,
        totalOrders: 100,
      });

      const [pie, line, bar, summary] = await Promise.all([
        chartService.getPieChartData(mockFilter, 'category'),
        chartService.getLineChartData(mockFilter, 'date'),
        chartService.getBarChartData(mockFilter, 'category'),
        chartService.getDashboardSummary(mockFilter),
      ]);

      expect(pie).toBeDefined();
      expect(line).toBeDefined();
      expect(bar).toBeDefined();
      expect(summary).toBeDefined();
    });
  });
});
