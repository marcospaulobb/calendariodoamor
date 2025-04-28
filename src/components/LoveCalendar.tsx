import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import MonthStats from './MonthStats';
import MonthlyChart from './MonthlyChart';
import { calendarApi, CalendarMark } from '@/lib/supabase';
import './LoveCalendar.css';

// ID do usuário atual (você pode implementar um sistema de autenticação mais robusto depois)
const CURRENT_USER_ID = 'user1'; // Temporário para teste

interface LoveCalendarProps {
  selectedDates: Date[];
  onDateSelect: (date: Date) => void;
}

const LoveCalendar: React.FC<LoveCalendarProps> = ({ selectedDates, onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  // Carregar marcações do Supabase ao iniciar
  useEffect(() => {
    const loadMarks = async () => {
      try {
        const marks = await calendarApi.getMarks(CURRENT_USER_ID);
        const dates = marks
          .filter(mark => mark.is_marked)
          .map(mark => new Date(mark.date));
        // Não precisamos mais definir selectedDays aqui, pois estamos usando selectedDates das props
      } catch (error) {
        console.error('Erro ao carregar marcações:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMarks();
  }, []);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handlePreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const handleDayClick = (date: Date) => {
    onDateSelect(date);
  };

  const isDateSelected = (date: Date) => {
    return selectedDates.some(selectedDate => isSameDay(selectedDate, date));
  };

  const isSpecialDay = (date: Date) => {
    return date.getDate() === 4;
  };

  if (loading) {
    return <div className="text-center p-4">Carregando...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl p-4">
      <h1 className="mb-8 text-center text-5xl font-bold text-gray-800 title-love sm:text-6xl">
        Calendário do Amor
      </h1>

      <Card className="mb-8 p-6">
        <MonthStats 
          currentDate={currentDate} 
          selectedDays={selectedDates}
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
          
          {daysInMonth.map(day => (
            <button
              key={day.toString()}
              onClick={() => handleDayClick(day)}
              className={`calendar-cell 
                ${isDateSelected(day) ? 'selected' : ''} 
                ${isSpecialDay(day) ? 'bg-[#FFDEE2]' : ''} 
                ${isToday(day) ? 'bg-gray-100' : ''}
                border border-gray-200`}
              disabled={!isSameMonth(day, currentDate)}
            >
              <span className="z-10 relative">{format(day, 'd')}</span>
              {isDateSelected(day) && (
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
        <MonthlyChart selectedDays={selectedDates} />
      </Card>
    </div>
  );
};

export default LoveCalendar;
