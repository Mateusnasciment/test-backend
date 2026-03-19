import { z } from 'zod';

export const dateFilterSchema = z.object({
  startDate: z.string().transform((val) => new Date(val)),
  endDate: z.string().transform((val) => new Date(val)),
}).refine(
  (data) => data.startDate <= data.endDate,
  { message: 'startDate must be before or equal to endDate' }
);

export const chartQuerySchema = z.object({
  startDate: z.string().transform((val) => new Date(val)),
  endDate: z.string().transform((val) => new Date(val)),
  groupBy: z.enum(['category', 'product', 'date', 'week', 'month']).optional(),
});

export type DateFilter = z.infer<typeof dateFilterSchema>;
export type ChartQuery = z.infer<typeof chartQuerySchema>;
