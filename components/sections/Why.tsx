const REASONS = [
  { t: "Insured & Licensed", d: "Full liability and workers' compensation coverage on every job — your home and our crew are protected.", icon: "🛡" },
  { t: "Built for Florida Rain", d: "Heavy-gauge seamless aluminum, hidden hangers, oversized downspouts — engineered for tropical storm runoff.", icon: "🌧" },
  { t: "Warranty-Protected", d: "Workmanship warranty on every installation plus full manufacturer warranties on materials. Terms in writing.", icon: "✓" },
];

function WhyShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="py-20">
      <div className="container-x">
        <h2 className="section-title">Why Choose Dream Team Gutters</h2>
        {children}
      </div>
    </section>
  );
}

export function WhyGrid() {
  return (
    <WhyShell>
      <div className="grid md:grid-cols-3 gap-[30px]">
        {REASONS.map((w) => (
          <div key={w.t} className="bg-offwhite p-[35px] rounded-[10px] border-t-4 border-gold text-center">
            <h3 className="mb-3 text-[1.3rem]">{w.t}</h3>
            <p className="text-[#555]">{w.d}</p>
          </div>
        ))}
      </div>
    </WhyShell>
  );
}

export function WhyStacked() {
  return (
    <WhyShell>
      <div className="max-w-2xl mx-auto flex flex-col gap-5">
        {REASONS.map((w) => (
          <div key={w.t} className="bg-offwhite p-[30px] rounded-[10px] border-l-4 border-gold">
            <h3 className="mb-2 text-[1.3rem]">{w.t}</h3>
            <p className="text-[#555]">{w.d}</p>
          </div>
        ))}
      </div>
    </WhyShell>
  );
}

export function WhyIconLed() {
  return (
    <WhyShell>
      <div className="grid md:grid-cols-3 gap-[30px]">
        {REASONS.map((w) => (
          <div key={w.t} className="bg-offwhite p-[30px] rounded-[10px] flex gap-4 items-start">
            <div className="shrink-0 w-[52px] h-[52px] rounded-full bg-gold text-navy flex items-center justify-center text-[1.5rem] font-bold">{w.icon}</div>
            <div>
              <h3 className="mb-2 text-[1.2rem]">{w.t}</h3>
              <p className="text-[#555] text-[0.95rem]">{w.d}</p>
            </div>
          </div>
        ))}
      </div>
    </WhyShell>
  );
}
