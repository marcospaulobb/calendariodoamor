
import { isSameMonth, getDaysInMonth } from 'date-fns';

interface MonthStatsProps {
  currentDate: Date;
  selectedDays: Date[];
}

const MonthStats = ({ currentDate, selectedDays }: MonthStatsProps) => {
  const daysInMonth = getDaysInMonth(currentDate);
  const selectedDaysInMonth = selectedDays.filter(date => 
    isSameMonth(date, currentDate)
  ).length;
  const percentage = ((selectedDaysInMonth / daysInMonth) * 100).toFixed(1);

  return (
    <div className="text-center">
      <h3 className="text-lg font-semibold text-gray-700">
        Dias Marcados este Mês
      </h3>
      <div className="mt-2 space-x-1">
        <span className="text-3xl font-bold text-[#ea384c]">
          {selectedDaysInMonth}
        </span>
        <span className="text-lg text-gray-600">
          de {daysInMonth} dias ({percentage}%)
        </span>
      </div>
    </div>
  );
};

export default MonthStats;
