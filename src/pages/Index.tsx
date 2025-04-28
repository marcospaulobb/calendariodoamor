// Commit para testar webhook da Vercel
import { useState, useEffect } from "react";
import LoveCalendar from "@/components/LoveCalendar";
import { calendarApi } from "@/lib/supabase";

// ID do usuário atual (você pode implementar um sistema de autenticação mais robusto depois)
const CURRENT_USER_ID = 'user1'; // Temporário para teste

// Componente principal da aplicação
const Index = () => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar marcações do Supabase ao iniciar
  useEffect(() => {
    const loadMarks = async () => {
      try {
        const marks = await calendarApi.getMarks(CURRENT_USER_ID);
        const dates = marks
          .filter(mark => mark.is_marked)
          .map(mark => new Date(mark.date));
        setSelectedDates(dates);
      } catch (error) {
        console.error('Erro ao carregar marcações:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMarks();
  }, []);

  const handleDateSelect = async (date: Date) => {
    try {
      const isSelected = selectedDates.some(d => d.getTime() === date.getTime());
      const dateStr = date.toISOString().split('T')[0];

      if (isSelected) {
        await calendarApi.deleteMark(CURRENT_USER_ID, dateStr);
        setSelectedDates(prev => prev.filter(d => d.getTime() !== date.getTime()));
      } else {
        await calendarApi.upsertMark(CURRENT_USER_ID, dateStr, true);
        setSelectedDates(prev => [...prev, date]);
      }
    } catch (error) {
      console.error('Erro ao atualizar marcação:', error);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-b from-primary/30 to-white flex items-center justify-center">
      <div className="text-center p-4">Carregando...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/30 to-white">
      <LoveCalendar 
        selectedDates={selectedDates} 
        onDateSelect={handleDateSelect} 
      />
    </div>
  );
};

export default Index;
