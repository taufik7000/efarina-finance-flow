
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = 'https://pvsxbdnhldeadmvxywfr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2c3hiZG5obGRlYWRtdnh5d2ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4OTk2NjUsImV4cCI6MjA2MzQ3NTY2NX0.2pQhIviEJS1frFYz45KQLcWI4qIITpZKnGVqPgtahjY';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing!');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export default supabase;
