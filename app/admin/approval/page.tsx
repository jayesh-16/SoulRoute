"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, XCircle, Clock, Mail, User, GraduationCap, 
  ArrowLeft, Eye, Filter, Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin-sidebar";
import { getPendingUsers, approveUser, rejectUser } from "@/lib/actions/auth";

interface PendingUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'student' | 'counselor';
  created_at: string;
  approval_status: 'pending' | 'approved' | 'rejected';
}

const DURATION = 0.3;
const EASE_OUT = "easeOut";

// Sidebar Navigation Component
// const Sidebar = () => {
//   const navItems = [
//     { icon: Home, label: "Dashboard", active: false, href: "/dashboard" },
//     { icon: MessageSquare, label: "Messages", active: false, href: "/chat" },
//     { icon: Calendar, label: "Tickets", active: false, href: "/tickets" },
//     { icon: BookOpen, label: "Resources", active: false, href: "/resources" },
//     { icon: Users, label: "Peer Support", active: false, href: "/peer-support" },
//     { icon: Shield, label: "Admin", active: false, href: "/admin" },
//     { icon: CheckCircle, label: "Approvals", active: true, href: "/admin/approval" },
//     { icon: UserCheck, label: "Counselor", active: false, href: "/counselor" },
//     { icon: User, label: "Student", active: false, href: "/student" }
//   ];

//   return (
//     <motion.div 
//       initial={{ x: -100, opacity: 0 }}
//       animate={{ x: 0, opacity: 1 }}
//       transition={{ duration: 0.6, ease: "easeOut" }}
//       className="fixed left-0 top-0 h-full w-20 bg-gradient-to-b from-blue-400 to-blue-700 flex flex-col items-center py-6 space-y-6 rounded-r-3xl shadow-lg"
//     >
//       {/* Logo */}
//       <motion.div 
//         whileHover={{ scale: 1.1, rotate: 5 }}
//         whileTap={{ scale: 0.95 }}
//         className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-6 cursor-pointer"
//       >
//         <motion.div
//           animate={{ scale: [1, 1.2, 1] }}
//           transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
//         >
//           <HeartIcon className="w-6 h-6 text-white" />
//         </motion.div>
//       </motion.div>
      
//       {/* Navigation Items */}
//       <nav className="flex flex-col space-y-4">
//         {navItems.map((item, index) => {
//           const Icon = item.icon;
//           return (
//             <Link href={item.href} key={index}>
//               <motion.div
//                 initial={{ x: -50, opacity: 0 }}
//                 animate={{ x: 0, opacity: 1 }}
//                 transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
//                 whileHover={{ scale: 1.1, x: 5 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className={`w-12 h-12 rounded-xl transition-all duration-300 ${
//                     item.active 
//                       ? "bg-white/20 text-white shadow-lg" 
//                       : "text-white/70 hover:text-white hover:bg-white/10"
//                   }`}
//                 >
//                   <Icon className="w-6 h-6" />
//                 </Button>
//               </motion.div>
//             </Link>
//           );
//         })}
//       </nav>
//     </motion.div>
//   );
// };

