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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Background } from "@/components/background";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginSchema = z.infer<typeof loginSchema>;

const DURATION = 0.3;
const EASE_OUT = "easeOut";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginSchema) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement actual login logic
      console.log("Login values:", values);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // For now, redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Login error:", error);
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
                SoulRoute®
              </h1>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION, ease: EASE_OUT, delay: 0.1 }}
            className="w-full max-w-md"
          >
            <div className="backdrop-blur-xl bg-primary/20 border-2 border-border/50 rounded-3xl p-8 shadow-button">
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