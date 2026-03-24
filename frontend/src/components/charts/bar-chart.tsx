import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { BarChartData } from '@/types/chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BarChartComponentProps {
  data: BarChartData[];
  title?: string;
}

export function BarChartComponent({ data, title = 'Gráfico de Barras' }: BarChartComponentProps) {
  const chartData = data.map((item, index) => ({
    name: item.label.length > 15 ? item.label.substring(0, 15) + '...' : item.label,
    value: item.value,
    fill: `hsl(var(--chart-${(index % 5) + 1}))`,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                tickFormatter={(value) => value.toLocaleString('pt-BR', { notation: 'compact' })}
              />
              <Tooltip 
                formatter={(value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              />
              <Legend />
              <Bar 
                dataKey="value" 
                name="Valor"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
