export interface PieChartData {
  label: string;
  value: number;
}

export interface LineChartData {
  date: string;
  value: number;
}

export interface BarChartData {
  label: string;
  value: number;
}

export interface DashboardSummary {
  totalSales: number;
  totalRevenue: number;
  averageOrderValue: number;
  totalOrders: number;
}

export interface ChartResponse<T> {
  success: boolean;
  chartType: string;
  filter: {
    startDate: string;
    endDate: string;
  };
  data: T;
}

export type ChartType = 'pie' | 'line' | 'bar' | 'summary';
export type GroupBy = 'category' | 'product' | 'date' | 'week' | 'month';

export interface ChartFilters {
  startDate: Date;
  endDate: Date;
  groupBy?: GroupBy;
}
