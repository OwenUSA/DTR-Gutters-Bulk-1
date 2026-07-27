type AboutProps = { name: string; isHome: boolean };

const ABOUT_IMG = "/assets/about-crew.jpg";

function AboutCopy({ name, isHome }: AboutProps) {
  return (
    <div>
      <h2 className="text-[2.2rem] mb-2.5">About Dream Team Roofing & Gutters</h2>
      <h3 className="text-gold text-[1.2rem] mb-5 font-sans font-medium">
        {isHome ? "Your Trusted Gutter Partner Across South Florida" : `Your Local Gutter Partner in ${name}`}
      </h3>
      <p className="mb-[18px] text-[#555]">At Dream Team, we believe gutters deserve more than a quick patch — they deserve expert installation. Serving South Florida, we specialize in seamless gutters, leaf protection, and full repairs built to handle tropical storms and torrential rain.</p>
      <p className="mb-[18px] text-[#555]">We are <strong>licensed, insured, and experienced</strong>, with a proven track record of protecting homes from water damage at the source.</p>
      <a href="#quote" className="btn btn-primary">Get Started Today</a>
    </div>
  );
}

function AboutImage() {
  return (
    <div>
      <img src={ABOUT_IMG} alt="Dream Team gutter crew" className="rounded-[10px] shadow-[0_10px_30px_rgba(0,0,0,0.15)]" />
    </div>
  );
}

export function AboutImageRight(p: AboutProps) {
  return (
    <section className="py-20" id="about">
      <div className="container-x grid md:grid-cols-2 gap-[50px] items-center">
        <AboutCopy {...p} />
        <AboutImage />
      </div>
    </section>
  );
}

export function AboutImageLeft(p: AboutProps) {
  return (
    <section className="py-20" id="about">
      <div className="container-x grid md:grid-cols-2 gap-[50px] items-center">
        <AboutImage />
        <AboutCopy {...p} />
      </div>
    </section>
  );
}

export function AboutStacked(p: AboutProps) {
  return (
    <section className="py-20" id="about">
      <div className="container-x max-w-4xl mx-auto">
        <img src={ABOUT_IMG} alt="Dream Team gutter crew" className="rounded-[10px] shadow-[0_10px_30px_rgba(0,0,0,0.15)] w-full h-[320px] object-cover mb-10" />
        <div className="text-center">
          <AboutCopy {...p} />
        </div>
      </div>
    </section>
  );
}
