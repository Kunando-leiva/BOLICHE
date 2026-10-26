import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Ingresar" };

export default function LoginPage() {
  return (
    <main className="relative flex min-h-[100svh] items-center overflow-hidden px-5" data-testid="admin-login-page">
      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-magenta/25 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan/15 blur-[140px]" />
      <div className="relative mx-auto w-full max-w-md rounded-3xl border border-line glass p-8 md:p-10">
        <p className="eyebrow">Panel de administración</p>
        <h1 className="mb-8 mt-3 font-display text-6xl font-black uppercase"><span className="text-neon-magenta">LUNA</span> Admin</h1>
        <LoginForm />
      </div>
    </main>
  );
}