// src/utils/supabase.js
// Supabase client setup and sample fetch function

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://mhrkyxblweffdxkciwaz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ocmt5eGJsd2VmZmR4a2Npd2F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwNDkzNzUsImV4cCI6MjA2NTYyNTM3NX0.T5wSPNCdJpA4turhsGi3BveWuujLz53c9MZ3q2uevB8

export const supabase = createClient(supabaseUrl, supabaseKey);

// Example: fetch all accounts
export async function fetchAccounts() {
  const { data, error } = await supabase.from('accounts').select('*');
  if (error) throw error;
  return data;
} 