"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search,
  Heart,
  Bell,
  MoreHorizontal,
  ArrowRight,
  TrendingUp,
  Smile,
  Frown,
  Zap,
  Brain,
  Clock,
  ChevronRight,
  Bold,
  Underline,
  Italic,
  Image as ImageIcon,
  DollarSign,
  LinkIcon,
  Play,
  BookOpen,
  Headphones,
  Settings,
  X,
  Bot,
  Send,
  Sparkles,
  Music
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import Link from "next/link";
import { SharedSidebar } from "@/components/shared-sidebar";


// Main Content Header - removed
const DashboardHeader = () => {
  return null;
};

// Welcome Section - HELLO SAKHII!
const WelcomeSection = () => {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Card className="bg-white border border-gray-200 shadow-lg rounded-xl mb-6 hover:shadow-xl transition-all duration-300 overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-800 to-blue-400"></div>
        <CardContent className="p-3 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex-1"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.h1 
                className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent mb-2"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                HELLO SAKHII!
              </motion.h1>
              <motion.p 
                className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                How are you feeling today?
              </motion.p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <Link href="/wellbeing/checkin">
                  <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-300">
                    Record your feelings
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </motion.div>
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
            
            {/* Meditation Illustration */}
            <motion.div 
              className="hidden sm:block w-48 sm:w-56 lg:w-64 h-36 sm:h-40 lg:h-48 bg-white rounded-xl flex items-center justify-center p-3 sm:p-4 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
              initial={{ x: 30, opacity: 0, rotate: -5 }}
              animate={{ x: 0, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              whileHover={{ scale: 1.02, rotate: 1 }}
            >
              <motion.img 
                src="/2.svg" 
                alt="Mental Health Illustration" 
                className="w-full h-full object-contain"
                animate={{ 
                  y: [0, -8, 0],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  times: [0, 0.5, 1]
                }}
                whileHover={{
                  scale: 1.1,
                  rotate: [0, 5, -5, 0],
                  transition: { duration: 0.6 }
                }}
              />
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Daily Report Section with Mood Cards
const DailyReportSection = () => {
  const moods = [
    { 
      label: "Optimistic", 
      description: "I can conquer the world", 
      active: true,
      progress: 85
    },
    { 
      label: "Gloomy", 
      description: "uggggh...", 
      active: false,
      progress: 40
    },
    { 
      label: "Inspired", 
      description: "I just got the most am...", 
      active: false,
      progress: 65
    }
  ];

  return (
    <motion.div 
      className="mb-6"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <motion.div 
        className="flex items-center justify-between mb-6"
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Daily report</h2>
        <div className="flex space-x-6">
          <motion.span 
            className="text-sm text-blue-600 font-medium cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            • Daily
          </motion.span>
          <motion.span 
            className="text-sm text-gray-400 cursor-pointer hover:text-blue-500 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Weekly
          </motion.span>
          <motion.span 
            className="text-sm text-gray-400 cursor-pointer hover:text-blue-500 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Monthly
          </motion.span>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {moods.map((mood, index) => (
          <motion.div
            key={index}
            initial={{ y: 50, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className={`bg-white border border-gray-200 shadow-lg rounded-xl cursor-pointer transition-all duration-300 hover:shadow-xl overflow-hidden relative ${
              mood.active ? "shadow-blue-100 ring-2 ring-blue-100" : "hover:border-blue-200"
            }`}>
              <div className={`absolute top-0 left-0 right-0 h-1 ${
                mood.active ? "bg-gradient-to-r from-blue-800 to-blue-400" : "bg-gradient-to-r from-blue-600 to-blue-300"
              }`}></div>
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm sm:text-base font-medium text-gray-900">{mood.label}</h3>
                  <motion.div 
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      mood.active ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-300"
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {mood.active && (
                      <motion.div 
                        className="w-3 h-3 bg-blue-500 rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      />
                    )}
                  </motion.div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">{mood.description}</p>
                <div className="flex items-center">
                  <div className={`flex-1 h-2 bg-gray-200 rounded-full overflow-hidden ${
                    mood.active ? "bg-blue-100" : "bg-gray-100"
                  }`}>
                    <motion.div 
                      className={`h-full transition-all duration-500 ${
                        mood.active ? "bg-gradient-to-r from-blue-500 to-blue-600" : "bg-gray-300"
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${mood.progress}%` }}
                      transition={{ duration: 1, delay: 0.8 + index * 0.1, ease: "easeOut" }}
                    />
                  </div>
                  <motion.div
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowRight className={`ml-3 w-4 h-4 ${
                      mood.active ? "text-blue-500" : "text-gray-400"
                    }`} />
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Share Your Thoughts Section (Right Sidebar)
const ShareThoughtsSection = () => {
  return (
    <Card className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-800 to-blue-400"></div>
      <CardContent className="p-3 sm:p-4 lg:p-6">
        <div className="space-y-4">
          <textarea 
            placeholder="Pen down your thoughts..."
            className="w-full h-60 sm:h-72 lg:h-80 p-3 sm:p-4 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-lg text-gray-700 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          />
          <div className="flex items-center justify-center space-x-4 pt-4 border-t border-blue-200">
            <Button variant="ghost" size="icon" className="h-10 w-10 bg-gray-100 hover:bg-blue-100 rounded-xl border border-blue-200">
              <Bold className="w-4 h-4 text-gray-600" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 bg-gray-100 hover:bg-blue-100 rounded-xl border border-blue-200">
              <Underline className="w-4 h-4 text-gray-600" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 bg-gray-100 hover:bg-blue-100 rounded-xl border border-blue-200">
              <Italic className="w-4 h-4 text-gray-600" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 bg-gray-100 hover:bg-blue-100 rounded-xl border border-blue-200">
              <ImageIcon className="w-4 h-4 text-gray-600" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 bg-gray-100 hover:bg-blue-100 rounded-xl border border-blue-200">
              <DollarSign className="w-4 h-4 text-gray-600" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 bg-gray-100 hover:bg-blue-100 rounded-xl border border-blue-200">
              <X className="w-4 h-4 text-gray-600" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Profile Section (Right Sidebar)
const ProfileSection = () => {
  const userName = "Sakhii"; // This would come from user data
  
  // Simple gender detection based on name endings and common patterns
  const detectGender = (name: string) => {
    const lowerName = name.toLowerCase();
    const femaleEndings = ['a', 'i', 'e', 'ia', 'ika', 'isha', 'priya', 'devi', 'kumari'];
    const femaleNames = ['sakhii', 'sakhi', 'priya', 'ananya', 'kavya', 'riya', 'shreya', 'pooja', 'neha', 'isha'];
    const maleNames = ['raj', 'amit', 'rohit', 'vikash', 'arjun', 'dev', 'karan', 'rahul', 'aman', 'rohan'];
    
    // Check exact matches first
    if (femaleNames.some(fname => lowerName.includes(fname))) return 'female';
    if (maleNames.some(mname => lowerName.includes(mname))) return 'male';
    
    // Check endings
    if (femaleEndings.some(ending => lowerName.endsWith(ending))) return 'female';
    
    // Default to male if uncertain
    return 'male';
  };
  
  const gender = detectGender(userName);
  const avatarSrc = gender === 'female' ? '/woman.svg' : '/chill-guy.svg';
  
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.0 }}
    >
      <Card className="bg-white border border-gray-200 shadow-lg rounded-xl hover:shadow-xl transition-all duration-300 overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-800 to-blue-400"></div>
        <CardContent className="p-3">
          <div className="flex items-center space-x-2 mb-3">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center border-2 border-blue-300 shadow-md overflow-hidden">
                <motion.img
                  src={avatarSrc}
                  alt={`${gender} avatar`}
                  className="w-7 h-7 object-contain"
                  animate={{ 
                    y: [0, -1, 0],
                    rotate: [0, 1, -1, 0]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                />
              </div>
              <motion.div
                className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border border-white"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
            
            <div className="flex-1">
              <motion.h3 
                className="font-semibold text-gray-900 text-sm"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                {userName}
              </motion.h3>
              <motion.p 
                className="text-xs text-gray-500"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.3 }}
              >
                Mental Health Journey
              </motion.p>
              <motion.div 
                className="flex items-center mt-1 space-x-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
              >
                <div className="flex space-x-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.div
                      key={star}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.4 + star * 0.05, type: "spring" }}
                      whileHover={{ scale: 1.2 }}
                    >
                      <Heart className={`w-2 h-2 ${
                        star <= 4 ? "text-red-500 fill-red-500" : "text-gray-300"
                      }`} />
                    </motion.div>
                  ))}
                </div>
                <span className="text-xs text-gray-400">4.0</span>
              </motion.div>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-blue-50">
                <Settings className="w-3 h-3 text-gray-400" />
              </Button>
            </motion.div>
          </div>
          
          <motion.div 
            className="mb-3 pb-2 border-b border-gray-100"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <div className="flex justify-between text-xs">
              <div className="text-center">
                <motion.p 
                  className="font-semibold text-blue-600 text-xs"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  12
                </motion.p>
                <p className="text-gray-500 text-xs">Days</p>
              </div>
              <div className="text-center">
                <motion.p 
                  className="font-semibold text-green-600 text-xs"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >
                  89%
                </motion.p>
                <p className="text-gray-500 text-xs">Mood</p>
              </div>
              <div className="text-center">
                <motion.p 
                  className="font-semibold text-purple-600 text-xs"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  7.2
                </motion.p>
                <p className="text-gray-500 text-xs">Sleep</p>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Today's Curation Section (Right Sidebar)
const TodaysCuration = () => {
  const items = [
    {
      type: "podcast",
      title: "The Art of Living",
      subtitle: "Daily Mindfulness",
      duration: "12 min",
      icon: Headphones,
      color: "bg-purple-100 text-purple-600"
    },
    {
      type: "playlist",
      title: "Calming Sounds",
      subtitle: "Nature & Rain",
      duration: "45 min",
      icon: Music,
      color: "bg-green-100 text-green-600"
    }
  ];

  return (
    <Card className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-800 to-blue-400"></div>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-gray-900">Today's curation</CardTitle>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="w-4 h-4 text-gray-400" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 cursor-pointer border border-blue-100">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{item.title}</p>
                  <p className="text-sm text-gray-500">{item.subtitle}</p>
                </div>
                <div className="text-xs text-gray-400">
                  {item.duration}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

// Emotional Graph Component
const EmotionalGraph = () => {
  const chartData = [
    { date: "Mar 1", sleepQuality: 30, mood: 70 },
    { date: "Mar 2", sleepQuality: 45, mood: 65 },
    { date: "Mar 3", sleepQuality: 60, mood: 85 },
    { date: "Mar 4", sleepQuality: 40, mood: 55 },
    { date: "Mar 5", sleepQuality: 70, mood: 90 },
    { date: "Mar 6", sleepQuality: 55, mood: 75 }
  ];

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <Card className="bg-white border border-gray-200 shadow-lg rounded-xl hover:shadow-xl transition-all duration-300 overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-800 to-blue-400"></div>
        <CardHeader>
          <motion.div 
            className="flex items-center justify-between"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <CardTitle className="text-gray-900">Emotional graph</CardTitle>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Badge className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border-0 rounded-full cursor-pointer">59</Badge>
            </motion.div>
          </motion.div>
        </CardHeader>
        <CardContent>
          <motion.div 
            className="h-64"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSleepQuality" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                />
                <YAxis hide />
                <Area 
                  type="monotone" 
                  dataKey="sleepQuality" 
                  stroke="#1e3a8a" 
                  fillOpacity={1}
                  fill="url(#colorSleepQuality)"
                  strokeWidth={3}
                />
                <Area 
                  type="monotone" 
                  dataKey="mood" 
                  stroke="#60a5fa" 
                  fillOpacity={1}
                  fill="url(#colorMood)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
          <motion.div 
            className="flex items-center justify-between mt-4 text-sm"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <div className="flex items-center space-x-4">
              <motion.div 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div 
                  className="w-3 h-3 bg-blue-900 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <span className="text-gray-600">Sleep Quality</span>
              </motion.div>
              <motion.div 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div 
                  className="w-3 h-3 bg-blue-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                />
                <span className="text-gray-600">Mood</span>
              </motion.div>
            </div>
            <div className="text-xs text-gray-400">
              <span>Weekly Average</span>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Message interface for chatbot
interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isTyping?: boolean;
}

// Floating Chatbot Button Component
const FloatingChatButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        delay: 1.5 
      }}
    >
      <motion.button
        onClick={onClick}
        className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center border-2 border-white"
        whileHover={{ 
          scale: 1.1,
          rotate: [0, -10, 10, -10, 0],
          transition: { duration: 0.5 }
        }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <Bot className="w-8 h-8" />
        </motion.div>
        
        {/* Pulsing ring effect */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-blue-400"
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.8, 0.3, 0.8]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
      </motion.button>
      
      {/* Floating sparkles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-blue-400 rounded-full"
          style={{
            top: `${Math.random() * 60}px`,
            left: `${Math.random() * 60}px`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.7,
            ease: "easeInOut"
          }}
        />
      ))}
    </motion.div>
  );
};

// Chatbot Popup Component
const ChatbotPopup = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hello! I'm your AI mental health assistant. How can I help you today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when popup opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Generate AI response
  const generateAIResponse = (userMessage: string): string => {
    const responses = [
      "Thank you for sharing that with me. How does that make you feel?",
      "I understand. Would you like to try a breathing exercise to help you relax?",
      "That sounds challenging. Remember, it's okay to take things one step at a time.",
      "Your feelings are completely valid. What would help you feel better right now?",
      "I'm here to support you. Have you tried any coping strategies that worked for you before?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async () => {
    const textToSend = inputMessage.trim();
    if (!textToSend) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Add typing indicator
    const typingMessage: ChatMessage = {
      id: 'typing',
      text: '',
      sender: 'ai',
      timestamp: new Date(),
      isTyping: true
    };
    setMessages(prev => [...prev, typingMessage]);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = generateAIResponse(textToSend);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => prev.filter(m => m.id !== 'typing').concat(aiMessage));
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-md z-40"
            onClick={onClose}
          />
          
          {/* Chat Popup */}
          <motion.div
            initial={{ 
              opacity: 0, 
              scale: 0.8,
              y: 50,
              x: 0
            }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: 0,
              x: 0
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.8,
              y: 50
            }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 25 
            }}
            className="fixed bottom-24 right-6 w-96 h-[500px] z-50"
          >
            <Card className="h-full bg-white border border-gray-200 shadow-2xl rounded-xl overflow-hidden">
              {/* Header */}
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      animate={{ 
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                      className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
                    >
                      <Bot className="w-5 h-5" />
                    </motion.div>
                    <div>
                      <CardTitle className="text-lg font-semibold">AI Assistant</CardTitle>
                      <p className="text-sm text-blue-100">Here to help you • Online</p>
                    </div>
                  </div>
                  <motion.button
                    onClick={onClose}
                    className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </CardHeader>
              
              {/* Messages */}
              <CardContent className="flex-1 overflow-hidden p-0">
                <div className="h-80 overflow-y-auto p-4 space-y-3">
                  <AnimatePresence>
                    {messages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ y: 20, opacity: 0, scale: 0.95 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        transition={{ 
                          duration: 0.3, 
                          delay: index * 0.05,
                          type: "spring",
                          stiffness: 400,
                          damping: 25
                        }}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs px-3 py-2 rounded-xl shadow-sm ${
                          message.sender === 'user' 
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                            : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 border border-gray-200'
                        }`}>
                          {message.isTyping ? (
                            <motion.div className="flex items-center space-x-1">
                              <span className="text-sm">AI is typing</span>
                              {[0, 1, 2].map((dot) => (
                                <motion.div
                                  key={dot}
                                  className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                                  animate={{ scale: [1, 1.5, 1] }}
                                  transition={{
                                    duration: 0.6,
                                    repeat: Infinity,
                                    delay: dot * 0.2
                                  }}
                                />
                              ))}
                            </motion.div>
                          ) : (
                            <>
                              <p className="text-sm leading-relaxed">{message.text}</p>
                              <p className={`text-xs mt-1 ${
                                message.sender === 'user' ? 'text-blue-100' : 'text-gray-400'
                              }`}>
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Input */}
                <div className="border-t border-gray-200 p-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 relative">
                      <Input
                        ref={inputRef}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                        placeholder="Type your message..."
                        className="w-full pl-4 pr-12 py-2 bg-gray-50 border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        disabled={isTyping}
                      />
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim() || isTyping}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full px-4 py-2 shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default function Dashboard() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  return (
    <div className="min-h-screen bg-white">
      <SharedSidebar currentPage="/dashboard" userRole="student" />
      {/* Main Layout */}
      <div className="ml-20 flex min-h-screen">
        {/* Left Column - Main Content with White Background and Rounded Border */}
        <motion.div
          className="flex-1 p-3 sm:p-6 lg:p-8 rounded-tr-3xl rounded-br-3xl"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <DashboardHeader />
          <motion.div 
            className="bg-white p-3 sm:p-6 lg:p-8 rounded-3xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <WelcomeSection />
            <DailyReportSection />
            <EmotionalGraph />
          </motion.div>
        </motion.div>
        
      </div>
      
      {/* Floating Chatbot Button */}
      <FloatingChatButton onClick={() => setIsChatOpen(true)} />
      
      {/* Chatbot Popup */}
      <ChatbotPopup isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}