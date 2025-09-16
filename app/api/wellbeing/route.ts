import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Debug logging utility
const debugLog = (message: string, data?: any) => {
  console.log(`[WELLBEING-API] ${new Date().toISOString()} - ${message}`);
  if (data) {
    console.log('[WELLBEING-API] Data:', JSON.stringify(data, null, 2));
  }
};

// Assessment scoring functions
const calculatePHQ9Score = (responses: number[]) => {
  const score = responses.reduce((sum, response) => sum + response, 0);
  let category = '';
  if (score <= 4) category = 'Minimal';
  else if (score <= 9) category = 'Mild';
  else if (score <= 14) category = 'Moderate';
  else if (score <= 19) category = 'Moderately Severe';
  else category = 'Severe';
  
  return { score, category, maxScore: 27, severityLevel: Math.floor(score / 7) };
};

const calculateGAD7Score = (responses: number[]) => {
  const score = responses.reduce((sum, response) => sum + response, 0);
  let category = '';
  if (score <= 4) category = 'Minimal';
  else if (score <= 9) category = 'Mild';
  else if (score <= 14) category = 'Moderate';
  else category = 'Severe';
  
  return { score, category, maxScore: 21, severityLevel: Math.floor(score / 5) };
};

const calculatePSS10Score = (responses: number[]) => {
  // Reverse scoring for items 4, 5, 7, 8 (0-based indices: 3, 4, 6, 7)
  const reverseItems = [3, 4, 6, 7];
  const adjustedResponses = responses.map((response, index) => 
    reverseItems.includes(index) ? 4 - response : response
  );
  
  const score = adjustedResponses.reduce((sum, response) => sum + response, 0);
  let category = '';
  if (score <= 13) category = 'Low';
  else if (score <= 26) category = 'Moderate';
  else category = 'High';
  
  return { score, category, maxScore: 40, severityLevel: Math.floor(score / 14) };
};

const calculateGHQ12Score = (responses: number[]) => {
  // GHQ-12 uses binary scoring (0-0-1-1) for each item
  const binaryScore = responses.reduce((sum, response) => 
    sum + (response >= 2 ? 1 : 0), 0
  );
  
  let category = '';
  if (binaryScore <= 2) category = 'No distress';
  else if (binaryScore <= 5) category = 'Possible distress';
  else category = 'Probable distress';
  
  return { score: binaryScore, category, maxScore: 12, severityLevel: Math.floor(binaryScore / 3) };
};

const calculateOverallCategory = (scores: any) => {
  const { phq9, gad7, pss10, ghq12 } = scores;
  
  // Crisis indicators
  if (phq9.score >= 20 || gad7.score >= 15 || pss10.score >= 35 || ghq12.score >= 10) {
    return 'CRISIS_ALERT';
  }
  
  // Count high severity scores
  let highCount = 0;
  if (phq9.score >= 15) highCount++;
  if (gad7.score >= 10) highCount++;
  if (pss10.score >= 27) highCount++;
  if (ghq12.score >= 7) highCount++;
  
  // Count moderate severity scores
  let moderateCount = 0;
  if (phq9.score >= 10) moderateCount++;
  if (gad7.score >= 5) moderateCount++;
  if (pss10.score >= 20) moderateCount++;
  if (ghq12.score >= 4) moderateCount++;
  
  if (highCount >= 2) return 'HIGH';
  if (highCount >= 1 || moderateCount >= 3) return 'MODERATE';
  return 'LOW';
};

const checkSafetyFlag = (phq9Responses: number[]) => {
  // Check PHQ-9 question 9 (suicidal ideation) - index 8
  return phq9Responses.length >= 9 && phq9Responses[8] > 0;
};

