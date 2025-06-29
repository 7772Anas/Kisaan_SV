-- =====================================================
-- COMPLETE DATABASE SETUP FOR KISAAN SUVIDHA
-- Matches AccountSetup.js data structure exactly
-- =====================================================

-- Clean up existing tables (if any)
DROP TABLE IF EXISTS admin_profiles CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

-- =====================================================
-- 1. MAIN PROFILES TABLE (for all user types)
-- =====================================================

CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin', 'farmer', 'buyer', 'service')),
  phone TEXT,
  
  -- Common location fields
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  
  -- Farmer specific fields
  farm_name TEXT,
  farm_location TEXT,
  farm_address TEXT,
  
  -- Buyer specific fields
  home_address TEXT,
  home_address_full TEXT,
  
  -- Service Provider specific fields
  org_name TEXT,
  service_type TEXT CHECK (service_type IN ('Water', 'Electricity', 'Labor', 'Machinery')),
  service_location TEXT,
  service_address TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- =====================================================
-- 2. ADMIN PROFILES TABLE (for admin-specific data)
-- =====================================================

CREATE TABLE admin_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  admin_level VARCHAR(20) NOT NULL DEFAULT 'standard' CHECK (admin_level IN ('super', 'standard', 'moderator')),
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_profiles table
CREATE POLICY "Admins can view admin profiles" ON admin_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update admin profiles" ON admin_profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert admin profiles" ON admin_profiles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- =====================================================
-- 3. AUTOMATIC PROFILE CREATION FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'farmer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- 4. CREATE ADMIN USER
-- =====================================================

-- Create admin user with provided credentials
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data
) VALUES (
  gen_random_uuid(),
  'admin1@gmail.com',
  crypt('admin111', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"full_name": "Admin User", "role": "admin"}'::jsonb
);

-- Get the admin user ID and create profiles
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Get the admin user ID
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = 'admin1@gmail.com';

  -- Create profile for the admin user
  INSERT INTO profiles (
    id,
    email,
    full_name,
    role
  ) VALUES (
    admin_user_id,
    'admin1@gmail.com',
    'Admin User',
    'admin'
  );

  -- Create admin profile
  INSERT INTO admin_profiles (
    user_id,
    admin_level,
    permissions
  ) VALUES (
    admin_user_id,
    'super',
    '{"manage_users": true, "manage_content": true, "view_analytics": true, "manage_settings": true}'::jsonb
  );

  RAISE NOTICE 'Admin user created successfully with ID: %', admin_user_id;
END $$;

-- =====================================================
-- 5. VERIFICATION QUERIES
-- =====================================================

-- Check if admin user exists
SELECT 'Admin User Check:' as info, id, email, email_confirmed_at FROM auth.users WHERE email = 'admin1@gmail.com';

-- Check if admin profile exists
SELECT 'Admin Profile Check:' as info, * FROM profiles WHERE email = 'admin1@gmail.com';

-- Check if admin_profiles record exists
SELECT 'Admin Details Check:' as info, ap.*, p.email 
FROM admin_profiles ap 
JOIN profiles p ON ap.user_id = p.id 
WHERE p.email = 'admin1@gmail.com';

-- =====================================================
-- 6. SAMPLE DATA FOR TESTING (OPTIONAL)
-- =====================================================

-- You can uncomment these to create sample users for testing

/*
-- Sample Farmer
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
VALUES (gen_random_uuid(), 'farmer@test.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"full_name": "John Farmer", "role": "farmer"}'::jsonb);

-- Sample Buyer
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
VALUES (gen_random_uuid(), 'buyer@test.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"full_name": "Jane Buyer", "role": "buyer"}'::jsonb);

-- Sample Service Provider
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
VALUES (gen_random_uuid(), 'service@test.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), '{"full_name": "Bob Service", "role": "service"}'::jsonb);
*/

RAISE NOTICE 'Database setup completed successfully!';
RAISE NOTICE 'Admin credentials: admin1@gmail.com / admin111'; 