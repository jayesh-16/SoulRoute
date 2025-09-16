"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { type ScreeningSessionSchema } from '@/lib/schema';

// Re-export the type for convenience
export type { ScreeningSessionSchema };
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  CheckCircledIcon,
  InfoCircledIcon,
  ExclamationTriangleIcon
} from '@radix-ui/react-icons';

// Assessment questions data
const assessments = {
  phq9: {
    title: "PHQ-9 Depression Screening",
    description: "Over the last 2 weeks, how often have you been bothered by any of the following problems?",
    questions: [
      "Little interest or pleasure in doing things",
      "Feeling down, depressed, or hopeless",
      "Trouble falling or staying asleep, or sleeping too much",
      "Feeling tired or having little energy",
      "Poor appetite or overeating",
      "Feeling bad about yourself or that you are a failure or have let yourself or your family down",
      "Trouble concentrating on things, such as reading the newspaper or watching television",
      "Moving or speaking so slowly that other people could have noticed, or the opposite - being so fidgety or restless that you have been moving around a lot more than usual",
      "Thoughts that you would be better off dead, or of hurting yourself"
    ],
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  gad7: {
    title: "GAD-7 Anxiety Screening",
    description: "Over the last 2 weeks, how often have you been bothered by the following problems?",
    questions: [
      "Feeling nervous, anxious, or on edge",
      "Not being able to stop or control worrying",
      "Worrying too much about different things",
      "Trouble relaxing",
      "Being so restless that it is hard to sit still",
      "Becoming easily annoyed or irritable",
      "Feeling afraid, as if something awful might happen"
    ],
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ]
  },
  pss10: {
    title: "PSS-10 Stress Scale",
    description: "In the last month, how often have you felt or thought the following?",
    questions: [
      "Been upset because of something that happened unexpectedly?",
      "Felt that you were unable to control the important things in your life?",
      "Felt nervous and stressed?",
      "Felt confident about your ability to handle your personal problems?",
      "Felt that things were going your way?",
      "Found that you could not cope with all the things that you had to do?",
      "Been able to control irritations in your life?",
      "Felt that you were on top of things?",
      "Been angered because of things that happened that were outside of your control?",
      "Felt difficulties were piling up so high that you could not overcome them?"
    ],
    options: [
      { value: 0, label: "Never" },
      { value: 1, label: "Almost never" },
      { value: 2, label: "Sometimes" },
      { value: 3, label: "Fairly often" },
      { value: 4, label: "Very often" }
    ]
  },
  ghq12: {
    title: "GHQ-12 General Health",
    description: "Have you recently experienced any of the following?",
    questions: [
      "Been able to concentrate on whatever you're doing?",
      "Lost much sleep over worry?",
      "Felt that you were playing a useful part in things?",
      "Felt capable of making decisions about things?",
      "Felt constantly under strain?",
      "Felt you couldn't overcome your difficulties?",
      "Been able to enjoy your normal day-to-day activities?",
      "Been able to face up to your problems?",
      "Been feeling unhappy or depressed?",
      "Been losing confidence in yourself?",
      "Been thinking of yourself as a worthless person?",
      "Been feeling reasonably happy, all things considered?"
    ],
    options: [
      { value: 0, label: "Better than usual" },
      { value: 1, label: "Same as usual" },
      { value: 2, label: "Less than usual" },
      { value: 3, label: "Much less than usual" }
    ]
  }
};

interface ScreeningWizardProps {
  onComplete: (data: ScreeningSessionSchema) => void;
  onSkip: () => void;
}

