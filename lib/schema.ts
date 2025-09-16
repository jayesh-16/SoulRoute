import { z } from "zod";

export const newsletterSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Invalid email." }),
});

export type NewsletterSchema = z.infer<typeof newsletterSchema>;

// Wellbeing Assessment Schemas
export const screeningSessionSchema = z.object({
  phq9: z.array(z.number().min(0).max(3)).length(9),
  gad7: z.array(z.number().min(0).max(3)).length(7),
  pss10: z.array(z.number().min(0).max(4)).length(10),
  ghq12: z.array(z.number().min(0).max(3)).length(12),
  completedAt: z.string().datetime(),
});

export type ScreeningSessionSchema = z.infer<typeof screeningSessionSchema>;

export const assessmentScoreSchema = z.object({
  score: z.number(),
  category: z.string(),
  maxScore: z.number(),
  percentage: z.number().optional(),
});

export type AssessmentScore = z.infer<typeof assessmentScoreSchema>;

export const scoreBreakdownSchema = z.object({
  phq9: assessmentScoreSchema,
  gad7: assessmentScoreSchema,
  pss10: assessmentScoreSchema,
  ghq12: assessmentScoreSchema,
  overall: z.enum(['LOW', 'MODERATE', 'HIGH', 'CRISIS_ALERT']),
  safetyFlag: z.boolean(),
});

export type ScoreBreakdown = z.infer<typeof scoreBreakdownSchema>;

export const wellbeingSessionSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  session_status: z.enum(['in_progress', 'completed', 'abandoned']),
  started_at: z.string().datetime(),
  completed_at: z.string().datetime().optional(),
  overall_category: z.enum(['LOW', 'MODERATE', 'HIGH', 'CRISIS_ALERT']).optional(),
  safety_flag: z.boolean().default(false),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type WellbeingSession = z.infer<typeof wellbeingSessionSchema>;

export const assessmentRecommendationSchema = z.object({
  id: z.string().uuid(),
  session_id: z.string().uuid(),
  recommendation_type: z.string(),
  title: z.string(),
  description: z.string(),
  priority: z.number(),
  action_url: z.string().optional(),
  is_urgent: z.boolean().default(false),
  created_at: z.string().datetime(),
});

export type AssessmentRecommendation = z.infer<typeof assessmentRecommendationSchema>;
