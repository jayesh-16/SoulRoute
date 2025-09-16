// Assessment scoring utilities for mental health screenings
// Based on validated clinical assessment tools

export interface AssessmentScore {
  score: number;
  category: string;
  maxScore: number;
  severityLevel: number;
}

export interface ScoreBreakdown {
  phq9: AssessmentScore;
  gad7: AssessmentScore;
  pss10: AssessmentScore;
  ghq12: AssessmentScore;
  overall: 'LOW' | 'MODERATE' | 'HIGH' | 'CRISIS_ALERT';
  safetyFlag: boolean;
}

/**
 * Calculate PHQ-9 (Patient Health Questionnaire) score for depression screening
 * @param responses Array of 9 responses (0-3 scale)
 * @returns Calculated score with category and severity
 */
export function calculatePHQ9Score(responses: number[]): AssessmentScore {
  if (responses.length !== 9) {
    throw new Error('PHQ-9 requires exactly 9 responses');
  }

  const score = responses.reduce((sum, response) => sum + response, 0);
  let category = '';
  let severityLevel = 0;

  if (score <= 4) {
    category = 'Minimal';
    severityLevel = 0;
  } else if (score <= 9) {
    category = 'Mild';
    severityLevel = 1;
  } else if (score <= 14) {
    category = 'Moderate';
    severityLevel = 2;
  } else if (score <= 19) {
    category = 'Moderately Severe';
    severityLevel = 3;
  } else {
    category = 'Severe';
    severityLevel = 4;
  }

  return { score, category, maxScore: 27, severityLevel };
}

/**
 * Calculate GAD-7 (Generalized Anxiety Disorder) score
 * @param responses Array of 7 responses (0-3 scale)
 * @returns Calculated score with category and severity
 */
export function calculateGAD7Score(responses: number[]): AssessmentScore {
  if (responses.length !== 7) {
    throw new Error('GAD-7 requires exactly 7 responses');
  }

  const score = responses.reduce((sum, response) => sum + response, 0);
  let category = '';
  let severityLevel = 0;

  if (score <= 4) {
    category = 'Minimal';
    severityLevel = 0;
  } else if (score <= 9) {
    category = 'Mild';
    severityLevel = 1;
  } else if (score <= 14) {
    category = 'Moderate';
    severityLevel = 2;
  } else {
    category = 'Severe';
    severityLevel = 3;
  }

  return { score, category, maxScore: 21, severityLevel };
}

/**
 * Calculate PSS-10 (Perceived Stress Scale) score
 * @param responses Array of 10 responses (0-4 scale)
 * @returns Calculated score with category and severity
 */
export function calculatePSS10Score(responses: number[]): AssessmentScore {
  if (responses.length !== 10) {
    throw new Error('PSS-10 requires exactly 10 responses');
  }

  // Reverse scoring for items 4, 5, 7, 8 (0-based indices: 3, 4, 6, 7)
  const reverseItems = [3, 4, 6, 7];
  const adjustedResponses = responses.map((response, index) => 
    reverseItems.includes(index) ? 4 - response : response
  );

  const score = adjustedResponses.reduce((sum, response) => sum + response, 0);
  let category = '';
  let severityLevel = 0;

  if (score <= 13) {
    category = 'Low';
    severityLevel = 0;
  } else if (score <= 26) {
    category = 'Moderate';
    severityLevel = 1;
  } else {
    category = 'High';
    severityLevel = 2;
  }

  return { score, category, maxScore: 40, severityLevel };
}

/**
 * Calculate GHQ-12 (General Health Questionnaire) score
 * @param responses Array of 12 responses (0-3 scale)
 * @returns Calculated score with category and severity
 */
export function calculateGHQ12Score(responses: number[]): AssessmentScore {
  if (responses.length !== 12) {
    throw new Error('GHQ-12 requires exactly 12 responses');
  }

  // GHQ-12 uses binary scoring (0-0-1-1) for each item
  const binaryScore = responses.reduce((sum, response) => 
    sum + (response >= 2 ? 1 : 0), 0
  );

  let category = '';
  let severityLevel = 0;

  if (binaryScore <= 2) {
    category = 'No distress';
    severityLevel = 0;
  } else if (binaryScore <= 5) {
    category = 'Possible distress';
    severityLevel = 1;
  } else {
    category = 'Probable distress';
    severityLevel = 2;
  }

  return { score: binaryScore, category, maxScore: 12, severityLevel };
}

