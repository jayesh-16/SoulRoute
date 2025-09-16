# Supabase Setup Instructions

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your project URL and anon key from the project settings

## 2. Environment Variables

Update your `.env.local` file with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## 3. Database Setup

Run the following SQL in your Supabase SQL Editor to create the required tables:

```sql
-- Create custom types
CREATE TYPE user_role AS ENUM ('student', 'counselor', 'admin');
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected');

-- Create users table (extends auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role user_role NOT NULL,
  approval_status approval_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user profiles table
CREATE TABLE public.user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  bio TEXT,
  university TEXT,
  year_of_study TEXT,
  specialization TEXT, -- For counselors
  license_number TEXT, -- For counselors
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can read their own data
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Admins can read all user data
CREATE POLICY "Admins can read all user data" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Users can update their own data
CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Admins can update user approval status
CREATE POLICY "Admins can update approval status" ON public.users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create user record for student and counselor signups
  -- Admin accounts will be created manually
  IF NEW.raw_user_meta_data->>'role' IN ('student', 'counselor') THEN
    INSERT INTO public.users (id, email, first_name, last_name, role, approval_status)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'role', 'student')::user_role,
      'pending'
    );
  END IF;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the auth signup
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user record
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create default admin user (run this after setting up auth)
-- Replace with your admin email and password
-- INSERT INTO auth.users (email, encrypted_password, email_confirmed_at, created_at, updated_at)
-- VALUES ('admin@soulroute.com', crypt('your_admin_password', gen_salt('bf')), NOW(), NOW(), NOW());
--
-- Then manually insert into users table:
-- INSERT INTO public.users (id, email, first_name, last_name, role, approval_status)
-- VALUES (
--   (SELECT id FROM auth.users WHERE email = 'admin@soulroute.com'),
--   'admin@soulroute.com',
--   'Admin',
--   'User',
--   'admin',
--   'approved'
-- );
```

## 5. Create Admin User

After setting up the database, you need to create an admin user manually:

### Option 1: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Users
3. Click "Add User" and create a user with:

   - Email: admin@soulroute.com (or your preferred admin email)
   - Password: Your secure admin password
   - Email Confirmed: Yes

4. After creating the auth user, go to Table Editor > users
5. Insert a new row with:
   - id: (copy the user ID from auth.users)
   - email: admin@soulroute.com
   - first_name: Admin
   - last_name: User
   - role: admin
   - approval_status: approved

### Option 2: Using SQL

```sql
-- First, create the auth user (replace with your email and password)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@soulroute.com',
  crypt('your_admin_password_here', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "admin"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Then create the user profile
INSERT INTO public.users (id, email, first_name, last_name, role, approval_status)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@soulroute.com'),
  'admin@soulroute.com',
  'Admin',
  'User',
  'admin',
  'approved'
);
```

## 6. Authentication Configuration

In your Supabase project settings:

1. Go to Authentication > Settings
2. Configure your site URL: `http://localhost:3000` (for development)
3. Add your production URL when deploying
4. Configure email templates as needed

## 7. Testing

1. Start your development server: `npm run dev`
2. Try creating a new student/counselor account through the signup flow
3. Check your Supabase dashboard to see the new user records with 'pending' status
4. Login as admin to approve/reject users
5. Test login with approved student/counselor accounts

## 8. User Flow Summary

### Student/Counselor Registration:

1. User visits `/signup`
2. Selects role (student or counselor)
3. Fills out registration form
4. Account created with `approval_status: 'pending'`
5. User redirected to `/waiting-approval`

### Admin Approval Process:

1. Admin logs in and is redirected to `/admin`
2. Admin can access `/admin/approval` to see pending users
3. Admin approves or rejects users
4. Approved users can login and access the platform
5. Rejected users see rejection message on login

### Login Flow:

- **Admin**: Direct access to admin dashboard
- **Approved Users**: Access to main dashboard
- **Pending Users**: Redirected to waiting approval page
- **Rejected Users**: Login denied with error message

