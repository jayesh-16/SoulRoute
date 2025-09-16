"use client";

import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home, MessageSquare, Calendar, BookOpen, Users, Shield, CheckCircle, UserCheck, LogOut } from "lucide-react";
import { HeartIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { clearSessionData } from "@/lib/session-manager";

export function AdminSidebar() {
  const router = useRouter();
  const currentPage = usePathname();

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

  const navItems = [
    { icon: Home, label: "Admin", href: "/admin" },
    { icon: CheckCircle, label: "Approvals", href: "/admin/approval" },
    { icon: BookOpen, label: "Resources", href: "/resources" }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="hidden md:flex fixed left-0 top-0 h-full w-20 bg-gradient-to-b from-blue-400 to-blue-700 flex-col items-center py-6 space-y-6 rounded-r-3xl shadow-lg z-50"
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
                            (currentPage.startsWith('/admin') && item.href === '/admin');
            
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
        </nav>
        
        <div className="mt-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="w-12 h-12 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
          >
            <LogOut className="w-6 h-6" />
          </Button>
        </div>
      </motion.div>

      {/* Mobile Bottom Navigation */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-400 to-blue-700 flex items-center justify-around py-3 px-4 rounded-t-3xl shadow-lg z-50"
      >
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = currentPage === item.href || 
                          (currentPage.startsWith('/admin') && item.href === '/admin');
          
          return (
            <Link href={item.href} key={index}>
              <Button
                variant="ghost"
                size="icon"
                className={`w-12 h-12 rounded-xl transition-all duration-300 ${
                  isActive ? "bg-white/20 text-white shadow-lg" : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className="w-5 h-5" />
              </Button>
            </Link>
          );
        })}
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="w-12 h-12 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </motion.div>
    </>
  );
}
