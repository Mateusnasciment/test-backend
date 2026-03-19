import { Request, Response } from 'express';
import chartService from '../services/chart.service';

/**
 * @openapi
 * components:
 *   schemas:
 *     ChartType:
 *       type: string
 *       enum: [pie, line, bar, summary, trend]
 *       description: Type of chart to retrieve
 */
export class ChartController {
  /**
   * Get chart data by type
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<void>}
   */
  async getChartByType(req: Request, res: Response): Promise<void> {
    try {
      const { chartType } = req.params;
      const filter = req.queryFilter;
      const groupBy = req.queryGroupBy;

      if (!filter || !filter.startDate || !filter.endDate) {
        res.status(400).json({
          success: false,
          error: 'startDate and endDate are required',
        });
        return;
      }

      const data = await chartService.getChartDataByType(chartType as string, filter, groupBy);

      res.status(200).json({
        success: true,
        chartType,
        filter: {
          startDate: filter.startDate.toISOString(),
          endDate: filter.endDate.toISOString(),
        },
        data,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          error: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Internal server error',
        });
      }
    }
  }

  /**
   * Get pie chart data
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<void>}
   */
  async getPieChart(req: Request, res: Response): Promise<void> {
    try {
      const filter = req.queryFilter;

      if (!filter || !filter.startDate || !filter.endDate) {
        res.status(400).json({
          success: false,
          error: 'startDate and endDate are required',
        });
        return;
      }

      const groupBy = req.queryGroupBy || 'category';

      const data = await chartService.getPieChartData(filter, groupBy);

      res.status(200).json({
        success: true,
        chartType: 'pie',
        filter: {
          startDate: filter.startDate.toISOString(),
          endDate: filter.endDate.toISOString(),
        },
        data,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({
          success: false,
          error: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Internal server error',
        });
      }
    }
  }

  /**
   * Get line chart data
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<void>}
   */
  async getLineChart(req: Request, res: Response): Promise<void> {
    try {
      const filter = req.queryFilter;
      
      if (!filter || !filter.startDate || !filter.endDate) {
        res.status(400).json({
          success: false,
          error: 'startDate and endDate are required',
        });
        return;
      }
      
      const groupBy = req.queryGroupBy || 'date';

      const data = await chartService.getLineChartData(filter, groupBy);

      res.status(200).json({
        success: true,
        chartType: 'line',
        filter: {
          startDate: filter.startDate.toISOString(),
          endDate: filter.endDate.toISOString(),
        },
        data,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({
          success: false,
          error: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Internal server error',
        });
      }
    }
  }

  /**
   * Get bar chart data
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<void>}
   */
  async getBarChart(req: Request, res: Response): Promise<void> {
    try {
      const filter = req.queryFilter;
      
      if (!filter || !filter.startDate || !filter.endDate) {
        res.status(400).json({
          success: false,
          error: 'startDate and endDate are required',
        });
        return;
      }
      
      const groupBy = req.queryGroupBy || 'category';

      const data = await chartService.getBarChartData(filter, groupBy);

      res.status(200).json({
        success: true,
        chartType: 'bar',
        filter: {
          startDate: filter.startDate.toISOString(),
          endDate: filter.endDate.toISOString(),
        },
        data,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({
          success: false,
          error: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Internal server error',
        });
      }
    }
  }

  /**
   * Get dashboard summary
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<void>}
   */
  async getDashboardSummary(req: Request, res: Response): Promise<void> {
    try {
      const filter = req.queryFilter;
      
      if (!filter || !filter.startDate || !filter.endDate) {
        res.status(400).json({
          success: false,
          error: 'startDate and endDate are required',
        });
        return;
      }

      const data = await chartService.getDashboardSummary(filter);

      res.status(200).json({
        success: true,
        chartType: 'summary',
        filter: {
          startDate: filter.startDate.toISOString(),
          endDate: filter.endDate.toISOString(),
        },
        data,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({
          success: false,
          error: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Internal server error',
        });
      }
    }
  }
}

export default new ChartController();
