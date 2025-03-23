/*
  # Initial Schema Setup for AI Expense Manager

  1. New Tables
    - profiles
      - id (uuid, references auth.users)
      - full_name (text)
      - avatar_url (text)
      - updated_at (timestamp)
    
    - expenses
      - id (uuid)
      - user_id (uuid, references auth.users)
      - amount (numeric)
      - category (text)
      - description (text)
      - date (date)
      - created_at (timestamp)
    
    - expense_predictions
      - id (uuid)
      - user_id (uuid, references auth.users)
      - date (date)
      - predicted_amount (numeric)
      - confidence (numeric)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  PRIMARY KEY (id)
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create expenses table
CREATE TABLE expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  category text NOT NULL,
  description text,
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own expenses"
  ON expenses FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create expense_predictions table
CREATE TABLE expense_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  date date NOT NULL,
  predicted_amount numeric NOT NULL,
  confidence numeric NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

ALTER TABLE expense_predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own predictions"
  ON expense_predictions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX expenses_user_id_idx ON expenses(user_id);
CREATE INDEX expenses_date_idx ON expenses(date);
CREATE INDEX expense_predictions_user_id_idx ON expense_predictions(user_id);
CREATE INDEX expense_predictions_date_idx ON expense_predictions(date);