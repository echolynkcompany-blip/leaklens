import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://afojfqrczdnhochkxefe.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmb2pmcXJjemRuaG9jaGt4ZWZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2NTkwOTMsImV4cCI6MjA5NTIzNTA5M30.0V78qcceoRibaDfp5jj2-dTf4AAIg-7ffuGV6nGOAzA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  }
});