/**
 * Calculate overall risk category based on all assessment scores
 * @param scores Object containing all four assessment scores
 * @returns Overall category (LOW, MODERATE, HIGH, CRISIS_ALERT)
 */
export function calculateOverallCategory(scores: {
  phq9: AssessmentScore;
  gad7: AssessmentScore;
  pss10: AssessmentScore;
  ghq12: AssessmentScore;
}): 'LOW' | 'MODERATE' | 'HIGH' | 'CRISIS_ALERT' {
  const { phq9, gad7, pss10, ghq12 } = scores;

  // Crisis indicators - any severe score triggers crisis alert
  if (phq9.score >= 20 || gad7.score >= 15 || pss10.score >= 35 || ghq12.score >= 10) {
    return 'CRISIS_ALERT';
  }

  // Count high severity scores
  let highCount = 0;
  if (phq9.score >= 15) highCount++; // Moderately severe depression
  if (gad7.score >= 10) highCount++; // Moderate-severe anxiety
  if (pss10.score >= 27) highCount++; // High stress
  if (ghq12.score >= 7) highCount++;  // Probable distress

  // Count moderate severity scores
  let moderateCount = 0;
  if (phq9.score >= 10) moderateCount++; // Moderate depression
  if (gad7.score >= 5) moderateCount++;  // Mild-moderate anxiety
  if (pss10.score >= 20) moderateCount++; // Moderate stress
  if (ghq12.score >= 4) moderateCount++; // Possible distress

  // Determine overall category
  if (highCount >= 2) {
    return 'HIGH';
  } else if (highCount >= 1 || moderateCount >= 3) {
    return 'MODERATE';
  } else {
    return 'LOW';
  }
}

/**
 * Check for safety flags (suicidal ideation, self-harm risk)
 * @param phq9Responses Array of PHQ-9 responses
 * @returns Boolean indicating if safety flag should be raised
 */
export function checkSafetyFlag(phq9Responses: number[]): boolean {
  if (phq9Responses.length < 9) {
    return false;
  }

  // Check PHQ-9 question 9 (suicidal ideation) - index 8
  // Any response > 0 indicates some level of suicidal thoughts
  return phq9Responses[8] > 0;
}

/**
 * Calculate complete assessment results
 * @param responses Object containing all assessment responses
 * @returns Complete score breakdown with overall category and safety flag
 */
export function calculateAssessmentResults(responses: {
  phq9: number[];
  gad7: number[];
  pss10: number[];
  ghq12: number[];
}): ScoreBreakdown {
  const scores = {
    phq9: calculatePHQ9Score(responses.phq9),
    gad7: calculateGAD7Score(responses.gad7),
    pss10: calculatePSS10Score(responses.pss10),
    ghq12: calculateGHQ12Score(responses.ghq12)
  };

  const overall = calculateOverallCategory(scores);
  const safetyFlag = checkSafetyFlag(responses.phq9);

  return {
    ...scores,
    overall,
    safetyFlag
  };
}

/**
 * Get severity level description
 * @param severityLevel Numeric severity level (0-4)
 * @returns Human-readable severity description
 */
export function getSeverityDescription(severityLevel: number): string {
  switch (severityLevel) {
    case 0: return 'Minimal';
    case 1: return 'Mild';
    case 2: return 'Moderate';
    case 3: return 'Severe';
    case 4: return 'Crisis';
    default: return 'Unknown';
  }
}

/**
 * Get color coding for severity levels (for UI components)
 * @param severityLevel Numeric severity level
 * @returns Color variant string
 */
export function getSeverityColor(severityLevel: number): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (severityLevel) {
    case 0: return 'outline';
    case 1: return 'default';
    case 2: return 'secondary';
    case 3:
    case 4: return 'destructive';
    default: return 'outline';
  }
}
