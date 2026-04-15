import { supabase } from '../lib/supabase';

export const getSafetyIncidents = async () => {
  const { data, error } = await supabase
    .from('safety_incidents')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) { console.error('Error fetching safety incidents:', error); return []; }
  return data;
};

export const addSafetyIncident = async (incident) => {
  const { data, error } = await supabase
    .from('safety_incidents')
    .insert([{
      type: incident.type || null,
      location: incident.location || null,
      severity: incident.severity || null,
      description: incident.description || null,
      reported_by: incident.reportedBy || null,
    }])
    .select()
    .single();

  if (error) { console.error('Error adding safety incident:', error); return null; }
  return data;
};
