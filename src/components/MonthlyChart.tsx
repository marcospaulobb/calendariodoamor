import { subMonths, isSameMonth, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

interface MonthlyChartProps {
  selectedDays: Date[];
}

const MonthlyChart = ({ selectedDays }: MonthlyChartProps) => {
  const last12Months = Array.from({ length: 12 }, (_, i) => {
    const date = subMonths(new Date(), i);
    const count = selectedDays.filter(d => isSameMonth(d, date)).length;
    return {
      month: format(date, 'MMM', { locale: ptBR }),
      count,
    };
  }).reverse();

  return (
    <div className="h-[300px] w-full">
      <h3 className="mb-4 text-lg font-semibold text-gray-700">
        Histórico dos Últimos 12 Meses
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={last12Months}>
          <XAxis 
            dataKey="month" 
            stroke="#888888"
            fontSize={12}
            tickLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
          />
          <Tooltip />
          <Bar
            dataKey="count"
            fill="#ea384c"
            radius={[4, 4, 0, 0]}
          >
            <LabelList dataKey="count" position="top" fill="#666" fontSize={12} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyChart;
