"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home,
  MessageSquare,
  Calendar,
  ArrowLeft,
  Clock,
  MapPin,
  Star,
  Shield,
  UserCheck,
  User,
  CheckCircle,
  Phone,
  Mail,
  Calendar as CalendarIcon,
  ChevronRight,
  ChevronLeft,
  Video,
  Users,
  BookOpen
} from "lucide-react";
import { HeartIcon } from "@radix-ui/react-icons";
import Link from "next/link";

// Sidebar Navigation Component (same as dashboard)
const Sidebar = () => {
  const navItems = [
    { icon: Home, label: "Dashboard", active: false, href: "/dashboard" },
    { icon: MessageSquare, label: "Messages", active: false, href: "/chat" },
    { icon: Calendar, label: "Booking", active: true, href: "/booking" },
    { icon: BookOpen, label: "Resources", active: false, href: "/resources" },
    { icon: Users, label: "Peer Support", active: false, href: "/peer-support" },
    { icon: Shield, label: "Admin", active: false, href: "/admin" },
    { icon: CheckCircle, label: "Approvals", active: false, href: "/admin/approval" },
    { icon: UserCheck, label: "Counselor", active: false, href: "/counselor" },
    { icon: User, label: "Student", active: false, href: "/student" }
  ];

  return (
    <motion.div 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed left-0 top-0 h-full w-20 bg-gradient-to-b from-blue-400 to-blue-700 flex flex-col items-center py-6 space-y-6 rounded-r-3xl shadow-lg"
    >
      {/* Logo */}
      <motion.div 
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-6 cursor-pointer"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <HeartIcon className="w-6 h-6 text-white" />
        </motion.div>
      </motion.div>
      
      {/* Navigation Items */}
      <nav className="flex flex-col space-y-4">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link href={item.href} key={index}>
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                whileHover={{ scale: 1.1, x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className={`w-12 h-12 rounded-xl transition-all duration-300 ${
                    item.active 
                      ? "bg-white/20 text-white shadow-lg" 
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </Button>
              </motion.div>
            </Link>
          );
        })}
      </nav>
    </motion.div>
  );
};

// Page Header
const BookingHeader = () => {
  return (
    <motion.div
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="bg-white border border-gray-200 shadow-lg rounded-xl mb-6 hover:shadow-xl transition-all duration-300 border-t-4" style={{ borderImage: 'linear-gradient(to right, #1e3a8a, #60a5fa) 1', borderImageSlice: 1 }}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="ghost" size="icon" className="rounded-xl hover:bg-blue-50">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </Button>
                </motion.div>
              </Link>
              
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
                  className="relative"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center border-2 border-blue-300 shadow-md">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                </motion.div>
                
                <div>
                  <motion.h1 
                    className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Confidential Booking System
                  </motion.h1>
                  <motion.p 
                    className="text-sm text-gray-500"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Book your private counseling session • Secure & Confidential
                  </motion.p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Counselor data
const counselors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Anxiety & Depression",
    rating: 4.9,
    experience: "8 years",
    image: "/woman.svg",
    available: true,
    price: "$120/session",
    nextSlot: "Today 2:00 PM"
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Trauma & PTSD",
    rating: 4.8,
    experience: "12 years", 
    image: "/chill-guy.svg",
    available: true,
    price: "$150/session",
    nextSlot: "Tomorrow 10:00 AM"
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialty: "Relationship Counseling",
    rating: 4.9,
    experience: "6 years",
    image: "/woman.svg", 
    available: false,
    price: "$110/session",
    nextSlot: "Next week"
  }
];

// Counselor Card Component
const CounselorCard = ({ counselor, onBook }: { counselor: any; onBook: (counselor: any) => void }) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, scale: 1.02 }}
    >
      <Card className="bg-white border border-gray-200 shadow-lg rounded-xl hover:shadow-xl transition-all duration-300 border-t-4" style={{ borderImage: 'linear-gradient(to right, #1e3a8a, #60a5fa) 1', borderImageSlice: 1 }}>
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="relative"
            >
              <Avatar className="w-16 h-16 border-2 border-blue-300 shadow-md">
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center">
                  <img src={counselor.image} alt={counselor.name} className="w-10 h-10" />
                </div>
              </Avatar>
              {counselor.available && (
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg">{counselor.name}</h3>
              <p className="text-blue-600 text-sm font-medium">{counselor.specialty}</p>
              <div className="flex items-center space-x-2 mt-2">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium">{counselor.rating}</span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-600">{counselor.experience}</span>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div>
                  <p className="text-sm text-gray-500">Next available:</p>
                  <p className="text-sm font-medium text-gray-700">{counselor.nextSlot}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">{counselor.price}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                onClick={() => onBook(counselor)}
                disabled={!counselor.available}
                className={`w-full rounded-full py-3 transition-all duration-300 ${
                  counselor.available 
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg" 
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                {counselor.available ? "Book Session" : "Not Available"}
                {counselor.available && <ChevronRight className="ml-2 w-4 h-4" />}
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Main Booking Component
export default function BookingPage() {
  const [selectedCounselor, setSelectedCounselor] = useState<any>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const handleBookCounselor = (counselor: any) => {
    setSelectedCounselor(counselor);
    setShowBookingForm(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Layout */}
      <div className="ml-20 flex min-h-screen">
        {/* Main Content */}
        <motion.div 
          className="flex-1 p-8"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <BookingHeader />
          
          <motion.div 
            className="bg-white p-8 rounded-3xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Available Counselors Section */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Counselors</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {counselors.map((counselor, index) => (
                  <motion.div
                    key={counselor.id}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <CounselorCard 
                      counselor={counselor} 
                      onBook={handleBookCounselor}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Booking Features */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 shadow-lg rounded-xl">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Choose Our Service?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-8 h-8 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">100% Confidential</p>
                        <p className="text-sm text-gray-600">Your privacy is our priority</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Video className="w-8 h-8 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Online & In-Person</p>
                        <p className="text-sm text-gray-600">Flexible session options</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-8 h-8 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">24/7 Support</p>
                        <p className="text-sm text-gray-600">Available when you need us</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Booking Confirmation Modal would go here */}
      <AnimatePresence>
        {showBookingForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-md z-40 flex items-center justify-center p-4"
            onClick={() => setShowBookingForm(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Booking Confirmed!</h3>
                <p className="text-gray-600 mb-4">
                  Your session with {selectedCounselor?.name} has been scheduled.
                </p>
                <Button 
                  onClick={() => setShowBookingForm(false)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full px-6 py-2"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}