import { createClient } from '@supabase/supabase-js';

// Credentials provided by the user
const supabaseUrl = 'https://xujiqssuhxzsfembyfrf.supabase.co';
// The key was previously truncated. Combining the parts to form the valid JWT signature.
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1amlxc3N1aHh6c2ZlbWJ5ZnJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzgyNjQsImV4cCI6MjA3OTcxNDI2NH0.JA7wLHnl5BvKdJoj8Q61nuepV-5ZHJ7nBP0hGv3Al_w';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);