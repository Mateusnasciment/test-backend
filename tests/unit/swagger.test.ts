import request from 'supertest';
import express from 'express';
import swaggerSpec from '../../src/config/swagger';

// Create test app with swagger
const app = express();
app.use(express.json());

// Mock swagger endpoint
app.get('/api-docs/json', (req, res) => {
  res.json(swaggerSpec);
});

const spec = swaggerSpec as any;

describe('Swagger Configuration Tests', () => {
  describe('Swagger Spec Structure', () => {
    it('should have openapi version defined', () => {
      expect(spec.openapi).toBeDefined();
      expect(spec.openapi).toBe('3.1.0');
    });

    it('should have info object with required fields', () => {
      expect(spec.info).toBeDefined();
      expect(spec.info.title).toBeDefined();
      expect(spec.info.version).toBeDefined();
      expect(spec.info.description).toBeDefined();
    });

    it('should have correct API title', () => {
      expect(spec.info.title).toContain('Dashboard API');
    });

    it('should have correct API version', () => {
      expect(spec.info.version).toBe('1.0.0');
    });

    it('should have license information', () => {
      expect(spec.info.license).toBeDefined();
      expect(spec.info.license?.name).toBe('ISC');
    });

    it('should have servers defined', () => {
      expect(spec.servers).toBeDefined();
      expect(spec.servers.length).toBeGreaterThan(0);
    });

    it('should have localhost server', () => {
      const localhostServer = spec.servers?.find((s: any) => s.url?.includes('localhost'));
      expect(localhostServer).toBeDefined();
    });

    it('should have Charts tag', () => {
      const chartsTag = spec.tags?.find((t: any) => t.name === 'Charts');
      expect(chartsTag).toBeDefined();
      expect(chartsTag?.description).toBeDefined();
    });

    it('should have Health tag', () => {
      const healthTag = spec.tags?.find((t: any) => t.name === 'Health');
      expect(healthTag).toBeDefined();
    });
  });

  describe('Swagger Components - Schemas', () => {
    it('should have DateFilter schema', () => {
      expect(spec.components?.schemas?.DateFilter).toBeDefined();
    });

    it('should have PieChartData schema', () => {
      expect(spec.components?.schemas?.PieChartData).toBeDefined();
    });

    it('should have LineChartData schema', () => {
      expect(spec.components?.schemas?.LineChartData).toBeDefined();
    });

    it('should have BarChartData schema', () => {
      expect(spec.components?.schemas?.BarChartData).toBeDefined();
    });

    it('should have DashboardSummary schema', () => {
      expect(spec.components?.schemas?.DashboardSummary).toBeDefined();
    });

    it('should have SuccessResponse schema', () => {
      expect(spec.components?.schemas?.SuccessResponse).toBeDefined();
    });

    it('should have ErrorResponse schema', () => {
      expect(spec.components?.schemas?.ErrorResponse).toBeDefined();
    });

    it('should have DateFilter with startDate and endDate properties', () => {
      const schema = spec.components?.schemas?.DateFilter as any;
      expect(schema.properties.startDate).toBeDefined();
      expect(schema.properties.endDate).toBeDefined();
      expect(schema.required).toContain('startDate');
      expect(schema.required).toContain('endDate');
    });

    it('should have DashboardSummary with all required fields', () => {
      const schema = spec.components?.schemas?.DashboardSummary as any;
      expect(schema.properties.totalSales).toBeDefined();
      expect(schema.properties.totalRevenue).toBeDefined();
      expect(schema.properties.averageOrderValue).toBeDefined();
      expect(schema.properties.totalOrders).toBeDefined();
    });
  });

  describe('Swagger Components - Parameters', () => {
    it('should have startDateParam parameter', () => {
      expect(spec.components?.parameters?.startDateParam).toBeDefined();
    });

    it('should have endDateParam parameter', () => {
      expect(spec.components?.parameters?.endDateParam).toBeDefined();
    });

    it('should have groupByCategoryParam parameter', () => {
      expect(spec.components?.parameters?.groupByCategoryParam).toBeDefined();
    });

    it('should have groupByTimeParam parameter', () => {
      expect(spec.components?.parameters?.groupByTimeParam).toBeDefined();
    });

    it('should have chartTypeParam parameter', () => {
      expect(spec.components?.parameters?.chartTypeParam).toBeDefined();
    });

    it('should have startDateParam as required', () => {
      const param = spec.components?.parameters?.startDateParam as any;
      expect(param.required).toBe(true);
    });

    it('should have endDateParam as required', () => {
      const param = spec.components?.parameters?.endDateParam as any;
      expect(param.required).toBe(true);
    });

    it('should have groupByCategoryParam as optional', () => {
      const param = spec.components?.parameters?.groupByCategoryParam as any;
      expect(param.required).toBe(false);
    });
  });

  describe('Swagger Components - Responses', () => {
    it('should have BadRequestError response', () => {
      expect(spec.components?.responses?.BadRequestError).toBeDefined();
    });

    it('should have NotFoundError response', () => {
      expect(spec.components?.responses?.NotFoundError).toBeDefined();
    });

    it('should have InternalServerError response', () => {
      expect(spec.components?.responses?.InternalServerError).toBeDefined();
    });
  });

  describe('Swagger Paths', () => {
    it('should have paths defined', () => {
      expect(spec.paths).toBeDefined();
    });
  });

  describe('Schema Property Types', () => {
    it('should have correct type for DateFilter startDate', () => {
      const schema = spec.components?.schemas?.DateFilter as any;
      expect(schema.properties.startDate.type).toBe('string');
      expect(schema.properties.startDate.format).toBe('date');
    });

    it('should have correct type for DateFilter endDate', () => {
      const schema = spec.components?.schemas?.DateFilter as any;
      expect(schema.properties.endDate.type).toBe('string');
      expect(schema.properties.endDate.format).toBe('date');
    });

    it('should have correct type for PieChartData value', () => {
      const schema = spec.components?.schemas?.PieChartData as any;
      expect(schema.properties.value.type).toBe('number');
    });

    it('should have correct type for DashboardSummary totalSales', () => {
      const schema = spec.components?.schemas?.DashboardSummary as any;
      expect(schema.properties.totalSales.type).toBe('integer');
    });

    it('should have correct type for DashboardSummary totalRevenue', () => {
      const schema = spec.components?.schemas?.DashboardSummary as any;
      expect(schema.properties.totalRevenue.type).toBe('number');
    });
  });

  describe('Parameter Schema Validation', () => {
    it('should have chartTypeParam with enum values', () => {
      const param = spec.components?.parameters?.chartTypeParam as any;
      expect(param.schema.enum).toContain('pie');
      expect(param.schema.enum).toContain('line');
      expect(param.schema.enum).toContain('bar');
      expect(param.schema.enum).toContain('summary');
      expect(param.schema.enum).toContain('trend');
    });

    it('should have groupByCategoryParam with correct enum values', () => {
      const param = spec.components?.parameters?.groupByCategoryParam as any;
      expect(param.schema.enum).toContain('category');
      expect(param.schema.enum).toContain('product');
    });

    it('should have groupByTimeParam with correct enum values', () => {
      const param = spec.components?.parameters?.groupByTimeParam as any;
      expect(param.schema.enum).toContain('date');
      expect(param.schema.enum).toContain('week');
      expect(param.schema.enum).toContain('month');
    });
  });
});

describe('Swagger API Documentation', () => {
  describe('API Info', () => {
    it('should have contact information', () => {
      expect(spec.info.contact).toBeDefined();
    });

    it('should have description mentioning Node.js and TypeScript', () => {
      expect(spec.info.description).toContain('Node.js');
      expect(spec.info.description).toContain('TypeScript');
    });

    it('should have description mentioning Express', () => {
      expect(spec.info.description).toContain('Express');
    });

    it('should have description mentioning Prisma', () => {
      expect(spec.info.description).toContain('Prisma');
    });

    it('should have description mentioning MySQL', () => {
      expect(spec.info.description).toContain('MySQL');
    });
  });

  describe('Server Configuration', () => {
    it('should have development server URL', () => {
      const devServer = spec.servers?.find((s: any) => s.description?.includes('Development'));
      expect(devServer).toBeDefined();
      expect(devServer?.url).toBe('http://localhost:3000');
    });

    it('should have local server with port variable', () => {
      const localServer = spec.servers?.find((s: any) => s.description?.includes('Local'));
      expect(localServer).toBeDefined();
      expect(localServer?.variables?.port).toBeDefined();
    });
  });
});
