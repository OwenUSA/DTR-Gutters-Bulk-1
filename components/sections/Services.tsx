const SERVICES = [
  {
    title: "Seamless Gutter Installation",
    img: "/assets/placeholder.svg",
    body: "Custom-cut on-site from one continuous coil of aluminum, copper, or steel. Fewer joints, fewer leaks, and a cleaner line along your roof.",
  },
  {
    title: "Gutter Guards & Leaf Protection",
    img: "/assets/placeholder.svg",
    body: "Micro-mesh, screen, and reverse-curve guards that keep leaves, pine needles, and shingle grit out while letting heavy Florida rain flow through.",
  },
  {
    title: "Gutter Cleaning",
    img: "/assets/placeholder.svg",
    body: "Full debris removal, downspout flushing, and a flow test on every run. We bag the debris and leave the roofline spotless.",
  },
  {
    title: "Gutter Repair",
    img: "/assets/placeholder.svg",
    body: "Re-pitching sagging runs, swapping pulled fasteners for hidden hangers, sealing seams, and patching pinhole leaks before they rot the fascia.",
  },
  {
    title: "Downspout Installation & Repair",
    img: "/assets/placeholder.svg",
    body: "New downspouts, extensions, splash blocks, and underground drainage tie-ins that move water well away from your foundation.",
  },
  {
    title: "Fascia & Soffit Repair",
    img: "/assets/placeholder.svg",
    body: "When gutters fail, the wood behind them usually pays the price. We replace rotted fascia and soffit boards before re-hanging.",
  },
  {
    title: "Copper & Specialty Gutters",
    img: "/assets/placeholder.svg",
    body: "Premium copper, half-round profiles, and custom finishes for historic homes and high-end builds where the gutter is part of the design.",
  },
];

function ServicesShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="py-20" id="services">
      <div className="container-x">
        <h2 className="section-title">Our Gutter Services</h2>
        {children}
      </div>
    </section>
  );
}

export function ServicesGrid() {
  return (
    <ServicesShell>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
        {SERVICES.map((s) => (
          <div key={s.title} className="bg-white rounded-[10px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden transition hover:-translate-y-[5px] hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)]">
            <img src={s.img} alt={s.title} className="h-[200px] w-full object-cover" />
            <div className="p-[25px]">
              <h3 className="text-[1.3rem] mb-3">{s.title}</h3>
              <p className="mb-5 text-[#555] text-[0.95rem]">{s.body}</p>
              <a href="#quote" className="btn btn-outline">Learn More</a>
            </div>
          </div>
        ))}
      </div>
    </ServicesShell>
  );
}

export function ServicesList() {
  return (
    <ServicesShell>
      <div className="flex flex-col gap-[25px]">
        {SERVICES.map((s) => (
          <div key={s.title} className="bg-white rounded-[10px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden grid md:grid-cols-[280px_1fr]">
            <img src={s.img} alt={s.title} className="h-full w-full object-cover min-h-[200px]" />
            <div className="p-[25px] flex flex-col justify-center">
              <h3 className="text-[1.5rem] mb-3">{s.title}</h3>
              <p className="mb-5 text-[#555]">{s.body}</p>
              <a href="#quote" className="btn btn-outline self-start">Learn More</a>
            </div>
          </div>
        ))}
      </div>
    </ServicesShell>
  );
}

export function ServicesAlternating() {
  return (
    <ServicesShell>
      <div className="flex flex-col gap-[40px]">
        {SERVICES.map((s, i) => (
          <div
            key={s.title}
            className={`grid md:grid-cols-2 gap-[40px] items-center ${i % 2 === 1 ? "md:[direction:rtl]" : ""}`}
          >
            <img
              src={s.img}
              alt={s.title}
              className="rounded-[10px] shadow-[0_6px_20px_rgba(0,0,0,0.1)] w-full h-[280px] object-cover md:[direction:ltr]"
            />
            <div className="md:[direction:ltr]">
              <h3 className="text-[1.5rem] mb-3">{s.title}</h3>
              <p className="mb-5 text-[#555]">{s.body}</p>
              <a href="#quote" className="btn btn-outline">Learn More</a>
            </div>
          </div>
        ))}
      </div>
    </ServicesShell>
  );
}
