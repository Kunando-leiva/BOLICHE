import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col items-start justify-center px-5 md:px-10" data-testid="not-found">
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-4 font-display text-8xl font-black uppercase text-neon-magenta md:text-[12rem]">Apagón</h1>
      <p className="mt-4 text-muted">Esta página no existe o ya terminó la fiesta.</p>
      <Link href="/" className="btn btn-primary mt-10" data-testid="not-found-home-btn">Volver al inicio</Link>
    </main>
  );
}