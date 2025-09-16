import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/lib/supabase/server';

// Debug logging utility
const debugLog = (message: string, data?: any) => {
  console.log(`[CHAT-API] ${new Date().toISOString()} - ${message}`);
  if (data) {
    console.log('[CHAT-API] Data:', JSON.stringify(data, null, 2));
  }
};

// Validate environment variables
const validateEnv = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  debugLog('Environment validation', {
    hasApiKey: !!apiKey,
    apiKeyLength: apiKey?.length || 0,
    apiKeyPrefix: apiKey?.substring(0, 10) + '...' || 'undefined'
  });
  return apiKey;
};

const apiKey = validateEnv();
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Fallback AI response generator if Gemini fails
const generateFallbackResponse = (userMessage: string, chatHistory: any[] = []) => {
  const lowerMessage = userMessage.toLowerCase();
  
  const responses = {
    greeting: [
      "Hello! I'm here to support you. How are you feeling today?",
      "Hi there! I'm glad you reached out. What's on your mind?",
      "Welcome! I'm here to listen and help. How can I support you today?"
    ],
    anxiety: [
      "I understand you're feeling anxious. Try taking slow, deep breaths. Breathe in for 4 counts, hold for 4, then exhale for 6. This can help calm your nervous system.",
      "Anxiety can be overwhelming. Remember that this feeling will pass. Have you tried grounding techniques like naming 5 things you can see, 4 you can hear, 3 you can touch?",
      "It's okay to feel anxious - you're not alone in this. Consider talking to a counselor through our ticket system for additional support and coping strategies."
    ],
    depression: [
      "I hear that you're struggling, and I want you to know that your feelings are valid. Depression is treatable, and reaching out shows strength.",
      "Thank you for sharing with me. Small steps can make a big difference - even getting out of bed or taking a shower can be an achievement when you're depressed.",
      "You don't have to face this alone. Consider creating a support ticket to connect with one of our counselors who can provide professional guidance."
    ],
    stress: [
      "Stress can feel overwhelming. Try breaking down your tasks into smaller, manageable pieces. What's one small thing you could accomplish today?",
      "I understand you're feeling stressed. Remember to take breaks and practice self-care. Even 5 minutes of deep breathing or a short walk can help.",
      "Stress is your body's way of responding to challenges. Consider time management techniques or talking to a counselor about healthy coping strategies."
    ],
    support: [
      "I'm here to listen and support you. You've taken a brave step by reaching out. What would be most helpful for you right now?",
      "Thank you for trusting me with your feelings. Remember that seeking help is a sign of strength, not weakness.",
      "You matter, and your wellbeing is important. I'm here to help you navigate through this. What support do you need today?"
    ]
  };

  // Simple keyword matching
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
  } else if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety') || lowerMessage.includes('worried') || lowerMessage.includes('panic')) {
    return responses.anxiety[Math.floor(Math.random() * responses.anxiety.length)];
  } else if (lowerMessage.includes('depressed') || lowerMessage.includes('depression') || lowerMessage.includes('sad') || lowerMessage.includes('hopeless')) {
    return responses.depression[Math.floor(Math.random() * responses.depression.length)];
  } else if (lowerMessage.includes('stress') || lowerMessage.includes('overwhelmed') || lowerMessage.includes('pressure')) {
    return responses.stress[Math.floor(Math.random() * responses.stress.length)];
  } else {
    return responses.support[Math.floor(Math.random() * responses.support.length)];
  }
};

