"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRightIcon, CheckCircledIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Background } from "@/components/background";
import { createClient } from "@/lib/supabase/client";

const DURATION = 0.3;
const EASE_OUT = "easeOut";

export default function VerifyEmailPage() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [isResending, setIsResending] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get email from URL params or localStorage
    const emailParam = searchParams.get('email');
    const storedEmail = localStorage.getItem('pendingVerificationEmail');
    
    if (emailParam) {
      setEmail(emailParam);
      localStorage.setItem('pendingVerificationEmail', emailParam);
    } else if (storedEmail) {
      setEmail(storedEmail);
    }

    // Check if user is already verified
    const checkVerification = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user && user.email_confirmed_at) {
        setIsVerified(true);
        // Clean up localStorage
        localStorage.removeItem('pendingVerificationEmail');
        // Redirect to profile setup after a delay
        setTimeout(() => {
          router.push('/profile-setup');
        }, 2000);
      }
    };

    checkVerification();
  }, [searchParams, router]);

  const handleResendVerification = async () => {
    if (!email) {
      setError("Email address not found. Please try signing up again.");
      return;
    }

    setIsResending(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`
        }
      });

      if (resendError) {
        setError(resendError.message);
      } else {
        setError(null);
        // Show success message (you could add a success state here)
      }
    } catch (err) {
      console.error('Resend verification error:', err);
      setError("Failed to resend verification email. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckVerification = async () => {
    setIsVerifying(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError) {
        setError("Failed to check verification status. Please try again.");
        return;
      }

      if (user && user.email_confirmed_at) {
        setIsVerified(true);
        localStorage.removeItem('pendingVerificationEmail');
        setTimeout(() => {
          router.push('/profile-setup');
        }, 2000);
      } else {
        setError("Email not verified yet. Please check your email and click the verification link.");
      }
    } catch (err) {
      console.error('Check verification error:', err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <main className="h-[100dvh] w-full">
      <div className="relative h-full w-full">
        <Background 
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alt-g7Cv2QzqL3k6ey3igjNYkM32d8Fld7.mp4" 
          placeholder="/alt-placeholder.png" 
        />
        
        <div className="flex overflow-hidden relative flex-col gap-4 justify-center items-center pt-10 w-full h-full px-sides pb-footer-safe-area">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION, ease: EASE_OUT }}
          >
            <Link href="/" className="block mb-8">
              <h1 className="font-serif text-4xl italic text-foreground hover:opacity-80 transition-opacity">
                SoulRoute
              </h1>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION, ease: EASE_OUT, delay: 0.1 }}
            className="w-full max-w-md"
          >
            <div className="backdrop-blur-2xl bg-primary/30 border-2 border-border/60 rounded-3xl p-8 shadow-button">
              {isVerified ? (
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="mb-6"
                  >
                    <CheckCircledIcon className="h-16 w-16 text-green-500 mx-auto" />
                  </motion.div>
                  <h2 className="text-2xl font-semibold text-foreground mb-2">
                    Email Verified!
                  </h2>
                  <p className="text-foreground/80 mb-6">
                    Your email has been successfully verified. Redirecting you to complete your profile...
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-semibold text-foreground mb-2">
                      Verify Your Email
                    </h2>
                    <p className="text-foreground/80">
                      We've sent a verification link to:
                    </p>
                    <p className="text-foreground font-medium mt-2">
                      {email || "your email address"}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {error && (
                      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive">
                        {error}
                      </div>
                    )}

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <p className="text-sm text-foreground/80 mb-3">
                        Please check your email inbox (and spam folder) for the verification link, then click the button below to continue.
                      </p>
                    </div>

                    <Button 
                      onClick={handleCheckVerification}
                      className="w-full"
                      disabled={isVerifying}
                      shine={!isVerifying}
                    >
                      {isVerifying ? (
                        <>
                          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                          Checking...
                        </>
                      ) : (
                        <>
                          I've Verified My Email
                          <ArrowRightIcon className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border/50" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-primary/30 px-2 text-foreground/60">
                          Didn't receive it?
                        </span>
                      </div>
                    </div>

                    <Button 
                      variant="ghost"
                      onClick={handleResendVerification}
                      className="w-full"
                      disabled={isResending || !email}
                    >
                      {isResending ? (
                        <>
                          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                          Resending...
                        </>
                      ) : (
                        <>
                          Resend Verification Email
                          <ReloadIcon className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-foreground/60">
                      Wrong email address?{" "}
                      <Link 
                        href="/signup" 
                        className="text-foreground font-medium hover:underline"
                      >
                        Sign up again
                      </Link>
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}