// POST - Submit assessment responses
export async function POST(request: NextRequest) {
  try {
    debugLog('POST request received for wellbeing assessment');
    
    const { phq9, gad7, pss10, ghq12, userId } = await request.json();
    
    debugLog('Assessment data received', {
      userId: userId?.substring(0, 8) + '...',
      phq9Length: phq9?.length,
      gad7Length: gad7?.length,
      pss10Length: pss10?.length,
      ghq12Length: ghq12?.length
    });

    if (!phq9 || !gad7 || !pss10 || !ghq12 || !userId) {
      debugLog('Missing required assessment data');
      return NextResponse.json(
        { error: 'All assessment responses and userId are required' },
        { status: 400 }
      );
    }

    debugLog('Initializing Supabase client');
    const supabase = await createClient();

    // Check if user is a student and can take assessment
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      debugLog('User not found', userError);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (userData.role !== 'student') {
      debugLog('Access denied - user is not a student', { role: userData.role });
      return NextResponse.json(
        { error: 'Wellbeing assessments are only available to students' },
        { status: 403 }
      );
    }

    // Check cooldown period using database function
    const { data: canTakeResult, error: cooldownError } = await supabase
      .rpc('can_take_assessment', { user_uuid: userId });

    if (cooldownError) {
      debugLog('Error checking assessment cooldown', cooldownError);
      return NextResponse.json(
        { error: 'Failed to check assessment eligibility' },
        { status: 500 }
      );
    }

    if (!canTakeResult) {
      // Get days remaining until next assessment
      const { data: daysRemaining } = await supabase
        .rpc('days_until_next_assessment', { user_uuid: userId });

      debugLog('Assessment blocked by cooldown', { daysRemaining });
      return NextResponse.json(
        { 
          error: 'Assessment cooldown active',
          message: `You can take your next assessment in ${daysRemaining || 'a few'} days. Assessments are limited to once per week to track meaningful changes.`,
          daysRemaining: daysRemaining || 0,
          canRetake: false
        },
        { status: 429 }
      );
    }

    debugLog('User eligible for assessment - proceeding');

    // Calculate scores
    const scores = {
      phq9: calculatePHQ9Score(phq9),
      gad7: calculateGAD7Score(gad7),
      pss10: calculatePSS10Score(pss10),
      ghq12: calculateGHQ12Score(ghq12)
    };

    const overallCategory = calculateOverallCategory(scores);
    const safetyFlag = checkSafetyFlag(phq9);

    debugLog('Scores calculated', { scores, overallCategory, safetyFlag });

    // Create session
    const { data: session, error: sessionError } = await supabase
      .from('wellbeing_sessions')
      .insert({
        user_id: userId,
        session_status: 'completed',
        completed_at: new Date().toISOString(),
        overall_category: overallCategory,
        safety_flag: safetyFlag
      })
      .select()
      .single();

    if (sessionError) {
      debugLog('Error creating session', sessionError);
      return NextResponse.json(
        { error: 'Failed to create assessment session' },
        { status: 500 }
      );
    }

    debugLog('Session created', { sessionId: session.id });

    // Save individual responses
    const allResponses = [
      ...phq9.map((response: number, index: number) => ({
        session_id: session.id,
        assessment_type: 'phq9',
        question_index: index,
        response_value: response
      })),
      ...gad7.map((response: number, index: number) => ({
        session_id: session.id,
        assessment_type: 'gad7',
        question_index: index,
        response_value: response
      })),
      ...pss10.map((response: number, index: number) => ({
        session_id: session.id,
        assessment_type: 'pss10',
        question_index: index,
        response_value: response
      })),
      ...ghq12.map((response: number, index: number) => ({
        session_id: session.id,
        assessment_type: 'ghq12',
        question_index: index,
        response_value: response
      }))
    ];

    const { error: responsesError } = await supabase
      .from('assessment_responses')
      .insert(allResponses);

    if (responsesError) {
      debugLog('Error saving responses', responsesError);
    } else {
      debugLog('Responses saved successfully');
    }

    // Save calculated scores
    const scoreInserts = Object.entries(scores).map(([type, scoreData]) => ({
      session_id: session.id,
      assessment_type: type,
      raw_score: scoreData.score,
      max_score: scoreData.maxScore,
      category: scoreData.category,
      severity_level: scoreData.severityLevel
    }));

    const { error: scoresError } = await supabase
      .from('assessment_scores')
      .insert(scoreInserts);

    if (scoresError) {
      debugLog('Error saving scores', scoresError);
    } else {
      debugLog('Scores saved successfully');
    }

    // Generate recommendations based on results
    const recommendations = generateRecommendations(overallCategory, safetyFlag, scores);
    
    if (recommendations.length > 0) {
      const recommendationInserts = recommendations.map(rec => ({
        session_id: session.id,
        recommendation_type: rec.type,
        title: rec.title,
        description: rec.description,
        priority: rec.priority,
        action_url: rec.actionUrl,
        is_urgent: rec.isUrgent
      }));

      const { error: recommendationsError } = await supabase
        .from('assessment_recommendations')
        .insert(recommendationInserts);

      if (recommendationsError) {
        debugLog('Error saving recommendations', recommendationsError);
      } else {
        debugLog('Recommendations saved successfully');
      }
    }

    debugLog('Assessment processing completed successfully');

    return NextResponse.json({
      sessionId: session.id,
      scores,
      overallCategory,
      safetyFlag,
      recommendations,
      success: true
    });

  } catch (error: any) {
    debugLog('Critical error in wellbeing assessment', {
      errorMessage: error.message,
      errorStack: error.stack
    });
    
    return NextResponse.json(
      { error: 'Failed to process assessment' },
      { status: 500 }
    );
  }
}

