-- ==========================================
-- AUTHENTICATION & SECURITY POLICIES
-- Row Level Security for profiles table
-- ==========================================

-- Enable RLS on profiles table
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Allow users to read all profiles
-- This allows users to see other users' basic info (useful for admin features)
CREATE POLICY "Users can view all profiles"
  ON profiles
  FOR SELECT
  USING (true);

-- Policy: Allow users to insert their own profile
-- This is triggered when a new user signs up
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policy: Allow users to update only their own profile
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy: Prevent users from deleting profiles
-- Profile deletion should be handled through auth.users deletion
CREATE POLICY "Users cannot delete profiles"
  ON profiles
  FOR DELETE
  USING (false);

-- ==========================================
-- NOTES FOR IMPLEMENTATION
-- ==========================================
-- 1. Run this SQL in your Supabase SQL Editor
-- 2. Make sure to run this AFTER the main database schema
-- 3. The auth.uid() function returns the current authenticated user's ID
-- 4. These policies ensure users can only modify their own data
-- 5. All users can read profiles (useful for displaying user info in the app)
