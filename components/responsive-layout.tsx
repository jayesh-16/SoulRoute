"use client";

import { ReactNode } from "react";

interface ResponsiveLayoutProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveLayout({ children, className = "" }: ResponsiveLayoutProps) {
  return (
    <div className={`min-h-screen bg-white ${className}`}>
      <div className="md:ml-20 md:pb-0 pb-20 flex min-h-screen">
        {children}
      </div>
    </div>
  );
}
