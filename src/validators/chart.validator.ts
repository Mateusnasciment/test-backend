import { z } from 'zod';

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})?)?$/;

export const dateFilterSchema = z.object({
  startDate: z.string()
    .regex(ISO_DATE_REGEX, 'startDate must be in ISO 8601 format')
    .transform((val) => {
      const date = new Date(val);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      return date;
    }),
  endDate: z.string()
    .regex(ISO_DATE_REGEX, 'endDate must be in ISO 8601 format')
    .transform((val) => {
      const date = new Date(val);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      return date;
    }),
}).refine(
  (data) => data.startDate <= data.endDate,
  { message: 'startDate must be before or equal to endDate' }
);

export const chartQuerySchema = z.object({
  startDate: z.string()
    .regex(ISO_DATE_REGEX, 'startDate must be in ISO 8601 format')
    .transform((val) => {
      const date = new Date(val);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      return date;
    }),
  endDate: z.string()
    .regex(ISO_DATE_REGEX, 'endDate must be in ISO 8601 format')
    .transform((val) => {
      const date = new Date(val);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      return date;
    }),
  groupBy: z.enum(['category', 'product', 'date', 'week', 'month']).optional(),
}).refine(
  (data) => data.startDate <= data.endDate,
  { message: 'startDate must be before or equal to endDate' }
);

export type DateFilter = z.infer<typeof dateFilterSchema>;
export type ChartQuery = z.infer<typeof chartQuerySchema>;
