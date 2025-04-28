import { createClient } from '@supabase/supabase-js';

// Substitua estas variáveis pelos valores do seu projeto no Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para as marcações do calendário
export interface CalendarMark {
  id: string;
  user_id: string;
  date: string;
  is_marked: boolean;
  created_at: string;
}

// Funções para interagir com o Supabase
export const calendarApi = {
  // Buscar todas as marcações de um usuário
  async getMarks(userId: string) {
    const { data, error } = await supabase
      .from('calendar_marks')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data as CalendarMark[];
  },

  // Adicionar ou atualizar uma marcação
  async upsertMark(userId: string, date: string, isMarked: boolean) {
    const { data, error } = await supabase
      .from('calendar_marks')
      .upsert({
        user_id: userId,
        date,
        is_marked: isMarked,
      })
      .select();
    
    if (error) throw error;
    return data[0] as CalendarMark;
  },

  // Remover uma marcação
  async deleteMark(userId: string, date: string) {
    const { error } = await supabase
      .from('calendar_marks')
      .delete()
      .eq('user_id', userId)
      .eq('date', date);
    
    if (error) throw error;
  }
}; 