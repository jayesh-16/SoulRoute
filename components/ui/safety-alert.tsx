"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  ExclamationTriangleIcon, 
  Cross2Icon,
  ChatBubbleIcon,
  EnvelopeClosedIcon,
  HeartIcon
} from '@radix-ui/react-icons';
import { Phone } from 'lucide-react';

interface SafetyAlertProps {
  onContactCounselor: () => void;
  onEmailSupport: () => void;
  onViewEmergencyContacts: () => void;
  onClose?: () => void;
}

export function SafetyAlert({ 
  onContactCounselor, 
  onEmailSupport, 
  onViewEmergencyContacts,
  onClose 
}: SafetyAlertProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-2xl"
      >
        <Card className="border-2 border-red-200 dark:border-red-800 bg-card shadow-2xl">
          <CardHeader className="relative">
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="absolute right-4 top-4 h-8 w-8 p-0"
              >
                <Cross2Icon className="h-4 w-4" />
              </Button>
            )}
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
                <ExclamationTriangleIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <Badge variant="destructive" className="mb-2">
                  Crisis Alert
                </Badge>
                <CardTitle className="text-2xl text-red-900 dark:text-red-100">
                  Immediate Support Available
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Alert className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
              <HeartIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
              <AlertDescription className="text-red-800 dark:text-red-200">
                <strong>Your responses indicate you may be experiencing significant distress.</strong>
                <br />
                You don't have to face this alone. Professional support is available right now.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-foreground">
                Get immediate help:
              </h3>
              
              <div className="grid gap-3">
                <Button
                  onClick={onContactCounselor}
                  className="w-full h-auto p-4 bg-primary hover:bg-primary/90"
                >
                  <div className="flex items-center gap-3 w-full">
                    <ChatBubbleIcon className="w-5 h-5" />
                    <div className="text-left flex-1">
                      <div className="font-semibold">Connect with a Counselor</div>
                      <div className="text-sm opacity-90">Start a confidential chat session now</div>
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={onEmailSupport}
                  variant="ghost"
                  className="w-full h-auto p-4 border-2"
                >
                  <div className="flex items-center gap-3 w-full">
                    <EnvelopeClosedIcon className="w-5 h-5" />
                    <div className="text-left flex-1">
                      <div className="font-semibold">Email Support Team</div>
                      <div className="text-sm text-muted-foreground">Get personalized guidance via email</div>
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={onViewEmergencyContacts}
                  variant="ghost"
                  className="w-full h-auto p-4 border-2 border-red-200 dark:border-red-800"
                >
                  <div className="flex items-center gap-3 w-full">
                    <Phone className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <div className="text-left flex-1">
                      <div className="font-semibold text-red-700 dark:text-red-300">Emergency Contacts</div>
                      <div className="text-sm text-red-600 dark:text-red-400">Crisis hotlines and immediate help</div>
                    </div>
                  </div>
                </Button>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Crisis Resources (24/7):
              </h4>
              <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <div className="flex justify-between">
                  <span>National Suicide Prevention Lifeline:</span>
                  <span className="font-mono">988</span>
                </div>
                <div className="flex justify-between">
                  <span>Crisis Text Line:</span>
                  <span className="font-mono">Text HOME to 741741</span>
                </div>
                <div className="flex justify-between">
                  <span>Emergency Services:</span>
                  <span className="font-mono">911</span>
                </div>
              </div>
            </div>

            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground">
                Your safety and wellbeing are our top priority. These resources are confidential and available anytime.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
