import { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import MonthStats from './MonthStats';
import MonthlyChart from './MonthlyChart';

const LoveCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDays, setSelectedDays] = useState<Date[]>(() => {
    const saved = localStorage.getItem('selectedDays');
    return saved ? JSON.parse(saved).map((d: string) => new Date(d)) : [];
  });

  useEffect(() => {
    localStorage.setItem('selectedDays', JSON.stringify(selectedDays));
  }, [selectedDays]);

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  const handlePreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const toggleDay = (date: Date) => {
    setSelectedDays(prev => {
      const isSelected = prev.some(d => isSameDay(d, date));
      if (isSelected) {
        return prev.filter(d => !isSameDay(d, date));
      }
      return [...prev, date];
    });
  };

  const isDaySelected = (date: Date) => {
    return selectedDays.some(d => isSameDay(d, date));
  };

  const isSpecialDay = (date: Date) => {
    return date.getDate() === 4;
  };

  return (
    <div className="mx-auto max-w-4xl p-4">
      <h1 className="mb-8 text-center text-5xl font-bold text-gray-800 title-love sm:text-6xl">
        Calendário do Amor
      </h1>

      <Card className="mb-8 p-6">
        <MonthStats 
          currentDate={currentDate} 
          selectedDays={selectedDays}
        />
      </Card>

      <Card className="mb-8 overflow-hidden p-6">
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={handlePreviousMonth}
            className="rounded-full p-2 transition-colors hover:bg-primary"
          >
            ←
          </button>
          <h2 className="text-xl font-semibold capitalize title-love">
            {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
          </h2>
          <button
            onClick={handleNextMonth}
            className="rounded-full p-2 transition-colors hover:bg-primary"
          >
            →
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} className="text-sm font-semibold border-b border-gray-300 pb-2">
              {day}
            </div>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-7 gap-2 border-t border-gray-300 pt-2">
          {Array.from({ length: startOfMonth(currentDate).getDay() }).map((_, i) => (
            <div key={`empty-${i}`} className="calendar-cell invisible" />
          ))}
          
          {days.map(day => (
            <button
              key={day.toString()}
              onClick={() => toggleDay(day)}
              className={`calendar-cell 
                ${isDaySelected(day) ? 'selected' : ''} 
                ${isSpecialDay(day) ? 'bg-[#FFDEE2]' : ''} 
                border border-gray-200`}
              disabled={!isSameMonth(day, currentDate)}
            >
              <span className="z-10 relative">{format(day, 'd')}</span>
              {isDaySelected(day) && (
                <Heart 
                  className="absolute text-red-600" 
                  size={24} 
                  fill="#ea384c" 
                />
              )}
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <MonthlyChart selectedDays={selectedDays} />
      </Card>
    </div>
  );
};

export default LoveCalendar;
