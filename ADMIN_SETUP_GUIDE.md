# Admin Setup Guide - Kisaan Suvidha

## 🎯 Your Admin Credentials
- **Email**: admin1@gmail.com
- **Password**: admin111

## 📋 Step-by-Step Setup

### Step 1: Fix the Admin Profiles Table
Run this SQL in your Supabase SQL Editor:
```sql
-- Copy and paste the contents of fix-admin-profiles.sql
```

### Step 2: Create the Admin User
Run this SQL in your Supabase SQL Editor:
```sql
-- Copy and paste the contents of create-admin-user.sql
```

### Step 3: Set up Environment Variables
Create a `.env` file in your project root (`kisaan-suvidha/.env`) with:

```env
REACT_APP_SUPABASE_URL=your_supabase_project_url_here
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**Important**: In Create React App, environment variables must start with `REACT_APP_`

### Step 4: Verify the Setup
Run these queries to confirm everything is set up correctly:

```sql
-- Check if admin user exists
SELECT id, email, email_confirmed_at FROM auth.users WHERE email = 'admin1@gmail.com';

-- Check if admin profile exists
SELECT * FROM profiles WHERE email = 'admin1@gmail.com';

-- Check if admin_profiles record exists
SELECT ap.*, p.email 
FROM admin_profiles ap 
JOIN profiles p ON ap.user_id = p.id 
WHERE p.email = 'admin1@gmail.com';
```

## 🚀 Testing the Admin Login

1. **Start your React app**:
   ```bash
   cd kisaan-suvidha
   npm start
   ```

2. **Navigate to login page**:
   - Go to `http://localhost:3000/AccountSetup`

3. **Login as admin**:
   - Select "Admin" role
   - Enter email: `admin1@gmail.com`
   - Enter password: `admin111`
   - Click "Sign In"

4. **Expected result**:
   - Should redirect to `/admin` page
   - Should see admin dashboard with your admin level (super)
   - Should see admin information panel

## 🔧 What's Been Set Up

### Database Tables:
- ✅ `profiles` - User profiles with roles
- ✅ `admin_profiles` - Admin-specific data
- ✅ Row Level Security policies
- ✅ Proper foreign key relationships

### Admin User:
- ✅ Email: admin1@gmail.com
- ✅ Password: admin111
- ✅ Role: admin
- ✅ Admin Level: super
- ✅ Full permissions enabled

### Frontend Features:
- ✅ Admin authentication
- ✅ Protected `/admin` route
- ✅ Admin dashboard with stats
- ✅ Admin level display
- ✅ Sign out functionality

## 🛠️ Troubleshooting

### Issue: "Invalid login credentials"
**Solution**: 
1. Check if the user was created properly:
   ```sql
   SELECT * FROM auth.users WHERE email = 'admin1@gmail.com';
   ```
2. If not found, run the create-admin-user.sql script again

### Issue: "Access denied"
**Solution**:
1. Check if profile has admin role:
   ```sql
   SELECT role FROM profiles WHERE email = 'admin1@gmail.com';
   ```
2. Should return 'admin'

### Issue: Environment variables not working
**Solution**:
1. Ensure variable names start with `REACT_APP_` (not `VITE_`)
2. Restart the development server after adding `.env` file
3. Check browser console for environment variable status

### Issue: Admin dashboard not loading
**Solution**:
1. Check browser console for errors
2. Verify your `.env` file has correct Supabase credentials
3. Restart the development server

## 📊 Admin Dashboard Features

Once logged in, you'll see:
- **Admin Information Panel**: Shows admin level, user ID, member since date
- **Stats Cards**: Total users, active orders, revenue
- **Quick Actions**: Add user, view reports, settings, support
- **Admin Level Badge**: Shows "super Admin" in the header

## 🔐 Security Features

- **Row Level Security**: Users can only access their own data
- **Role-based Access**: Only admin users can access `/admin`
- **Protected Routes**: Automatic redirects for unauthorized access
- **Session Management**: Proper sign out functionality

## 🎉 Next Steps

After successful setup, you can:
1. **Customize the dashboard** - Add more admin features
2. **Add more admin users** - Create additional admin accounts
3. **Implement user management** - Add/remove users from admin panel
4. **Add analytics** - Real-time data from your database
5. **Create role-specific dashboards** - For farmers, buyers, service providers

## 📞 Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify all SQL scripts ran successfully
3. Ensure your `.env` file is properly configured with `REACT_APP_` prefix
4. Restart the development server after any changes

Your admin system is now ready to use! 🚀 