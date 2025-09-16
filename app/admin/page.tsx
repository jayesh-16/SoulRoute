"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, MessageSquare, Calendar, BookOpen, Users, ArrowLeft, Shield, UserCheck, User,
  TrendingUp, TrendingDown, Clock, Download, FileText, BarChart3, PieChart,
  Eye, Flag, CheckCircle, Brain, Video, Headphones, MessageCircle, Filter,
  Bell, Globe, Settings, LogOut, Shield as ShieldIcon
} from "lucide-react";
import { HeartIcon } from "@radix-ui/react-icons";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, PieChart as RechartsPieChart, Cell, Pie } from "recharts";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin-sidebar";


export default function AdminPage() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('English');
  const [showProfile, setShowProfile] = useState(false);

  // Sample notifications data
  const notifications = [
    { id: 1, type: "system", title: "System maintenance scheduled for tonight", time: "5 min ago", unread: true },
    { id: 2, type: "report", title: "Weekly analytics report is ready", time: "1 hour ago", unread: true },
    { id: 3, type: "alert", title: "High-risk student alert flagged", time: "2 hours ago", unread: false },
    { id: 4, type: "user", title: "New counselor registration pending", time: "1 day ago", unread: false }
  ];

  // Supported languages
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩' }
  ];
  // KPI Data
  const kpis = [
    { title: "Total Users", value: "2,847", change: "+12.3%", trend: "up", icon: Users, color: "text-blue-600", bgColor: "bg-blue-100" },
    { title: "Active Users", value: "1,892", change: "+8.7%", trend: "up", icon: UserCheck, color: "text-green-600", bgColor: "bg-green-100" },
    { title: "Screenings Completed", value: "4,231", change: "+15.2%", trend: "up", icon: Brain, color: "text-purple-600", bgColor: "bg-purple-100" },
    { title: "Appointments Booked", value: "863", change: "-2.1%", trend: "down", icon: Calendar, color: "text-orange-600", bgColor: "bg-orange-100" }
  ];

  // Risk Distribution Data
  const phqData = [
    { name: "None", value: 45, color: "#10b981" },
    { name: "Mild", value: 30, color: "#f59e0b" },
    { name: "Moderate", value: 18, color: "#f97316" },
    { name: "Severe", value: 7, color: "#ef4444" }
  ];

  const gadData = [
    { name: "None", value: 52, color: "#10b981" },
    { name: "Mild", value: 28, color: "#f59e0b" },
    { name: "Moderate", value: 15, color: "#f97316" },
    { name: "Severe", value: 5, color: "#ef4444" }
  ];

  // Trend Data
  const trendData = [
    { month: "Jan", stress: 65, screenings: 320 },
    { month: "Feb", stress: 59, screenings: 285 },
    { month: "Mar", stress: 80, screenings: 450 },
    { month: "Apr", stress: 81, screenings: 467 },
    { month: "May", stress: 56, screenings: 310 },
    { month: "Jun", stress: 45, screenings: 200 },
    { month: "Jul", stress: 42, screenings: 180 },
    { month: "Aug", stress: 68, screenings: 380 },
    { month: "Sep", stress: 72, screenings: 410 },
    { month: "Oct", stress: 69, screenings: 395 },
    { month: "Nov", stress: 85, screenings: 520 },
    { month: "Dec", stress: 88, screenings: 550 }
  ];

  return (
    <div className="min-h-screen bg-white">
      <AdminSidebar />
      
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
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Admin Dashboard
                  </h1>
                </div>
                <Badge className="bg-yellow-100 text-yellow-700 border-0 text-xs px-2 py-1 rounded-full">
                  2
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
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" />
                    </div>
                    <div>
                      <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Admin Dashboard
                      </h1>
                      <p className="text-xs sm:text-sm text-gray-500">Analytics & Management Console • Real-time Insights</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  {/* Language Toggle */}
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setCurrentLanguage(currentLanguage === 'English' ? 'हिंदी' : 'English')}
                      className="rounded-xl hover:bg-blue-50"
                    >
                      <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                    </Button>
                  </div>
                  
                  {/* Notifications */}
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="rounded-xl hover:bg-blue-50 relative"
                    >
                      <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                      {notifications.filter(n => n.unread).length > 0 && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full" />
                      )}
                    </Button>
                    
                    {/* Notifications Panel */}
                    <AnimatePresence>
                      {showNotifications && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 top-12 w-72 sm:w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50"
                        >
                          <div className="p-4 border-b border-gray-100">
                            <h3 className="font-semibold text-gray-900">Admin Notifications</h3>
                          </div>
                          <div className="max-h-64 overflow-y-auto">
                            {notifications.map((notification) => (
                              <div key={notification.id} className={`p-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${
                                notification.unread ? 'bg-blue-50' : ''
                              }`}>
                                <div className="flex items-start space-x-3">
                                  <div className={`w-2 h-2 rounded-full mt-2 ${
                                    notification.unread ? 'bg-red-500' : 'bg-gray-300'
                                  }`} />
                                  <div className="flex-1">
                                    <p className="text-sm text-gray-900">{notification.title}</p>
                                    <p className="text-xs text-gray-500">{notification.time}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="p-3 border-t border-gray-100">
                            <Button className="w-full text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full">
                              View All Notifications
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {/* Profile Settings */}
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowProfile(!showProfile)}
                      className="rounded-xl hover:bg-blue-50"
                    >
                      <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                    </Button>
                    
                    {/* Profile Panel */}
                    <AnimatePresence>
                      {showProfile && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 top-12 w-56 sm:w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50"
                        >
                          <div className="p-4 border-b border-gray-100">
                            <h3 className="font-semibold text-gray-900">Admin Profile</h3>
                          </div>
                          <div className="p-3 space-y-2">
                            <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                              <span className="text-sm text-gray-700">System Settings</span>
                              <Settings className="w-4 h-4 text-gray-400" />
                            </div>
                            <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                              <span className="text-sm text-gray-700">Privacy Controls</span>
                              <ShieldIcon className="w-4 h-4 text-gray-400" />
                            </div>
                            <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                              <span className="text-sm text-gray-700">Data Management</span>
                              <Eye className="w-4 h-4 text-gray-400" />
                            </div>
                            <div className="border-t border-gray-100 pt-2 mt-2">
                              <div className="flex items-center justify-between p-2 hover:bg-red-50 rounded-lg cursor-pointer text-red-600">
                                <span className="text-sm">Logout</span>
                                <LogOut className="w-4 h-4" />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <Button variant="ghost" className="hidden sm:flex rounded-full border border-blue-200 hover:bg-blue-50">
                    <Filter className="w-4 h-4 mr-2" />
                    <span className="hidden lg:inline">Filter</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <motion.div className="bg-white p-3 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl lg:rounded-3xl">
            {/* KPI Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
              {kpis.map((kpi, index) => {
                const Icon = kpi.icon;
                return (
                  <Card key={index} className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden relative">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-800 to-blue-400"></div>
                    <CardContent className="p-3 sm:p-4 lg:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs sm:text-sm text-gray-600 mb-1">{kpi.title}</p>
                          <p className="text-xl sm:text-2xl font-bold text-gray-900">{kpi.value}</p>
                          <div className="flex items-center mt-2">
                            {kpi.trend === "up" ? (
                              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                            )}
                            <span className={`text-sm font-medium ${kpi.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                              {kpi.change}
                            </span>
                          </div>
                        </div>
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${kpi.bgColor}`}>
                          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${kpi.color}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Risk Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
              <Card className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-800 to-blue-400"></div>
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900">
                    <PieChart className="w-5 h-5 mr-2 text-blue-600" />
                    PHQ-9 Risk Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie dataKey="value" data={phqData} cx="50%" cy="50%" outerRadius={60}>
                          {phqData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {phqData.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-gray-600">{item.name}: {item.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-800 to-blue-400"></div>
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900">
                    <PieChart className="w-5 h-5 mr-2 text-blue-600" />
                    GAD-7 Risk Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie dataKey="value" data={gadData} cx="50%" cy="50%" outerRadius={60}>
                          {gadData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {gadData.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-gray-600">{item.name}: {item.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Trend Analysis */}
            <Card className="bg-white border border-gray-200 shadow-lg rounded-xl mb-4 sm:mb-6 lg:mb-8 overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-800 to-blue-400"></div>
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900">
                  <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                  Stress Levels & Screening Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorScreenings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
                      <YAxis hide />
                      <Area type="monotone" dataKey="stress" stroke="#ef4444" fillOpacity={1} fill="url(#colorStress)" strokeWidth={3} />
                      <Area type="monotone" dataKey="screenings" stroke="#1e3a8a" fillOpacity={1} fill="url(#colorScreenings)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <span className="text-sm text-gray-600">Stress Levels</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-900 rounded-full" />
                      <span className="text-sm text-gray-600">Screenings Completed</span>
                    </div>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800 border-0">Peak during exam periods</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Additional Analytics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
              {/* Counselor Utilization */}
              <Card className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-800 to-blue-400"></div>
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900">
                    <Clock className="w-5 h-5 mr-2 text-blue-600" />
                    Counselor Utilization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-600">87%</p>
                      <p className="text-sm text-gray-600">Average Utilization</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">1.8 days</p>
                      <p className="text-sm text-gray-600">Average Wait Time</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Forum Analytics */}
              <Card className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-800 to-blue-400"></div>
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900">
                    <MessageCircle className="w-5 h-5 mr-2 text-blue-600" />
                    Forum Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">246</p>
                      <p className="text-sm text-gray-600">Active Threads</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-yellow-600">12</p>
                      <p className="text-sm text-gray-600">Flagged Posts</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">89%</p>
                      <p className="text-sm text-gray-600">Resolution Rate</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">1,842</p>
                      <p className="text-sm text-gray-600">Weekly Posts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Resource Usage */}
              <Card className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-800 to-blue-400"></div>
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900">
                    <Eye className="w-5 h-5 mr-2 text-blue-600" />
                    Top Resources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Video className="w-4 h-4 text-red-600" />
                        <span className="text-sm">Anxiety Management</span>
                      </div>
                      <span className="text-sm font-medium">1,847</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Headphones className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Breathing Exercise</span>
                      </div>
                      <span className="text-sm font-medium">1,623</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-sm">Stress Guide</span>
                      </div>
                      <span className="text-sm font-medium">1,205</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}