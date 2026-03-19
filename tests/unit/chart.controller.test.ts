import { Request, Response } from 'express';
import chartController from '../../src/controllers/chart.controller';
import chartService from '../../src/services/chart.service';
import { DateFilter } from '../../src/validators/chart.validator';

// Mock the chart service
jest.mock('../../src/services/chart.service', () => ({
  __esModule: true,
  default: {
    getChartDataByType: jest.fn(),
    getPieChartData: jest.fn(),
    getLineChartData: jest.fn(),
    getBarChartData: jest.fn(),
    getDashboardSummary: jest.fn(),
  },
}));

const mockChartService = chartService as jest.Mocked<typeof chartService>;

describe('Chart Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  const mockFilter: DateFilter = {
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
  };

  beforeEach(() => {
    mockRequest = {
      queryFilter: mockFilter,
      queryGroupBy: undefined,
      params: {},
      query: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('getChartByType', () => {
    it('should return pie chart data successfully', async () => {
      mockRequest.params = { chartType: 'pie' };
      const mockData = [
        { label: 'Electronics', value: 5000 },
        { label: 'Clothing', value: 3000 },
      ];
      mockChartService.getChartDataByType.mockResolvedValue(mockData as any);

      await chartController.getChartByType(mockRequest as Request, mockResponse as Response);

      expect(mockChartService.getChartDataByType).toHaveBeenCalledWith('pie', mockFilter, undefined);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        chartType: 'pie',
        filter: {
          startDate: mockFilter.startDate.toISOString(),
          endDate: mockFilter.endDate.toISOString(),
        },
        data: mockData,
      });
    });

    it('should return line chart data successfully', async () => {
      mockRequest.params = { chartType: 'line' };
      const mockData = [{ date: '2024-01', value: 1000 }];
      mockChartService.getChartDataByType.mockResolvedValue(mockData as any);

      await chartController.getChartByType(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          chartType: 'line',
        })
      );
    });

    it('should return bar chart data successfully', async () => {
      mockRequest.params = { chartType: 'bar' };
      const mockData = [{ label: 'Electronics', value: 5000 }];
      mockChartService.getChartDataByType.mockResolvedValue(mockData as any);

      await chartController.getChartByType(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          chartType: 'bar',
        })
      );
    });

    it('should return summary data successfully', async () => {
      mockRequest.params = { chartType: 'summary' };
      const mockSummary = {
        totalSales: 100,
        totalRevenue: 50000,
        averageOrderValue: 500,
        totalOrders: 100,
      };
      mockChartService.getChartDataByType.mockResolvedValue(mockSummary as any);

      await chartController.getChartByType(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          chartType: 'summary',
          data: mockSummary,
        })
      );
    });

    it('should return trend data successfully', async () => {
      mockRequest.params = { chartType: 'trend' };
      const mockData = [{ date: '2024-01', value: 1000 }];
      mockChartService.getChartDataByType.mockResolvedValue(mockData as any);

      await chartController.getChartByType(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          chartType: 'trend',
        })
      );
    });

    it('should handle groupBy parameter', async () => {
      mockRequest.params = { chartType: 'pie' };
      mockRequest.query = { groupBy: 'product' };
      mockRequest.queryGroupBy = 'product';
      const mockData = [{ label: 'Product A', value: 3000 }];
      mockChartService.getChartDataByType.mockResolvedValue(mockData as any);

      await chartController.getChartByType(mockRequest as Request, mockResponse as Response);

      expect(mockChartService.getChartDataByType).toHaveBeenCalledWith('pie', mockFilter, 'product');
    });

    it('should return 400 when filter is missing', async () => {
      mockRequest.queryFilter = undefined as any;
      mockRequest.params = { chartType: 'pie' };

      await chartController.getChartByType(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'startDate and endDate are required',
      });
    });

    it('should return 400 when service throws error', async () => {
      mockRequest.params = { chartType: 'pie' };
      mockChartService.getChartDataByType.mockRejectedValue(new Error('Invalid chart type'));

      await chartController.getChartByType(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid chart type',
      });
    });

    it('should return 500 for unknown error', async () => {
      mockRequest.params = { chartType: 'pie' };
      mockChartService.getChartDataByType.mockRejectedValue('string error');

      await chartController.getChartByType(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Internal server error',
      });
    });

    it('should format filter dates correctly in response', async () => {
      mockRequest.params = { chartType: 'pie' };
      const mockData = [{ label: 'Category', value: 1000 }];
      mockChartService.getChartDataByType.mockResolvedValue(mockData as any);

      await chartController.getChartByType(mockRequest as Request, mockResponse as Response);

      const responseArg = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(responseArg.filter.startDate).toBe(mockFilter.startDate.toISOString());
      expect(responseArg.filter.endDate).toBe(mockFilter.endDate.toISOString());
    });
  });

  describe('getPieChart', () => {
    it('should return pie chart data with default groupBy', async () => {
      const mockData = [
        { label: 'Electronics', value: 5000 },
        { label: 'Clothing', value: 3000 },
      ];
      mockChartService.getPieChartData.mockResolvedValue(mockData);

      await chartController.getPieChart(mockRequest as Request, mockResponse as Response);

      expect(mockChartService.getPieChartData).toHaveBeenCalledWith(mockFilter, 'category');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        chartType: 'pie',
        filter: {
          startDate: mockFilter.startDate.toISOString(),
          endDate: mockFilter.endDate.toISOString(),
        },
        data: mockData,
      });
    });

    it('should return pie chart data with custom groupBy', async () => {
      mockRequest.queryGroupBy = 'product';
      const mockData = [{ label: 'Product A', value: 3000 }];
      mockChartService.getPieChartData.mockResolvedValue(mockData);

      await chartController.getPieChart(mockRequest as Request, mockResponse as Response);

      expect(mockChartService.getPieChartData).toHaveBeenCalledWith(mockFilter, 'product');
    });

    it('should return 500 when service throws error', async () => {
      mockChartService.getPieChartData.mockRejectedValue(new Error('Database error'));

      await chartController.getPieChart(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Database error',
      });
    });

    it('should return 500 for unknown error', async () => {
      mockChartService.getPieChartData.mockRejectedValue(null);

      await chartController.getPieChart(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Internal server error',
      });
    });
  });

  describe('getLineChart', () => {
    it('should return line chart data with default groupBy', async () => {
      const mockData = [
        { date: '2024-01', value: 1000 },
        { date: '2024-02', value: 1500 },
      ];
      mockChartService.getLineChartData.mockResolvedValue(mockData);

      await chartController.getLineChart(mockRequest as Request, mockResponse as Response);

      expect(mockChartService.getLineChartData).toHaveBeenCalledWith(mockFilter, 'date');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        chartType: 'line',
        filter: {
          startDate: mockFilter.startDate.toISOString(),
          endDate: mockFilter.endDate.toISOString(),
        },
        data: mockData,
      });
    });

    it('should return line chart data with week groupBy', async () => {
      mockRequest.queryGroupBy = 'week';
      const mockData = [{ date: 'Week 1', value: 1000 }];
      mockChartService.getLineChartData.mockResolvedValue(mockData);

      await chartController.getLineChart(mockRequest as Request, mockResponse as Response);

      expect(mockChartService.getLineChartData).toHaveBeenCalledWith(mockFilter, 'week');
    });

    it('should return line chart data with month groupBy', async () => {
      mockRequest.queryGroupBy = 'month';
      const mockData = [{ date: '2024-01', value: 1000 }];
      mockChartService.getLineChartData.mockResolvedValue(mockData);

      await chartController.getLineChart(mockRequest as Request, mockResponse as Response);

      expect(mockChartService.getLineChartData).toHaveBeenCalledWith(mockFilter, 'month');
    });

    it('should return 500 when service throws error', async () => {
      mockChartService.getLineChartData.mockRejectedValue(new Error('Service error'));

      await chartController.getLineChart(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Service error',
      });
    });
  });

  describe('getBarChart', () => {
    it('should return bar chart data with default groupBy', async () => {
      const mockData = [
        { label: 'Electronics', value: 5000 },
        { label: 'Clothing', value: 3000 },
      ];
      mockChartService.getBarChartData.mockResolvedValue(mockData);

      await chartController.getBarChart(mockRequest as Request, mockResponse as Response);

      expect(mockChartService.getBarChartData).toHaveBeenCalledWith(mockFilter, 'category');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        chartType: 'bar',
        filter: {
          startDate: mockFilter.startDate.toISOString(),
          endDate: mockFilter.endDate.toISOString(),
        },
        data: mockData,
      });
    });

    it('should return bar chart data with product groupBy', async () => {
      mockRequest.queryGroupBy = 'product';
      const mockData = [{ label: 'Product A', value: 3000 }];
      mockChartService.getBarChartData.mockResolvedValue(mockData);

      await chartController.getBarChart(mockRequest as Request, mockResponse as Response);

      expect(mockChartService.getBarChartData).toHaveBeenCalledWith(mockFilter, 'product');
    });

    it('should return 500 when service throws error', async () => {
      mockChartService.getBarChartData.mockRejectedValue(new Error('Error fetching data'));

      await chartController.getBarChart(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Error fetching data',
      });
    });
  });

  describe('getDashboardSummary', () => {
    it('should return dashboard summary successfully', async () => {
      const mockSummary = {
        totalSales: 100,
        totalRevenue: 50000,
        averageOrderValue: 500,
        totalOrders: 100,
      };
      mockChartService.getDashboardSummary.mockResolvedValue(mockSummary);

      await chartController.getDashboardSummary(mockRequest as Request, mockResponse as Response);

      expect(mockChartService.getDashboardSummary).toHaveBeenCalledWith(mockFilter);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        chartType: 'summary',
        filter: {
          startDate: mockFilter.startDate.toISOString(),
          endDate: mockFilter.endDate.toISOString(),
        },
        data: mockSummary,
      });
    });

    it('should return summary with zero values', async () => {
      const mockSummary = {
        totalSales: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        totalOrders: 0,
      };
      mockChartService.getDashboardSummary.mockResolvedValue(mockSummary);

      await chartController.getDashboardSummary(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: mockSummary,
        })
      );
    });

    it('should return 500 when service throws error', async () => {
      mockChartService.getDashboardSummary.mockRejectedValue(new Error('Summary error'));

      await chartController.getDashboardSummary(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Summary error',
      });
    });

    it('should handle non-error exceptions', async () => {
      mockChartService.getDashboardSummary.mockRejectedValue({ custom: 'error' });

      await chartController.getDashboardSummary(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Internal server error',
      });
    });
  });

  describe('Response Format Validation', () => {
    it('should include all required fields in pie chart response', async () => {
      const mockData = [{ label: 'Category', value: 1000 }];
      mockChartService.getPieChartData.mockResolvedValue(mockData);

      await chartController.getPieChart(mockRequest as Request, mockResponse as Response);

      const responseArg = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(responseArg).toHaveProperty('success');
      expect(responseArg).toHaveProperty('chartType');
      expect(responseArg).toHaveProperty('filter');
      expect(responseArg).toHaveProperty('data');
      expect(responseArg.chartType).toBe('pie');
    });

    it('should include all required fields in line chart response', async () => {
      const mockData = [{ date: '2024-01', value: 1000 }];
      mockChartService.getLineChartData.mockResolvedValue(mockData);

      await chartController.getLineChart(mockRequest as Request, mockResponse as Response);

      const responseArg = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(responseArg).toHaveProperty('success');
      expect(responseArg).toHaveProperty('chartType');
      expect(responseArg).toHaveProperty('filter');
      expect(responseArg).toHaveProperty('data');
      expect(responseArg.chartType).toBe('line');
    });

    it('should include all required fields in bar chart response', async () => {
      const mockData = [{ label: 'Category', value: 1000 }];
      mockChartService.getBarChartData.mockResolvedValue(mockData);

      await chartController.getBarChart(mockRequest as Request, mockResponse as Response);

      const responseArg = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(responseArg).toHaveProperty('success');
      expect(responseArg).toHaveProperty('chartType');
      expect(responseArg).toHaveProperty('filter');
      expect(responseArg).toHaveProperty('data');
      expect(responseArg.chartType).toBe('bar');
    });

    it('should include all required fields in summary response', async () => {
      const mockSummary = {
        totalSales: 100,
        totalRevenue: 50000,
        averageOrderValue: 500,
        totalOrders: 100,
      };
      mockChartService.getDashboardSummary.mockResolvedValue(mockSummary);

      await chartController.getDashboardSummary(mockRequest as Request, mockResponse as Response);

      const responseArg = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(responseArg).toHaveProperty('success');
      expect(responseArg).toHaveProperty('chartType');
      expect(responseArg).toHaveProperty('filter');
      expect(responseArg).toHaveProperty('data');
      expect(responseArg.chartType).toBe('summary');
    });
  });
});
