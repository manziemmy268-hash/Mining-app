import { supabase } from '../lib/supabase';

export const getAttendanceLogs = async () => {
  const { data, error } = await supabase
    .from('attendance_logs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) { console.error('Error fetching attendance logs:', error); return []; }
  return data;
};

export const addAttendanceLog = async ({ email, shift }) => {
  const checkIn = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const { data, error } = await supabase
    .from('attendance_logs')
    .insert([{ email, shift, check_in: checkIn, check_out: '--:--', status: 'On Site' }])
    .select()
    .single();

  if (error) { console.error('Error adding attendance log:', error); return null; }
  return data;
};

export const updateAttendanceCheckOut = async (id) => {
  const checkOutTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const { data, error } = await supabase
    .from('attendance_logs')
    .update({ check_out: checkOutTime, status: 'Checked Out' })
    .eq('id', id)
    .select()
    .single();

  if (error) { console.error('Error updating attendance log:', error); return null; }
  return data;
};
