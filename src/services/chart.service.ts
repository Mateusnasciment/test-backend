import chartRepository, {
  PieChartData,
  LineChartData,
  BarChartData,
  DashboardSummary,
} from '../repositories/chart.repository';
import { DateFilter } from '../validators/chart.validator';

export class ChartService {
  async getPieChartData(filter: DateFilter, groupBy?: string): Promise<PieChartData[]> {
    return chartRepository.getPieChartData(filter, groupBy);
  }

  async getLineChartData(filter: DateFilter, groupBy?: string): Promise<LineChartData[]> {
    return chartRepository.getLineChartData(filter, groupBy);
  }

  async getBarChartData(filter: DateFilter, groupBy?: string): Promise<BarChartData[]> {
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
    const groupByStr = typeof groupBy === 'string' ? groupBy : undefined;
    
    switch (chartType.toLowerCase()) {
      case 'pie':
        return this.getPieChartData(filter, groupByStr);
      case 'line':
        return this.getLineChartData(filter, groupByStr);
      case 'bar':
        return this.getBarChartData(filter, groupByStr);
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
