-- =============================================
-- STRAIGHT LAB CRM - Supabase Schema
-- Supabase > SQL Editor 에서 실행하세요
-- =============================================

-- 기존 테이블 이름 변경 (이미 만든 경우)
-- ALTER TABLE students RENAME TO customer;
-- ALTER TABLE leads RENAME TO customer;

-- customer 테이블 새로 생성
create table if not exists customer (
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
alter table customer enable row level security;

-- 인증된 사용자(관리자)만 전체 관리 가능
create policy "Authenticated users can manage customers"
  on customer for all
  using (auth.role() = 'authenticated');

-- 비로그인 사용자도 상담 신청(INSERT) 가능
create policy "Anyone can submit a consultation"
  on customer for insert
  with check (true);

-- =============================================
-- 관리자 계정 role 설정 (최초 1회 실행)
-- =============================================
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'troywppark@gmail.com';
