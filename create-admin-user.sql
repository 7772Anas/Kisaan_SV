-- Create admin user with the provided credentials
-- Email: admin1@gmail.com
-- Password: admin111

-- First, create the user in auth.users
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

-- Get the user ID that was just created
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