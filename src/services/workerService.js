import { supabase } from '../lib/supabase';

export const getWorkers = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, role')
    .eq('role', 'Worker')
    .order('email', { ascending: true });

  if (error) { 
    console.error('Error fetching workers:', error); 
    return []; 
  }
  
  return data;
};
