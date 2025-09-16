"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScreeningWizard, type ScreeningSessionSchema } from '@/components/screening-wizard';
import { 
  ArrowLeft, Brain, Clock, Heart
} from "lucide-react";
import Link from "next/link";

export default function WellbeingCheckinPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async (data: ScreeningSessionSchema) => {
    setIsLoading(true);
    try {
      // Mock API call - in a real app this would submit to backend
      console.log('Screening data:', data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful submission
      const mockResult = {
        sessionId: 'mock-session-' + Date.now(),
        scores: {
          phq9: { score: 12, category: 'Moderate', maxScore: 27 },
          gad7: { score: 8, category: 'Mild', maxScore: 21 },
          pss10: { score: 22, category: 'Moderate', maxScore: 40 },
          ghq12: { score: 5, category: 'Possible distress', maxScore: 12 },
          overall: 'MODERATE',
          safetyFlag: false
        }
      };
      
      console.log('Mock screening result:', mockResult);
      
      // Redirect to results page with mock session ID
      router.push(`/wellbeing/results?sessionId=${mockResult.sessionId}`);
    } catch (error) {
      console.error('Failed to submit screening:', error);
      // In a real app, show error message to user
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    // Log skip event and redirect
    console.log('User skipped screening');
    router.push('/student');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full p-3 sm:p-6 lg:p-8">
        <motion.div 
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header Card */}
          <Card className="bg-white border border-gray-200 shadow-lg rounded-xl mb-6 hover:shadow-xl transition-all duration-300 overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-800 to-blue-400"></div>
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <Link href="/student" className="hidden sm:block">
                    <Button variant="ghost" size="icon" className="rounded-xl hover:bg-blue-50">
                      <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </Button>
                  </Link>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 flex items-center justify-center border-2 border-purple-300 shadow-md">
                      <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                    </div>
                    <div>
                      <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        Wellbeing Assessment
                      </h1>
                      <p className="text-xs sm:text-sm text-gray-500">Mental health check-in • Confidential & Secure</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className="bg-purple-100 text-purple-700 border-0 px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    10-15 minutes
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <motion.div 
            className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-800 to-blue-400"></div>
            <div className="p-3 sm:p-6 lg:p-8">
              <ScreeningWizard
                onComplete={handleComplete}
                onSkip={handleSkip}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}