export async function POST(request: NextRequest) {
  try {
    debugLog('POST request received');
    
    const { message, sessionId, userId } = await request.json();
    
    debugLog('Request payload', { 
      messageLength: message?.length || 0,
      sessionId: sessionId?.substring(0, 8) + '...' || 'undefined',
      userId: userId?.substring(0, 8) + '...' || 'undefined'
    });

    if (!message || !sessionId || !userId) {
      debugLog('Missing required parameters', { message: !!message, sessionId: !!sessionId, userId: !!userId });
      return NextResponse.json(
        { error: 'Message, sessionId, and userId are required' },
        { status: 400 }
      );
    }

    debugLog('Initializing Supabase client');
    const supabase = await createClient();

    // Save user message to database
    const { error: userMessageError } = await supabase
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        user_id: userId,
        message: message,
        sender: 'user',
        created_at: new Date().toISOString()
      });

    if (userMessageError) {
      debugLog('Error saving user message', userMessageError);
    } else {
      debugLog('User message saved successfully');
    }

    // Get chat history for context
    debugLog('Fetching chat history');
    const { data: chatHistory, error: historyError } = await supabase
      .from('chat_messages')
      .select('message, sender, created_at')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(10);

    if (historyError) {
      debugLog('Error fetching chat history', historyError);
    } else {
      debugLog('Chat history fetched', { messageCount: chatHistory?.length || 0 });
    }

    // Generate AI response using Gemini
    let aiResponse: string = '';
    
    if (!genAI) {
      debugLog('Gemini API not available (no API key), using fallback');
      aiResponse = generateFallbackResponse(message, chatHistory || []);
    } else {
      try {
        debugLog('Attempting Gemini API call');
        
        // Prepare context for Gemini
        const contextMessages = chatHistory?.map((msg: any) => 
          `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.message}`
        ).join('\n') || '';

        debugLog('Context prepared', { contextLength: contextMessages.length });

        const systemPrompt = `You are SoulRoute AI, a compassionate mental health support assistant for a campus mental health platform. Your role is to:

1. Provide emotional support and guidance to students
2. Offer coping strategies and mental health resources
3. Help users understand when to seek professional help
4. Be empathetic, non-judgmental, and supportive
5. Never provide medical diagnoses or replace professional therapy
6. Encourage users to create support tickets for counselor sessions when needed
7. Keep responses concise but caring (2-3 sentences typically)

Guidelines:
- Always be warm, understanding, and supportive
- Use encouraging language and validate feelings
- Suggest practical coping strategies when appropriate
- Recommend professional help for serious concerns
- Mention the ticket system for counselor support when relevant
- Be culturally sensitive and inclusive

Previous conversation context:
${contextMessages}

Current user message: ${message}

Respond as SoulRoute AI with empathy and helpful guidance:`;

        // Retry logic for API calls
        const maxRetries = 3;
        let retryCount = 0;
        
        while (retryCount < maxRetries) {
          try {
            // Generate response using Gemini
            const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
            debugLog(`Calling Gemini API with model: gemini-2.0-flash (attempt ${retryCount + 1}/${maxRetries})`);
            
            const result = await model.generateContent(systemPrompt);
            aiResponse = result.response.text();
            
            debugLog('Gemini API response received', { responseLength: aiResponse.length });
            break; // Success, exit retry loop
            
          } catch (retryError: any) {
            retryCount++;
            debugLog(`Gemini API attempt ${retryCount} failed`, {
              errorMessage: retryError.message,
              errorStatus: retryError.status,
              errorStatusText: retryError.statusText
            });
            
            // If it's a 503 (Service Unavailable) and we have retries left, wait and retry
            if (retryError.status === 503 && retryCount < maxRetries) {
              const waitTime = Math.pow(2, retryCount) * 1000; // Exponential backoff: 2s, 4s, 8s
              debugLog(`Waiting ${waitTime}ms before retry due to service overload`);
              await new Promise(resolve => setTimeout(resolve, waitTime));
              continue;
            }
            
            // If we've exhausted retries or it's not a 503 error, throw the error
            throw retryError;
          }
        }
        
      } catch (error: any) {
        debugLog('Gemini API error, using fallback', {
          errorMessage: error.message,
          errorStatus: error.status,
          errorStatusText: error.statusText,
          errorDetails: error.errorDetails
        });
        
        // Use fallback response if Gemini fails
        aiResponse = generateFallbackResponse(message, chatHistory || []);
      }
    }

    // Save AI response to database
    debugLog('Saving AI response to database');
    const { error: aiMessageError } = await supabase
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        user_id: userId,
        message: aiResponse,
        sender: 'ai',
        created_at: new Date().toISOString()
      });

    if (aiMessageError) {
      debugLog('Error saving AI message', aiMessageError);
    } else {
      debugLog('AI message saved successfully');
    }

    debugLog('Request completed successfully', { 
      responseLength: aiResponse.length,
      usedFallback: !genAI || aiResponse.includes('I understand') // Simple heuristic
    });

    return NextResponse.json({ 
      response: aiResponse,
      success: true,
      debug: {
        usedGemini: !!genAI,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    debugLog('Critical error in chat API', {
      errorMessage: error.message,
      errorStack: error.stack,
      errorName: error.name
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to process chat message',
        debug: {
          timestamp: new Date().toISOString(),
          errorType: error.name || 'Unknown'
        }
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    debugLog('GET request received for chat history');
    
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const userId = searchParams.get('userId');

    debugLog('GET request parameters', {
      sessionId: sessionId?.substring(0, 8) + '...' || 'undefined',
      userId: userId?.substring(0, 8) + '...' || 'undefined'
    });

    if (!sessionId || !userId) {
      debugLog('Missing required parameters for GET request');
      return NextResponse.json(
        { error: 'SessionId and userId are required' },
        { status: 400 }
      );
    }

    debugLog('Initializing Supabase client for GET request');
    const supabase = await createClient();

    // Get chat history
    debugLog('Fetching chat messages from database');
    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      debugLog('Error fetching chat history', error);
      return NextResponse.json(
        { 
          error: 'Failed to fetch chat history',
          debug: {
            timestamp: new Date().toISOString(),
            errorDetails: error
          }
        },
        { status: 500 }
      );
    }

    debugLog('Chat history fetched successfully', { 
      messageCount: messages?.length || 0,
      sessionId: sessionId.substring(0, 8) + '...'
    });

    return NextResponse.json({ 
      messages,
      debug: {
        messageCount: messages?.length || 0,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    debugLog('Critical error in GET chat history', {
      errorMessage: error.message,
      errorStack: error.stack,
      errorName: error.name
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch chat history',
        debug: {
          timestamp: new Date().toISOString(),
          errorType: error.name || 'Unknown'
        }
      },
      { status: 500 }
    );
  }
}
