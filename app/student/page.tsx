"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, MessageSquare, Calendar, BookOpen, Users, ArrowLeft, User,
  MessageCircle, UserCheck, Shield, Bot, Star, TrendingUp, TrendingDown,
  Play, Headphones, Video, Heart, Brain, Clock, ChevronRight, Smile,
  Frown, Meh, Zap, Target, Activity, Phone, Plus, Eye, ArrowRight,
  Bell, Globe, Settings, LogOut, Shield as ShieldIcon, EyeOff, Languages,
  CheckCircle
} from "lucide-react";
import { HeartIcon } from "@radix-ui/react-icons";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import Link from "next/link";
import { StudentSidebar } from "@/components/student-sidebar";


export default function StudentPage() {
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [showMoodPopup, setShowMoodPopup] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('English');
  const [showProfile, setShowProfile] = useState(false);
  
  // Sample data for wellness tracking
  const wellnessData = [
    { week: "Week 1", phq9: 12, gad7: 10 },
    { week: "Week 2", phq9: 10, gad7: 8 },
    { week: "Week 3", phq9: 8, gad7: 7 },
    { week: "Week 4", phq9: 6, gad7: 5 }
  ];

  const moods = [
    { icon: Smile, label: "Great", color: "text-green-500", bgColor: "bg-green-100", value: "great" },
    { icon: Meh, label: "Okay", color: "text-yellow-500", bgColor: "bg-yellow-100", value: "okay" },
    { icon: Frown, label: "Struggling", color: "text-red-500", bgColor: "bg-red-100", value: "struggling" }
  ];

  const quickActions = [
    { icon: MessageCircle, label: "Start Chat", href: "/chat", color: "bg-blue-500", description: "Talk to AI assistant" },
    { icon: Calendar, label: "Create Ticket", href: "/tickets", color: "bg-purple-500", description: "Request counseling session" },
    { icon: BookOpen, label: "Check Resources", href: "/resources", color: "bg-green-500", description: "Wellness guides" },
    { icon: Users, label: "Peer Support", href: "/peer-support", color: "bg-orange-500", description: "Join community" }
  ];

  const recentThreads = [
    { title: "Managing exam stress", replies: 12, time: "2h ago", category: "Academic" },
    { title: "Sleep improvement tips", replies: 8, time: "4h ago", category: "Wellness" },
    { title: "Social anxiety support", replies: 15, time: "6h ago", category: "Mental Health" }
  ];

  const wellnessResources = [
    { type: "video", title: "5-Minute Breathing Exercise", duration: "5:30", views: "1.2K", icon: Video },
    { type: "audio", title: "Sleep Meditation", duration: "15:00", plays: "2.1K", icon: Headphones },
    { type: "guide", title: "Stress Management Toolkit", pages: 12, downloads: "856", icon: BookOpen }
  ];

  const notifications = [
    { id: 1, type: "message", title: "New message from Dr. Sarah", time: "5 min ago", unread: true },
    { id: 2, type: "appointment", title: "Appointment reminder: Tomorrow 2:00 PM", time: "1 hour ago", unread: true },
    { id: 3, type: "forum", title: "Someone replied to your post", time: "2 hours ago", unread: false },
    { id: 4, type: "system", title: "Weekly wellness check-in available", time: "1 day ago", unread: false }
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <StudentSidebar />
      
      <div className="md:ml-20 md:pb-0 pb-20 flex min-h-screen">
        <motion.div 
          className="flex-1 p-3 sm:p-6 lg:p-8"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <Card className="bg-white border border-gray-200 shadow-lg rounded-xl mb-6 overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-800 to-blue-400"></div>
            <CardContent className="p-3 sm:p-4 lg:p-6">
              {/* Mobile Header */}
              <div className="block sm:hidden">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center border-2 border-blue-300 shadow-md">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-center">
                    <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Wellness Hub
                    </h1>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-0 px-2 py-1 text-xs">
                    Active
                  </Badge>
                </div>
              </div>
              
              {/* Desktop Header */}
              <div className="hidden sm:flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Link href="/dashboard">
                    <Button variant="ghost" size="icon" className="rounded-xl hover:bg-blue-50">
                      <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </Button>
                  </Link>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center border-2 border-blue-300 shadow-md">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        My Wellness Hub
                      </h1>
                      <p className="text-sm text-gray-500">Your personal self-care & wellness center</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className="bg-green-100 text-green-700 border-0">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                    Wellness Active
                  </Badge>
                  
                  {/* Language Toggle */}
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setCurrentLanguage(currentLanguage === 'English' ? 'हिंदी' : 'English')}
                      className="rounded-xl hover:bg-blue-50"
                    >
                      <Globe className="w-5 h-5 text-gray-600" />
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
                      <Bell className="w-5 h-5 text-gray-600" />
                      {notifications.filter(n => n.unread).length > 0 && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                      )}
                    </Button>
                    
                    {/* Notifications Panel */}
                    <AnimatePresence>
                      {showNotifications && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50"
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
                      <Settings className="w-5 h-5 text-gray-600" />
                    </Button>
                    
                    {/* Profile Panel */}
                    <AnimatePresence>
                      {showProfile && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 top-12 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50"
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

          <motion.div className="bg-white p-3 sm:p-6 lg:p-8 rounded-3xl">
            {/* Quick Actions */}
            <motion.div 
              className="mb-8"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-600" />
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                    >
                      <Link href={action.href}>
                        <Card className="bg-white border border-gray-200 shadow-lg rounded-xl hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden relative">
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-800 to-blue-400"></div>
                          <CardContent className="p-3 sm:p-4 lg:p-6 text-center">
                            <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center mx-auto mb-3`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">{action.label}</h3>
                            <p className="text-xs sm:text-sm text-gray-600">{action.description}</p>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {/* My Wellness */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="lg:col-span-2"
              >
                <Card className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden relative">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-800 to-blue-400"></div>
                  <CardHeader>
                    <CardTitle className="flex items-center text-gray-900">
                      <Brain className="w-6 h-6 mr-2 text-purple-600" />
                      My Wellness Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <h4 className="font-medium text-purple-900 mb-2">Latest PHQ-9 Score</h4>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl font-bold text-purple-600">6</span>
                          <Badge className="bg-green-100 text-green-700 border-0">
                            <TrendingDown className="w-3 h-3 mr-1" />
                            Improving
                          </Badge>
                        </div>
                        <p className="text-sm text-purple-700">Mild range • Down from 12</p>
                      </div>
                      
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-medium text-blue-900 mb-2">Latest GAD-7 Score</h4>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl font-bold text-blue-600">5</span>
                          <Badge className="bg-green-100 text-green-700 border-0">
                            <TrendingDown className="w-3 h-3 mr-1" />
                            Improving
                          </Badge>
                        </div>
                        <p className="text-sm text-blue-700">Mild range • Down from 10</p>
                      </div>
                    </div>
                    
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={wellnessData}>
                          <defs>
                            <linearGradient id="colorPHQ9" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                            </linearGradient>
                            <linearGradient id="colorGAD7" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
                          <YAxis hide />
                          <Area type="monotone" dataKey="phq9" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorPHQ9)" strokeWidth={3} />
                          <Area type="monotone" dataKey="gad7" stroke="#3b82f6" fillOpacity={1} fill="url(#colorGAD7)" strokeWidth={3} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 gap-3 sm:gap-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-purple-500 rounded-full" />
                          <span className="text-xs sm:text-sm text-gray-600">PHQ-9 (Depression)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full" />
                          <span className="text-xs sm:text-sm text-gray-600">GAD-7 (Anxiety)</span>
                        </div>
                      </div>
                      <Link href="/wellbeing/checkin" className="w-full sm:w-auto">
                        <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-full text-xs sm:text-sm lg:text-base px-4 py-2 sm:px-6 sm:py-2 lg:px-8 lg:py-3 w-full sm:w-auto transition-all duration-200 shadow-md hover:shadow-lg">
                          Take Assessment
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Daily Mood Tracker */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden relative">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-800 to-blue-400"></div>
                  <CardHeader>
                    <CardTitle className="flex items-center text-gray-900">
                      <Heart className="w-6 h-6 mr-2 text-red-600" />
                      How are you feeling?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {moods.map((mood, index) => {
                        const Icon = mood.icon;
                        const isSelected = selectedMood === mood.value;
                        return (
                          <motion.button
                            key={mood.value}
                            onClick={() => setSelectedMood(mood.value)}
                            className={`w-full p-4 rounded-lg border-2 transition-all duration-300 ${
                              isSelected 
                                ? `${mood.bgColor} border-current ${mood.color}` 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center space-x-3">
                              <Icon className={`w-6 h-6 ${isSelected ? mood.color : 'text-gray-400'}`} />
                              <span className={`font-medium ${isSelected ? mood.color : 'text-gray-600'}`}>
                                {mood.label}
                              </span>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                    
                    <div className="mt-6">
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full"
                        disabled={!selectedMood}
                        onClick={() => setShowMoodPopup(true)}
                      >
                        Log Mood
                      </Button>
                    </div>
                    
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 text-center">
                        <strong>This week:</strong> 4 great days, 2 okay days, 1 struggling day
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Mood Log Popup */}
      {showMoodPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center">
                {selectedMood === 'great' && <Smile className="w-8 h-8 text-green-600" />}
                {selectedMood === 'okay' && <Meh className="w-8 h-8 text-yellow-600" />}
                {selectedMood === 'struggling' && <Frown className="w-8 h-8 text-red-600" />}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {selectedMood === 'great' && 'Feeling Great! 🎉'}
                {selectedMood === 'okay' && 'Having an Okay Day 😊'}
                {selectedMood === 'struggling' && 'We\'re Here for You 💙'}
              </h3>
              
              <p className="text-gray-600 mb-6">
                {selectedMood === 'great' && 'That\'s wonderful! Your mood has been logged. Keep up the positive energy!'}
                {selectedMood === 'okay' && 'Thanks for checking in. Your mood has been logged. Remember, it\'s okay to have neutral days.'}
                {selectedMood === 'struggling' && 'Thank you for being honest about how you\'re feeling. Your mood has been logged. Consider reaching out for support if you need it.'}
              </p>
              
              {selectedMood === 'struggling' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-red-700 mb-2">💡 <strong>Quick Support Options:</strong></p>
                  <ul className="text-sm text-red-600 text-left space-y-1">
                    <li>• Talk to a counselor through our chat system</li>
                    <li>• Try our breathing exercises</li>
                    <li>• Connect with peer support groups</li>
                    <li>• Access crisis resources if needed</li>
                  </ul>
                </div>
              )}
              
              <div className="flex space-x-3">
                <Button
                  onClick={() => setShowMoodPopup(false)}
                  className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full"
                >
                  Close
                </Button>
                {selectedMood === 'struggling' && (
                  <Button
                    onClick={() => {
                      setShowMoodPopup(false);
                      // Add navigation to support resources or chat
                    }}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full"
                  >
                    Get Support
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}