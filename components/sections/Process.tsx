const STEPS = [
  { n: 1, t: "Contact Us", d: "Quick call or web form to share what's going on with your gutters." },
  { n: 2, t: "On-Site Estimate", d: "We measure every run, check fascia condition, and deliver a clear quote within 24–48 hours." },
  { n: 3, t: "Schedule", d: "Most jobs scheduled within 1–2 weeks. We pull any permits needed and coordinate around your day." },
  { n: 4, t: "Install & Cleanup", d: "Seamless gutters cut on-site, hidden hangers installed, downspouts tied in, debris hauled away." },
];

function ProcessShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="py-20 bg-navy text-white">
      <div className="container-x">
        <h2 className="section-title !text-white">Our Simple 4-Step Process</h2>
        {children}
      </div>
    </section>
  );
}

export function ProcessCards() {
  return (
    <ProcessShell>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-[25px]">
        {STEPS.map((s) => (
          <div key={s.n} className="text-center p-5">
            <div className="w-[60px] h-[60px] rounded-full bg-gold text-navy flex items-center justify-center text-[1.8rem] font-bold mx-auto mb-[15px] font-slab">{s.n}</div>
            <h4 className="text-white text-[1.2rem] mb-2">{s.t}</h4>
            <p className="text-[0.95rem] opacity-90">{s.d}</p>
          </div>
        ))}
      </div>
    </ProcessShell>
  );
}

export function ProcessTimeline() {
  return (
    <ProcessShell>
      <div className="relative">
        <div className="hidden md:block absolute top-[30px] left-[8%] right-[8%] h-[2px] bg-gold/40" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[25px] relative">
          {STEPS.map((s) => (
            <div key={s.n} className="text-center px-3">
              <div className="w-[60px] h-[60px] rounded-full bg-gold text-navy flex items-center justify-center text-[1.8rem] font-bold mx-auto mb-[15px] font-slab relative z-10 ring-4 ring-navy">{s.n}</div>
              <h4 className="text-white text-[1.2rem] mb-2">{s.t}</h4>
              <p className="text-[0.95rem] opacity-90">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </ProcessShell>
  );
}

export function ProcessStepper() {
  return (
    <ProcessShell>
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        {STEPS.map((s) => (
          <div key={s.n} className="flex gap-5 items-start">
            <div className="shrink-0 w-[56px] h-[56px] rounded-full bg-gold text-navy flex items-center justify-center text-[1.6rem] font-bold font-slab">{s.n}</div>
            <div>
              <h4 className="text-white text-[1.2rem] mb-1">{s.t}</h4>
              <p className="text-[0.95rem] opacity-90">{s.d}</p>
            </div>
          </div>
        ))}
      </div>
    </ProcessShell>
  );
}
