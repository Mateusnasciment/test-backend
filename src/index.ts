import express, { Application, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import chartRoutes from './routes/chart.routes';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI and API Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Dashboard API Docs',
}));

// Health check endpoint
/**
 * @openapi
 * /:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns API status and available endpoints
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is running successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Dashboard API is running
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 *                 endpoints:
 *                   type: object
 *                   properties:
 *                     charts:
 *                       type: string
 *                       example: /api/charts
 *                     documentation:
 *                       type: string
 *                       example: /api/docs
 */
app.get('/', (req: Request, res: Response) => {
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

// Legacy API Documentation endpoint
/**
 * @openapi
 * /api/docs:
 *   get:
 *     summary: Legacy API documentation endpoint
 *     description: Returns comprehensive API documentation in JSON format
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API documentation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 title:
 *                   type: string
 *                   example: Dashboard API Documentation
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 *                 endpoints:
 *                   type: array
 *                   items:
 *                     type: object
 */
app.get('/api/docs', (req: Request, res: Response) => {
  res.json({
    success: true,
    title: 'Dashboard API Documentation',
    version: '1.0.0',
    swaggerDocs: '/api-docs',
    endpoints: [
      {
        path: '/api/charts/:chartType',
        method: 'GET',
        description: 'Get chart data by type (pie, line, bar, summary, trend)',
        params: {
          chartType: 'Type of chart (pie, line, bar, summary, trend)',
        },
        queryParameters: {
          startDate: { required: true, format: 'ISO 8601 (YYYY-MM-DD)', description: 'Start date for filtering' },
          endDate: { required: true, format: 'ISO 8601 (YYYY-MM-DD)', description: 'End date for filtering' },
          groupBy: { required: false, description: 'Field to group by (category, product, date, week, month)' },
        },
        responses: {
          200: 'Success - Returns chart data',
          400: 'Bad Request - Missing or invalid parameters',
          500: 'Internal Server Error',
        },
      },
      {
        path: '/api/charts/pie',
        method: 'GET',
        description: 'Get pie chart data grouped by category or product',
        queryParameters: {
          startDate: { required: true, format: 'ISO 8601 (YYYY-MM-DD)' },
          endDate: { required: true, format: 'ISO 8601 (YYYY-MM-DD)' },
          groupBy: { required: false, default: 'category', options: ['category', 'product'] },
        },
      },
      {
        path: '/api/charts/line',
        method: 'GET',
        description: 'Get line chart data for trend analysis',
        queryParameters: {
          startDate: { required: true, format: 'ISO 8601 (YYYY-MM-DD)' },
          endDate: { required: true, format: 'ISO 8601 (YYYY-MM-DD)' },
          groupBy: { required: false, default: 'date', options: ['date', 'week', 'month'] },
        },
      },
      {
        path: '/api/charts/bar',
        method: 'GET',
        description: 'Get bar chart data for comparison',
        queryParameters: {
          startDate: { required: true, format: 'ISO 8601 (YYYY-MM-DD)' },
          endDate: { required: true, format: 'ISO 8601 (YYYY-MM-DD)' },
          groupBy: { required: false, default: 'category', options: ['category', 'product'] },
        },
      },
      {
        path: '/api/charts/summary',
        method: 'GET',
        description: 'Get dashboard summary with key metrics',
        queryParameters: {
          startDate: { required: true, format: 'ISO 8601 (YYYY-MM-DD)' },
          endDate: { required: true, format: 'ISO 8601 (YYYY-MM-DD)' },
        },
        response: {
          totalSales: 'Total quantity of items sold',
          totalRevenue: 'Total revenue amount',
          averageOrderValue: 'Average value per order',
          totalOrders: 'Total number of orders',
        },
      },
    ],
    exampleUsage: {
      pieChart: '/api/charts/pie?startDate=2024-01-01&endDate=2024-12-31&groupBy=category',
      lineChart: '/api/charts/line?startDate=2024-01-01&endDate=2024-12-31&groupBy=month',
      barChart: '/api/charts/bar?startDate=2024-01-01&endDate=2024-12-31&groupBy=product',
      summary: '/api/charts/summary?startDate=2024-01-01&endDate=2024-12-31',
      dynamic: '/api/charts/pie?startDate=2024-01-01&endDate=2024-12-31',
    },
  });
});

// Routes
app.use('/api/charts', chartRoutes);

// 404 handler
/**
 * @openapi
 * /{path}:
 *   get:
 *     summary: 404 Not Found handler
 *     description: Returns error when endpoint is not found
 *     tags: [Health]
 *     parameters:
 *       - name: path
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       404:
 *         description: Endpoint not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Endpoint not found
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
});

export default app;
