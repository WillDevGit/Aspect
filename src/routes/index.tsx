import { createFileRoute } from "@tanstack/react-router";
import { BeforeAfter } from "@/components/BeforeAfter";
import { Portfolio } from "@/components/Portfolio";
import { AspectLogo } from "@/components/AspectLogo";
import { Particles } from "@/components/Particles";
import { MagneticButton } from "@/components/MagneticButton";
import { useReveal } from "@/hooks/use-reveal";
import { ScrollHero } from "@/components/ScrollHero";
import { Viewer360 } from "@/components/Viewer360";
import { DriveItCTA } from "@/components/DriveItCTA";
import { CrosshairCursor } from "@/components/CrosshairCursor";
import heroBg from "@/assets/hero-bg.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aspect — Professional-grade car photography" },
      {
        name: "description",
        content:
          "Aspect turns amateur car photos into magazine-grade cinematic images. For dealerships, resellers and enthusiasts.",
      },
      { property: "og:title", content: "Aspect — Professional-grade car photography" },
      {
        property: "og:description",
        content: "Turn ordinary car photos into cinematic images in minutes.",
      },
      { property: "og:image", content: heroBg },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: heroBg },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <CrosshairCursor />
      <Header />
      <ScrollHero />
      <TrustBar />
      <Viewer360 />
      <Marquee />
      <Comparison />
      <Portfolio />
      <Features />
      <Process />
      <CTA />
      <DriveItCTA />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="absolute left-0 right-0 top-0 z-50 px-6 py-6 md:px-12">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <AspectLogo />
        <nav className="hidden items-center gap-10 text-sm uppercase tracking-widest text-muted-foreground md:flex">
          <a href="#work" className="transition hover:text-foreground">Work</a>
          <a href="#portfolio" className="transition hover:text-foreground">Portfolio</a>
          <a href="#process" className="transition hover:text-foreground">Process</a>
          <a href="#contact" className="transition hover:text-foreground">Contact</a>
        </nav>
        <a
          href="mailto:aspecttdigital@gmail.com"
          className="hidden rounded-sm border border-ember/40 bg-ember/10 px-5 py-2 text-sm font-medium uppercase tracking-widest text-ember transition hover:bg-ember hover:text-accent-foreground md:inline-block"
        >
          Get in touch
        </a>
      </div>
    </header>
  );
}

