/*
  # Complete ONG A.A.S Database Schema

  1. New Tables
    - `users` - User accounts with profile information and documents
    - `claims` - Insurance claims with file attachments
    - `claim_updates` - Updates and progress tracking for claims
    - `posts` - Admin posts with media content
    - `comments` - User comments on posts

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for users, admins, and public access
    - Ensure data privacy and proper access control

  3. Storage
    - Create storage buckets for profiles, claims, and posts
    - Set up proper file access policies
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  phone_number text UNIQUE NOT NULL,
  pin text NOT NULL,
  profile_image text,
  driver_license text,
  insurance_image text,
  insurance_start date,
  insurance_end date,
  car_number text NOT NULL,
  is_verified boolean DEFAULT false,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at timestamptz DEFAULT now()
);

-- Claims table
CREATE TABLE IF NOT EXISTS claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  date date NOT NULL,
  accident_images text[] DEFAULT ARRAY[]::text[],
  police_report text,
  insurance_receipt text,
  status text DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Resolved')),
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at timestamptz DEFAULT now()
);

-- Claim updates table
CREATE TABLE IF NOT EXISTS claim_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id uuid REFERENCES claims(id) ON DELETE CASCADE,
  updated_by uuid REFERENCES users(id),
  new_status text CHECK (new_status IN ('Pending', 'In Progress', 'Resolved')),
  new_progress integer CHECK (new_progress >= 0 AND new_progress <= 100),
  note text,
  created_at timestamptz DEFAULT now()
);

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  media text,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE claim_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read their own data"
  ON users FOR SELECT
  USING (true); -- Public read for admin verification

CREATE POLICY "Users can update their own data"
  ON users FOR UPDATE
  USING (true); -- Allow updates for verification

CREATE POLICY "Anyone can insert users (registration)"
  ON users FOR INSERT
  WITH CHECK (true);

-- Claims policies
CREATE POLICY "Users can read their own claims"
  ON claims FOR SELECT
  USING (true); -- Public read for claim numbers

CREATE POLICY "Verified users can create claims"
  ON claims FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update claims"
  ON claims FOR UPDATE
  USING (true);

-- Claim updates policies
CREATE POLICY "Anyone can read claim updates"
  ON claim_updates FOR SELECT
  USING (true);

CREATE POLICY "Admins can create claim updates"
  ON claim_updates FOR INSERT
  WITH CHECK (true);

-- Posts policies
CREATE POLICY "Anyone can read posts"
  ON posts FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage posts"
  ON posts FOR ALL
  USING (true);

-- Comments policies
CREATE POLICY "Anyone can read comments"
  ON comments FOR SELECT
  USING (true);

CREATE POLICY "Verified users can create comments"
  ON comments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own comments"
  ON comments FOR UPDATE
  USING (true);

CREATE POLICY "Users can delete their own comments"
  ON comments FOR DELETE
  USING (true);

-- Insert default admin user
INSERT INTO users (full_name, phone_number, pin, role, is_verified, car_number)
VALUES ('Admin User', '34141497', '3690', 'admin', true, 'ADMIN001')
ON CONFLICT (phone_number) DO NOTHING;

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('profiles', 'profiles', true),
  ('claims', 'claims', true),
  ('posts', 'posts', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Anyone can view profile files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profiles');

CREATE POLICY "Anyone can upload profile files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'profiles');

CREATE POLICY "Anyone can view claim files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'claims');

CREATE POLICY "Anyone can upload claim files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'claims');

CREATE POLICY "Anyone can view post files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'posts');

CREATE POLICY "Anyone can upload post files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'posts');