export function ScreeningWizard({ onComplete, onSkip }: ScreeningWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<ScreeningSessionSchema>({
    phq9: [],
    gad7: [],
    pss10: [],
    ghq12: [],
    completedAt: ''
  });
  const [showIntro, setShowIntro] = useState(true);

  const assessmentKeys = Object.keys(assessments) as (keyof typeof assessments)[];
  const currentAssessment = assessmentKeys[currentStep];
  const currentAssessmentData = assessments[currentAssessment];
  const totalSteps = assessmentKeys.length;
  const totalQuestions = currentAssessmentData?.questions.length || 0;
  const overallProgress = ((currentStep * 100) + ((currentQuestion + 1) / totalQuestions * 100)) / totalSteps;

  const handleResponse = (value: number) => {
    const newResponses = { ...responses };
    newResponses[currentAssessment][currentQuestion] = value;
    setResponses(newResponses);

    // Auto-advance to next question
    setTimeout(() => {
      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else if (currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1);
        setCurrentQuestion(0);
      } else {
        // Complete assessment
        const completedData = {
          ...newResponses,
          completedAt: new Date().toISOString()
        };
        onComplete(completedData);
      }
    }, 300);
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setCurrentQuestion(assessments[assessmentKeys[currentStep - 1]].questions.length - 1);
    }
  };

  const canGoBack = currentStep > 0 || currentQuestion > 0;
  const currentResponse = responses[currentAssessment]?.[currentQuestion];

  if (showIntro) {
    return (
      <div className="w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="bg-white border-2 border-blue-600 shadow-xl rounded-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="text-center border-b border-blue-200 pb-6">
              <CheckCircledIcon className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-3xl mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Wellbeing Check-In</CardTitle>
              <p className="text-gray-600 text-lg">
                Take a moment to reflect on your mental health and wellbeing
              </p>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200 shadow-sm">
                <div className="flex items-start gap-3">
                  <InfoCircledIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-3">
                      What to expect:
                    </h3>
                    <ul className="text-sm text-blue-800 space-y-2">
                      <li>• 4 brief assessments covering depression, anxiety, stress, and general wellbeing</li>
                      <li>• Approximately 5-10 minutes to complete</li>
                      <li>• Confidential and secure - only you can see your results</li>
                      <li>• Based on validated clinical screening tools</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 p-6 rounded-lg border-2 border-amber-200 shadow-sm">
                <div className="flex items-start gap-3">
                  <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-3">
                      Important reminders:
                    </h3>
                    <ul className="text-sm text-amber-800 space-y-2">
                      <li>• This is a screening tool, not a diagnostic assessment</li>
                      <li>• Answer honestly based on how you've been feeling recently</li>
                      <li>• If you're in crisis, please contact emergency services immediately</li>
                      <li>• Your responses will help us provide personalized support</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center pt-6 border-t border-blue-200">
                <Button 
                  variant="ghost" 
                  onClick={onSkip}
                  className="px-8 py-3 border-2 border-blue-600 hover:bg-blue-50 text-blue-700"
                >
                  Skip Assessment
                </Button>
                <Button
                  onClick={() => setShowIntro(false)}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Begin Assessment
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="max-w-3xl mx-auto p-6">
          {/* Progress Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <Badge variant="outline" className="mb-2">
                  Step {currentStep + 1} of {totalSteps}
                </Badge>
                <h1 className="text-2xl font-bold text-foreground">
                  {currentAssessmentData.title}
                </h1>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground mb-1">
                  Question {currentQuestion + 1} of {totalQuestions}
                </div>
                <div className="text-2xl font-bold text-primary">
                  {Math.round(overallProgress)}%
                </div>
              </div>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </motion.div>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentStep}-${currentQuestion}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-white border-2 border-blue-600 shadow-xl">
                <CardHeader className="border-b border-blue-200 pb-4">
                  <p className="text-gray-600 mb-4 text-sm">
                    {currentAssessmentData.description}
                  </p>
                  <CardTitle className="text-xl leading-relaxed text-gray-900">
                    {currentAssessmentData.questions[currentQuestion]}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <RadioGroup
                    value={currentResponse?.toString()}
                    onValueChange={(value) => handleResponse(parseInt(value))}
                    className="space-y-4"
                  >
                    {currentAssessmentData.options.map((option) => (
                      <motion.div
                        key={option.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Label
                          htmlFor={`option-${option.value}`}
                          className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            currentResponse === option.value
                              ? 'border-blue-600 bg-blue-50 shadow-md'
                              : 'border-blue-600 hover:border-blue-700 hover:bg-blue-50'
                          }`}
                        >
                          <RadioGroupItem
                            value={option.value.toString()}
                            id={`option-${option.value}`}
                          />
                          <span className="flex-1 text-base">{option.label}</span>
                        </Label>
                      </motion.div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200"
          >
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={!canGoBack}
              className="flex items-center gap-2 border-2 border-blue-600 hover:bg-white text-blue-700"
            >
              <ChevronLeftIcon className="w-4 h-4" />
              Previous
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600 font-medium">
                Select an answer to continue
              </p>
            </div>

            <Button
              variant="ghost"
              onClick={onSkip}
              className="text-blue-700 border-2 border-blue-600 hover:bg-white"
            >
              Skip Assessment
            </Button>
          </motion.div>
      </div>
    </div>
  );
}
