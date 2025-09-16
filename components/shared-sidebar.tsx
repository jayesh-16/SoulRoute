"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Home, Calendar, BookOpen, Users, Bot, MessageSquare,
  Shield, CheckCircle, UserCheck, User, LogOut
} from "lucide-react";
import { HeartIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { clearSessionData } from '@/lib/session-manager';

interface SidebarProps {
  currentPage?: string;
  userRole?: 'student' | 'counselor' | 'admin';
}

export const SharedSidebar = ({ currentPage = '', userRole = 'student' }: SidebarProps) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      
      // Clear session data including remember me preferences
      clearSessionData();
      
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  // Define navigation items based on user role
  const getNavItems = () => {
    if (userRole === 'student') {
      return [
        { icon: Home, label: "Dashboard", href: "/student" },
        { icon: Bot, label: "Chatbot", href: "/chat" },
        { icon: Calendar, label: "Tickets", href: "/tickets" },
        { icon: BookOpen, label: "Resources", href: "/resources" },
        { icon: Users, label: "Peer Support", href: "/peer-support" }
      ];
    } else if (userRole === 'counselor') {
      return [
        { icon: Home, label: "Counselor", href: "/counselor" },
        { icon: Calendar, label: "Tickets", href: "/tickets" },
        { icon: Users, label: "Peer Support", href: "/peer-support" }
      ];
    } else if (userRole === 'admin') {
      return [
        { icon: Home, label: "Dashboard", href: "/dashboard" },
        { icon: MessageSquare, label: "Messages", href: "/chat" },
        { icon: Calendar, label: "Tickets", href: "/tickets" },
        { icon: BookOpen, label: "Resources", href: "/resources" },
        { icon: Users, label: "Peer Support", href: "/peer-support" },
        { icon: Shield, label: "Admin", href: "/admin" },
        { icon: CheckCircle, label: "Approvals", href: "/admin/approval" },
        { icon: UserCheck, label: "Counselor", href: "/counselor" }
      ];
    }
    
    return [];
  };

  const navItems = getNavItems();

  return (
    <motion.div 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed left-0 top-0 h-full w-20 bg-gradient-to-b from-blue-400 to-blue-700 flex flex-col items-center py-6 space-y-6 rounded-r-3xl shadow-lg z-50"
    >
      <motion.div 
        whileHover={{ scale: 1.1, rotate: 5 }}
        className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-6 cursor-pointer"
      >
        <HeartIcon className="w-6 h-6 text-white" />
      </motion.div>
      
      <nav className="flex flex-col space-y-4">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = currentPage === item.href || 
                          (currentPage.startsWith('/tickets/') && item.href === '/tickets') ||
                          (currentPage.startsWith('/chat') && item.href === '/chat') ||
                          (currentPage.startsWith('/admin') && item.href === '/admin') ||
                          (currentPage === '/student' && item.href === '/student') ||
                          (currentPage === '/dashboard' && item.href === '/dashboard') ||
                          (currentPage === '/counselor' && item.href === '/counselor');
          
          return (
            <Link href={item.href} key={index}>
              <Button
                variant="ghost"
                size="icon"
                className={`w-12 h-12 rounded-xl transition-all duration-300 ${
                  isActive ? "bg-white/20 text-white shadow-lg" : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className="w-6 h-6" />
              </Button>
            </Link>
          );
        })}
        
        {/* Logout Button */}
        <motion.div
          className="mt-auto pt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-xl transition-all duration-300 text-white/70 hover:text-white hover:bg-red-500/20 border border-red-400/30 hover:border-red-400"
            title="Logout"
          >
            <LogOut className="w-6 h-6" />
          </Button>
        </motion.div>
      </nav>
    </motion.div>
  );
};
