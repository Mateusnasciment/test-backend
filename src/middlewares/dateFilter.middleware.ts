import { Request, Response, NextFunction } from 'express';
import { chartQuerySchema, DateFilter } from '../validators/chart.validator';

export function validateDateFilter(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { startDate, endDate, groupBy } = req.query;

  if (!startDate || !endDate) {
    res.status(400).json({
      success: false,
      error: 'Missing required query parameters: startDate and endDate are required',
    });
    return;
  }

  try {
    const validated = chartQuerySchema.parse({ startDate, endDate, groupBy });
    req.queryFilter = {
      startDate: validated.startDate,
      endDate: validated.endDate,
    };
    req.queryGroupBy = validated.groupBy;
    next();
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Invalid date format. Use ISO 8601 format (YYYY-MM-DD)',
      });
    }
  }
}

declare global {
  namespace Express {
    interface Request {
      queryFilter?: DateFilter;
      queryGroupBy?: string;
    }
  }
}
