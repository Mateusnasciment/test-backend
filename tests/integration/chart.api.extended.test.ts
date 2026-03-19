import request from 'supertest';
import express from 'express';
import chartRoutes from '../../src/routes/chart.routes';
import swaggerSpec from '../../src/config/swagger';

// Create test app
const app = express();
app.use(express.json());
app.use('/api/charts', chartRoutes);

// Mock the chart service
jest.mock('../../src/services/chart.service', () => ({
  __esModule: true,
  default: {
    getPieChartData: jest.fn(),
    getLineChartData: jest.fn(),
    getBarChartData: jest.fn(),
    getDashboardSummary: jest.fn(),
    getChartDataByType: jest.fn(),
  },
}));

const chartService = require('../../src/services/chart.service').default;

describe('Chart API Integration Tests - Extended', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/charts/pie - Extended', () => {
    it('should return pie chart data with valid date range', async () => {
      const mockData = [
        { label: 'Electronics', value: 5000 },
        { label: 'Clothing', value: 3000 },
      ];
      chartService.getPieChartData.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/api/charts/pie')
        .query({ startDate: '2024-01-01', endDate: '2024-12-31' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.chartType).toBe('pie');
      expect(response.body.data).toEqual(mockData);
    });

    it('should return 400 when startDate is missing', async () => {
      const response = await request(app)
        .get('/api/charts/pie')
        .query({ endDate: '2024-12-31' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return 400 when endDate is missing', async () => {
      const response = await request(app)
        .get('/api/charts/pie')
        .query({ startDate: '2024-01-01' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return 400 when startDate is after endDate', async () => {
      const response = await request(app)
        .get('/api/charts/pie')
        .query({ startDate: '2024-12-31', endDate: '2024-01-01' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should accept groupBy parameter as category', async () => {
      const mockData = [{ label: 'Category', value: 1000 }];
      chartService.getPieChartData.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/api/charts/pie')
        .query({ startDate: '2024-01-01', endDate: '2024-12-31', groupBy: 'category' });

      expect(response.status).toBe(200);
    });

    it('should accept groupBy parameter as product', async () => {
      const mockData = [{ label: 'Product', value: 1000 }];
      chartService.getPieChartData.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/api/charts/pie')
        .query({ startDate: '2024-01-01', endDate: '2024-12-31', groupBy: 'product' });

      expect(response.status).toBe(200);
    });

    it('should return 400 for invalid groupBy value', async () => {
      const response = await request(app)
        .get('/api/charts/pie')
        .query({ startDate: '2024-01-01', endDate: '2024-12-31', groupBy: 'invalid' });

      expect(response.status).toBe(400);
    });

    it('should return 400 for invalid date format', async () => {
      const response = await request(app)
        .get('/api/charts/pie')
        .query({ startDate: 'invalid', endDate: '2024-12-31' });

      expect(response.status).toBe(400);
    });

    it('should return empty array when no data', async () => {
      chartService.getPieChartData.mockResolvedValue([]);

      const response = await request(app)
        .get('/api/charts/pie')
        .query({ startDate: '2024-01-01', endDate: '2024-12-31' });

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
    });

    it('should handle single data point', async () => {
      const mockData = [{ label: 'Only Category', value: 5000 }];
      chartService.getPieChartData.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/api/charts/pie')
        .query({ startDate: '2024-01-01', endDate: '2024-12-31' });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
    });

    it('should handle multiple categories', async () => {
      const mockData = [
        { label: 'Electronics', value: 5000 },
        { label: 'Clothing', value: 3000 },
        { label: 'Home', value: 2000 },
        { label: 'Sports', value: 1000 },
      ];
      chartService.getPieChartData.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/api/charts/pie')
        .query({ startDate: '2024-01-01', endDate: '2024-12-31' });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(4);
    });

    it('should return filter with ISO dates', async () => {
      const mockData = [{ label: 'Category', value: 1000 }];
      chartService.getPieChartData.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/api/charts/pie')
        .query({ startDate: '2024-01-01', endDate: '2024-12-31' });

      expect(response.body.filter.startDate).toContain('2024-01-01');
      expect(response.body.filter.endDate).toContain('2024-12-31');
    });
  });

  describe('GET /api/charts/line - Extended', () => {
    it('should return line chart data with valid date range', async () => {
      const mockData = [
        { date: '2024-01', value: 1000 },
        { date: '2024-02', value: 1500 },
      ];
      chartService.getLineChartData.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/api/charts/line')
        .query({ startDate: '2024-01-01', endDate: '2024-12-31' });

      expect(response.status).toBe(200);
      expect(response.body.chartType).toBe('line');
    });

    it('should accept groupBy as date', async () => {
      const mockData = [{ date: '2024-01-15', value: 1000 }];
      chartService.getLineChartData.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/api/charts/line')
        .query({ startDate: '2024-01-01', endDate: '2024-12-31', groupBy: 'date' });

      expect(response.status).toBe(200);
    });

    it('should accept groupBy as week', async () => {
      const mockData = [{ date: 'Week 1', value: 1000 }];
      chartService.getLineChartData.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/api/charts/line')
        .query({ startDate: '2024-01-01', endDate: '2024-12-31', groupBy: 'week' });

      expect(response.status).toBe(200);
    });

    it('should accept groupBy as month', async () => {
      const mockData = [{ date: '2024-01', value: 1000 }];
      chartService.getLineChartData.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/api/charts/line')
        .query({ startDate: '2024-01-01', endDate: '2024-12-31', groupBy: 'month' });

      expect(response.status).toBe(200);
    });

    it('should return 400 for invalid groupBy value', async () => {
      const response = await request(app)
        .get('/api/charts/line')
        .query({ startDate: '2024-01-01', endDate: '2024-12-31', groupBy: 'invalid' });

      expect(response.status).toBe(400);
    });

    it('should return empty array when no data', async () => {
      chartService.getLineChartData.mockResolvedValue([]);

      const response = await request(app)
        .get('/api/charts/line')
        .query({ startDate: '2024-01-01', endDate: '2024-12-31' });

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
    });

    it('should handle single data point', async () => {
      const mockData = [{ date: '2024-06', value: 5000 }];
      chartService.getLineChartData.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/api/charts/line')
        .query({ startDate: '2024-01-01', endDate: '2024-12-31' });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
    });

    it('should handle multiple time periods', async () => {
      const mockData = [
        { date: '2024-01', value: 1000 },
        { date: '2024-02', value: 1500 },
        { date: '2024-03', value: 2000 },
        { date: '2024-04', value: 2500 },
      ];
      chartService.getLineChartData.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/api/charts/line')
        .query({ startDate: '2024-01-01', endDate: '2024-12-31' });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(4);
    });
  });

  describe('GET /api/charts/bar - Extended', () => {
    it('should return bar chart data with valid date range', async () => {
      const mockData = [
        { label: 'Electronics', value: 5000 },
        { label: 'Clothing', value: 3000 },
      ];
      chartService.getBarChartData.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/api/charts/bar')
        .query({ startDate: '2024-01-01', endDate: '2024-12-31' });

      expect(response.status).toBe(200);
      expect(response.body.chartType).toBe('bar');
    });

    it('should accept groupBy as category', async () => {
      const mockData = [{ label: 'Category', value: 1000 }];
      chartService.getBarChartData.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/api/charts/bar')
        .query({ startDate: '2024-01-01', endDate: '2024-12-31', groupBy: 'category' });

      expect(response.status).toBe(200);
    });

    it('should accept groupBy as product', async () => {
      const mockData = [{ label: 'Product', value: 1000 }];
      chartService.getBarChartData.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/api/charts/bar')
        .query({ startDate: '2024-01-01', endDate: '2024-12-31', groupBy: 'product' });

      expect(response.status).toBe(200);
    });

    it('should return 400 for invalid groupBy value', async () => {
      const response = await request(app)
        .get('/api/charts/bar')
        .query({ startDate: '2024-01-01', endDate: '2024-12-31', groupBy: 'invalid' });

      expect(response.status).toBe(400);
    });

    it('should return empty array when no data', async () => {
      chartService.getBarChartData.mockResolvedValue([]);

      const response = await request(app)
        .get('/api/charts/bar')
        .query({ startDate: '2024-01-01', endDate: '2024-12-31' });

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
    });

    it('should handle single bar', async () => {
      const mockData = [{ label: 'Only Category', value: 5000 }];
      chartService.getBarChartData.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/api/charts/bar')
        .query({ startDate: '2024-01-01', endDate: '2024-12-31' });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
    });

    it('should handle multiple bars', async () => {
      const mockData = [
        { label: 'Electronics', value: 5000 },
        { label: 'Clothing', value: 3000 },
        { label: 'Home', value: 2000 },
      ];
      chartService.getBarChartData.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/api/charts/bar')
        .query({ startDate: '2024-01-01', endDate: '2024-12-31' });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(3);
    });
  });

  describe('GET /api/charts/summary - Extended', () => {
    it('should return dashboard summary with valid date range', async () => {
      const mockSummary = {
        totalSales: 100,
        totalRevenue: 50000,
        averageOrderValue: 500,
        totalOrders: 100,
      };
      chartService.getDashboardSummary.mockResolvedValue(mockSummary);

      const response = await request(app)
        .get('/api/charts/summary')
        .query({ startDate: '2024-01-01', endDate: '2024-12-31' });

      expect(response.status).toBe(200);
      expect(response.body.chartType).toBe('summary');
      expect(response.body.data).toEqual(mockSummary);
    });

    it('should return summary with zero values', async () => {
      const mockSummary = {
        totalSales: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        totalOrders: 0,
      };
      chartService.getDashboardSummary.mockResolvedValue(mockSummary);

      const response = await request(app)
        .get('/api/charts/summary')
        .query({ startDate: '2024-01-01', endDate: '2024-12-31' });

      expect(response.status).toBe(200);
      expect(response.body.data.totalSales).toBe(0);
    });

    it('should return summary with large numbers', async () => {
      const mockSummary = {
        totalSales: 1000000,
        totalRevenue: 999999999.99,
        averageOrderValue: 9999.99,
        totalOrders: 100000,
      };
      chartService.getDashboardSummary.mockResolvedValue(mockSummary);

      const response = await request(app)
        .get('/api/charts/summary')
        .query({ startDate: '2024-01-01', endDate: '2024-12-31' });

      expect(response.status).toBe(200);
      expect(response.body.data.totalRevenue).toBe(999999999.99);
    });

    it('should not accept groupBy parameter', async () => {
      const mockSummary = {
        totalSales: 100,
        totalRevenue: 50000,
        averageOrderValue: 500,
        totalOrders: 100,
      };
      chartService.getDashboardSummary.mockResolvedValue(mockSummary);

      const response = await request(app)
        .get('/api/charts/summary')
        .query({ startDate: '2024-01-01', endDate: '2024-12-31', groupBy: 'category' });

      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/charts/:chartType - Extended', () => {
    it('should return data for pie chart type', async () => {
      const mockData = [{ label: 'Category', value: 1000 }];
      chartService.getChartDataByType.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/api/charts/pie')
        .query({ startDate: '2024-01-01', endDate: '2024-12-31' });

      expect(response.status).toBe(200);
      expect(chartService.getChartDataByType).toHaveBeenCalledWith(
        'pie',
        expect.any(Object),
        undefined
      );
    });

    it('should return data for line chart type', async () => {
      const mockData = [{ date: '2024-01', value: 1000 }];
      chartService.getChartDataByType.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/api/charts/line')
        .query({ startDate: '2024-01-01', endDate: '2024-12-31' });

      expect(response.status).toBe(200);
    });

    it('should return data for bar chart type', async () => {
      const mockData = [{ label: 'Category', value: 1000 }];
      chartService.getChartDataByType.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/api/charts/bar')
        .query({ startDate: '2024-01-01', endDate: '2024-12-31' });

      expect(response.status).toBe(200);
    });

    it('should return data for summary chart type', async () => {
      const mockSummary = {
        totalSales: 100,
        totalRevenue: 50000,
        averageOrderValue: 500,
        totalOrders: 100,
      };
      chartService.getChartDataByType.mockResolvedValue(mockSummary);

      const response = await request(app)
        .get('/api/charts/summary')
        .query({ startDate: '2024-01-01', endDate: '2024-12-31' });

      expect(response.status).toBe(200);
    });

    it('should return data for trend chart type', async () => {
      const mockData = [{ date: '2024-01', value: 1000 }];
      chartService.getChartDataByType.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/api/charts/trend')
        .query({ startDate: '2024-01-01', endDate: '2024-12-31' });

      expect(response.status).toBe(200);
    });

    it('should return 400 for unsupported chart type', async () => {
      chartService.getChartDataByType.mockRejectedValue(
        new Error('Unsupported chart type: unknown')
      );

      const response = await request(app)
        .get('/api/charts/unknown')
        .query({ startDate: '2024-01-01', endDate: '2024-12-31' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should handle uppercase chart type', async () => {
      const mockData = [{ label: 'Category', value: 1000 }];
      chartService.getChartDataByType.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/api/charts/PIE')
        .query({ startDate: '2024-01-01', endDate: '2024-12-31' });

      expect(response.status).toBe(200);
    });

    it('should handle groupBy parameter for dynamic route', async () => {
      const mockData = [{ label: 'Product', value: 1000 }];
      chartService.getChartDataByType.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/api/charts/pie')
        .query({ startDate: '2024-01-01', endDate: '2024-12-31', groupBy: 'product' });

      expect(response.status).toBe(200);
      expect(chartService.getChartDataByType).toHaveBeenCalledWith(
        'pie',
        expect.any(Object),
        'product'
      );
    });
  });

  describe('Error Handling', () => {
    it('should return 500 when service throws non-error exception', async () => {
      const mockService = require('../../src/services/chart.service').default;
      mockService.getPieChartData = jest.fn().mockRejectedValue('string error');

      const response = await request(app)
        .get('/api/charts/pie')
        .query({ startDate: '2024-01-01', endDate: '2024-12-31' });

      expect(response.status).toBe(500);
    });

    it('should return 500 when service throws null', async () => {
      const mockService = require('../../src/services/chart.service').default;
      mockService.getPieChartData = jest.fn().mockRejectedValue(null);

      const response = await request(app)
        .get('/api/charts/pie')
        .query({ startDate: '2024-01-01', endDate: '2024-12-31' });

      expect(response.status).toBe(500);
    });

    it('should return proper error format', async () => {
      const mockService = require('../../src/services/chart.service').default;
      mockService.getPieChartData = jest.fn().mockRejectedValue(new Error('Test error'));

      const response = await request(app)
        .get('/api/charts/pie')
        .query({ startDate: '2024-01-01', endDate: '2024-12-31' });

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('Response Format Validation', () => {
    it('should include success field in all responses', async () => {
      const mockData = [{ label: 'Category', value: 1000 }];
      chartService.getPieChartData.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/api/charts/pie')
        .query({ startDate: '2024-01-01', endDate: '2024-12-31' });

      expect(response.body.success).toBe(true);
    });

    it('should include chartType field in responses', async () => {
      const mockData = [{ label: 'Category', value: 1000 }];
      chartService.getPieChartData.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/api/charts/pie')
        .query({ startDate: '2024-01-01', endDate: '2024-12-31' });

      expect(response.body.chartType).toBe('pie');
    });

    it('should include filter field in responses', async () => {
      const mockData = [{ label: 'Category', value: 1000 }];
      chartService.getPieChartData.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/api/charts/pie')
        .query({ startDate: '2024-01-01', endDate: '2024-12-31' });

      expect(response.body.filter).toBeDefined();
      expect(response.body.filter.startDate).toBeDefined();
      expect(response.body.filter.endDate).toBeDefined();
    });

    it('should include data field in responses', async () => {
      const mockData = [{ label: 'Category', value: 1000 }];
      chartService.getPieChartData.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/api/charts/pie')
        .query({ startDate: '2024-01-01', endDate: '2024-12-31' });

      expect(response.body.data).toBeDefined();
    });
  });

  describe('Date Range Edge Cases', () => {
    it('should handle same start and end date', async () => {
      const mockData = [{ label: 'Category', value: 1000 }];
      chartService.getPieChartData.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/api/charts/pie')
        .query({ startDate: '2024-06-15', endDate: '2024-06-15' });

      expect(response.status).toBe(200);
    });

    it('should handle year boundary dates', async () => {
      const mockData = [{ label: 'Category', value: 1000 }];
      chartService.getPieChartData.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/api/charts/pie')
        .query({ startDate: '2024-01-01', endDate: '2024-12-31' });

      expect(response.status).toBe(200);
    });

    it('should handle leap year date', async () => {
      const mockData = [{ label: 'Category', value: 1000 }];
      chartService.getPieChartData.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/api/charts/pie')
        .query({ startDate: '2024-02-29', endDate: '2024-03-01' });

      expect(response.status).toBe(200);
    });
  });
});
