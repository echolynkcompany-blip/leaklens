import { createClient } from '@supabase/supabase-js';

// ─────────────────────────────────────────────
// STEP 1: Replace these two values with yours
// from supabase.com → your project → Settings → API
// ─────────────────────────────────────────────
const SUPABASE_URL = 'https://afojfqrczdnhochkxefe.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmb2pmcXJjemRuaG9jaGt4ZWZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2NTkwOTMsImV4cCI6MjA5NTIzNTA5M30.0V78qcceoRibaDfp5jj2-dTf4AAIg-7ffuGV6nGOAzA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─────────────────────────────────────────────
// STEP 2: Run this SQL in Supabase → SQL Editor
// (copy/paste the whole block and click Run)
// ─────────────────────────────────────────────
/*
-- Practices table
create table practices (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  month text not null,
  avg_patient_value numeric default 300,
  missed_call_booking_rate numeric default 0.30,
  lead_conversion_rate numeric default 0.40,
  no_show_threshold numeric default 0.08,
  missed_call_threshold numeric default 0.10,
  cancellation_threshold numeric default 0.10,
  unbooked_lead_threshold numeric default 0.20,
  created_at timestamptz default now()
);

-- Calls table
create table calls (
  id uuid default gen_random_uuid() primary key,
  practice_id uuid references practices(id) on delete cascade,
  date text, time text, name text, phone text,
  status text, duration text, booked text, notes text,
  created_at timestamptz default now()
);

-- Appointments table
create table appointments (
  id uuid default gen_random_uuid() primary key,
  practice_id uuid references practices(id) on delete cascade,
  date text, time text, patient text, type text,
  provider text, status text, value numeric default 300, notes text,
  created_at timestamptz default now()
);

-- Leads table
create table leads (
  id uuid default gen_random_uuid() primary key,
  practice_id uuid references practices(id) on delete cascade,
  date text, name text, phone text, source text,
  service text, status text, booked text, value numeric default 300, notes text,
  created_at timestamptz default now()
);

-- Recovery queue status (which items are marked done)
create table recovery_status (
  id uuid default gen_random_uuid() primary key,
  practice_id uuid references practices(id) on delete cascade,
  item_key text not null,
  done boolean default false,
  created_at timestamptz default now(),
  unique(practice_id, item_key)
);
*/
