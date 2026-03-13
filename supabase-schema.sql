-- =============================================
-- STRAIGHT LAB CRM - Supabase Schema
-- Supabase > SQL Editor 에서 실행하세요
-- =============================================

-- leads 테이블
create table if not exists leads (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  hagwon_name text not null,
  contact_name text not null,
  phone text not null,
  email text,
  status text default 'new' check (status in ('new', 'contacted', 'consulting', 'contracted', 'hold')),
  notes text,
  budget_tier text,
  recommended_channels text[],
  monthly_total integer,
  diagnosis_result jsonb
);

-- RLS 활성화
alter table leads enable row level security;

-- 인증된 사용자만 모든 작업 허용
create policy "Authenticated users can manage leads"
  on leads for all
  using (auth.role() = 'authenticated');

-- 익명 사용자는 INSERT만 허용 (진단 결과 제출)
create policy "Anyone can submit a lead"
  on leads for insert
  with check (true);

-- =============================================
-- 관리자 계정 role 설정 (최초 1회 실행)
-- =============================================
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'troywppark@gmail.com';
