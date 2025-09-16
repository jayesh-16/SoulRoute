"use client";

import { motion } from "framer-motion";
import { HeartIcon } from "@radix-ui/react-icons";

export const RotatingIcon = () => {
  return (
    <div className="absolute top-6 right-6 z-10">
      <motion.div
        className="relative"
        animate={{ rotate: 360 }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className="w-16 h-16 rounded-full backdrop-blur-2xl bg-primary/30 border-2 border-border/60 shadow-button flex items-center justify-center hover:bg-primary/40 transition-colors duration-300">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <HeartIcon className="w-6 h-6 text-foreground" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};