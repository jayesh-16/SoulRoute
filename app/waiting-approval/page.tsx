"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ClockIcon, CheckCircledIcon, PersonIcon, BackpackIcon, HeartIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, CheckCircle, Phone, ArrowLeft, Mail, Calendar, 
  Sparkles
} from "lucide-react";

const DURATION = 0.3;
const EASE_OUT = "easeOut";

export default function WaitingApprovalPage() {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Get user role from localStorage or URL params
    const role = localStorage.getItem('pendingUserRole') || 'student';
    setUserRole(role);
  }, []);

  const getRoleIcon = () => {
    if (userRole === 'counselor') {
      return <PersonIcon className="w-8 h-8 text-foreground" />;
    }
    return <BackpackIcon className="w-8 h-8 text-foreground" />;
  };

  const getRoleText = () => {
    if (userRole === 'counselor') {
      return {
        title: "Counselor Application Submitted",
        subtitle: "Your counselor credentials are being verified",
        description: "Our team is reviewing your qualifications and credentials. This process typically takes 24-48 hours to ensure we maintain the highest standards of care for our community."
      };
    }
    return {
      title: "Student Application Submitted",
      subtitle: "Your student account is pending approval",
      description: "We're setting up your personalized mental health support system. This quick review helps us provide you with the most relevant resources for your campus."
    };
  };

  const roleContent = getRoleText();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative" style={{ border: '12px solid', borderImage: 'linear-gradient(to right, #1e3a8a, #60a5fa) 1', borderImageSlice: 1 }}>
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/20 rounded-full blur-xl" />
        <div className="absolute top-40 right-20 w-48 h-48 bg-purple-200/20 rounded-full blur-xl" />
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-green-200/20 rounded-full blur-xl" />
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-yellow-200/20 rounded-full blur-xl" />
      </div>

      <motion.div 
        className="relative z-10 flex-1 p-8 max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header */}
        <Card className="bg-white border border-gray-200 shadow-lg rounded-xl mb-8 border-t-4" style={{ borderImage: 'linear-gradient(to right, #1e3a8a, #60a5fa) 1', borderImageSlice: 1 }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/">
                  <Button variant="ghost" size="icon" className="rounded-xl hover:bg-blue-50">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </Button>
                </Link>
                <div className="flex items-center space-x-3">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center border-2 border-blue-300 shadow-lg">
                    <HeartIcon className="w-7 h-7 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      SoulRoute®
                    </h1>
                    <p className="text-base text-gray-600">Application Status Center</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge className="bg-yellow-100 text-yellow-700 border-0 px-4 py-2">
                  <Clock className="w-4 h-4 mr-2" />
                  Pending Approval
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Status Card - Centered and Enhanced */}
        <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="rounded-3xl p-1 bg-gradient-to-r from-blue-900 to-blue-400">
                <Card className="bg-white border-0 shadow-xl rounded-3xl">
                <CardContent className="p-6">
                  {/* Status Icon - Enhanced Size and Animation */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 180 }}
                    className="flex justify-center mb-6"
                  >
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center border-4 border-blue-300 shadow-2xl">
                        {userRole === 'counselor' ? (
                          <PersonIcon className="w-14 h-14 text-blue-600" />
                        ) : (
                          <BackpackIcon className="w-16 h-16 text-blue-600" />
                        )}
                      </div>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-2 -right-2"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 border-3 border-white flex items-center justify-center shadow-xl">
                          <Clock className="w-5 h-5 text-white" />
                        </div>
                      </motion.div>
                      
                      {/* Enhanced Sparkle effects */}
                      <motion.div
                        animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
                        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                        className="absolute -top-3 -left-3"
                      >
                        <Sparkles className="w-6 h-6 text-yellow-400" />
                      </motion.div>
                      <motion.div
                        animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
                        transition={{ duration: 2.5, repeat: Infinity, delay: 1.8 }}
                        className="absolute -bottom-3 -right-3"
                      >
                        <Sparkles className="w-6 h-6 text-purple-400" />
                      </motion.div>
                      <motion.div
                        animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
                        transition={{ duration: 2.5, repeat: Infinity, delay: 3.2 }}
                        className="absolute top-4 -right-4"
                      >
                        <Sparkles className="w-5 h-5 text-blue-400" />
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Enhanced Content with Better Typography */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: DURATION, ease: EASE_OUT, delay: 0.4 }}
                    className="text-center mb-6"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                      {roleContent.title}
                    </h2>
                    <p className="text-base text-gray-600 mb-3 font-medium">
                      {roleContent.subtitle}
                    </p>
                    <p className="text-gray-700 leading-relaxed text-sm max-w-2xl mx-auto font-light">
                      {roleContent.description}
                    </p>
                  </motion.div>

                  {/* Enhanced Status Steps with Larger Design */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: DURATION, ease: EASE_OUT, delay: 0.5 }}
                    className="mb-6"
                  >
                    <div className="flex justify-center items-center space-x-12">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center shadow-2xl border-2 border-green-200">
                          <CheckCircle className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-gray-900 text-base mb-1">Application Received</p>
                          <p className="text-xs text-green-600 font-semibold">✓ Completed Successfully</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <div className="w-24 h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                          <motion.div 
                            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full shadow-md"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 2.5, delay: 0.7 }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-2 font-medium">Processing...</p>
                      </div>
                      
                      <div className="flex flex-col items-center space-y-3">
                        <motion.div 
                          className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center shadow-2xl border-2 border-yellow-200"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2.5, repeat: Infinity }}
                        >
                          <Clock className="w-8 h-8 text-white" />
                        </motion.div>
                        <div className="text-center">
                          <p className="font-bold text-gray-900 text-base mb-1">Under Review</p>
                          <p className="text-xs text-yellow-600 font-semibold">⏳ In Progress</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Enhanced Action Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: DURATION, ease: EASE_OUT, delay: 0.6 }}
                    className="space-y-6"
                  >
                    <div className="text-center">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6 mb-6 shadow-lg">
                      <div className="flex items-center justify-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mr-3 shadow-lg">
                          <Mail className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Email Notification</h3>
                      </div>
                      <p className="text-gray-700 font-medium text-lg text-center mb-3 leading-relaxed">
                        You'll receive an email notification once your account is approved.
                      </p>
                      <p className="text-sm text-gray-500 text-center">
                        Please check your inbox and spam folder regularly.
                      </p>
                    </div>
                      
                      <div className="flex justify-center space-x-6">
                        <Button 
                          asChild
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full px-8 py-3 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                        >
                          <Link href="/login">
                            Check Login Status
                          </Link>
                        </Button>
                        
                        <Button 
                          asChild
                          variant="ghost"
                          className="rounded-full border-2 border-gray-300 hover:border-gray-400 px-8 py-3 text-lg font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
                        >
                          <Link href="/">
                            Return to Home
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </CardContent>
                </Card>
              </div>
            </motion.div>
        </div>
      </motion.div>
    </div>
  );
}