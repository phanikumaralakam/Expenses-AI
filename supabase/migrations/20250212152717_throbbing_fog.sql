/*
  # Fix Expenses RLS Policies

  1. Changes
    - Update RLS policies for expenses table to allow proper insertion
    - Add explicit INSERT policy for expenses table
    - Ensure user_id is set correctly on insert

  2. Security
    - Maintain data isolation between users
    - Allow users to manage their own expenses only
*/

-- Drop existing policy
DROP POLICY IF EXISTS "Users can manage own expenses" ON expenses;

-- Create separate policies for each operation
CREATE POLICY "Users can read own expenses"
  ON expenses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own expenses"
  ON expenses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expenses"
  ON expenses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own expenses"
  ON expenses FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);