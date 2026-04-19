import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('Testing connection to:', supabaseUrl);
  const { data, error } = await supabase.from('profiles').select('*').limit(1);
  
  if (error) {
    console.error('Connection failed:', error.message);
  } else {
    console.log('Connection successful! Data fetched:', data);
  }
}

testConnection();
