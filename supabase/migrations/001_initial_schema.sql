-- Create custom types
CREATE TYPE user_role AS ENUM ('expert', 'entrepreneur', 'ngo');
CREATE TYPE profile_status AS ENUM ('pending_review', 'approved', 'rejected');
CREATE TYPE organization_type AS ENUM ('startup', 'ngo');
CREATE TYPE booking_status AS ENUM ('requested', 'confirmed', 'completed', 'cancelled');

-- Profiles table (shared base for all users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  role user_role NOT NULL,
  status profile_status NOT NULL DEFAULT 'approved',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Expert profiles
CREATE TABLE expert_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  headline TEXT NOT NULL,
  industries TEXT[] NOT NULL DEFAULT '{}',
  expertise_tags TEXT[] NOT NULL DEFAULT '{}',
  years_experience INTEGER NOT NULL DEFAULT 0,
  former_companies TEXT[] NOT NULL DEFAULT '{}',
  linkedin_url TEXT,
  meeting_link TEXT,
  availability JSONB,
  UNIQUE(profile_id)
);

-- Seeker profiles (entrepreneurs and NGOs)
CREATE TABLE seeker_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  organization_name TEXT NOT NULL,
  organization_type organization_type NOT NULL,
  website_url TEXT,
  stage TEXT,
  description TEXT,
  UNIQUE(profile_id)
);

-- Bookings
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expert_id UUID NOT NULL REFERENCES expert_profiles(id) ON DELETE CASCADE,
  seeker_id UUID NOT NULL REFERENCES seeker_profiles(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  meeting_link TEXT,
  status booking_status NOT NULL DEFAULT 'requested',
  topic TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Reviews (schema-ready for post-MVP)
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Admins table
CREATE TABLE admins (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_status ON profiles(status);
CREATE INDEX idx_expert_profiles_profile_id ON expert_profiles(profile_id);
CREATE INDEX idx_seeker_profiles_profile_id ON seeker_profiles(profile_id);
CREATE INDEX idx_bookings_expert_id ON bookings(expert_id);
CREATE INDEX idx_bookings_seeker_id ON bookings(seeker_id);
CREATE INDEX idx_bookings_status ON bookings(status);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row Level Security Policies

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE expert_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE seeker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Profiles: anyone can read, users can update their own
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Expert profiles: anyone can read approved, experts can manage their own
CREATE POLICY "Expert profiles are viewable by everyone"
  ON expert_profiles FOR SELECT USING (true);

CREATE POLICY "Experts can insert their own expert profile"
  ON expert_profiles FOR INSERT WITH CHECK (
    profile_id = auth.uid()
  );

CREATE POLICY "Experts can update their own expert profile"
  ON expert_profiles FOR UPDATE USING (
    profile_id = auth.uid()
  );

-- Seeker profiles: anyone can read, seekers can manage their own
CREATE POLICY "Seeker profiles are viewable by everyone"
  ON seeker_profiles FOR SELECT USING (true);

CREATE POLICY "Seekers can insert their own seeker profile"
  ON seeker_profiles FOR INSERT WITH CHECK (
    profile_id = auth.uid()
  );

CREATE POLICY "Seekers can update their own seeker profile"
  ON seeker_profiles FOR UPDATE USING (
    profile_id = auth.uid()
  );

-- Bookings: participants can view their own, seekers can create, experts can update
CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT USING (
    expert_id IN (SELECT id FROM expert_profiles WHERE profile_id = auth.uid())
    OR seeker_id IN (SELECT id FROM seeker_profiles WHERE profile_id = auth.uid())
  );

CREATE POLICY "Seekers can create bookings"
  ON bookings FOR INSERT WITH CHECK (
    seeker_id IN (SELECT id FROM seeker_profiles WHERE profile_id = auth.uid())
  );

CREATE POLICY "Booking participants can update bookings"
  ON bookings FOR UPDATE USING (
    expert_id IN (SELECT id FROM expert_profiles WHERE profile_id = auth.uid())
    OR seeker_id IN (SELECT id FROM seeker_profiles WHERE profile_id = auth.uid())
  );

-- Admins: only admins can read admin table
CREATE POLICY "Only admins can view admins table"
  ON admins FOR SELECT USING (
    auth.uid() IN (SELECT id FROM admins)
  );

-- Admin policies for managing profiles (approve/reject experts)
CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM admins)
  );
