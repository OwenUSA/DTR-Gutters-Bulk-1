import QuoteForm from "./QuoteForm";

type HeroProps = {
  heroImage: string;
  heroH1: string;
  heroSub: string;
};

const overlayStyle = {
  backgroundImage:
    "linear-gradient(to bottom right, rgba(var(--navy-rgb), 0.55), rgba(var(--navy-rgb), 0.3))",
};

function HeroShell({
  heroImage,
  children,
}: {
  heroImage: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="relative text-white py-20 overflow-hidden bg-center bg-cover bg-no-repeat"
      style={{ backgroundImage: `url('${heroImage}')` }}
    >
      <div className="absolute inset-0" style={overlayStyle} />
      <div className="container-x relative">{children}</div>
    </section>
  );
}

function HeroCopy({ heroH1, heroSub }: { heroH1: string; heroSub: string }) {
  return (
    <>
      <h1 className="text-white !text-[2.8rem] max-md:!text-[2rem] mb-5 font-slab">
        {heroH1}
      </h1>
      <p className="text-[1.15rem] mb-[30px] opacity-95">{heroSub}</p>
      <a href="#quote" className="btn btn-cta">Get Your Quote Today!</a>
      <div className="flex gap-5 mt-[30px] flex-wrap">
        <span className="bg-white/15 px-4 py-2 rounded-[20px] text-[0.9rem] font-medium">★ 5.0 Google</span>
        <span className="bg-white/15 px-4 py-2 rounded-[20px] text-[0.9rem] font-medium">★ 5.0 Facebook</span>
        <span className="bg-white/15 px-4 py-2 rounded-[20px] text-[0.9rem] font-medium">★ 5.0 Yelp</span>
      </div>
    </>
  );
}

export function HeroSplit(p: HeroProps) {
  return (
    <HeroShell heroImage={p.heroImage}>
      <div className="grid md:grid-cols-[1fr_400px] gap-[50px] items-center">
        <div><HeroCopy heroH1={p.heroH1} heroSub={p.heroSub} /></div>
        <QuoteForm />
      </div>
    </HeroShell>
  );
}

export function HeroCentered(p: HeroProps) {
  return (
    <HeroShell heroImage={p.heroImage}>
      <div className="text-center max-w-3xl mx-auto mb-10">
        <HeroCopy heroH1={p.heroH1} heroSub={p.heroSub} />
      </div>
      <div className="max-w-[460px] mx-auto">
        <QuoteForm />
      </div>
    </HeroShell>
  );
}

export function HeroImageRight(p: HeroProps) {
  return (
    <HeroShell heroImage={p.heroImage}>
      <div className="grid md:grid-cols-[400px_1fr] gap-[50px] items-center">
        <QuoteForm />
        <div><HeroCopy heroH1={p.heroH1} heroSub={p.heroSub} /></div>
      </div>
    </HeroShell>
  );
}
