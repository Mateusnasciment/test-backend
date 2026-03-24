import type { ChartFilters, ChartResponse, PieChartData, LineChartData, BarChartData, DashboardSummary } from '@/types/chart';

const API_BASE_URL = '/api';

async function fetchApi<T>(endpoint: string, filters: ChartFilters): Promise<T> {
  const params = new URLSearchParams({
    startDate: filters.startDate.toISOString().split('T')[0],
    endDate: filters.endDate.toISOString().split('T')[0],
  });

  if (filters.groupBy) {
    params.append('groupBy', filters.groupBy);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}?${params}`);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Erro ao buscar dados' }));
    throw new Error(error.error || 'Erro na requisição');
  }

  const data: ChartResponse<T> = await response.json();
  return data.data;
}

export const chartService = {
  getPieChartData: (filters: ChartFilters) => 
    fetchApi<PieChartData[]>('/charts/pie', filters),

  getLineChartData: (filters: ChartFilters) => 
    fetchApi<LineChartData[]>('/charts/line', filters),

  getBarChartData: (filters: ChartFilters) => 
    fetchApi<BarChartData[]>('/charts/bar', filters),

  getDashboardSummary: (filters: ChartFilters) => 
    fetchApi<DashboardSummary>('/charts/summary', filters),
};
