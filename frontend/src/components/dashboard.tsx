import { useState, useEffect, useCallback } from 'react';
import { BarChart3, PieChart, LineChart, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FilterPanel } from '@/components/filter-panel';
import { SummaryCards } from '@/components/charts/summary-cards';
import { PieChartComponent } from '@/components/charts/pie-chart';
import { LineChartComponent } from '@/components/charts/line-chart';
import { BarChartComponent } from '@/components/charts/bar-chart';
import { chartService } from '@/services/api';
import type { ChartFilters, ChartType, PieChartData, LineChartData, BarChartData, DashboardSummary } from '@/types/chart';
import { cn } from '@/lib/utils';

const chartTypes: { value: ChartType; label: string; icon: React.ElementType }[] = [
  { value: 'summary', label: 'Resumo', icon: LayoutDashboard },
  { value: 'pie', label: 'Pizza', icon: PieChart },
  { value: 'line', label: 'Linha', icon: LineChart },
  { value: 'bar', label: 'Barras', icon: BarChart3 },
];

export function Dashboard() {
  const [chartType, setChartType] = useState<ChartType>('summary');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [pieData, setPieData] = useState<PieChartData[]>([]);
  const [lineData, setLineData] = useState<LineChartData[]>([]);
  const [barData, setBarData] = useState<BarChartData[]>([]);
  const [summaryData, setSummaryData] = useState<DashboardSummary | null>(null);

  const [filters, setFilters] = useState<ChartFilters>({
    startDate: new Date(new Date().getFullYear(), 0, 1),
    endDate: new Date(),
    groupBy: 'category',
  });

  const fetchChartData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [pie, line, bar, summary] = await Promise.all([
        chartService.getPieChartData({ ...filters, groupBy: filters.groupBy || 'category' }),
        chartService.getLineChartData({ ...filters, groupBy: filters.groupBy || 'month' }),
        chartService.getBarChartData({ ...filters, groupBy: filters.groupBy || 'category' }),
        chartService.getDashboardSummary(filters),
      ]);

      setPieData(pie);
      setLineData(line);
      setBarData(bar);
      setSummaryData(summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
      console.error('Erro ao buscar dados:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  const handleFiltersChange = (newFilters: ChartFilters) => {
    setFilters(newFilters);
  };

  const renderChart = () => {
    if (error) {
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              <p className="font-semibold">Erro ao carregar dados</p>
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button onClick={fetchChartData} variant="outline" className="mt-4">
                Tentar Novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    switch (chartType) {
      case 'summary':
        return summaryData ? <SummaryCards data={summaryData} /> : null;
      case 'pie':
        return pieData.length > 0 ? (
          <PieChartComponent data={pieData} title="Distribuição por Categoria/Produto" />
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Nenhum dado encontrado para o período selecionado</p>
            </CardContent>
          </Card>
        );
      case 'line':
        return lineData.length > 0 ? (
          <LineChartComponent data={lineData} title="Evolução Temporal" />
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Nenhum dado encontrado para o período selecionado</p>
            </CardContent>
          </Card>
        );
      case 'bar':
        return barData.length > 0 ? (
          <BarChartComponent data={barData} title="Comparação de Valores" />
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Nenhum dado encontrado para o período selecionado</p>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      <div className="container mx-auto py-8 px-4">
        <header className="mb-8 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8 shadow-sm">
          <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Dashboard de Vendas</h1>
          <p className="text-center text-muted-foreground">
            Visualize os dados de vendas através de gráficos interativos
          </p>
        </header>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {chartTypes.map((type) => (
              <Button
                key={type.value}
                variant={chartType === type.value ? 'default' : 'outline'}
                onClick={() => setChartType(type.value)}
                className={cn(
                  'gap-2 transition-all duration-200',
                  chartType === type.value && 'ring-2 ring-primary ring-offset-2 shadow-md'
                )}
              >
                <type.icon className="h-4 w-4" />
                {type.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <FilterPanel
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onRefresh={fetchChartData}
            isLoading={isLoading}
            chartType={chartType}
          />
        </div>

        <main className="space-y-6">
          {renderChart()}
        </main>

        <footer className="mt-12 text-center text-sm text-muted-foreground bg-card rounded-xl p-6 shadow-sm">
          <p>Dashboard API - Desenvolvido com <span className="text-primary font-semibold">React</span>, <span className="text-accent font-semibold">shadcn/ui</span> e <span className="text-chart-2 font-semibold">Recharts</span></p>
        </footer>
      </div>
    </div>
  );
}
