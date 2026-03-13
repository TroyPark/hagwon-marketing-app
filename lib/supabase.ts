import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getRedirectUrl = (path: string) =>
  typeof window !== 'undefined' ? `${window.location.origin}${path}` : path;

export type CustomerStatus = 'new' | 'contacted' | 'consulting' | 'contracted' | 'hold';

export interface Customer {
  id: string;
  created_at: string;
  hagwon_name: string;
  contact_name: string;
  phone: string;
  email: string | null;
  diagnosis_result: Record<string, unknown> | null;
  status: CustomerStatus;
  notes: string | null;
  budget_tier: string | null;
  recommended_channels: string[] | null;
  monthly_total: number | null;
}
