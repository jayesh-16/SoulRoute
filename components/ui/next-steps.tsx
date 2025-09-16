"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ExclamationTriangleIcon
} from '@radix-ui/react-icons';
import { 
  Calendar,
  BookOpen,
  MessageCircle,
  Heart,
  Lightbulb,
  User
} from 'lucide-react';

interface NextStepsProps {
  overallCategory: string;
  safetyFlag: boolean;
  onScheduleCallback: () => void;
  onViewResources: () => void;
  onBookAppointment: () => void;
}

export function NextSteps({ 
  overallCategory, 
  safetyFlag, 
  onScheduleCallback, 
  onViewResources, 
  onBookAppointment 
}: NextStepsProps) {
  const getRecommendations = () => {
    switch (overallCategory) {
      case 'CRISIS_ALERT':
        return {
          priority: 'immediate',
          title: 'Immediate Action Required',
          description: 'Your responses indicate you may be in crisis. Please seek immediate professional help.',
          actions: [
            {
              icon: ExclamationTriangleIcon,
              title: 'Contact Crisis Support',
              description: 'Speak with a crisis counselor immediately',
              action: onScheduleCallback,
              variant: 'default' as const,
              urgent: true
            },
            {
              icon: User,
              title: 'Emergency Appointment',
              description: 'Schedule an urgent counseling session',
              action: onBookAppointment,
              variant: 'default' as const,
              urgent: true
            }
          ]
        };

      case 'HIGH':
        return {
          priority: 'high',
          title: 'Professional Support Recommended',
          description: 'Your results suggest you would benefit from professional mental health support.',
          actions: [
            {
              icon: User,
              title: 'Book Counseling Session',
              description: 'Schedule with a licensed counselor',
              action: onBookAppointment,
              variant: 'default' as const,
              urgent: false
            },
            {
              icon: MessageCircle,
              title: 'Schedule Callback',
              description: 'Have a counselor contact you within 24 hours',
              action: onScheduleCallback,
              variant: 'ghost' as const,
              urgent: false
            },
            {
              icon: BookOpen,
              title: 'Mental Health Resources',
              description: 'Access coping strategies and self-help tools',
              action: onViewResources,
              variant: 'ghost' as const,
              urgent: false
            }
          ]
        };

      case 'MODERATE':
        return {
          priority: 'moderate',
          title: 'Support Options Available',
          description: 'Consider connecting with support services to help manage your current challenges.',
          actions: [
            {
              icon: BookOpen,
              title: 'Explore Resources',
              description: 'Self-help tools and coping strategies',
              action: onViewResources,
              variant: 'default' as const,
              urgent: false
            },
            {
              icon: MessageCircle,
              title: 'Schedule Check-in',
              description: 'Optional callback to discuss your results',
              action: onScheduleCallback,
              variant: 'ghost' as const,
              urgent: false
            },
            {
              icon: User,
              title: 'Consider Counseling',
              description: 'Professional support if symptoms persist',
              action: onBookAppointment,
              variant: 'ghost' as const,
              urgent: false
            }
          ]
        };

      case 'LOW':
      default:
        return {
          priority: 'low',
          title: 'Maintain Your Wellbeing',
          description: 'Your results look positive. Here are ways to continue supporting your mental health.',
          actions: [
            {
              icon: BookOpen,
              title: 'Wellness Resources',
              description: 'Tips for maintaining good mental health',
              action: onViewResources,
              variant: 'ghost' as const,
              urgent: false
            },
            {
              icon: Heart,
              title: 'Preventive Support',
              description: 'Optional check-in for ongoing wellness',
              action: onScheduleCallback,
              variant: 'ghost' as const,
              urgent: false
            },
            {
              icon: Lightbulb,
              title: 'Peer Support',
              description: 'Connect with campus wellness programs',
              action: onViewResources,
              variant: 'ghost' as const,
              urgent: false
            }
          ]
        };
    }
  };

  const recommendations = getRecommendations();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'immediate':
        return 'destructive';
      case 'high':
        return 'secondary';
      case 'moderate':
        return 'outline';
      case 'low':
        return 'default';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Badge variant={getPriorityColor(recommendations.priority)}>
          {recommendations.priority.toUpperCase()} PRIORITY
        </Badge>
        <h3 className="text-xl font-semibold">{recommendations.title}</h3>
      </div>
      
      <p className="text-muted-foreground text-lg mb-6">
        {recommendations.description}
      </p>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {recommendations.actions.map((action, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className={`h-full cursor-pointer transition-all hover:shadow-lg ${
                action.urgent 
                  ? 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/10' 
                  : 'hover:border-primary/50'
              }`}
              onClick={action.action}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    action.urgent 
                      ? 'bg-red-100 dark:bg-red-900/20' 
                      : 'bg-primary/10'
                  }`}>
                    <action.icon className={`w-5 h-5 ${
                      action.urgent 
                        ? 'text-red-600 dark:text-red-400' 
                        : 'text-primary'
                    }`} />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {action.description}
                </p>
                <Button 
                  variant={action.variant}
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    action.action();
                  }}
                >
                  {action.urgent ? 'Get Help Now' : 'Learn More'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {safetyFlag && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                    Additional Support Available
                  </h4>
                  <p className="text-red-800 dark:text-red-200 text-sm mb-3">
                    If you're having thoughts of self-harm or suicide, please reach out for immediate help:
                  </p>
                  <div className="space-y-1 text-sm text-red-800 dark:text-red-200">
                    <div>• National Suicide Prevention Lifeline: <strong>988</strong></div>
                    <div>• Crisis Text Line: <strong>Text HOME to 741741</strong></div>
                    <div>• Campus Emergency: <strong>911</strong></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="text-center mt-8">
        <p className="text-sm text-muted-foreground">
          Remember: Taking this assessment is a positive step toward understanding and improving your mental health.
          You're not alone, and support is always available.
        </p>
      </div>
    </div>
  );
}
