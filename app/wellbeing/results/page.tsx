"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { SafetyAlert } from '@/components/ui/safety-alert';
import { NextSteps } from '@/components/ui/next-steps';
import { 
  CheckCircledIcon, 
  InfoCircledIcon, 
  DownloadIcon, 
  HomeIcon,
  ReloadIcon
} from '@radix-ui/react-icons';
import { 
  ArrowLeft, Brain, Clock, Heart, TrendingUp, TrendingDown, CheckCircle
} from "lucide-react";
import Link from "next/link";
// Type definitions
type ScoreBreakdown = {
  phq9: { score: number; category: string; maxScore: number };
  gad7: { score: number; category: string; maxScore: number };
  pss10: { score: number; category: string; maxScore: number };
  ghq12: { score: number; category: string; maxScore: number };
  overall: string;
  safetyFlag: boolean;
};

// Mock data - in a real app, this would come from the API
const mockResults: ScoreBreakdown = {
  phq9: { score: 12, category: 'Moderate', maxScore: 27 },
  gad7: { score: 8, category: 'Mild', maxScore: 21 },
  pss10: { score: 22, category: 'Moderate', maxScore: 40 },
  ghq12: { score: 5, category: 'Possible distress', maxScore: 12 },
  overall: 'MODERATE',
  safetyFlag: false
};

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [results, setResults] = useState<ScoreBreakdown>(mockResults);
  const [showSafetyAlert, setShowSafetyAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch results from API using session ID from search params
    const sessionId = searchParams.get('session');
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (results.safetyFlag) {
        setShowSafetyAlert(true);
      }
    }, 1000);
  }, [searchParams, results.safetyFlag]);

  const getCategoryColor = (category: string) => {
    switch (category.toUpperCase()) {
      case 'CRISIS_ALERT':
      case 'SEVERE':
      case 'MODERATELY SEVERE':
      case 'PROBABLE DISTRESS':
        return 'destructive';
      case 'HIGH':
        return 'destructive';
      case 'MODERATE':
      case 'POSSIBLE DISTRESS':
        return 'secondary';
      case 'MILD':
      case 'LOW':
      case 'MINIMAL':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getOverallCategoryColor = (category: string) => {
    switch (category) {
      case 'CRISIS_ALERT':
        return 'destructive';
      case 'HIGH':
        return 'destructive';
      case 'MODERATE':
        return 'secondary';
      case 'LOW':
        return 'default';
      default:
        return 'outline';
    }
  };

  const handleContactCounselor = () => {
    console.log('Contact counselor');
    // In a real app, this would open a booking system or contact form
  };

  const handleEmailSupport = () => {
    console.log('Email support');
    // In a real app, this would open an email client or contact form
  };

  const handleViewEmergencyContacts = () => {
    console.log('View emergency contacts');
    setShowSafetyAlert(false);
  };

  const handleScheduleCallback = () => {
    console.log('Schedule callback');
    router.push('/wellbeing/support/callback');
  };

  const handleViewResources = () => {
    console.log('View resources');
    router.push('/wellbeing/resources');
  };

  const handleBookAppointment = () => {
    console.log('Book appointment');
    router.push('/wellbeing/support/booking');
  };

  const handleDownloadResults = () => {
    console.log('Download results');
    // In a real app, this would generate a PDF report
  };

  const handleRetakeAssessment = () => {
    router.push('/wellbeing/checkin');
  };

  const handleGoHome = () => {
    router.push('/');
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="w-full px-6 py-8">
          <div className="flex-1 p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Calculating your results...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Safety Alert Overlay */}
      {showSafetyAlert && (
        <SafetyAlert
          onContactCounselor={handleContactCounselor}
          onEmailSupport={handleEmailSupport}
          onViewEmergencyContacts={handleViewEmergencyContacts}
        />
      )}
      
      {/* Main Content */}
      <div className="w-full px-6 py-8">
        <motion.div 
          className="flex-1 p-8"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <Card className="bg-white border-2 border-blue-600 shadow-xl rounded-xl mb-6 border-t-4 border-t-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Link href="/wellbeing/checkin">
                    <Button variant="ghost" size="icon" className="rounded-xl hover:bg-blue-50 border-2 border-blue-600">
                      <ArrowLeft className="w-5 h-5 text-blue-700" />
                    </Button>
                  </Link>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-blue-200 flex items-center justify-center border-2 border-green-300 shadow-md">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                        Assessment Results
                      </h1>
                      <p className="text-sm text-gray-500">Your wellbeing check-in results • Confidential</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className="bg-green-100 text-green-700 border-0 px-4 py-2">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Completed
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <motion.div 
            className="bg-white border-2 border-blue-600 shadow-xl p-8 rounded-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >

            {/* Overall Category */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <Card className="bg-white border-2 border-blue-600 shadow-xl rounded-xl border-t-4 border-t-blue-800">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl mb-2 text-gray-900">Overall Wellbeing Category</CardTitle>
                  <div className="flex justify-center">
                    <Badge className={`text-lg px-6 py-2 rounded-full ${
                      results.overall === 'CRISIS_ALERT' ? 'bg-red-100 text-red-800' :
                      results.overall === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                      results.overall === 'MODERATE' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {results.overall.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Alert className="bg-blue-50 border-blue-200">
                    <InfoCircledIcon className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      This overall category is based on your responses across all four assessments. 
                      Below you'll find detailed results for each area and personalized recommendations.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </motion.div>

            {/* Individual Scores */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid gap-6 md:grid-cols-2 mb-8"
            >
              {/* PHQ-9 */}
              <Card className="bg-white border-2 border-blue-600 shadow-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between text-gray-900">
                    PHQ-9 (Depression)
                    <Badge variant={getCategoryColor(results.phq9.category)}>
                      {results.phq9.category}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-gray-900">
                        {results.phq9.score}/{results.phq9.maxScore}
                      </span>
                      <span className="text-sm text-gray-600">
                        {Math.round((results.phq9.score / results.phq9.maxScore) * 100)}%
                      </span>
                    </div>
                    <Progress 
                      value={(results.phq9.score / results.phq9.maxScore) * 100} 
                      className="h-2"
                    />
                    <p className="text-sm text-gray-600">
                      Depression symptoms over the past 2 weeks
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* GAD-7 */}
              <Card className="bg-white border-2 border-blue-600 shadow-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between text-gray-900">
                    GAD-7 (Anxiety)
                    <Badge variant={getCategoryColor(results.gad7.category)}>
                      {results.gad7.category}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-gray-900">
                        {results.gad7.score}/{results.gad7.maxScore}
                      </span>
                      <span className="text-sm text-gray-600">
                        {Math.round((results.gad7.score / results.gad7.maxScore) * 100)}%
                      </span>
                    </div>
                    <Progress 
                      value={(results.gad7.score / results.gad7.maxScore) * 100} 
                      className="h-2"
                    />
                    <p className="text-sm text-gray-600">
                      Anxiety symptoms over the past 2 weeks
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* PSS-10 */}
              <Card className="bg-white border-2 border-blue-600 shadow-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between text-gray-900">
                    PSS-10 (Stress)
                    <Badge variant={getCategoryColor(results.pss10.category)}>
                      {results.pss10.category}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-gray-900">
                        {results.pss10.score}/{results.pss10.maxScore}
                      </span>
                      <span className="text-sm text-gray-600">
                        {Math.round((results.pss10.score / results.pss10.maxScore) * 100)}%
                      </span>
                    </div>
                    <Progress 
                      value={(results.pss10.score / results.pss10.maxScore) * 100} 
                      className="h-2"
                    />
                    <p className="text-sm text-gray-600">
                      Perceived stress levels over the past month
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* GHQ-12 */}
              <Card className="bg-white border-2 border-blue-600 shadow-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between text-gray-900">
                    GHQ-12 (General Health)
                    <Badge variant={getCategoryColor(results.ghq12.category)}>
                      {results.ghq12.category}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-gray-900">
                        {results.ghq12.score}/{results.ghq12.maxScore}
                      </span>
                      <span className="text-sm text-gray-600">
                        {Math.round((results.ghq12.score / results.ghq12.maxScore) * 100)}%
                      </span>
                    </div>
                    <Progress 
                      value={(results.ghq12.score / results.ghq12.maxScore) * 100} 
                      className="h-2"
                    />
                    <p className="text-sm text-gray-600">
                      General psychological distress indicators
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                What you can do next
              </h2>
              <NextSteps
                overallCategory={results.overall}
                safetyFlag={results.safetyFlag}
                onScheduleCallback={handleScheduleCallback}
                onViewResources={handleViewResources}
                onBookAppointment={handleBookAppointment}
              />
            </motion.div>

            <Separator className="my-8" />

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-3 sm:gap-4 justify-center"
            >
              <Button 
                onClick={handleDownloadResults}
                variant="ghost"
                className="flex items-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 hover:text-gray-800 text-sm sm:text-base"
              >
                <DownloadIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Download Results</span>
                <span className="sm:hidden">Download</span>
              </Button>
              
              <Button 
                onClick={handleRetakeAssessment}
                variant="ghost"
                className="flex items-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 hover:text-gray-800 text-sm sm:text-base"
              >
                <ReloadIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Retake Assessment</span>
                <span className="sm:hidden">Retake</span>
              </Button>
              
              <Button 
                onClick={handleGoHome}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl text-sm sm:text-base"
              >
                <HomeIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Return to Dashboard</span>
                <span className="sm:hidden">Dashboard</span>
              </Button>
            </motion.div>

            {/* Footer Note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-8 text-center"
            >
              <p className="text-sm text-gray-600 max-w-2xl mx-auto">
                These results are based on validated screening tools and provide insights 
                into your current wellbeing. They are not a substitute for professional 
                diagnosis. You can retake this assessment in 7 days to track changes over time.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white">
        <div className="w-full p-3 sm:p-6 lg:p-8">
          <div className="flex-1 p-3 sm:p-6 lg:p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading results...</p>
            </div>
          </div>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}