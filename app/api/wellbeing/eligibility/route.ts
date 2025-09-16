import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Debug logging utility
const debugLog = (message: string, data?: any) => {
  console.log(`[WELLBEING-ELIGIBILITY-API] ${new Date().toISOString()} - ${message}`);
  if (data) {
    console.log('[WELLBEING-ELIGIBILITY-API] Data:', JSON.stringify(data, null, 2));
  }
};

// GET - Check if user can take assessment
export async function GET(request: NextRequest) {
  try {
    debugLog('GET request received for assessment eligibility check');
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    debugLog('GET parameters', {
      userId: userId?.substring(0, 8) + '...'
    });

    if (!userId) {
      debugLog('Missing userId parameter');
      return NextResponse.json(
        { error: 'UserId is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if user is a student
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
      debugLog('User is not a student', { role: userData.role });
      return NextResponse.json({
        canTakeAssessment: false,
        reason: 'not_student',
        message: 'Wellbeing assessments are only available to students',
        daysRemaining: null,
        lastAssessmentDate: null
      });
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

    // Get days remaining and last assessment date
    const { data: daysRemaining } = await supabase
      .rpc('days_until_next_assessment', { user_uuid: userId });

    // Get last assessment date
    const { data: lastSession } = await supabase
      .from('wellbeing_sessions')
      .select('completed_at')
      .eq('user_id', userId)
      .eq('session_status', 'completed')
      .not('completed_at', 'is', null)
      .order('completed_at', { ascending: false })
      .limit(1)
      .single();

    const response = {
      canTakeAssessment: canTakeResult,
      reason: canTakeResult ? 'eligible' : 'cooldown_active',
      message: canTakeResult 
        ? 'You are eligible to take the wellbeing assessment'
        : `You can take your next assessment in ${daysRemaining || 'a few'} days. Assessments are limited to once per week to track meaningful changes.`,
      daysRemaining: daysRemaining || 0,
      lastAssessmentDate: lastSession?.completed_at || null,
      isStudent: true
    };

    debugLog('Eligibility check completed', response);

    return NextResponse.json(response);

  } catch (error: any) {
    debugLog('Critical error in eligibility check', {
      errorMessage: error.message,
      errorStack: error.stack
    });
    
    return NextResponse.json(
      { error: 'Failed to check assessment eligibility' },
      { status: 500 }
    );
  }
}
