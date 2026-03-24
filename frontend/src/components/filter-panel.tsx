import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/calendar';
import type { ChartFilters, GroupBy } from '@/types/chart';

interface FilterPanelProps {
  filters: ChartFilters;
  onFiltersChange: (filters: ChartFilters) => void;
  onRefresh: () => void;
  isLoading?: boolean;
  chartType: string;
}

const groupByOptions: Record<string, { value: GroupBy; label: string }[]> = {
  pie: [
    { value: 'category', label: 'Categoria' },
    { value: 'product', label: 'Produto' },
  ],
  line: [
    { value: 'date', label: 'Data' },
    { value: 'week', label: 'Semana' },
    { value: 'month', label: 'Mês' },
  ],
  bar: [
    { value: 'category', label: 'Categoria' },
    { value: 'product', label: 'Produto' },
  ],
};

export function FilterPanel({
  filters,
  onFiltersChange,
  onRefresh,
  isLoading,
  chartType,
}: FilterPanelProps) {
  const handleStartDateChange = (date: Date | undefined) => {
    if (date) {
      onFiltersChange({
        ...filters,
        startDate: date,
      });
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (date) {
      onFiltersChange({
        ...filters,
        endDate: date,
      });
    }
  };

  const handleGroupByChange = (value: string) => {
    onFiltersChange({
      ...filters,
      groupBy: value as GroupBy,
    });
  };

  const currentGroupByOptions = groupByOptions[chartType] || [];

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 items-end">
          <div className="space-y-2">
            <Label htmlFor="start-date">Data Inicial</Label>
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
              <DatePicker
                date={filters.startDate}
                onSelect={handleStartDateChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="end-date">Data Final</Label>
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
              <DatePicker
                date={filters.endDate}
                onSelect={handleEndDateChange}
              />
            </div>
          </div>

          {currentGroupByOptions.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="group-by">Agrupar por</Label>
              <Select value={filters.groupBy || currentGroupByOptions[0].value} onValueChange={handleGroupByChange}>
                <SelectTrigger>
                  {currentGroupByOptions.find((opt) => opt.value === filters.groupBy)?.label || 'Selecione'}
                </SelectTrigger>
                <SelectContent>
                  {currentGroupByOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label>&nbsp;</Label>
            <Button
              onClick={onRefresh}
              disabled={isLoading}
              className="w-full"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Carregando...' : 'Atualizar'}
            </Button>
          </div>

          <div className="space-y-2">
            <Label>&nbsp;</Label>
            <div className="text-sm text-muted-foreground">
              Período:{' '}
              <span className="font-medium text-foreground">
                {format(filters.startDate, 'dd/MM/yyyy', { locale: ptBR })} até{' '}
                {format(filters.endDate, 'dd/MM/yyyy', { locale: ptBR })}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
