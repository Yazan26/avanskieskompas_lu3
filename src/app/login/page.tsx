import AuthForm from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-[var(--color-primary)]/5 via-transparent to-[var(--color-accent)]/5 animate-gradient" />
      
      {/* Abstract floating shapes */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[var(--color-primary)]/10 rounded-full blur-[100px] animate-float" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-[var(--color-accent)]/10 rounded-full blur-[100px] animate-float delay-500" />
      
      <main className="relative z-10 w-full max-w-md animate-scale-in">
        <AuthForm />
      </main>
    </div>
  );
}
