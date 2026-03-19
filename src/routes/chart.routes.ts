import { Router } from 'express';
import chartController from '../controllers/chart.controller';
import { validateDateFilter } from '../middlewares/dateFilter.middleware';

const router = Router();

/**
 * @openapi
 * /api/charts/{chartType}:
 *   get:
 *     summary: Get chart data by type
 *     description: Get chart data by type (pie, line, bar, summary, trend) with date filtering and optional grouping
 *     tags: [Charts]
 *     parameters:
 *       - name: chartType
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           enum: [pie, line, bar, summary, trend]
 *         description: Type of chart to retrieve
 *       - $ref: '#/components/parameters/startDateParam'
 *       - $ref: '#/components/parameters/endDateParam'
 *       - name: groupBy
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [category, product, date, week, month]
 *         description: Field to group results by (depends on chart type)
 *     responses:
 *       200:
 *         description: Successful response with chart data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/:chartType', validateDateFilter, (req, res) =>
  chartController.getChartByType(req, res)
);

/**
 * @openapi
 * /api/charts/pie:
 *   get:
 *     summary: Get pie chart data
 *     description: Get pie chart data grouped by category or product for visualizing proportions
 *     tags: [Charts]
 *     parameters:
 *       - $ref: '#/components/parameters/startDateParam'
 *       - $ref: '#/components/parameters/endDateParam'
 *       - $ref: '#/components/parameters/groupByCategoryParam'
 *     responses:
 *       200:
 *         description: Successful response with pie chart data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 chartType:
 *                   type: string
 *                   example: pie
 *                 filter:
 *                   type: object
 *                   properties:
 *                     startDate:
 *                       type: string
 *                       format: date-time
 *                     endDate:
 *                       type: string
 *                       format: date-time
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       label:
 *                         type: string
 *                         example: Electronics
 *                       value:
 *                         type: number
 *                         example: 5000
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/pie', validateDateFilter, (req, res) =>
  chartController.getPieChart(req, res)
);

/**
 * @openapi
 * /api/charts/line:
 *   get:
 *     summary: Get line chart data
 *     description: Get line chart data for trend analysis over time periods
 *     tags: [Charts]
 *     parameters:
 *       - $ref: '#/components/parameters/startDateParam'
 *       - $ref: '#/components/parameters/endDateParam'
 *       - name: groupBy
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [date, week, month]
 *           default: date
 *         description: Time period to group results by
 *     responses:
 *       200:
 *         description: Successful response with line chart data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 chartType:
 *                   type: string
 *                   example: line
 *                 filter:
 *                   type: object
 *                   properties:
 *                     startDate:
 *                       type: string
 *                       format: date-time
 *                     endDate:
 *                       type: string
 *                       format: date-time
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         example: 2024-01
 *                       value:
 *                         type: number
 *                         example: 1000
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/line', validateDateFilter, (req, res) =>
  chartController.getLineChart(req, res)
);

/**
 * @openapi
 * /api/charts/bar:
 *   get:
 *     summary: Get bar chart data
 *     description: Get bar chart data for comparison across categories or products
 *     tags: [Charts]
 *     parameters:
 *       - $ref: '#/components/parameters/startDateParam'
 *       - $ref: '#/components/parameters/endDateParam'
 *       - name: groupBy
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [category, product]
 *           default: category
 *         description: Field to group results by
 *     responses:
 *       200:
 *         description: Successful response with bar chart data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 chartType:
 *                   type: string
 *                   example: bar
 *                 filter:
 *                   type: object
 *                   properties:
 *                     startDate:
 *                       type: string
 *                       format: date-time
 *                     endDate:
 *                       type: string
 *                       format: date-time
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       label:
 *                         type: string
 *                         example: Electronics
 *                       value:
 *                         type: number
 *                         example: 5000
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/bar', validateDateFilter, (req, res) =>
  chartController.getBarChart(req, res)
);

/**
 * @openapi
 * /api/charts/summary:
 *   get:
 *     summary: Get dashboard summary
 *     description: Get dashboard summary with key metrics including total sales, revenue, average order value, and total orders
 *     tags: [Charts]
 *     parameters:
 *       - $ref: '#/components/parameters/startDateParam'
 *       - $ref: '#/components/parameters/endDateParam'
 *     responses:
 *       200:
 *         description: Successful response with dashboard summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 chartType:
 *                   type: string
 *                   example: summary
 *                 filter:
 *                   type: object
 *                   properties:
 *                     startDate:
 *                       type: string
 *                       format: date-time
 *                     endDate:
 *                       type: string
 *                       format: date-time
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalSales:
 *                       type: integer
 *                       description: Total quantity of items sold
 *                       example: 500
 *                     totalRevenue:
 *                       type: number
 *                       description: Total revenue amount
 *                       example: 75000
 *                     averageOrderValue:
 *                       type: number
 *                       description: Average value per order
 *                       example: 150
 *                     totalOrders:
 *                       type: integer
 *                       description: Total number of orders
 *                       example: 500
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/summary', validateDateFilter, (req, res) =>
  chartController.getDashboardSummary(req, res)
);

export default router;
