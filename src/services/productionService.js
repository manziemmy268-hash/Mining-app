import { supabase } from '../lib/supabase';

export const getProductionLogs = async () => {
  const { data, error } = await supabase
    .from('production_logs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) { console.error('Error fetching production logs:', error); return []; }
  return data;
};

export const addProductionLog = async (log) => {
  const { data, error } = await supabase
    .from('production_logs')
    .insert([{
      mineral: log.mineral,
      location: log.location,
      quantity: log.quantity,
      shift: log.shift || null,
      status: 'Verified',
      operator: log.operator || null,
    }])
    .select()
    .single();

  if (error) { console.error('Error adding production log:', error); return null; }
  return data;
};
