/*
  # Add insert policy for profiles table

  1. Security Changes
    - Add policy to allow users to insert their own profile
*/

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = id);