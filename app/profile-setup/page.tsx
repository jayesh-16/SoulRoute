"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRightIcon, PersonIcon, BackpackIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Background } from "@/components/background";
import { setupProfile } from "@/lib/actions/auth";
import { createClient } from "@/lib/supabase/client";

const profileSetupSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  role: z.enum(["student", "counselor"], {
    required_error: "Please select your role",
  }),
});

type ProfileSetupSchema = z.infer<typeof profileSetupSchema>;

const DURATION = 0.3;
const EASE_OUT = "easeOut";

export default function ProfileSetupPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const form = useForm<ProfileSetupSchema>({
    resolver: zodResolver(profileSetupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      role: undefined,
    },
  });

  // Check if user is authenticated and email is verified
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/login");
        return;
      }

      // Check if email is verified
      if (!user.email_confirmed_at) {
        // Store email and redirect to verification page
        localStorage.setItem('pendingVerificationEmail', user.email!);
        router.push(`/verify-email?email=${encodeURIComponent(user.email!)}`);
        return;
      }

      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();

      if (existingProfile) {
        router.push("/waiting-approval");
        return;
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const onSubmit = async (values: ProfileSetupSchema) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      console.log('Starting profile setup with:', values);
      
      const formData = new FormData();
      formData.append('firstName', values.firstName);
      formData.append('lastName', values.lastName);
      formData.append('role', values.role);
      
      const result = await setupProfile(formData);
      
      console.log('Profile setup result:', result);
      
      if (result.success) {
        // Store user role for the waiting approval page
        localStorage.setItem('pendingUserRole', values.role);
        // Redirect to waiting approval page
        router.push("/waiting-approval");
      } else {
        console.error('Profile setup failed:', result.message);
        setError(result.message);
      }
    } catch (error) {
      console.error("Profile setup error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="h-[100dvh] w-full">
        <div className="relative h-full w-full">
          <Background 
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alt-g7Cv2QzqL3k6ey3igjNYkM32d8Fld7.mp4" 
            placeholder="/alt-placeholder.png" 
          />
          <div className="flex overflow-hidden relative flex-col gap-4 justify-center items-center pt-10 w-full h-full px-sides pb-footer-safe-area">
            <div className="text-foreground">Loading...</div>
          </div>
        </div>
      </main>
    );
  }

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
                  Complete Your Profile
                </h2>
                <p className="text-foreground/80">
                  Tell us a bit about yourself to complete your registration
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
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">I am a</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-2 gap-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="student" id="student" />
                              <label
                                htmlFor="student"
                                className="flex items-center space-x-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-foreground"
                              >
                                <BackpackIcon className="h-4 w-4" />
                                <span>Student</span>
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="counselor" id="counselor" />
                              <label
                                htmlFor="counselor"
                                className="flex items-center space-x-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-foreground"
                              >
                                <PersonIcon className="h-4 w-4" />
                                <span>Counselor</span>
                              </label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground">First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground">Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full mt-6"
                    disabled={isSubmitting}
                    shine={!isSubmitting}
                  >
                    {isSubmitting ? (
                      "Setting up profile..."
                    ) : (
                      <>
                        Complete Profile
                        <ArrowRightIcon className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>

              <div className="mt-6 text-center">
                <p className="text-sm text-foreground/60">
                  Your account will be reviewed by our admin team before activation
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}