"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn("google", { callbackUrl: "/account" });
    // We don't need to setIsLoading(false) because the page will redirect.
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card border border-border rounded-3xl p-8 z-[101] shadow-2xl overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/20 to-transparent opacity-50 pointer-events-none" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-8 relative z-10 pt-4">
              <h2 className="text-3xl font-black tracking-tight mb-2">Welcome Back</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Sign in or create an account to manage your tickets, track orders, and sell your passes securely.
              </p>
            </div>

            <div className="space-y-4 relative z-10">
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 bg-white text-black py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                )}
                Continue with Google
              </button>
            </div>

            <p className="text-xs text-center text-muted-foreground mt-8">
              By continuing, you agree to Ticket Universe's Terms of Service and Privacy Policy.
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
