/*
  # Fix RLS Policies for Meu Fluxo de Caixa Simples

  1. Tables
    - profiles (user profile information)
    - categories (transaction categories)
    - transactions (financial transactions)
    - plans (subscription plan details)
    - subscriptions (user subscription information)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Fix duplicate policy issues with existence checks
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('entrada', 'saida')),
  amount NUMERIC(10,2) NOT NULL,
  date DATE NOT NULL,
  description TEXT NOT NULL,
  category_id UUID REFERENCES categories(id),
  account TEXT NOT NULL CHECK (account IN ('pessoal', 'empresa')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create plans table
CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES plans(id),
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'trial')),
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default plan
INSERT INTO plans (name, price, description)
VALUES ('Padrão', 14.90, 'Plano Padrão do Meu Fluxo de Caixa Simples') 
ON CONFLICT DO NOTHING;

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- Profiles policies
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own profile') THEN
    DROP POLICY "Users can view their own profile" ON profiles;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own profile') THEN
    DROP POLICY "Users can update their own profile" ON profiles;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own profile') THEN
    DROP POLICY "Users can insert their own profile" ON profiles;
  END IF;

  -- Categories policies
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own categories') THEN
    DROP POLICY "Users can view their own categories" ON categories;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can create their own categories') THEN
    DROP POLICY "Users can create their own categories" ON categories;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own categories') THEN
    DROP POLICY "Users can update their own categories" ON categories;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete their own categories') THEN
    DROP POLICY "Users can delete their own categories" ON categories;
  END IF;

  -- Transactions policies
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own transactions') THEN
    DROP POLICY "Users can view their own transactions" ON transactions;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can create their own transactions') THEN
    DROP POLICY "Users can create their own transactions" ON transactions;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own transactions') THEN
    DROP POLICY "Users can update their own transactions" ON transactions;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete their own transactions') THEN
    DROP POLICY "Users can delete their own transactions" ON transactions;
  END IF;

  -- Plans policies
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Everyone can view plans') THEN
    DROP POLICY "Everyone can view plans" ON plans;
  END IF;

  -- Subscriptions policies
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own subscriptions') THEN
    DROP POLICY "Users can view their own subscriptions" ON subscriptions;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can create their own subscriptions') THEN
    DROP POLICY "Users can create their own subscriptions" ON subscriptions;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own subscriptions') THEN
    DROP POLICY "Users can update their own subscriptions" ON subscriptions;
  END IF;
END $$;

-- Create security policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own categories"
  ON categories FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories"
  ON categories FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions"
  ON transactions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions"
  ON transactions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Everyone can view plans"
  ON plans FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own subscriptions"
  ON subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);