import chartRepository, {
  PieChartData,
  LineChartData,
  BarChartData,
  DashboardSummary,
} from '../repositories/chart.repository';
import type { DateFilter, ChartQuery } from '../validators/chart.validator';

type GroupBy = ChartQuery['groupBy'];
const VALID_GROUP_BY = ['category', 'product', 'date', 'week', 'month'] as const;

function isValidGroupBy(value: unknown): value is GroupBy {
  return typeof value === 'string' && VALID_GROUP_BY.some((v) => v === value);
}

export class ChartService {
  async getPieChartData(filter: DateFilter, groupBy?: GroupBy): Promise<PieChartData[]> {
    return chartRepository.getPieChartData(filter, groupBy);
  }

  async getLineChartData(filter: DateFilter, groupBy?: GroupBy): Promise<LineChartData[]> {
    return chartRepository.getLineChartData(filter, groupBy);
  }

  async getBarChartData(filter: DateFilter, groupBy?: GroupBy): Promise<BarChartData[]> {
    return chartRepository.getBarChartData(filter, groupBy);
  }

  async getDashboardSummary(filter: DateFilter): Promise<DashboardSummary> {
    return chartRepository.getDashboardSummary(filter);
  }

  async getChartDataByType(
    chartType: string,
    filter: DateFilter,
    groupBy?: unknown
  ): Promise<PieChartData[] | LineChartData[] | BarChartData[] | DashboardSummary> {
    const validGroupBy = isValidGroupBy(groupBy) ? groupBy : undefined;

    switch (chartType.toLowerCase()) {
      case 'pie':
        return this.getPieChartData(filter, validGroupBy);
      case 'line':
        return this.getLineChartData(filter, validGroupBy);
      case 'bar':
        return this.getBarChartData(filter, validGroupBy);
      case 'summary':
        return this.getDashboardSummary(filter);
      case 'trend':
        return this.getLineChartData(filter, 'date');
      default:
        throw new Error(`Unsupported chart type: ${chartType}`);
    }
  }
}

export default new ChartService();
