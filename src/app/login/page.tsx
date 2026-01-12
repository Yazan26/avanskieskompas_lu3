import AuthForm from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center p-4 relative overflow-hidden bg-gray-50 dark:bg-[#111418]">
      {/* Subtle background gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-[var(--color-primary)]/3 via-transparent to-[var(--color-accent)]/3" />

      {/* Subtle floating shapes - reduced size and opacity */}
      <div className="absolute top-[-10%] left-[-5%] w-[300px] h-[300px] bg-[var(--color-primary)]/5 rounded-full blur-[120px] animate-float" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[300px] h-[300px] bg-[var(--color-accent)]/5 rounded-full blur-[120px] animate-float delay-500" />

      <main className="relative z-10 w-full max-w-md animate-scale-in">
        <AuthForm />
      </main>
    </div>
  );
}
