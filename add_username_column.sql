-- ==========================================
-- ADD USERNAME COLUMN TO PROFILES TABLE
-- Run this SQL in Supabase SQL Editor
-- ==========================================

-- Add username column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;

-- Create index for faster username lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- Update existing profiles with username from email (if any exist)
-- This is a one-time migration for existing data
UPDATE profiles 
SET username = SPLIT_PART(
  (SELECT email FROM auth.users WHERE id = profiles.id), 
  '@', 
  1
)
WHERE username IS NULL;