## 🚨 IMPORTANT: Email Verification Setup Required

**Before testing the signup flow, you MUST configure email verification in Supabase:**

### Step 1: Enable Email Confirmation

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Settings**
3. Scroll down to **"User Signups"** section
4. **Enable** "Enable email confirmations" toggle
5. Set "Site URL" to: `http://localhost:3000`
6. Under "Redirect URLs", add:
   ```
   http://localhost:3000/auth/callback
   ```

### Step 2: Test Email Delivery

- For development, Supabase uses their SMTP service
- Check your spam folder if emails don't arrive
- For production, configure your own SMTP provider

### Step 3: New Authentication Flow

1. **Signup** → User enters email/password → Email verification required
2. **Email Verification** → User clicks link in email → Redirected to callback
3. **Profile Setup** → User completes name and role → Profile saved
4. **Waiting for Approval** → Admin approves/rejects → User can access dashboard

## Email Verification Setup

### Enable Email Confirmation

1. Go to Supabase Dashboard → Authentication → Settings
2. Under "User Signups", make sure "Enable email confirmations" is **enabled**
3. Set "Site URL" to: `http://localhost:3000` (for development)
4. Add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - For production, add your domain URLs

### Email Templates (Optional)

You can customize the email templates in Authentication → Email Templates:

- **Confirm signup**: Template sent when user signs up
- **Magic Link**: Template for passwordless login
- **Change Email Address**: Template when user changes email
- **Reset Password**: Template for password reset

## Database Schema

The setup creates:

- `users` table: Core user information with approval status and role (student, counselor, admin)
- `user_profiles` table: Extended profile information
- `support_tickets` table: Ticket-based appointment system for counseling sessions

### Database Tables Structure

#### Support Tickets System

Run the ticket system setup from the `database/create_ticket_system.sql` file:

```sql
-- This will create:
-- 1. Custom enums for ticket categories, urgency, status, and session modes
-- 2. support_tickets table with proper relationships
-- 3. Row Level Security (RLS) policies for secure access
-- 4. Indexes for performance optimization
-- 5. Triggers for automatic timestamp updates
```

- Automatic user creation on signup (students and counselors only)
- Row Level Security for data protection
- Admin policies for managing user approvals
- Proper relationships and constraints

## Features Implemented

✅ **Three-Role System**: Admin, Counselor, Student
✅ **Signup Restriction**: Only students and counselors can signup
✅ **Admin Creation**: Manual admin account creation
✅ **Approval Workflow**: Pending → Approved/Rejected
✅ **Role-Based Access**: Middleware protection for routes
✅ **Admin Dashboard**: Manage user approvals
✅ **Secure Authentication**: Supabase Auth integration

## Troubleshooting

### "Database error saving new user" during signup

This error typically occurs when:

1. **Database tables not created**: Make sure you've run all the SQL commands in the setup
2. **Environment variables missing**: Check your `.env.local` file has the correct Supabase credentials
3. **Trigger function not working**: Verify the trigger was created successfully

**To fix:**

1. Check if the `users` table exists:

```sql
SELECT * FROM information_schema.tables WHERE table_name = 'users';
```

2. Check if the trigger exists:

```sql
SELECT * FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created';
```

3. Test the trigger function manually:

```sql
-- Check if the function exists
SELECT * FROM information_schema.routines WHERE routine_name = 'handle_new_user';
```

4. Check RLS policies:

```sql
-- Verify RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'users';

-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'users';
```

5. If trigger is not working, you can temporarily disable it and the signup function will handle user creation manually:

```sql
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
```

### Environment Variables Setup

Make sure your `.env.local` contains:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Testing Database Connection

You can test if your Supabase connection is working by checking the browser console during signup for detailed error messages.

## Next Steps

After setting up Supabase:

1. Test the signup and login flows
2. Implement admin approval functionality
3. Add password reset functionality
4. Enhance user profiles based on role requirements
