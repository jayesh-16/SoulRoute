"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRightIcon, EyeOpenIcon, EyeNoneIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Background } from "@/components/background";
import { cn } from "@/lib/utils";
import { login } from "@/lib/actions/auth";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean(),
});

type LoginSchema = z.infer<typeof loginSchema>;

const DURATION = 0.3;
const EASE_OUT = "easeOut";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (values: LoginSchema) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('email', values.email);
      formData.append('password', values.password);
      formData.append('rememberMe', values.rememberMe.toString());
      
      const result = await login(formData);
      
      if (result.success) {
        // Role-based redirect logic
        if (result.data === "ADMIN_LOGIN") {
          router.push("/admin");
        } else if (result.data === "STUDENT_LOGIN") {
          router.push("/student");
        } else if (result.data === "COUNSELOR_LOGIN") {
          router.push("/counselor");
        } else {
          // Fallback to dashboard for any other case
          router.push("/dashboard");
        }
      } else {
        if (result.message === "PENDING_APPROVAL") {
          // User exists but not approved yet
          router.push("/waiting-approval");
        } else if (result.message === "PROFILE_SETUP_REQUIRED") {
          // User needs to complete profile setup
          router.push("/profile-setup");
        } else {
          setError(result.message);
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
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
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  Welcome Back
                </h2>
                <p className="text-foreground/80">
                  Continue your journey to better mental wellness
                </p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {error && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive">
                      {error}
                    </div>
                  )}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Email</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="your.email@university.edu" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              {...field} 
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeNoneIcon className="h-4 w-4 text-foreground/60" />
                              ) : (
                                <EyeOpenIcon className="h-4 w-4 text-foreground/60" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="rememberMe"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm text-foreground/80">
                            Remember me for 30 days
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-between mt-4">
                    <Link 
                      href="/forgot-password" 
                      className="text-sm text-foreground/80 hover:text-foreground hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full mt-6"
                    disabled={isSubmitting}
                    shine={!isSubmitting}
                  >
                    {isSubmitting ? (
                      "Signing In..."
                    ) : (
                      <>
                        Sign In
                        <ArrowRightIcon className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>

              <div className="mt-6 text-center">
                <p className="text-foreground/80">
                  Don't have an account?{" "}
                  <Link 
                    href="/signup" 
                    className="text-foreground font-medium hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-border/50">
                <div className="text-center">
                  <p className="text-sm text-foreground/60 mb-4">
                    Need immediate support?
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm text-foreground/80">
                      Crisis Text Line: Text HOME to 741741
                    </p>
                    <p className="text-sm text-foreground/80">
                      National Suicide Prevention Lifeline: 988
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}