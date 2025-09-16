"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { StudentSidebar } from "./student-sidebar";
import { CounselorSidebar } from "./counselor-sidebar";
import { AdminSidebar } from "./admin-sidebar";

export function RoleBasedSidebar() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserRole = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();
          
          if (userData) {
            setUserRole(userData.role);
          }
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      } finally {
        setLoading(false);
      }
    };

    getUserRole();
  }, []);

  if (loading) {
    return null; // Or a loading skeleton
  }

  switch (userRole) {
    case 'student':
      return <StudentSidebar />;
    case 'counselor':
      return <CounselorSidebar />;
    case 'admin':
      return <AdminSidebar />;
    default:
      return <StudentSidebar />; // Default fallback
  }
}
