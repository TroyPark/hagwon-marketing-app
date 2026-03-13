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

-- 기존 정책 삭제 후 재생성 (충돌 방지)
drop policy if exists "Authenticated users can manage customers" on customer;
drop policy if exists "Anyone can submit a consultation" on customer;

-- 비로그인 사용자도 INSERT 가능 (설문 제출)
create policy "Anyone can insert customer"
  on customer for insert
  with check (true);

-- 인증된 사용자(관리자)는 SELECT / UPDATE / DELETE 가능
create policy "Authenticated users can select customers"
  on customer for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can update customers"
  on customer for update
  using (auth.role() = 'authenticated');

create policy "Authenticated users can delete customers"
  on customer for delete
  using (auth.role() = 'authenticated');

-- =============================================
-- 관리자 계정 role 설정 (최초 1회 실행)
-- =============================================
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'troywppark@gmail.com';
