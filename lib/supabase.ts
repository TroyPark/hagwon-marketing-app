import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const siteUrl =
  typeof window !== 'undefined'
    ? window.location.origin + (window.location.pathname.startsWith('/hagwon-marketing-app') ? '/hagwon-marketing-app' : '')
    : 'https://troypark.github.io/hagwon-marketing-app';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getRedirectUrl = (path: string) => `${siteUrl}${path}`;

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
