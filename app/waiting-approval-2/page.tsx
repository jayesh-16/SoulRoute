"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function WaitingApproval2Page() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your email submission logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 relative flex flex-col">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="w-full h-full" 
             style={{
               backgroundImage: `
                 linear-gradient(rgba(0,0,0,0.15) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(0,0,0,0.15) 1px, transparent 1px),
                 linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)
               `,
               backgroundSize: '40px 40px, 40px 40px, 60px 30px, 25px 55px',
               backgroundPosition: '0 0, 0 0, 15px 10px, 5px 20px'
             }}>
        </div>
      </div>
      {/* Barcode elements top left */}
      <div className="absolute top-8 left-8">
        <div className="space-y-1">
          <div className="flex space-x-px">
            {Array.from({ length: 40 }).map((_, i) => (
              <div key={i} className="w-px h-3 bg-black" />
            ))}
          </div>
          <div className="flex space-x-px">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="w-px h-2 bg-black" />
            ))}
          </div>
        </div>
      </div>

      {/* Order element top right */}
      <div className="absolute top-8 right-8">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center space-x-2 mb-2">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 12l2 2 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="9" strokeWidth="2"/>
            </svg>
            <span className="text-sm text-gray-600">Double tap to place order</span>
          </div>
          <h3 className="font-bold text-lg">Steak dish</h3>
          <div className="flex items-center space-x-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">Hot • 15-20 min • Delivery fee $2.50</p>
        </div>
      </div>

      {/* Main content centered */}
      <div className="max-w-2xl mx-auto text-center mt-32">
        {/* Title with icon */}
        <div className="flex items-center justify-center mb-8">
          <svg className="w-12 h-12 mr-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeWidth="2"/>
          </svg>
          <h1 className="text-5xl font-bold text-gray-900">Join our waitlist</h1>
        </div>

        {/* Lorem ipsum text */}
        <p className="text-gray-600 text-lg mb-12 max-w-xl mx-auto leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur et 
          ipsum eu purus molestie lobortis quis nec dolor.
        </p>

        {/* Email form */}
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-20">
          <div className="flex">
            <div className="flex-1 mr-4">
              <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="joshajiboye10@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 text-white placeholder-gray-400 border-0 rounded-none"
                required
              />
            </div>
            <div className="flex items-end">
              <Button 
                type="submit"
                className="px-6 py-3 bg-white text-gray-800 border border-gray-300 rounded-none hover:bg-gray-50 font-medium"
              >
                GET EARLY ACCESS
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Illustrated Characters - At True Bottom of Page */}
      <div className="flex items-end justify-center">
        <div className="bg-white rounded-t-2xl relative z-50" style={{ width: '60vw', height: '60vw' }}>
          <img 
            src="/il.png" 
            alt="Community Illustration" 
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}