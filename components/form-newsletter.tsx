"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const DURATION = 0.3;
const EASE_OUT = "easeOut";

export const FormNewsletter = ({
  input,
  submit,
}: {
  input: (props: React.ComponentProps<"input">) => React.ReactNode;
  submit: (props: React.ComponentProps<"button">) => React.ReactNode;
}) => {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/signup');
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        {input({ 
          readOnly: true,
          value: "Start your journey to better well-being",
          onChange: () => {}, // No-op since it's read-only
        })}
        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          {submit({
            type: "submit",
          })}
        </div>
      </div>
    </form>
  );
};
