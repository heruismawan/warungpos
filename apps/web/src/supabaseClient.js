import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zcreofbgsncmzvhaijwq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjcmVvZmJnc25jbXp2aGFpandxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MjMxODAsImV4cCI6MjA5MzI5OTE4MH0.s_xea5ti3GM0tMJdoLsfCcOEq82Yerha6_1bc3WUsUQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
