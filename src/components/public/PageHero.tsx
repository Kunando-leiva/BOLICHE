export function PageHero({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-16 pt-36 md:px-10 md:pt-44">
      <p className="eyebrow rise">{eyebrow}</p>
      <h1 className="mt-4 font-display text-6xl font-black uppercase leading-[0.85] sm:text-7xl lg:text-9xl rise" style={{ animationDelay: "80ms" }} data-testid="page-title">
        {title}
      </h1>
      {intro && <p className="mt-6 max-w-xl text-base text-muted rise" style={{ animationDelay: "160ms" }}>{intro}</p>}
    </section>
  );
}