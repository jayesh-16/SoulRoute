"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Background } from "@/components/background";
import Link from "next/link";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const supabase = createClient();
        
        // Get the code from URL parameters
        const code = searchParams.get('code');
        
        if (code) {
          // Exchange the code for a session
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          
          if (error) {
            console.error('Auth callback error:', error);
            setStatus('error');
            setMessage(error.message);
            return;
          }

          if (data.user && data.user.email_confirmed_at) {
            setStatus('success');
            setMessage('Email verified successfully!');
            
            // Clean up localStorage
            localStorage.removeItem('pendingVerificationEmail');
            
            // Check if user has a profile
            const { data: profileData } = await supabase
              .from('users')
              .select('id')
              .eq('id', data.user.id)
              .single();

            // Redirect based on profile status
            setTimeout(() => {
              if (profileData) {
                router.push('/waiting-approval');
              } else {
                router.push('/profile-setup');
              }
            }, 2000);
          } else {
            setStatus('error');
            setMessage('Email verification failed. Please try again.');
          }
        } else {
          setStatus('error');
          setMessage('Invalid verification link. Please try signing up again.');
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setStatus('error');
        setMessage('An unexpected error occurred during verification.');
      }
    };

    handleAuthCallback();
  }, [searchParams, router]);

  return (
    <main className="h-[100dvh] w-full">
      <div className="relative h-full w-full">
        <Background 
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alt-g7Cv2QzqL3k6ey3igjNYkM32d8Fld7.mp4" 
          placeholder="/alt-placeholder.png" 
        />
        
        <div className="flex overflow-hidden relative flex-col gap-4 justify-center items-center pt-10 w-full h-full px-sides pb-footer-safe-area">
          <Link href="/" className="block mb-8">
            <h1 className="font-serif text-4xl italic text-foreground hover:opacity-80 transition-opacity">
              SoulRoute
            </h1>
          </Link>

          <div className="w-full max-w-md">
            <div className="backdrop-blur-2xl bg-primary/30 border-2 border-border/60 rounded-3xl p-8 shadow-button text-center">
              {status === 'loading' && (
                <>
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4"></div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    Verifying your email...
                  </h2>
                  <p className="text-foreground/80">
                    Please wait while we confirm your email address.
                  </p>
                </>
              )}

              {status === 'success' && (
                <>
                  <div className="text-green-500 text-5xl mb-4">✓</div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    Email Verified!
                  </h2>
                  <p className="text-foreground/80 mb-4">
                    {message}
                  </p>
                  <p className="text-sm text-foreground/60">
                    Redirecting you to complete your profile...
                  </p>
                </>
              )}

              {status === 'error' && (
                <>
                  <div className="text-red-500 text-5xl mb-4">✗</div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    Verification Failed
                  </h2>
                  <p className="text-foreground/80 mb-4">
                    {message}
                  </p>
                  <div className="space-y-2">
                    <Link 
                      href="/signup" 
                      className="block text-foreground font-medium hover:underline"
                    >
                      Try signing up again
                    </Link>
                    <Link 
                      href="/login" 
                      className="block text-foreground/80 hover:underline"
                    >
                      Already have an account? Sign in
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}