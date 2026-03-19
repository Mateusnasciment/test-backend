import { Request, Response, NextFunction } from 'express';
import { validateDateFilter } from '../../src/middlewares/dateFilter.middleware';

describe('Date Filter Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      query: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
    jest.clearAllMocks();
  });

  describe('Successful Validation', () => {
    it('should pass valid date range and call next()', () => {
      mockRequest.query = {
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      };

      validateDateFilter(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
      expect(mockRequest.queryFilter).toBeDefined();
      expect(mockRequest.queryFilter?.startDate).toBeInstanceOf(Date);
      expect(mockRequest.queryFilter?.endDate).toBeInstanceOf(Date);
    });

    it('should pass valid date range with same start and end date', () => {
      mockRequest.query = {
        startDate: '2024-06-15',
        endDate: '2024-06-15',
      };

      validateDateFilter(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should pass valid date range with groupBy parameter', () => {
      mockRequest.query = {
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        groupBy: 'category',
      };

      validateDateFilter(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
      expect(mockRequest.queryGroupBy).toBe('category');
    });

    it('should pass with groupBy set to product', () => {
      mockRequest.query = {
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        groupBy: 'product',
      };

      validateDateFilter(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
      expect(mockRequest.queryGroupBy).toBe('product');
    });

    it('should pass with groupBy set to date', () => {
      mockRequest.query = {
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        groupBy: 'date',
      };

      validateDateFilter(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
      expect(mockRequest.queryGroupBy).toBe('date');
    });

    it('should pass with groupBy set to week', () => {
      mockRequest.query = {
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        groupBy: 'week',
      };

      validateDateFilter(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
      expect(mockRequest.queryGroupBy).toBe('week');
    });

    it('should pass with groupBy set to month', () => {
      mockRequest.query = {
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        groupBy: 'month',
      };

      validateDateFilter(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
      expect(mockRequest.queryGroupBy).toBe('month');
    });

    it('should transform dates correctly', () => {
      mockRequest.query = {
        startDate: '2024-03-15',
        endDate: '2024-06-20',
      };

      validateDateFilter(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
      expect(mockRequest.queryFilter?.startDate).toBeInstanceOf(Date);
      expect(mockRequest.queryFilter?.endDate).toBeInstanceOf(Date);
    });
  });

  describe('Missing Parameters', () => {
    it('should return 400 when startDate is missing', () => {
      mockRequest.query = {
        endDate: '2024-12-31',
      };

      validateDateFilter(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Missing required query parameters: startDate and endDate are required',
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should return 400 when endDate is missing', () => {
      mockRequest.query = {
        startDate: '2024-01-01',
      };

      validateDateFilter(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Missing required query parameters: startDate and endDate are required',
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should return 400 when both dates are missing', () => {
      mockRequest.query = {};

      validateDateFilter(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Missing required query parameters: startDate and endDate are required',
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should return 400 when startDate is empty string', () => {
      mockRequest.query = {
        startDate: '',
        endDate: '2024-12-31',
      };

      validateDateFilter(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should return 400 when endDate is empty string', () => {
      mockRequest.query = {
        startDate: '2024-01-01',
        endDate: '',
      };

      validateDateFilter(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(nextFunction).not.toHaveBeenCalled();
    });
  });

  describe('Invalid Date Formats', () => {
    it('should return 400 for completely invalid startDate format', () => {
      mockRequest.query = {
        startDate: 'not-a-date-at-all-xyz',
        endDate: '2024-12-31',
      };

      validateDateFilter(mockRequest as Request, mockResponse as Response, nextFunction);

      // Zod will try to parse any string as Date, but the date range validation should fail
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should return 400 for completely invalid endDate format', () => {
      mockRequest.query = {
        startDate: '2024-01-01',
        endDate: 'not-a-date-at-all-xyz',
      };

      validateDateFilter(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should return 400 for empty string startDate', () => {
      mockRequest.query = {
        startDate: '',
        endDate: '2024-12-31',
      };

      validateDateFilter(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should return 400 for empty string endDate', () => {
      mockRequest.query = {
        startDate: '2024-01-01',
        endDate: '',
      };

      validateDateFilter(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(nextFunction).not.toHaveBeenCalled();
    });
  });

  describe('Date Range Validation', () => {
    it('should return 400 when startDate is after endDate', () => {
      mockRequest.query = {
        startDate: '2024-12-31',
        endDate: '2024-01-01',
      };

      validateDateFilter(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.any(String),
        })
      );
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should return 400 when dates are far apart in wrong order', () => {
      mockRequest.query = {
        startDate: '2025-06-15',
        endDate: '2023-01-01',
      };

      validateDateFilter(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalled();
      expect(nextFunction).not.toHaveBeenCalled();
    });
  });

  describe('Invalid groupBy Values', () => {
    it('should return 400 for invalid groupBy value', () => {
      mockRequest.query = {
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        groupBy: 'invalid',
      };

      validateDateFilter(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should return 400 for numeric groupBy', () => {
      mockRequest.query = {
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        groupBy: '123',
      };

      validateDateFilter(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(nextFunction).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle dates at boundary of year', () => {
      mockRequest.query = {
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      };

      validateDateFilter(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
      expect(mockRequest.queryFilter?.startDate.toISOString()).toContain('2024-01-01');
      expect(mockRequest.queryFilter?.endDate.toISOString()).toContain('2024-12-31');
    });

    it('should handle leap year date', () => {
      mockRequest.query = {
        startDate: '2024-02-29',
        endDate: '2024-03-01',
      };

      validateDateFilter(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
    });

    it('should handle single day range', () => {
      mockRequest.query = {
        startDate: '2024-06-15',
        endDate: '2024-06-15',
      };

      validateDateFilter(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
    });

    it('should handle ISO date format with time', () => {
      mockRequest.query = {
        startDate: '2024-01-01T00:00:00',
        endDate: '2024-12-31T23:59:59',
      };

      validateDateFilter(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
    });

    it('should set queryFilter with correct ISO strings', () => {
      mockRequest.query = {
        startDate: '2024-03-15',
        endDate: '2024-06-20',
      };

      validateDateFilter(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockRequest.queryFilter?.startDate.toISOString()).toBe('2024-03-15T00:00:00.000Z');
      expect(mockRequest.queryFilter?.endDate.toISOString()).toBe('2024-06-20T00:00:00.000Z');
    });
  });

  describe('Response Format', () => {
    it('should return proper error response format for missing parameters', () => {
      mockRequest.query = {
        endDate: '2024-12-31',
      };

      validateDateFilter(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: expect.stringContaining('startDate'),
      });
    });

    it('should return proper error response format for invalid dates', () => {
      mockRequest.query = {
        startDate: '2024-12-31',
        endDate: '2024-01-01',
      };

      validateDateFilter(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: expect.any(String),
      });
    });

    it('should chain status and json methods correctly', () => {
      mockRequest.query = {
        endDate: '2024-12-31',
      };

      validateDateFilter(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalled();
    });
  });
});
