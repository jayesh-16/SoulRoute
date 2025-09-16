"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ActionResult, error, success } from "@/lib/utils";

// Validation schemas
const profileSetupSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  role: z.enum(["student", "counselor"], {
    required_error: "Please select your role",
  }),
});

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.string().optional().transform(val => val === 'true'),
});

const adminLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function signup(formData: FormData): Promise<ActionResult<string>> {
  const supabase = await createClient();

  const rawData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const basicSignupSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  });

  const validation = basicSignupSchema.safeParse(rawData);
  if (!validation.success) {
    return error(validation.error.errors[0].message);
  }

  const { email, password } = validation.data;

  try {
    // Standard Supabase auth signup with email confirmation required
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`
      }
    });

    if (authError) {
      console.error('Auth signup error:', authError);
      return error(authError.message);
    }

    if (!authData.user) {
      return error("Failed to create user account");
    }

    console.log('Auth user created successfully:', authData.user.id);
    
    // Check if email confirmation is required
    if (!authData.session) {
      return success("VERIFICATION_REQUIRED");
    }
    
    return success("Account created successfully!");
    
  } catch (err) {
    console.error('Signup error:', err);
    return error("An unexpected error occurred during signup");
  }
}

export async function setupProfile(formData: FormData): Promise<ActionResult<string>> {
  const supabase = await createClient();
  const serviceSupabase = await createServiceClient();

  // Check if user is authenticated
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return error("You must be logged in to set up your profile");
  }

  const rawData = {
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    role: formData.get('role') as 'student' | 'counselor',
  };

  const validation = profileSetupSchema.safeParse(rawData);
  if (!validation.success) {
    return error(validation.error.errors[0].message);
  }

  const { firstName, lastName, role } = validation.data;

  try {
    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single();

    if (existingProfile) {
      return error("Profile already exists");
    }

    // Create the user profile record using service client
    const { error: profileError } = await serviceSupabase
      .from('users')
      .insert({
        id: user.id,
        email: user.email!,
        first_name: firstName,
        last_name: lastName,
        role: role,
        approval_status: 'pending'
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      return error(`Failed to create user profile: ${profileError.message}`);
    }

    console.log('User profile created successfully');
    return success("Profile setup completed! Your account is now pending approval.");
    
  } catch (err) {
    console.error('Profile setup error:', err);
    return error("An unexpected error occurred during profile setup");
  }
}

export async function login(formData: FormData): Promise<ActionResult<string>> {
  const supabase = await createClient();

  const rawData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    rememberMe: formData.get('rememberMe') as string,
  };

  const validation = loginSchema.safeParse(rawData);
  if (!validation.success) {
    return error(validation.error.errors[0].message);
  }

  const { email, password, rememberMe } = validation.data;

  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return error("Invalid email or password");
    }

    if (!authData.user || !authData.session) {
      return error("Authentication failed");
    }

    // Store remember me preference for session management
    if (typeof window !== 'undefined') {
      if (rememberMe) {
        // Set a marker for 30-day session preference
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('loginTime', Date.now().toString());
      } else {
        // Remove remember me markers for standard session
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('loginTime');
      }
    }

    // Check user approval status and role
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('approval_status, role')
      .eq('id', authData.user.id)
      .single();

    if (userError) {
      // If user data doesn't exist, they need to complete profile setup
      if (userError.code === 'PGRST116') {
        return error("PROFILE_SETUP_REQUIRED");
      }
      console.error('User data fetch error:', userError);
      return error("Failed to fetch user information");
    }

    // Admin users bypass approval process
    if (userData.role === 'admin') {
      return success("ADMIN_LOGIN");
    }

    // Check approval status for students and counselors
    if (userData.approval_status === 'pending') {
      return error("PENDING_APPROVAL");
    }

    if (userData.approval_status === 'rejected') {
      return error("Your account has been rejected. Please contact support.");
    }

    // Return role-specific success messages
    if (userData.role === 'student') {
      return success("STUDENT_LOGIN");
    } else if (userData.role === 'counselor') {
      return success("COUNSELOR_LOGIN");
    }

    return success("Login successful");
  } catch (err) {
    console.error('Login error:', err);
    return error("An unexpected error occurred during login");
  }
}

export async function logout(): Promise<void> {
  const supabase = await createClient();
  
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Logout error:', error);
  }
  
  redirect('/');
}

export async function getCurrentUser() {
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }

  // Get additional user data
  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  return {
    ...user,
    profile: userData
  };
}

// Admin functions
export async function getPendingUsers(): Promise<ActionResult<any[]>> {
  const supabase = await createClient();
  
  try {
    // Check if current user is admin
    const currentUser = await getCurrentUser();
    if (!currentUser?.profile?.role || currentUser.profile.role !== 'admin') {
      return error("Unauthorized: Admin access required");
    }

    const { data: pendingUsers, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('approval_status', 'pending')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Error fetching pending users:', fetchError);
      return error("Failed to fetch pending users");
    }

    return success(pendingUsers || []);
  } catch (err) {
    console.error('Error in getPendingUsers:', err);
    return error("An unexpected error occurred");
  }
}

export async function approveUser(userId: string): Promise<ActionResult<string>> {
  const supabase = await createClient();
  
  try {
    // Check if current user is admin
    const currentUser = await getCurrentUser();
    if (!currentUser?.profile?.role || currentUser.profile.role !== 'admin') {
      return error("Unauthorized: Admin access required");
    }

    const { error: updateError } = await supabase
      .from('users')
      .update({ approval_status: 'approved' })
      .eq('id', userId);

    if (updateError) {
      console.error('Error approving user:', updateError);
      return error("Failed to approve user");
    }

    return success("User approved successfully");
  } catch (err) {
    console.error('Error in approveUser:', err);
    return error("An unexpected error occurred");
  }
}

export async function rejectUser(userId: string): Promise<ActionResult<string>> {
  const supabase = await createClient();
  
  try {
    // Check if current user is admin
    const currentUser = await getCurrentUser();
    if (!currentUser?.profile?.role || currentUser.profile.role !== 'admin') {
      return error("Unauthorized: Admin access required");
    }

    const { error: updateError } = await supabase
      .from('users')
      .update({ approval_status: 'rejected' })
      .eq('id', userId);

    if (updateError) {
      console.error('Error rejecting user:', updateError);
      return error("Failed to reject user");
    }

    return success("User rejected successfully");
  } catch (err) {
    console.error('Error in rejectUser:', err);
    return error("An unexpected error occurred");
  }
}

export async function getAllUsers(): Promise<ActionResult<any[]>> {
  const supabase = await createClient();
  
  try {
    // Check if current user is admin
    const currentUser = await getCurrentUser();
    if (!currentUser?.profile?.role || currentUser.profile.role !== 'admin') {
      return error("Unauthorized: Admin access required");
    }

    const { data: users, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Error fetching users:', fetchError);
      return error("Failed to fetch users");
    }

    return success(users || []);
  } catch (err) {
    console.error('Error in getAllUsers:', err);
    return error("An unexpected error occurred");
  }
}