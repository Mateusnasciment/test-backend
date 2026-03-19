import { dateFilterSchema, chartQuerySchema } from '../../src/validators/chart.validator';
import { ZodError } from 'zod';

describe('Chart Validators', () => {
  describe('dateFilterSchema', () => {
    describe('Valid Inputs', () => {
      it('should validate valid date range', () => {
        const input = {
          startDate: '2024-01-01',
          endDate: '2024-12-31',
        };

        const result = dateFilterSchema.parse(input);

        expect(result.startDate).toBeInstanceOf(Date);
        expect(result.endDate).toBeInstanceOf(Date);
        expect(result.startDate.getTime()).toBeLessThanOrEqual(result.endDate.getTime());
      });

      it('should accept when startDate equals endDate', () => {
        const input = {
          startDate: '2024-06-15',
          endDate: '2024-06-15',
        };

        expect(() => dateFilterSchema.parse(input)).not.toThrow();
      });

      it('should transform string dates to Date objects', () => {
        const input = {
          startDate: '2024-03-15',
          endDate: '2024-06-20',
        };

        const result = dateFilterSchema.parse(input);

        expect(result.startDate).toBeInstanceOf(Date);
        expect(result.endDate).toBeInstanceOf(Date);
        expect(result.startDate.toISOString()).toContain('2024-03-15');
        expect(result.endDate.toISOString()).toContain('2024-06-20');
      });

      it('should handle ISO date format with time', () => {
        const input = {
          startDate: '2024-01-01T00:00:00',
          endDate: '2024-12-31T23:59:59',
        };

        const result = dateFilterSchema.parse(input);

        expect(result.startDate).toBeInstanceOf(Date);
        expect(result.endDate).toBeInstanceOf(Date);
      });

      it('should handle leap year date', () => {
        const input = {
          startDate: '2024-02-29',
          endDate: '2024-03-01',
        };

        const result = dateFilterSchema.parse(input);

        expect(result.startDate.getFullYear()).toBe(2024);
        expect(result.startDate.getMonth()).toBe(1);
        expect(result.startDate.getDate()).toBe(29);
      });

      it('should handle year boundary dates', () => {
        const input = {
          startDate: '2024-01-01',
          endDate: '2024-12-31',
        };

        const result = dateFilterSchema.parse(input);

        expect(result.startDate.getDate()).toBe(1);
        expect(result.endDate.getMonth()).toBe(11);
        expect(result.endDate.getDate()).toBe(31);
      });
    });

    describe('Invalid Inputs - Date Order', () => {
      it('should reject when startDate is after endDate', () => {
        const input = {
          startDate: '2024-12-31',
          endDate: '2024-01-01',
        };

        expect(() => dateFilterSchema.parse(input)).toThrow(ZodError);
      });

      it('should reject when dates are far apart in wrong order', () => {
        const input = {
          startDate: '2025-06-15',
          endDate: '2023-01-01',
        };

        expect(() => dateFilterSchema.parse(input)).toThrow(ZodError);
      });
    });

    describe('Invalid Inputs - Date Format', () => {
      it('should reject invalid startDate format', () => {
        const input = {
          startDate: 'invalid-date',
          endDate: '2024-12-31',
        };

        expect(() => dateFilterSchema.parse(input)).toThrow(ZodError);
      });

      it('should reject invalid endDate format', () => {
        const input = {
          startDate: '2024-01-01',
          endDate: 'not-a-date',
        };

        expect(() => dateFilterSchema.parse(input)).toThrow(ZodError);
      });

      it('should reject non-date string formats', () => {
        const input = {
          startDate: 'hello',
          endDate: 'world',
        };

        expect(() => dateFilterSchema.parse(input)).toThrow(ZodError);
      });

      it('should reject numeric strings', () => {
        const input = {
          startDate: '12345',
          endDate: '67890',
        };

        expect(() => dateFilterSchema.parse(input)).toThrow(ZodError);
      });

      it('should reject empty strings', () => {
        const input = {
          startDate: '',
          endDate: '',
        };

        expect(() => dateFilterSchema.parse(input)).toThrow(ZodError);
      });

      it('should reject partial date formats', () => {
        const input = {
          startDate: '2024-01',
          endDate: '2024-12-31',
        };

        expect(() => dateFilterSchema.parse(input)).toThrow(ZodError);
      });

      it('should reject date with only year', () => {
        const input = {
          startDate: '2024',
          endDate: '2024-12-31',
        };

        expect(() => dateFilterSchema.parse(input)).toThrow(ZodError);
      });
    });

    describe('Invalid Inputs - Missing Fields', () => {
      it('should reject when startDate is missing', () => {
        const input = {
          endDate: '2024-12-31',
        };

        expect(() => dateFilterSchema.parse(input)).toThrow(ZodError);
      });

      it('should reject when endDate is missing', () => {
        const input = {
          startDate: '2024-01-01',
        };

        expect(() => dateFilterSchema.parse(input)).toThrow(ZodError);
      });

      it('should reject when both dates are missing', () => {
        const input = {};

        expect(() => dateFilterSchema.parse(input)).toThrow(ZodError);
      });

      it('should reject empty object', () => {
        expect(() => dateFilterSchema.parse({})).toThrow(ZodError);
      });
    });

    describe('Error Messages', () => {
      it('should include refinement error message for wrong date order', () => {
        const input = {
          startDate: '2024-12-31',
          endDate: '2024-01-01',
        };

        try {
          dateFilterSchema.parse(input);
          fail('Should have thrown');
        } catch (error) {
          if (error instanceof ZodError) {
            expect(error.issues.some((e: any) => e.message.includes('startDate must be before or equal to endDate'))).toBe(true);
          }
        }
      });
    });
  });

  describe('chartQuerySchema', () => {
    describe('Valid Inputs', () => {
      it('should validate valid chart query with groupBy category', () => {
        const input = {
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          groupBy: 'category',
        };

        const result = chartQuerySchema.parse(input);

        expect(result.startDate).toBeInstanceOf(Date);
        expect(result.endDate).toBeInstanceOf(Date);
        expect(result.groupBy).toBe('category');
      });

      it('should validate valid chart query with groupBy product', () => {
        const input = {
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          groupBy: 'product',
        };

        const result = chartQuerySchema.parse(input);

        expect(result.groupBy).toBe('product');
      });

      it('should validate valid chart query with groupBy date', () => {
        const input = {
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          groupBy: 'date',
        };

        const result = chartQuerySchema.parse(input);

        expect(result.groupBy).toBe('date');
      });

      it('should validate without groupBy (optional)', () => {
        const input = {
          startDate: '2024-01-01',
          endDate: '2024-12-31',
        };

        const result = chartQuerySchema.parse(input);

        expect(result.groupBy).toBeUndefined();
      });

      it('should accept all valid groupBy values', () => {
        const validGroupByValues = ['category', 'product', 'date', 'week', 'month'];

        validGroupByValues.forEach((groupBy) => {
          const input = {
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            groupBy: groupBy as 'category' | 'product' | 'date' | 'week' | 'month',
          };

          expect(() => chartQuerySchema.parse(input)).not.toThrow();
        });
      });

      it('should transform dates correctly', () => {
        const input = {
          startDate: '2024-03-15',
          endDate: '2024-06-20',
          groupBy: 'category',
        };

        const result = chartQuerySchema.parse(input);

        expect(result.startDate.getFullYear()).toBe(2024);
        expect(result.startDate.getMonth()).toBe(2);
        expect(result.startDate.getDate()).toBe(15);
      });
    });

    describe('Invalid Inputs - groupBy', () => {
      it('should reject invalid groupBy value', () => {
        const input = {
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          groupBy: 'invalid',
        };

        expect(() => chartQuerySchema.parse(input)).toThrow(ZodError);
      });

      it('should reject numeric groupBy', () => {
        const input = {
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          groupBy: '123',
        };

        expect(() => chartQuerySchema.parse(input)).toThrow(ZodError);
      });

      it('should reject empty string groupBy', () => {
        const input = {
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          groupBy: '',
        };

        expect(() => chartQuerySchema.parse(input)).toThrow(ZodError);
      });

      it('should reject groupBy with special characters', () => {
        const input = {
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          groupBy: 'cat!@#',
        };

        expect(() => chartQuerySchema.parse(input)).toThrow(ZodError);
      });

      it('should reject groupBy with spaces', () => {
        const input = {
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          groupBy: 'category product',
        };

        expect(() => chartQuerySchema.parse(input)).toThrow(ZodError);
      });
    });

    describe('Invalid Inputs - Dates', () => {
      it('should reject when startDate is after endDate', () => {
        const input = {
          startDate: '2024-12-31',
          endDate: '2024-01-01',
          groupBy: 'category',
        };

        expect(() => chartQuerySchema.parse(input)).toThrow(ZodError);
      });

      it('should reject invalid startDate format', () => {
        const input = {
          startDate: 'invalid',
          endDate: '2024-12-31',
          groupBy: 'category',
        };

        expect(() => chartQuerySchema.parse(input)).toThrow(ZodError);
      });

      it('should reject invalid endDate format', () => {
        const input = {
          startDate: '2024-01-01',
          endDate: 'invalid',
          groupBy: 'category',
        };

        expect(() => chartQuerySchema.parse(input)).toThrow(ZodError);
      });

      it('should reject when startDate is missing', () => {
        const input = {
          endDate: '2024-12-31',
          groupBy: 'category',
        };

        expect(() => chartQuerySchema.parse(input)).toThrow(ZodError);
      });

      it('should reject when endDate is missing', () => {
        const input = {
          startDate: '2024-01-01',
          groupBy: 'category',
        };

        expect(() => chartQuerySchema.parse(input)).toThrow(ZodError);
      });
    });

    describe('Edge Cases', () => {
      it('should handle single day range', () => {
        const input = {
          startDate: '2024-06-15',
          endDate: '2024-06-15',
          groupBy: 'category',
        };

        const result = chartQuerySchema.parse(input);

        expect(result.startDate).toBeInstanceOf(Date);
        expect(result.endDate).toBeInstanceOf(Date);
      });

      it('should handle ISO date format with time', () => {
        const input = {
          startDate: '2024-01-01T10:00:00',
          endDate: '2024-12-31T23:59:59',
          groupBy: 'date',
        };

        const result = chartQuerySchema.parse(input);

        expect(result.startDate).toBeInstanceOf(Date);
        expect(result.endDate).toBeInstanceOf(Date);
      });

      it('should handle dates at year boundary', () => {
        const input = {
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          groupBy: 'month',
        };

        // Should fail because 'month' is not in the enum
        expect(() => chartQuerySchema.parse(input)).toThrow(ZodError);
      });
    });

    describe('Type Safety', () => {
      it('should return correct type with all fields', () => {
        const input = {
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          groupBy: 'category',
        };

        const result = chartQuerySchema.parse(input);

        expect(typeof result.startDate).toBe('object');
        expect(typeof result.endDate).toBe('object');
        expect(typeof result.groupBy).toBe('string');
      });

      it('should return correct type without groupBy', () => {
        const input = {
          startDate: '2024-01-01',
          endDate: '2024-12-31',
        };

        const result = chartQuerySchema.parse(input);

        expect(result.groupBy).toBeUndefined();
      });
    });
  });

  describe('Schema Refinement Tests', () => {
    it('should validate dates are in correct order with all valid groupBy options', () => {
      const groupByOptions = ['category', 'product', 'date'] as const;

      groupByOptions.forEach((groupBy) => {
        const input = {
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          groupBy,
        };

        expect(() => chartQuerySchema.parse(input)).not.toThrow();
      });
    });

    it('should reject dates in wrong order with all groupBy options', () => {
      const groupByOptions = ['category', 'product', 'date'] as const;

      groupByOptions.forEach((groupBy) => {
        const input = {
          startDate: '2024-12-31',
          endDate: '2024-01-01',
          groupBy,
        };

        expect(() => chartQuerySchema.parse(input)).toThrow(ZodError);
      });
    });
  });
});
