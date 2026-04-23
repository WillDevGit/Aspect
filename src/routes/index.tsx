import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BeforeAfter } from "@/components/BeforeAfter";
import { Portfolio } from "@/components/Portfolio";
import { AspectLogo } from "@/components/AspectLogo";
import { Particles } from "@/components/Particles";
import { MagneticButton } from "@/components/MagneticButton";
import { useReveal } from "@/hooks/use-reveal";
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
      <Header />
      <Hero />
      <Marquee />
      <Comparison />
      <Portfolio />
      <Features />
      <Process />
      <CTA />
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

function Hero() {
  const [scrollY, setScrollY] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMouse({ x, y });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <section className="relative grain min-h-screen overflow-hidden bg-black hero-enter">
      {/* Single full-width cinematic background image (car + scene baked in) */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{
          transform: `translate3d(${mouse.x * -8}px, ${scrollY * 0.12 + mouse.y * -6}px, 0)`,
        }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center animate-slow-zoom"
          style={{
            backgroundImage: `url(${heroBg})`,
            filter: "contrast(1.08) saturate(1.05)",
          }}
        />
      </div>

      {/* Soft left-side fade for text legibility — seamless, no hard edge.
          Goes from black on the far left to fully transparent past the headline,
          so the car on the right is never cut off. */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.85)_0%,rgba(0,0,0,0.55)_25%,rgba(0,0,0,0.15)_45%,transparent_60%)]" />

      {/* Subtle bottom fade into the page */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black to-transparent" />

      {/* Soft vignette + atmospheric haze + particles */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.7)_100%)]" />
      <Particles count={22} />
      <div className="beam-sweep" />

      {/* Foreground content */}
      <div className="relative mx-auto grid min-h-screen max-w-7xl grid-cols-1 gap-8 px-6 pt-32 pb-12 md:grid-cols-12 md:px-12">
        <div className="md:col-span-7 flex flex-col justify-center">
          <div className="mb-6 word-blast" style={{ animationDelay: "0.05s" }}>
            <span className="font-body text-xs font-medium uppercase tracking-[0.35em] text-ember-glow">
              People buy with their eyes first.
            </span>
          </div>

          <h1 className="font-display text-[3.4rem] leading-[0.95] tracking-tight text-foreground sm:text-7xl md:text-[6rem] lg:text-[7rem] [text-shadow:0_2px_40px_rgba(0,0,0,0.7)]">
            <span className="word-overshoot inline-block" style={{ animationDelay: "0.15s" }}>Make&nbsp;</span>
            <span className="word-overshoot inline-block" style={{ animationDelay: "0.27s" }}>your&nbsp;</span>
            <span className="word-overshoot inline-block" style={{ animationDelay: "0.39s" }}>car</span>
            <br />
            <span className="word-overshoot inline-block" style={{ animationDelay: "0.52s" }}>impossible&nbsp;</span>
            <span className="word-overshoot inline-block" style={{ animationDelay: "0.66s" }}>to</span>
            <br />
            <span
              className="word-overshoot inline-block font-editorial text-gradient-animated [filter:drop-shadow(0_0_32px_oklch(0.72_0.22_315_/_0.7))]"
              style={{ animationDelay: "0.82s" }}
            >
              ignore.
            </span>
          </h1>

          <p
            className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg word-blast"
            style={{ animationDelay: "1.05s" }}
          >
            We transform ordinary car photos into high-impact images that grab
            attention and{" "}
            <span className="text-ember-glow font-medium">sell faster</span>.
          </p>

          <div className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center word-blast" style={{ animationDelay: "1.25s" }}>
            <MagneticButton
              href="mailto:aspecttdigital@gmail.com"
              className="group relative overflow-hidden rounded-full border border-ember/60 bg-transparent px-9 py-4 text-center font-display text-sm tracking-[0.25em] text-foreground shadow-[0_0_30px_-5px_oklch(0.62_0.25_305_/_0.6)] transition hover:bg-ember/10"
            >
              <span className="relative z-10 inline-flex items-center gap-3">
                GET IN TOUCH <span aria-hidden>→</span>
              </span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </MagneticButton>

            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-ember/50 text-ember">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
                </svg>
              </span>
              <div className="leading-tight">
                <div className="font-display text-sm tracking-[0.2em] text-foreground">
                  FAST. POWERFUL. IRRESISTIBLE.
                </div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  Photos that sell
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Inline stats — no card, no block. Sits as text on the seamless background. */}
        <div
          className="md:col-span-7 word-blast mt-12 flex flex-wrap gap-x-10 gap-y-6"
          style={{ animationDelay: "1.45s" }}
        >
          <InlineStat value="3X" label="More views" />
          <span className="hidden h-10 w-px bg-white/15 sm:block" />
          <InlineStat value="2.7X" label="Faster sales" />
          <span className="hidden h-10 w-px bg-white/15 sm:block" />
          <InlineStat value="100%" label="Pro quality" />
        </div>
      </div>

      {/* Trust bar */}
      <div className="relative mx-auto max-w-7xl px-6 pb-8 md:px-12">
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
    </section>
  );
}

function InlineStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col">
      <span className="font-display text-4xl leading-none tracking-tight text-foreground md:text-5xl [text-shadow:0_2px_20px_rgba(0,0,0,0.7)]">
        {value}
      </span>
      <span className="mt-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        {label}
      </span>
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
