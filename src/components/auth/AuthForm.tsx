"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Lock, Mail, ArrowRight, Loader2, AlertCircle } from "lucide-react";


type AuthMode = "login" | "register";

export default function AuthForm() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError(null);
    setSuccess(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
    const url = `${baseUrl}${endpoint}`;

    const body = mode === "login" 
      ? { email: formData.email, password: formData.password }
      : { ...formData, role: "application" }; // Default role to application for normal users

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Authentication failed");
      }

      if (mode === "login") {
        // Handle successful login (store token)
        localStorage.setItem("token", data.token);
        setSuccess("Login successful! Redirecting...");
        // Redirect to home page after login
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        setSuccess("Registration successful! Please log in.");
        setTimeout(() => {
          setMode("login");
          setSuccess(null);
          setFormData(prev => ({ ...prev, password: "" })); 
        }, 1500);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-2xl bg-[var(--color-card-light)]/80 dark:bg-[var(--color-card-dark)]/80 backdrop-blur-md shadow-2xl border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent">
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] mt-2">
          {mode === "login" 
            ? "Enter your credentials to access your account" 
            : "Sign up to get started"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <AnimatePresence mode="popLayout">
          {mode === "register" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[var(--color-primary)] transition-colors" />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  required={mode === "register"}
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-black/50 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 dark:text-white"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative group">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[var(--color-primary)] transition-colors" />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-black/50 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 dark:text-white"
          />
        </div>

        <div className="relative group">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[var(--color-primary)] transition-colors" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-black/50 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 dark:text-white"
          />
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 p-3 text-sm text-red-500 bg-red-50 dark:bg-red-500/10 rounded-lg border border-red-100 dark:border-red-500/20"
            >
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </motion.div>
          )}
          {success && (
             <motion.div
             initial={{ opacity: 0, y: -10 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -10 }}
             className="flex items-center gap-2 p-3 text-sm text-green-500 bg-green-50 dark:bg-green-500/10 rounded-lg border border-green-100 dark:border-green-500/20"
           >
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
             <span>{success}</span>
           </motion.div>
          )}
        </AnimatePresence>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-[var(--color-primary)] hover:bg-red-700 text-white rounded-lg font-medium shadow-lg shadow-[var(--color-primary)]/20 hover:shadow-[var(--color-primary)]/40 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              {mode === "login" ? "Sign In" : "Create Account"}
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-[#1c2127] text-gray-500">Or</span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={toggleMode}
              className="font-medium text-[var(--color-primary)] hover:underline ml-1"
            >
              {mode === "login" ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