// GET - Retrieve assessment results
export async function GET(request: NextRequest) {
  try {
    debugLog('GET request received for assessment results');
    
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const userId = searchParams.get('userId');

    debugLog('GET parameters', {
      sessionId: sessionId?.substring(0, 8) + '...',
      userId: userId?.substring(0, 8) + '...'
    });

    if (!sessionId || !userId) {
      debugLog('Missing required parameters');
      return NextResponse.json(
        { error: 'SessionId and userId are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get session data
    const { data: session, error: sessionError } = await supabase
      .from('wellbeing_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', userId)
      .single();

    if (sessionError || !session) {
      debugLog('Session not found', sessionError);
      return NextResponse.json(
        { error: 'Assessment session not found' },
        { status: 404 }
      );
    }

    // Get scores
    const { data: scores, error: scoresError } = await supabase
      .from('assessment_scores')
      .select('*')
      .eq('session_id', sessionId);

    if (scoresError) {
      debugLog('Error fetching scores', scoresError);
      return NextResponse.json(
        { error: 'Failed to fetch assessment scores' },
        { status: 500 }
      );
    }

    // Get recommendations
    const { data: recommendations, error: recommendationsError } = await supabase
      .from('assessment_recommendations')
      .select('*')
      .eq('session_id', sessionId)
      .order('priority');

    if (recommendationsError) {
      debugLog('Error fetching recommendations', recommendationsError);
    }

    // Format scores for frontend
    const formattedScores = scores.reduce((acc: any, score) => {
      acc[score.assessment_type] = {
        score: score.raw_score,
        maxScore: score.max_score,
        category: score.category,
        percentage: score.percentage
      };
      return acc;
    }, {});

    debugLog('Assessment results retrieved successfully');

    return NextResponse.json({
      session,
      scores: formattedScores,
      recommendations: recommendations || [],
      success: true
    });

  } catch (error: any) {
    debugLog('Critical error fetching assessment results', {
      errorMessage: error.message,
      errorStack: error.stack
    });
    
    return NextResponse.json(
      { error: 'Failed to fetch assessment results' },
      { status: 500 }
    );
  }
}

// Helper function to generate recommendations
function generateRecommendations(overallCategory: string, safetyFlag: boolean, scores: any) {
  const recommendations = [];

  if (safetyFlag || overallCategory === 'CRISIS_ALERT') {
    recommendations.push({
      type: 'immediate',
      title: 'Immediate Crisis Support',
      description: 'Connect with a crisis counselor right now for immediate support.',
      priority: 1,
      actionUrl: '/tickets/create?urgent=true',
      isUrgent: true
    });
    
    recommendations.push({
      type: 'emergency',
      title: 'Emergency Resources',
      description: 'Access 24/7 crisis hotlines and emergency contacts.',
      priority: 1,
      actionUrl: '/resources/emergency',
      isUrgent: true
    });
  }

  if (overallCategory === 'HIGH' || overallCategory === 'CRISIS_ALERT') {
    recommendations.push({
      type: 'counseling',
      title: 'Schedule Counseling Session',
      description: 'Book an appointment with a licensed mental health counselor.',
      priority: 2,
      actionUrl: '/tickets/create',
      isUrgent: overallCategory === 'CRISIS_ALERT'
    });
  }

  if (overallCategory === 'MODERATE' || overallCategory === 'HIGH') {
    recommendations.push({
      type: 'resources',
      title: 'Mental Health Resources',
      description: 'Explore self-help tools, coping strategies, and educational materials.',
      priority: 3,
      actionUrl: '/resources',
      isUrgent: false
    });
    
    recommendations.push({
      type: 'support',
      title: 'Peer Support Groups',
      description: 'Connect with others who understand what you\'re going through.',
      priority: 4,
      actionUrl: '/peer-support',
      isUrgent: false
    });
  }

  if (overallCategory === 'LOW') {
    recommendations.push({
      type: 'wellness',
      title: 'Maintain Your Wellbeing',
      description: 'Continue building healthy habits and resilience skills.',
      priority: 3,
      actionUrl: '/resources/wellness',
      isUrgent: false
    });
    
    recommendations.push({
      type: 'prevention',
      title: 'Preventive Care',
      description: 'Learn about maintaining good mental health and preventing future issues.',
      priority: 4,
      actionUrl: '/resources/prevention',
      isUrgent: false
    });
  }

  return recommendations;
}
