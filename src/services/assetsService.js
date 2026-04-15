import { supabase } from '../lib/supabase';

export const getAssets = async () => {
  const { data, error } = await supabase
    .from('assets')
    .select('*')
    .order('id', { ascending: true });

  if (error) { console.error('Error fetching assets:', error); return []; }
  return data;
};
