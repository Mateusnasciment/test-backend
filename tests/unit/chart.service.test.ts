import chartService from '../../src/services/chart.service';
import chartRepository from '../../src/repositories/chart.repository';
import { DateFilter } from '../../src/validators/chart.validator';

// Mock the repository
jest.mock('../../src/repositories/chart.repository', () => ({
  getPieChartData: jest.fn(),
  getLineChartData: jest.fn(),
  getBarChartData: jest.fn(),
  getDashboardSummary: jest.fn(),
  getTrendData: jest.fn(),
}));

describe('Chart Service', () => {
  const mockFilter: DateFilter = {
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPieChartData', () => {
    it('should return pie chart data grouped by category', async () => {
      const mockData = [
        { label: 'Electronics', value: 5000 },
        { label: 'Clothing', value: 3000 },
        { label: 'Home', value: 2000 },
      ];
      (chartRepository.getPieChartData as jest.Mock).mockResolvedValue(mockData);

      const result = await chartService.getPieChartData(mockFilter, 'category');

      expect(chartRepository.getPieChartData).toHaveBeenCalledWith(mockFilter, 'category');
      expect(result).toEqual(mockData);
    });

    it('should use default groupBy when not provided', async () => {
      const mockData = [{ label: 'Category1', value: 1000 }];
      (chartRepository.getPieChartData as jest.Mock).mockResolvedValue(mockData);

      await chartService.getPieChartData(mockFilter);

      expect(chartRepository.getPieChartData).toHaveBeenCalledWith(mockFilter, undefined);
    });
  });

  describe('getLineChartData', () => {
    it('should return line chart data for trend analysis', async () => {
      const mockData = [
        { date: '2024-01', value: 1000 },
        { date: '2024-02', value: 1500 },
        { date: '2024-03', value: 2000 },
      ];
      (chartRepository.getLineChartData as jest.Mock).mockResolvedValue(mockData);

      const result = await chartService.getLineChartData(mockFilter, 'month');

      expect(chartRepository.getLineChartData).toHaveBeenCalledWith(mockFilter, 'month');
      expect(result).toEqual(mockData);
    });
  });

  describe('getBarChartData', () => {
    it('should return bar chart data for comparison', async () => {
      const mockData = [
        { label: 'Electronics', value: 5000 },
        { label: 'Clothing', value: 3000 },
      ];
      (chartRepository.getBarChartData as jest.Mock).mockResolvedValue(mockData);

      const result = await chartService.getBarChartData(mockFilter, 'category');

      expect(chartRepository.getBarChartData).toHaveBeenCalledWith(mockFilter, 'category');
      expect(result).toEqual(mockData);
    });
  });

  describe('getDashboardSummary', () => {
    it('should return dashboard summary metrics', async () => {
      const mockSummary = {
        totalSales: 100,
        totalRevenue: 50000,
        averageOrderValue: 500,
        totalOrders: 100,
      };
      (chartRepository.getDashboardSummary as jest.Mock).mockResolvedValue(mockSummary);

      const result = await chartService.getDashboardSummary(mockFilter);

      expect(chartRepository.getDashboardSummary).toHaveBeenCalledWith(mockFilter);
      expect(result).toEqual(mockSummary);
    });
  });

  describe('getChartDataByType', () => {
    it('should return pie chart data for "pie" type', async () => {
      const mockData = [{ label: 'Category', value: 1000 }];
      (chartRepository.getPieChartData as jest.Mock).mockResolvedValue(mockData);

      const result = await chartService.getChartDataByType('pie', mockFilter);

      expect(chartRepository.getPieChartData).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });

    it('should return line chart data for "line" type', async () => {
      const mockData = [{ date: '2024-01', value: 1000 }];
      (chartRepository.getLineChartData as jest.Mock).mockResolvedValue(mockData);

      const result = await chartService.getChartDataByType('line', mockFilter);

      expect(chartRepository.getLineChartData).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });

    it('should return bar chart data for "bar" type', async () => {
      const mockData = [{ label: 'Category', value: 1000 }];
      (chartRepository.getBarChartData as jest.Mock).mockResolvedValue(mockData);

      const result = await chartService.getChartDataByType('bar', mockFilter);

      expect(chartRepository.getBarChartData).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });

    it('should return summary for "summary" type', async () => {
      const mockSummary = {
        totalSales: 100,
        totalRevenue: 50000,
        averageOrderValue: 500,
        totalOrders: 100,
      };
      (chartRepository.getDashboardSummary as jest.Mock).mockResolvedValue(mockSummary);

      const result = await chartService.getChartDataByType('summary', mockFilter);

      expect(chartRepository.getDashboardSummary).toHaveBeenCalled();
      expect(result).toEqual(mockSummary);
    });

    it('should return trend data for "trend" type', async () => {
      const mockData = [{ date: '2024-01', value: 1000 }];
      (chartRepository.getLineChartData as jest.Mock).mockResolvedValue(mockData);

      const result = await chartService.getChartDataByType('trend', mockFilter);

      expect(chartRepository.getLineChartData).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });

    it('should throw error for unsupported chart type', async () => {
      await expect(
        chartService.getChartDataByType('unknown', mockFilter)
      ).rejects.toThrow('Unsupported chart type: unknown');
    });

    it('should handle case-insensitive chart types', async () => {
      const mockData = [{ label: 'Category', value: 1000 }];
      (chartRepository.getPieChartData as jest.Mock).mockResolvedValue(mockData);

      await chartService.getChartDataByType('PIE', mockFilter);
      await chartService.getChartDataByType('Pie', mockFilter);

      expect(chartRepository.getPieChartData).toHaveBeenCalledTimes(2);
    });
  });
});
