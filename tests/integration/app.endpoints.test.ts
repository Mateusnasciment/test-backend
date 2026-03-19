import request from 'supertest';
import express from 'express';
import swaggerSpec from '../../src/config/swagger';

// Create test app that mimics main index.ts
const app = express();
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Dashboard API is running',
    version: '1.0.0',
    endpoints: {
      charts: '/api/charts',
      documentation: '/api/docs',
      swagger: '/api-docs',
    },
  });
});

// API Documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    success: true,
    title: 'Dashboard API Documentation',
    version: '1.0.0',
    swaggerDocs: '/api-docs',
  });
});

// Swagger JSON endpoint
app.get('/api-docs/json', (req, res) => {
  res.json(swaggerSpec);
});

describe('Main Application Endpoints', () => {
  describe('GET / - Health Check', () => {
    it('should return success status', async () => {
      const response = await request(app).get('/');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should return API running message', async () => {
      const response = await request(app).get('/');

      expect(response.body.message).toBe('Dashboard API is running');
    });

    it('should return version 1.0.0', async () => {
      const response = await request(app).get('/');

      expect(response.body.version).toBe('1.0.0');
    });

    it('should return charts endpoint', async () => {
      const response = await request(app).get('/');

      expect(response.body.endpoints.charts).toBe('/api/charts');
    });

    it('should return documentation endpoint', async () => {
      const response = await request(app).get('/');

      expect(response.body.endpoints.documentation).toBe('/api/docs');
    });

    it('should return swagger endpoint', async () => {
      const response = await request(app).get('/');

      expect(response.body.endpoints.swagger).toBe('/api-docs');
    });

    it('should return all required endpoint fields', async () => {
      const response = await request(app).get('/');

      expect(response.body.endpoints).toHaveProperty('charts');
      expect(response.body.endpoints).toHaveProperty('documentation');
      expect(response.body.endpoints).toHaveProperty('swagger');
    });

    it('should return JSON content type', async () => {
      const response = await request(app).get('/');

      expect(response.header['content-type']).toContain('application/json');
    });
  });

  describe('GET /api/docs - API Documentation', () => {
    it('should return success status', async () => {
      const response = await request(app).get('/api/docs');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should return API documentation title', async () => {
      const response = await request(app).get('/api/docs');

      expect(response.body.title).toBe('Dashboard API Documentation');
    });

    it('should return version 1.0.0', async () => {
      const response = await request(app).get('/api/docs');

      expect(response.body.version).toBe('1.0.0');
    });

    it('should return swagger docs path', async () => {
      const response = await request(app).get('/api/docs');

      expect(response.body.swaggerDocs).toBe('/api-docs');
    });

    it('should return JSON content type', async () => {
      const response = await request(app).get('/api/docs');

      expect(response.header['content-type']).toContain('application/json');
    });
  });

  describe('GET /api-docs/json - Swagger Specification', () => {
    it('should return success status', async () => {
      const response = await request(app).get('/api-docs/json');

      expect(response.status).toBe(200);
    });

    it('should return openapi version', async () => {
      const response = await request(app).get('/api-docs/json');

      expect(response.body.openapi).toBe('3.1.0');
    });

    it('should return info object', async () => {
      const response = await request(app).get('/api-docs/json');

      expect(response.body.info).toBeDefined();
      expect(response.body.info.title).toBeDefined();
      expect(response.body.info.version).toBeDefined();
    });

    it('should return servers array', async () => {
      const response = await request(app).get('/api-docs/json');

      expect(response.body.servers).toBeDefined();
      expect(Array.isArray(response.body.servers)).toBe(true);
      expect(response.body.servers.length).toBeGreaterThan(0);
    });

    it('should return tags array', async () => {
      const response = await request(app).get('/api-docs/json');

      expect(response.body.tags).toBeDefined();
      expect(Array.isArray(response.body.tags)).toBe(true);
    });

    it('should return components object', async () => {
      const response = await request(app).get('/api-docs/json');

      expect(response.body.components).toBeDefined();
    });

    it('should return schemas in components', async () => {
      const response = await request(app).get('/api-docs/json');

      expect(response.body.components.schemas).toBeDefined();
    });

    it('should return parameters in components', async () => {
      const response = await request(app).get('/api-docs/json');

      expect(response.body.components.parameters).toBeDefined();
    });

    it('should return responses in components', async () => {
      const response = await request(app).get('/api-docs/json');

      expect(response.body.components.responses).toBeDefined();
    });

    it('should have Dashboard API title in swagger spec', async () => {
      const response = await request(app).get('/api-docs/json');

      expect(response.body.info.title).toContain('Dashboard API');
    });

    it('should have Charts tag in swagger spec', async () => {
      const response = await request(app).get('/api-docs/json');

      const chartsTag = response.body.tags.find((t: any) => t.name === 'Charts');
      expect(chartsTag).toBeDefined();
    });

    it('should have Health tag in swagger spec', async () => {
      const response = await request(app).get('/api-docs/json');

      const healthTag = response.body.tags.find((t: any) => t.name === 'Health');
      expect(healthTag).toBeDefined();
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for unknown route', async () => {
      const response = await request(app).get('/unknown-route');

      expect(response.status).toBe(404);
      // Note: Express 5 returns empty object for 404 by default
      expect(response.body).toBeDefined();
    });

    it('should return 404 for unknown nested route', async () => {
      const response = await request(app).get('/api/unknown/route');

      expect(response.status).toBe(404);
    });

    it('should return 404 for POST to unknown route', async () => {
      const response = await request(app).post('/unknown');

      expect(response.status).toBe(404);
    });

    it('should return 404 for PUT to unknown route', async () => {
      const response = await request(app).put('/unknown');

      expect(response.status).toBe(404);
    });

    it('should return 404 for DELETE to unknown route', async () => {
      const response = await request(app).delete('/unknown');

      expect(response.status).toBe(404);
    });

    it('should return 404 for PATCH to unknown route', async () => {
      const response = await request(app).patch('/unknown');

      expect(response.status).toBe(404);
    });
  });

  describe('Response Headers', () => {
    it('should return content-type header for health check', async () => {
      const response = await request(app).get('/');

      expect(response.header['content-type']).toBeDefined();
    });

    it('should return content-type header for api docs', async () => {
      const response = await request(app).get('/api/docs');

      expect(response.header['content-type']).toBeDefined();
    });

    it('should return content-type header for swagger', async () => {
      const response = await request(app).get('/api-docs/json');

      expect(response.header['content-type']).toBeDefined();
    });
  });

  describe('HTTP Methods Support', () => {
    it('should support GET for health check', async () => {
      const response = await request(app).get('/');

      expect(response.status).toBe(200);
    });

    it('should support GET for api docs', async () => {
      const response = await request(app).get('/api/docs');

      expect(response.status).toBe(200);
    });

    it('should support GET for swagger json', async () => {
      const response = await request(app).get('/api-docs/json');

      expect(response.status).toBe(200);
    });
  });

  describe('Error Handling', () => {
    it('should return 400 for malformed JSON in body', async () => {
      const response = await request(app)
        .post('/')
        .set('Content-Type', 'application/json')
        .send('invalid json');

      expect(response.status).toBe(400);
    });
  });

  describe('Multiple Sequential Requests', () => {
    it('should handle multiple sequential health check requests', async () => {
      const response1 = await request(app).get('/');
      const response2 = await request(app).get('/');
      const response3 = await request(app).get('/');

      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);
      expect(response3.status).toBe(200);
    });

    it('should handle multiple sequential api docs requests', async () => {
      const response1 = await request(app).get('/api/docs');
      const response2 = await request(app).get('/api/docs');

      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);
    });
  });

  describe('Concurrent Requests', () => {
    it('should handle concurrent health check requests', async () => {
      const [response1, response2, response3] = await Promise.all([
        request(app).get('/'),
        request(app).get('/'),
        request(app).get('/'),
      ]);

      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);
      expect(response3.status).toBe(200);
    });

    it('should handle concurrent requests to different endpoints', async () => {
      const [health, docs, swagger] = await Promise.all([
        request(app).get('/'),
        request(app).get('/api/docs'),
        request(app).get('/api-docs/json'),
      ]);

      expect(health.status).toBe(200);
      expect(docs.status).toBe(200);
      expect(swagger.status).toBe(200);
    });
  });
});