export default function AdminApprovalPage() {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'student' | 'counselor'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch pending users on component mount
  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getPendingUsers();
      if (result.success) {
        setPendingUsers(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error('Error fetching pending users:', err);
      setError('Failed to fetch pending users');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    try {
      const result = await approveUser(userId);
      if (result.success) {
        // Remove from pending list
        setPendingUsers(prev => prev.filter(user => user.id !== userId));
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error('Error approving user:', err);
      setError('Failed to approve user');
    }
  };

  const handleReject = async (userId: string) => {
    try {
      const result = await rejectUser(userId);
      if (result.success) {
        // Remove from pending list
        setPendingUsers(prev => prev.filter(user => user.id !== userId));
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error('Error rejecting user:', err);
      setError('Failed to reject user');
    }
  };

  const filteredUsers = pendingUsers.filter(user => {
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <AdminSidebar />
        <div className="md:ml-20 md:pb-0 pb-20 flex min-h-screen">
          <div className="flex-1 p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading pending approvals...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <AdminSidebar />
        <div className="md:ml-20 md:pb-0 pb-20 flex min-h-screen">
          <div className="flex-1 p-8 flex items-center justify-center">
            <div className="text-center">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Data</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={fetchPendingUsers} className="bg-blue-600 text-white">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Main Content */}
      <div className="md:ml-20 md:pb-0 pb-20 flex min-h-screen">
        <motion.div 
          className="flex-1 p-3 sm:p-6 lg:p-8"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <Card className="bg-white border border-gray-200 shadow-lg rounded-xl mb-4 sm:mb-6 overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-800 to-blue-400"></div>
            <CardContent className="p-3 sm:p-4 lg:p-6">
              {/* Mobile Header */}
              <div className="flex sm:hidden items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center border-2 border-blue-300 shadow-md">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Admin Approval Center
                  </h1>
                </div>
                <Badge className="bg-yellow-100 text-yellow-700 border-0 text-xs px-2 py-1 rounded-full">
                  {filteredUsers.length}
                </Badge>
              </div>

              {/* Desktop Header */}
              <div className="hidden sm:flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <Link href="/dashboard">
                    <Button variant="ghost" size="icon" className="rounded-xl hover:bg-blue-50">
                      <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                    </Button>
                  </Link>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center border-2 border-blue-300 shadow-md">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" />
                    </div>
                    <div>
                      <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Admin Approval Center
                      </h1>
                      <p className="text-xs sm:text-sm text-gray-500">Review and manage user registrations • Real-time Approvals</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className="bg-yellow-100 text-yellow-700 border-0 px-3 sm:px-4 py-2">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="text-xs sm:text-sm">{filteredUsers.length} Pending</span>
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <motion.div className="bg-white p-3 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl lg:rounded-3xl">
            {/* Search and Filter Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-4 sm:mb-6 lg:mb-8"
            >
              <Card className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-800 to-blue-400"></div>
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Search & Filter Users</h3>
                    <p className="text-sm text-gray-600">Find and filter pending registration requests</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <div className="flex-1 relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-xl blur-sm opacity-30 group-focus-within:opacity-50 transition-opacity duration-300"></div>
                      <div className="relative bg-white rounded-xl" style={{ 
                        border: '3px solid transparent',
                        backgroundImage: 'linear-gradient(white, white), linear-gradient(45deg, #1e3a8a, #60a5fa, #8b5cf6, #3b82f6)',
                        backgroundOrigin: 'border-box',
                        backgroundClip: 'content-box, border-box'
                      }}>
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-600 w-5 h-5 z-10" />
                        <Input
                          placeholder="Search for user by name, email, university, or credentials..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-12 pr-4 py-4 border-0 bg-transparent rounded-xl focus:ring-2 focus:ring-blue-300 focus:outline-none text-gray-800 placeholder-gray-500 font-medium"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant={filterRole === 'all' ? 'default' : 'ghost'}
                          onClick={() => setFilterRole('all')}
                          className={`w-full sm:w-auto rounded-xl px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold transition-all duration-300 shadow-md ${
                            filterRole === 'all' 
                              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg border-2 border-blue-500 transform scale-105' 
                              : 'border-2 border-blue-200 text-blue-600 hover:border-blue-400 hover:bg-blue-50 hover:shadow-lg'
                          }`}
                        >
                          <Filter className="w-4 h-4 mr-2" />
                          All Users
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant={filterRole === 'student' ? 'default' : 'ghost'}
                          onClick={() => setFilterRole('student')}
                          className={`w-full sm:w-auto rounded-xl px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold transition-all duration-300 shadow-md ${
                            filterRole === 'student' 
                              ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg border-2 border-green-500 transform scale-105' 
                              : 'border-2 border-green-200 text-green-600 hover:border-green-400 hover:bg-green-50 hover:shadow-lg'
                          }`}
                        >
                          <GraduationCap className="w-4 h-4 mr-2" />
                          Students
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant={filterRole === 'counselor' ? 'default' : 'ghost'}
                          onClick={() => setFilterRole('counselor')}
                          className={`w-full sm:w-auto rounded-xl px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold transition-all duration-300 shadow-md ${
                            filterRole === 'counselor' 
                              ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg border-2 border-purple-500 transform scale-105' 
                              : 'border-2 border-purple-200 text-purple-600 hover:border-purple-400 hover:bg-purple-50 hover:shadow-lg'
                          }`}
                        >
                          <User className="w-4 h-4 mr-2" />
                          Counselors
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Results Counter */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-4 sm:mb-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <p className="text-sm font-medium text-gray-600">
                    Showing <span className="font-bold text-blue-600">{filteredUsers.length}</span> pending {filteredUsers.length === 1 ? 'request' : 'requests'}
                    {searchTerm && (
                      <span className="ml-1">
                        for "<span className="font-semibold text-gray-800">{searchTerm}</span>"
                      </span>
                    )}
                    {filterRole !== 'all' && (
                      <span className="ml-1">
                        in <span className="font-semibold text-gray-800 capitalize">{filterRole}s</span>
                      </span>
                    )}
                  </p>
                </div>
                {filteredUsers.length > 0 && (
                  <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-200 px-3 py-1 rounded-full font-medium">
                    <Clock className="w-3 h-3 mr-1" />
                    Requires Action
                  </Badge>
                )}
              </div>
            </motion.div>

            {/* Pending Approvals Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
              {filteredUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Card className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden relative">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-800 to-blue-400"></div>
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            user.role === 'counselor' 
                              ? 'bg-gradient-to-r from-purple-100 to-purple-200 border-2 border-purple-300' 
                              : 'bg-gradient-to-r from-green-100 to-green-200 border-2 border-green-300'
                          }`}>
                            {user.role === 'counselor' ? (
                              <User className="w-6 h-6 text-purple-600" />
                            ) : (
                              <GraduationCap className="w-6 h-6 text-green-600" />
                            )}
                          </div>
                          <div>
                            <CardTitle className="text-lg font-bold text-gray-900">
                              {user.first_name} {user.last_name}
                            </CardTitle>
                            <Badge variant={user.role === 'counselor' ? 'secondary' : 'default'} className="text-xs">
                              {user.role === 'counselor' ? 'Counselor' : 'Student'}
                            </Badge>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="rounded-xl">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="w-4 h-4 mr-2" />
                          {user.email}
                        </div>
                        <div className="text-xs text-gray-500">
                          Submitted: {formatDate(user.created_at)}
                        </div>
                      </div>
                      
                      <div className="flex space-x-3 pt-4">
                        <Button
                          onClick={() => handleApprove(user.id)}
                          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleReject(user.id)}
                          variant="ghost"
                          className="flex-1 border-2 border-red-200 text-red-600 hover:bg-red-50 rounded-xl"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredUsers.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center py-12"
              >
                <Card className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden relative">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-800 to-blue-400"></div>
                  <CardContent className="p-12">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Pending Approvals</h3>
                    <p className="text-gray-600">All registration requests have been processed.</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}