/* Trust bar (dealer logos) — kept under the scroll-driven hero. */
function TrustBar() {
  return (
    <div className="relative border-t border-border bg-black">
      <div className="mx-auto max-w-7xl px-6 py-8 md:px-12">
        <div className="mb-4 flex items-center gap-4">
          <span className="h-px flex-1 bg-border" />
          <span className="font-display text-[11px] tracking-[0.4em] text-ember">
            TRUSTED BY DEALERS WHO SELL MORE
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 opacity-60">
          {["Webmotors", "OLX", "iCarros", "MobiAuto", "Auto+", "CrediNissan"].map((b) => (
            <span
              key={b}
              className="font-display text-base tracking-[0.2em] text-muted-foreground transition hover:text-foreground md:text-lg"
            >
              {b}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Marquee() {
  const words = [
    "CINEMATIC",
    "DEALERSHIP-READY",
    "COVER-WORTHY",
    "PIXEL PERFECT",
    "STUDIO QUALITY",
    "SHOWROOM STAGE",
  ];
  const items = [...words, ...words];
  return (
    <div className="relative overflow-hidden border-y border-border bg-background py-6">
      <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
        {items.map((w, i) => (
          <span
            key={i}
            className="font-display text-3xl tracking-[0.3em] text-muted-foreground/40 md:text-5xl"
          >
            {w} <span className="text-ember">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Comparison() {
  const ref = useReveal<HTMLElement>();
  return (
    <section ref={ref} id="work" className="border-t border-border bg-surface py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-12 grid gap-8 md:grid-cols-2 md:items-end reveal">
          <div>
            <div className="mb-4 font-display text-sm tracking-[0.3em] text-ember">
              BEFORE / AFTER
            </div>
            <h2 className="font-display text-5xl leading-none tracking-tight md:text-7xl">
              DRAG.
              <br />
              <span className="font-editorial text-gradient-animated">see the difference.</span>
            </h2>
          </div>
          <p className="text-lg text-muted-foreground md:text-right">
            Same photo. Same car. Professional retouching, recreated
            background, cinematic lighting and color calibrated to sell.
          </p>
        </div>

        <div className="reveal reveal-delay-2">
          <BeforeAfter />
        </div>

        <p className="reveal reveal-delay-3 mt-6 text-center text-xs uppercase tracking-widest text-muted-foreground">
          Drag the slider ⇄ to compare
        </p>
      </div>
    </section>
  );
}

function Features() {
  const ref = useReveal<HTMLElement>();
  const items = [
    {
      n: "01",
      title: "Cinematic background",
      text: "We remove the parking lot, the workshop, the traffic. We drop in scenes worthy of a campaign.",
    },
    {
      n: "02",
      title: "Light that sells",
      text: "Reflections on the bodywork, controlled shadows and color grading that flatter every curve.",
    },
    {
      n: "03",
      title: "Absolute detail",
      text: "Restored tires, clean glass, glowing headlights. Ready for a premium listing.",
    },
    {
      n: "04",
      title: "2 years in business",
      text: "Two years sharpening our craft alongside dealerships and enthusiasts who demand excellence.",
    },
  ];

  return (
    <section ref={ref} className="border-t border-border py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-16 max-w-2xl reveal">
          <div className="mb-4 font-display text-sm tracking-[0.3em] text-ember">
            WHAT WE DO
          </div>
          <h2 className="font-display text-5xl leading-none tracking-tight md:text-7xl">
            FOUR STEPS.
            <br />
            <span className="font-editorial text-gradient-animated">one result.</span>
          </h2>
        </div>

        <div className="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <div
              key={it.n}
              className={`group relative bg-background p-8 transition hover:-translate-y-1 hover:bg-surface md:p-10 reveal reveal-delay-${(i % 4) + 1}`}
            >
              <div className="font-editorial text-6xl text-ember/30 transition duration-500 group-hover:scale-110 group-hover:text-ember">
                {it.n}
              </div>
              <h3 className="mt-6 font-display text-2xl tracking-wide text-foreground">
                {it.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {it.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  const ref = useReveal<HTMLElement>();
  const steps = [
    { k: "01", t: "You email us", d: "Send your photos to our email. As many as you want." },
    { k: "02", t: "Our team retouches", d: "AI + human polish. Every image is reviewed by a specialist." },
    { k: "03", t: "Approval", d: "You get a preview. Request tweaks at no extra cost." },
    { k: "04", t: "Final delivery", d: "High-resolution files, ready for any channel." },
  ];
  return (
    <section ref={ref} id="process" className="border-t border-border bg-surface py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-16 grid gap-8 md:grid-cols-2 md:items-end reveal">
          <h2 className="font-display text-5xl leading-none tracking-tight md:text-7xl">
            HOW IT WORKS
          </h2>
          <p className="max-w-md text-lg text-muted-foreground md:justify-self-end">
            No fuss. No 40-page briefing. You send. We deliver.
          </p>
        </div>

        <div className="space-y-px">
          {steps.map((s, i) => (
            <div
              key={s.k}
              className={`group grid items-center gap-6 border-b border-border py-8 transition hover:bg-background md:grid-cols-12 md:gap-12 md:px-6 reveal reveal-delay-${(i % 4) + 1}`}
            >
              <div className="font-display text-5xl text-ember transition-transform duration-500 group-hover:translate-x-2 md:col-span-2 md:text-6xl">
                {s.k}
              </div>
              <h3 className="font-display text-3xl tracking-wide text-foreground md:col-span-3 md:text-4xl">
                {s.t}
              </h3>
              <p className="text-base text-muted-foreground md:col-span-6 md:text-lg">
                {s.d}
              </p>
              <div className="hidden text-ember opacity-0 transition duration-500 group-hover:translate-x-2 group-hover:opacity-100 md:col-span-1 md:block md:justify-self-end">
                →
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  const ref = useReveal<HTMLElement>();
  return (
    <section
      ref={ref}
      id="contact"
      className="relative grain overflow-hidden border-t border-border py-24 md:py-36"
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25 animate-slow-zoom"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
      <Particles count={18} />

      <div className="relative mx-auto max-w-4xl px-6 text-center md:px-12 reveal">
        <h2 className="font-display text-6xl leading-[0.9] tracking-tight md:text-8xl">
          LIKE WHAT YOU SEE?
          <br />
          <span className="font-editorial text-gradient-animated">let's talk.</span>
        </h2>
        <p className="mx-auto mt-8 max-w-xl text-lg text-muted-foreground">
          This is our portfolio. Drop us a line and we'll put together a quote
          tailored to your fleet, lot or personal collection.
        </p>
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <MagneticButton
            href="mailto:aspecttdigital@gmail.com"
            className="group relative overflow-hidden rounded-sm bg-ember px-10 py-5 font-display text-base tracking-widest text-accent-foreground animate-cta-pulse hover:bg-ember-glow"
          >
            <span className="relative z-10">EMAIL US →</span>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </MagneticButton>
        </div>
        <p className="mt-6 font-display text-sm tracking-[0.3em] text-muted-foreground">
          aspecttdigital@gmail.com
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-surface py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center md:px-12">
        <AspectLogo />
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          © {new Date().getFullYear()} Aspect Studio · Automotive photography
        </p>
        <div className="flex gap-6 text-xs uppercase tracking-widest text-muted-foreground">
          <a href="#" className="transition hover:text-ember">Instagram</a>
          <a href="#" className="transition hover:text-ember">Behance</a>
          <a href="mailto:aspecttdigital@gmail.com" className="transition hover:text-ember">Contact</a>
        </div>
      </div>
    </footer>
  );
}
