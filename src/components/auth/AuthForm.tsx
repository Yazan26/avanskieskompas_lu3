"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Lock, Mail, ArrowRight, Loader2, AlertCircle, Eye, EyeOff, Check, X } from "lucide-react";

type AuthMode = "login" | "register";

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

function getPasswordStrength(password: string): PasswordStrength {
  let score = 0;
  
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 1) return { score: 1, label: "Zwak", color: "bg-red-500" };
  if (score <= 2) return { score: 2, label: "Matig", color: "bg-orange-500" };
  if (score <= 3) return { score: 3, label: "Goed", color: "bg-yellow-500" };
  if (score <= 4) return { score: 4, label: "Sterk", color: "bg-green-500" };
  return { score: 5, label: "Zeer sterk", color: "bg-emerald-500" };
}

export default function AuthForm() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });

  const passwordStrength = useMemo(() => getPasswordStrength(formData.password), [formData.password]);
  const passwordsMatch = formData.password === formData.confirmPassword;

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError(null);
    setSuccess(null);
    setFormData({ email: "", password: "", confirmPassword: "", name: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === "register" && !passwordsMatch) {
      setError("Wachtwoorden komen niet overeen");
      return;
    }

    if (mode === "register" && formData.password.length < 8) {
      setError("Wachtwoord moet minimaal 8 tekens zijn");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
    const url = `${baseUrl}${endpoint}`;

    const body = mode === "login" 
      ? { email: formData.email, password: formData.password }
      : { email: formData.email, password: formData.password, name: formData.name, role: "application" };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Authenticatie mislukt");
      }

      if (mode === "login") {
        localStorage.setItem("token", data.token);
        setSuccess("Succesvol ingelogd! Je wordt doorgestuurd...");
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        setSuccess("Account aangemaakt! Je kunt nu inloggen.");
        setTimeout(() => {
          setMode("login");
          setSuccess(null);
          setFormData(prev => ({ ...prev, password: "", confirmPassword: "" })); 
        }, 1500);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Er is iets misgegaan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-2xl bg-white/95 dark:bg-[#1c2127]/95 backdrop-blur-md shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent">
          {mode === "login" ? "Welkom Terug" : "Account Aanmaken"}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {mode === "login" 
            ? "Vul je gegevens in om in te loggen" 
            : "Maak een account aan om te beginnen"}
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
                  placeholder="Volledige naam"
                  required={mode === "register"}
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800/50 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white"
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
            placeholder="E-mailadres"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800/50 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white"
          />
        </div>

        <div className="relative group">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[var(--color-primary)] transition-colors" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Wachtwoord"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800/50 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label={showPassword ? "Verberg wachtwoord" : "Toon wachtwoord"}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {/* Password strength indicator - only for register */}
        <AnimatePresence>
          {mode === "register" && formData.password.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                      level <= passwordStrength.score
                        ? passwordStrength.color
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Wachtwoordsterkte: <span className="font-medium">{passwordStrength.label}</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confirm password field - only for register */}
        <AnimatePresence mode="popLayout">
          {mode === "register" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[var(--color-primary)] transition-colors" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Bevestig wachtwoord"
                  required={mode === "register"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-3 rounded-lg border bg-white dark:bg-gray-800/50 focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white ${
                    formData.confirmPassword.length > 0
                      ? passwordsMatch
                        ? "border-green-500 focus:border-green-500"
                        : "border-red-500 focus:border-red-500"
                      : "border-gray-200 dark:border-gray-600 focus:border-[var(--color-primary)]"
                  }`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {formData.confirmPassword.length > 0 && (
                    <span className={passwordsMatch ? "text-green-500" : "text-red-500"}>
                      {passwordsMatch ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    aria-label={showConfirmPassword ? "Verberg wachtwoord" : "Toon wachtwoord"}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              {formData.confirmPassword.length > 0 && !passwordsMatch && (
                <p className="text-xs text-red-500 mt-1">Wachtwoorden komen niet overeen</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 rounded-lg border border-red-200 dark:border-red-500/20"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
          {success && (
             <motion.div
             initial={{ opacity: 0, y: -10 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -10 }}
             className="flex items-center gap-2 p-3 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 rounded-lg border border-green-200 dark:border-green-500/20"
           >
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
             <span>{success}</span>
           </motion.div>
          )}
        </AnimatePresence>

        <button
          type="submit"
          disabled={isLoading || (mode === "register" && (!passwordsMatch || formData.password.length < 8))}
          className="w-full py-3 px-4 bg-[var(--color-primary)] hover:bg-red-700 text-white rounded-lg font-medium shadow-lg shadow-[var(--color-primary)]/20 hover:shadow-[var(--color-primary)]/40 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-[var(--color-primary)]/20"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              {mode === "login" ? "Inloggen" : "Account Aanmaken"}
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white dark:bg-[#1c2127] text-gray-500 dark:text-gray-400 font-medium">Of</span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {mode === "login" ? "Nog geen account?" : "Heb je al een account?"}{" "}
            <button
              type="button"
              onClick={toggleMode}
              className="font-semibold text-[var(--color-primary)] hover:text-red-700 hover:underline ml-1 transition-colors"
            >
              {mode === "login" ? "Registreren" : "Inloggen"}
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
