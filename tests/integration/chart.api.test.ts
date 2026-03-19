import request from 'supertest';
import express from 'express';
import chartRoutes from '../../src/routes/chart.routes';
import { validateDateFilter } from '../../src/middlewares/dateFilter.middleware';

// Create test app
const app = express();
app.use(express.json());
app.use('/api/charts', chartRoutes);

// Mock the chart service
jest.mock('../../src/services/chart.service', () => ({
  getPieChartData: jest.fn(),
  getLineChartData: jest.fn(),
  getBarChartData: jest.fn(),
  getDashboardSummary: jest.fn(),
  getChartDataByType: jest.fn(),
}));

const chartService = require('../../src/services/chart.service').default;

describe('Chart API Integration Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/charts/pie', () => {
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
      expect(response.body.filter).toBeDefined();
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

    it('should accept groupBy parameter', async () => {
      const mockData = [{ label: 'Product1', value: 1000 }];
      chartService.getPieChartData.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/api/charts/pie')
        .query({ startDate: '2024-01-01', endDate: '2024-12-31', groupBy: 'product' });

      expect(response.status).toBe(200);
      expect(chartService.getPieChartData).toHaveBeenCalled();
    });
  });

  describe('GET /api/charts/line', () => {
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
      expect(response.body.success).toBe(true);
      expect(response.body.chartType).toBe('line');
      expect(response.body.data).toEqual(mockData);
    });

    it('should accept groupBy parameter for time grouping', async () => {
      const mockData = [{ date: '2024-W01', value: 1000 }];
      chartService.getLineChartData.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/api/charts/line')
        .query({ startDate: '2024-01-01', endDate: '2024-12-31', groupBy: 'week' });

      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/charts/bar', () => {
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
      expect(response.body.success).toBe(true);
      expect(response.body.chartType).toBe('bar');
      expect(response.body.data).toEqual(mockData);
    });
  });

  describe('GET /api/charts/summary', () => {
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
      expect(response.body.success).toBe(true);
      expect(response.body.chartType).toBe('summary');
      expect(response.body.data).toEqual(mockSummary);
    });
  });

  describe('GET /api/charts/:chartType', () => {
    it('should return data for dynamic chart type - pie', async () => {
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

    it('should return data for dynamic chart type - line', async () => {
      const mockData = [{ date: '2024-01', value: 1000 }];
      chartService.getChartDataByType.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/api/charts/line')
        .query({ startDate: '2024-01-01', endDate: '2024-12-31' });

      expect(response.status).toBe(200);
    });

    it('should return data for dynamic chart type - bar', async () => {
      const mockData = [{ label: 'Category', value: 1000 }];
      chartService.getChartDataByType.mockResolvedValue(mockData);

      const response = await request(app)
        .get('/api/charts/bar')
        .query({ startDate: '2024-01-01', endDate: '2024-12-31' });

      expect(response.status).toBe(200);
    });

    it('should return data for dynamic chart type - summary', async () => {
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

    it('should return data for dynamic chart type - trend', async () => {
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
  });
});
