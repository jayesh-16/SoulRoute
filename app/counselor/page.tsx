"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, MessageSquare, Calendar, BookOpen, Users, ArrowLeft, UserCheck, User,
  AlertTriangle, Clock, Shield, FileText, Flag, Settings, Search, Filter,
  Eye, EyeOff, Save, Plus, MoreHorizontal, CheckCircle, X, Edit, Trash2,
  Phone, Mail, MapPin, Brain, Heart, TrendingUp, TrendingDown,
  Bell, Globe, LogOut, Shield as ShieldIcon
} from "lucide-react";
import { HeartIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { CounselorSidebar } from "@/components/counselor-sidebar";


export default function CounselorPage() {
  const [activeTab, setActiveTab] = useState<'appointments' | 'alerts' | 'screenings' | 'notes' | 'moderation' | 'availability'>('appointments');
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('English');
  const [showProfile, setShowProfile] = useState(false);

  // Sample notifications data
  const notifications = [
    { id: 1, type: "message", title: "New message from Rahul S.", time: "5 min ago", unread: true },
    { id: 2, type: "appointment", title: "Appointment scheduled: Tomorrow 2:00 PM", time: "1 hour ago", unread: true },
    { id: 3, type: "alert", title: "Priority alert requires attention", time: "2 hours ago", unread: false },
    { id: 4, type: "system", title: "Weekly report is ready for review", time: "1 day ago", unread: false }
  ];

  // Supported languages
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩' }
  ];

  // Sample data
  const appointments = [
    {
      id: 1,
      student: "Rahul S.",
      time: "10:00 AM - 11:00 AM",
      date: "Today",
      type: "Individual Session",
      status: "confirmed",
      priority: "normal",
      notes: "Follow-up on anxiety management"
    },
    {
      id: 2,
      student: "Priya M.",
      time: "2:00 PM - 3:00 PM", 
      date: "Tomorrow",
      type: "Crisis Intervention",
      status: "pending",
      priority: "high",
      notes: "Initial assessment required"
    }
  ];

  const priorityAlerts = [
    {
      id: 1,
      student: "Anonymous ID: ST2024001",
      riskLevel: "High",
      type: "Self-harm indicators",
      lastActivity: "2 hours ago",
      phq9Score: 18,
      gad7Score: 15,
      flaggedContent: "Recent forum post expressing hopelessness"
    },
    {
      id: 2,
      student: "Anonymous ID: ST2024002", 
      riskLevel: "Medium",
      type: "Crisis pattern",
      lastActivity: "6 hours ago",
      phq9Score: 14,
      gad7Score: 12,
      flaggedContent: "Multiple missed appointments"
    }
  ];

  const screeningData = [
    {
      id: 1,
      student: "Student A",
      phq9: { score: 12, severity: "Moderate", date: "2024-01-15" },
      gad7: { score: 10, severity: "Moderate", date: "2024-01-15" },
      trend: "improving"
    },
    {
      id: 2,
      student: "Student B",
      phq9: { score: 8, severity: "Mild", date: "2024-01-14" },
      gad7: { score: 6, severity: "Mild", date: "2024-01-14" },
      trend: "stable"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <CounselorSidebar />
      
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
                    <UserCheck className="w-5 h-5 text-blue-600" />
                  </div>
                  <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Counselor Dashboard
                  </h1>
                </div>
                <Badge className="bg-yellow-100 text-yellow-700 border-0 text-xs px-2 py-1 rounded-full">
                  1
                </Badge>
              </div>

              {/* Desktop Header */}
              <div className="hidden sm:flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <Link href="/dashboard">
                    <Button variant="ghost" size="icon" className="rounded-xl hover:bg-blue-50">
                      <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                    </Button>
                  </Link>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center border-2 border-blue-300 shadow-md">
                      <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" />
                    </div>
                    <div>
                      <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Counselor Dashboard
                      </h1>
                      <p className="text-xs sm:text-sm text-gray-500">Professional Support Management • Student Wellness</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Badge className="bg-green-100 text-green-700 border-0 text-xs sm:text-sm">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full mr-1 sm:mr-2" />
                    Available
                  </Badge>
                  
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
                            <h3 className="font-semibold text-gray-900">Notifications</h3>
                          </div>
                          <div className="max-h-64 overflow-y-auto">
                            {notifications.map((notification) => (
                              <div key={notification.id} className={`p-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${
                                notification.unread ? 'bg-blue-50' : ''
                              }`}>
                                <div className="flex items-start space-x-3">
                                  <div className={`w-2 h-2 rounded-full mt-2 ${
                                    notification.unread ? 'bg-blue-500' : 'bg-gray-300'
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
                            <h3 className="font-semibold text-gray-900">Profile & Privacy</h3>
                          </div>
                          <div className="p-3 space-y-2">
                            <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                              <span className="text-sm text-gray-700">Data Visibility</span>
                              <Eye className="w-4 h-4 text-gray-400" />
                            </div>
                            <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                              <span className="text-sm text-gray-700">Privacy Controls</span>
                              <ShieldIcon className="w-4 h-4 text-gray-400" />
                            </div>
                            <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                              <span className="text-sm text-gray-700">Consent Settings</span>
                              <Settings className="w-4 h-4 text-gray-400" />
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
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tab Navigation */}
          <motion.div 
            className="mb-4 sm:mb-6 lg:mb-8"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex space-x-1 bg-gray-100 rounded-xl p-1 overflow-x-auto scrollbar-hide">
              {[
                { key: 'appointments', label: 'My Appointments', icon: Calendar },
                { key: 'alerts', label: 'Priority Alerts', icon: AlertTriangle },
                { key: 'screenings', label: 'Screening Data', icon: Brain },
                { key: 'notes', label: 'Session Notes', icon: FileText },
                { key: 'moderation', label: 'Forum Moderation', icon: Flag },
                { key: 'availability', label: 'Availability', icon: Settings }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <motion.button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`flex items-center space-x-1 sm:space-x-2 py-2 sm:py-3 px-2 sm:px-4 rounded-lg font-medium transition-all duration-300 whitespace-nowrap ${
                      activeTab === tab.key
                        ? 'bg-white text-blue-600 shadow-md'
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm hidden sm:inline">{tab.label}</span>
                    <span className="text-xs sm:hidden">{tab.key === 'appointments' ? 'Appts' : tab.key === 'alerts' ? 'Alerts' : tab.key === 'screenings' ? 'Screen' : tab.key === 'notes' ? 'Notes' : tab.key === 'moderation' ? 'Mod' : 'Avail'}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Content Area */}
          <motion.div 
            className="bg-white p-3 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <AnimatePresence mode="wait">
              {/* My Appointments Tab */}
              {activeTab === 'appointments' && (
                <motion.div
                  key="appointments"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">My Appointments</h2>
                    <div className="flex items-center space-x-3">
                      <Button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm">
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Add Appointment</span>
                        <span className="sm:hidden">Add</span>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-lg rounded-xl">
                      <CardContent className="p-4 sm:p-6 text-center">
                        <h3 className="text-sm sm:text-lg font-semibold text-blue-900 mb-1 sm:mb-2">Today's Sessions</h3>
                        <p className="text-2xl sm:text-3xl font-bold text-blue-600">4</p>
                        <p className="text-xs sm:text-sm text-blue-700">2 confirmed, 2 pending</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 shadow-lg rounded-xl">
                      <CardContent className="p-4 sm:p-6 text-center">
                        <h3 className="text-sm sm:text-lg font-semibold text-green-900 mb-1 sm:mb-2">This Week</h3>
                        <p className="text-2xl sm:text-3xl font-bold text-green-600">18</p>
                        <p className="text-xs sm:text-sm text-green-700">15 confirmed, 3 pending</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 shadow-lg rounded-xl sm:col-span-2 lg:col-span-1">
                      <CardContent className="p-4 sm:p-6 text-center">
                        <h3 className="text-sm sm:text-lg font-semibold text-purple-900 mb-1 sm:mb-2">Completed</h3>
                        <p className="text-2xl sm:text-3xl font-bold text-purple-600">127</p>
                        <p className="text-xs sm:text-sm text-purple-700">This semester</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-4">
                    {appointments.map((appointment, index) => (
                      <Card key={appointment.id} className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden relative">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-800 to-blue-400"></div>
                        <CardContent className="p-3 sm:p-4 lg:p-6">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
                            <div className="flex items-center space-x-3 sm:space-x-4">
                              <Avatar className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-blue-300">
                                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center">
                                  <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                                </div>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{appointment.student}</h3>
                                <p className="text-xs sm:text-sm text-gray-600">{appointment.type}</p>
                                <p className="text-xs sm:text-sm text-blue-600">{appointment.date} • {appointment.time}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto justify-end">
                              <Badge className={`${
                                appointment.status === 'confirmed' 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-yellow-100 text-yellow-700'
                              } border-0 text-xs`}>
                                {appointment.status}
                              </Badge>
                              {appointment.priority === 'high' && (
                                <Badge className="bg-red-100 text-red-700 border-0 text-xs hidden sm:flex">
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  High Priority
                                </Badge>
                              )}
                              <Button variant="ghost" size="icon" className="rounded-xl">
                                <MoreHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                            </div>
                          </div>
                          {appointment.notes && (
                            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-700">{appointment.notes}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Priority Alerts Tab */}
              {activeTab === 'alerts' && (
                <motion.div
                  key="alerts"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
                    <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-red-600" />
                    Priority Alerts
                  </h2>
                  
                  <div className="space-y-4">
                    {priorityAlerts.map((alert, index) => (
                      <Card key={alert.id} className="bg-white border-l-4 border-l-red-500 shadow-lg rounded-xl">
                        <CardContent className="p-3 sm:p-4 lg:p-6">
                          <div className="flex flex-col lg:flex-row items-start justify-between space-y-3 lg:space-y-0">
                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-3">
                                <Badge className={`${
                                  alert.riskLevel === 'High' 
                                    ? 'bg-red-100 text-red-700' 
                                    : 'bg-orange-100 text-orange-700'
                                } border-0 text-xs w-fit`}>
                                  {alert.riskLevel} Risk
                                </Badge>
                                <span className="text-xs sm:text-sm text-gray-500">{alert.lastActivity}</span>
                              </div>
                              
                              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{alert.student}</h3>
                              <p className="text-xs sm:text-sm text-gray-600 mb-3">{alert.type}</p>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-3">
                                <div className="flex items-center space-x-2">
                                  <Brain className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                                  <span className="text-xs sm:text-sm">PHQ-9: {alert.phq9Score}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                                  <span className="text-xs sm:text-sm">GAD-7: {alert.gad7Score}</span>
                                </div>
                              </div>
                              
                              <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs sm:text-sm text-gray-700">{alert.flaggedContent}</p>
                              </div>
                            </div>
                            
                            <div className="flex flex-row lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2 w-full lg:w-auto">
                              <Button className="bg-red-500 hover:bg-red-600 text-white rounded-full text-xs sm:text-sm flex-1 lg:flex-none">
                                <span className="hidden sm:inline">Immediate Action</span>
                                <span className="sm:hidden">Action</span>
                              </Button>
                              <Button variant="ghost" className="rounded-full border border-gray-200 text-xs sm:text-sm flex-1 lg:flex-none">
                                <span className="hidden sm:inline">Schedule Session</span>
                                <span className="sm:hidden">Schedule</span>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Student Screening Data Tab */}
              {activeTab === 'screenings' && (
                <motion.div
                  key="screenings"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Brain className="w-6 h-6 mr-2 text-purple-600" />
                    Student Screening Data
                  </h2>
                  
                  <div className="space-y-4">
                    {screeningData.map((data, index) => (
                      <Card key={data.id} className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden relative">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-800 to-blue-400"></div>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-900">{data.student}</h3>
                            <div className="flex items-center space-x-2">
                              {data.trend === 'improving' ? (
                                <TrendingDown className="w-4 h-4 text-green-500" />
                              ) : (
                                <TrendingUp className="w-4 h-4 text-blue-500" />
                              )}
                              <span className="text-sm text-gray-600 capitalize">{data.trend}</span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                              <h4 className="font-medium text-purple-900 mb-2">PHQ-9 Assessment</h4>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-2xl font-bold text-purple-600">{data.phq9.score}</span>
                                <Badge className="bg-purple-100 text-purple-700 border-0">{data.phq9.severity}</Badge>
                              </div>
                              <p className="text-sm text-purple-700">Assessed on {data.phq9.date}</p>
                            </div>
                            
                            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                              <h4 className="font-medium text-red-900 mb-2">GAD-7 Assessment</h4>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-2xl font-bold text-red-600">{data.gad7.score}</span>
                                <Badge className="bg-red-100 text-red-700 border-0">{data.gad7.severity}</Badge>
                              </div>
                              <p className="text-sm text-red-700">Assessed on {data.gad7.date}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Session Notes Tab */}
              {activeTab === 'notes' && (
                <motion.div
                  key="notes"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                      <FileText className="w-6 h-6 mr-2 text-blue-600" />
                      Session Notes
                    </h2>
                    <Button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full">
                      <Plus className="w-4 h-4 mr-2" />
                      New Note
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden relative">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-800 to-blue-400"></div>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-gray-900">Student Session #2024001</h3>
                          <Badge className="bg-blue-100 text-blue-700 border-0">Confidential</Badge>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>January 15, 2024 • 10:00 AM</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>50 minutes</span>
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">Progress on anxiety management techniques. Student showed improvement in identifying triggers.</p>
                        </div>
                        <div className="flex items-center space-x-2 mt-4">
                          <Button variant="ghost" size="sm" className="rounded-full">
                            <Eye className="w-4 h-4 mr-1" />
                            View Full
                          </Button>
                          <Button variant="ghost" size="sm" className="rounded-full">
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden relative">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-800 to-blue-400"></div>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-gray-900">Student Session #2024002</h3>
                          <Badge className="bg-green-100 text-green-700 border-0">Completed</Badge>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>January 12, 2024 • 2:00 PM</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>45 minutes</span>
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">Initial assessment completed. Recommended follow-up sessions for stress management.</p>
                        </div>
                        <div className="flex items-center space-x-2 mt-4">
                          <Button variant="ghost" size="sm" className="rounded-full">
                            <Eye className="w-4 h-4 mr-1" />
                            View Full
                          </Button>
                          <Button variant="ghost" size="sm" className="rounded-full">
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )}

              {/* Forum Moderation Tab */}
              {activeTab === 'moderation' && (
                <motion.div
                  key="moderation"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                      <Flag className="w-6 h-6 mr-2 text-orange-600" />
                      Forum Moderation
                    </h2>
                    <div className="flex items-center space-x-3">
                      <Badge className="bg-yellow-100 text-yellow-700 border-0">
                        3 Pending Reviews
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Card className="bg-white border border-gray-200 shadow-lg rounded-xl border-l-4 border-l-orange-500">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <Badge className="bg-orange-100 text-orange-700 border-0">
                                Flagged Content
                              </Badge>
                              <span className="text-sm text-gray-500">2 hours ago</span>
                            </div>
                            
                            <h3 className="font-semibold text-gray-900 mb-2">Post in "Academic Stress" Category</h3>
                            <p className="text-sm text-gray-600 mb-3">Anonymous User • Peer Support Forum</p>
                            
                            <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-l-gray-300">
                              <p className="text-sm text-gray-700">"I can't handle this anymore. Everything feels pointless and I don't see a way out..."</p>
                            </div>
                            
                            <div className="mt-4">
                              <p className="text-sm text-red-600 font-medium">Flagged for: Potential self-harm indicators</p>
                              <p className="text-xs text-gray-500 mt-1">Flagged by: Community Guidelines AI + 2 user reports</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-col space-y-2 ml-4">
                            <Button className="bg-green-500 hover:bg-green-600 text-white rounded-full text-sm">
                              Approve & Refer
                            </Button>
                            <Button className="bg-red-500 hover:bg-red-600 text-white rounded-full text-sm">
                              Remove Post
                            </Button>
                            <Button variant="ghost" className="rounded-full border border-gray-200 text-sm">
                              Contact User
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-white border border-gray-200 shadow-lg rounded-xl border-l-4 border-l-yellow-500">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <Badge className="bg-yellow-100 text-yellow-700 border-0">
                                Review Needed
                              </Badge>
                              <span className="text-sm text-gray-500">4 hours ago</span>
                            </div>
                            
                            <h3 className="font-semibold text-gray-900 mb-2">Response in "Relationship Issues"</h3>
                            <p className="text-sm text-gray-600 mb-3">Peer Volunteer • Support Response</p>
                            
                            <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-l-gray-300">
                              <p className="text-sm text-gray-700">"Have you considered trying medication? I know someone who had similar issues and..."</p>
                            </div>
                            
                            <div className="mt-4">
                              <p className="text-sm text-yellow-600 font-medium">Flagged for: Medical advice from non-professional</p>
                              <p className="text-xs text-gray-500 mt-1">Flagged by: Community Guidelines AI</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-col space-y-2 ml-4">
                            <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full text-sm">
                              Edit & Approve
                            </Button>
                            <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full text-sm">
                              Remove & Guide
                            </Button>
                            <Button variant="ghost" className="rounded-full border border-gray-200 text-sm">
                              Contact Author
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )}

              {/* Availability Settings Tab */}
              {activeTab === 'availability' && (
                <motion.div
                  key="availability"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                      <Settings className="w-6 h-6 mr-2 text-blue-600" />
                      Availability Settings
                    </h2>
                    <Button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Weekly Schedule */}
                    <Card className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden relative">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-800 to-blue-400"></div>
                      <CardHeader>
                        <CardTitle className="flex items-center text-gray-900">
                          <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                          Weekly Schedule
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                            <div key={day} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <span className="font-medium text-gray-900">{day}</span>
                              <div className="flex items-center space-x-2">
                                <Input
                                  type="time"
                                  defaultValue="09:00"
                                  className="w-24 text-sm"
                                />
                                <span className="text-gray-500">to</span>
                                <Input
                                  type="time"
                                  defaultValue="17:00"
                                  className="w-24 text-sm"
                                />
                                <Button variant="ghost" size="sm" className="rounded-full">
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Session Preferences */}
                    <Card className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden relative">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-800 to-blue-400"></div>
                      <CardHeader>
                        <CardTitle className="flex items-center text-gray-900">
                          <Clock className="w-5 h-5 mr-2 text-blue-600" />
                          Session Preferences
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Session Duration
                            </label>
                            <select className="w-full p-2 border border-gray-300 rounded-lg">
                              <option value="30">30 minutes</option>
                              <option value="45">45 minutes</option>
                              <option value="60" selected>60 minutes</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Buffer Time Between Sessions
                            </label>
                            <select className="w-full p-2 border border-gray-300 rounded-lg">
                              <option value="10">10 minutes</option>
                              <option value="15" selected>15 minutes</option>
                              <option value="30">30 minutes</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Maximum Daily Sessions
                            </label>
                            <Input
                              type="number"
                              defaultValue="8"
                              min="1"
                              max="12"
                              className="w-full"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Advance Booking Window
                            </label>
                            <select className="w-full p-2 border border-gray-300 rounded-lg">
                              <option value="1">1 day</option>
                              <option value="3">3 days</option>
                              <option value="7" selected>1 week</option>
                              <option value="14">2 weeks</option>
                            </select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Current Availability Status */}
                  <Card className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 shadow-lg rounded-xl mt-6">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                        <CheckCircle className="w-6 h-6 mr-2" />
                        Current Status
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">Available</p>
                          <p className="text-sm text-green-700">Status</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">18</p>
                          <p className="text-sm text-green-700">Open Slots This Week</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">Next: 2:00 PM</p>
                          <p className="text-sm text-green-700">Available Slot</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}