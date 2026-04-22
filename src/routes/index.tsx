import { createFileRoute } from "@tanstack/react-router";
import { BeforeAfter } from "@/components/BeforeAfter";
import { Portfolio } from "@/components/Portfolio";
import { AspectLogo } from "@/components/AspectLogo";
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
  return (
    <section className="relative grain min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 pt-32 pb-20 md:px-12">
        <div className="max-w-3xl animate-float-up">
          <div className="mb-8 flex items-center gap-3">
            <span className="h-px w-12 bg-ember" />
            <span className="font-display text-sm tracking-[0.3em] text-ember">
              AUTOMOTIVE PHOTOGRAPHY · AI
            </span>
          </div>

          <h1 className="font-display text-6xl leading-[0.9] tracking-tight text-foreground md:text-8xl lg:text-[10rem]">
            FROM THE GARAGE
            <br />
            <span className="font-editorial text-5xl text-gradient-ember md:text-7xl lg:text-9xl">
              to the cover
            </span>
            <br />
            OF A MAGAZINE.
          </h1>

          <p className="mt-10 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            Aspect takes that crooked photo shot in the parking lot and turns it
            into a cinematic image that sells. In minutes. No studio.
          </p>

          <div className="mt-12 flex flex-col gap-4 sm:flex-row">
            <a
              href="#portfolio"
              className="group relative overflow-hidden rounded-sm bg-ember px-8 py-4 text-center font-display text-base tracking-widest text-accent-foreground transition hover:bg-ember-glow"
            >
              VIEW PORTFOLIO →
            </a>
            <a
              href="#work"
              className="rounded-sm border border-border px-8 py-4 text-center font-display text-base tracking-widest text-foreground transition hover:border-ember hover:text-ember"
            >
              SEE TRANSFORMATIONS
            </a>
          </div>

          <div className="mt-16 flex items-center gap-8 text-sm text-muted-foreground">
            <Stat n="12k+" label="Photos retouched" />
            <div className="h-8 w-px bg-border" />
            <Stat n="2 yrs" label="In business" />
            <div className="h-8 w-px bg-border" />
            <Stat n="320+" label="Dealerships served" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div className="font-display text-3xl text-foreground">{n}</div>
      <div className="text-xs uppercase tracking-widest">{label}</div>
    </div>
  );
}

function Comparison() {
  return (
    <section id="work" className="border-t border-border bg-surface py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-12 grid gap-8 md:grid-cols-2 md:items-end">
          <div>
            <div className="mb-4 font-display text-sm tracking-[0.3em] text-ember">
              BEFORE / AFTER
            </div>
            <h2 className="font-display text-5xl leading-none tracking-tight md:text-7xl">
              DRAG.
              <br />
              <span className="font-editorial text-gradient-ember">see the difference.</span>
            </h2>
          </div>
          <p className="text-lg text-muted-foreground md:text-right">
            Same photo. Same car. Professional retouching, recreated
            background, cinematic lighting and color calibrated to sell.
          </p>
        </div>

        <BeforeAfter />

        <p className="mt-6 text-center text-xs uppercase tracking-widest text-muted-foreground">
          Drag the slider ⇄ to compare
        </p>
      </div>
    </section>
  );
}

function Features() {
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
    <section className="border-t border-border py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-16 max-w-2xl">
          <div className="mb-4 font-display text-sm tracking-[0.3em] text-ember">
            WHAT WE DO
          </div>
          <h2 className="font-display text-5xl leading-none tracking-tight md:text-7xl">
            FOUR STEPS.
            <br />
            <span className="font-editorial text-gradient-ember">one result.</span>
          </h2>
        </div>

        <div className="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <div
              key={it.n}
              className="group relative bg-background p-8 transition hover:bg-surface md:p-10"
            >
              <div className="font-editorial text-6xl text-ember/30 transition group-hover:text-ember">
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
  const steps = [
    { k: "01", t: "You email us", d: "Send your photos to our email. As many as you want." },
    { k: "02", t: "Our team retouches", d: "AI + human polish. Every image is reviewed by a specialist." },
    { k: "03", t: "Approval", d: "You get a preview. Request tweaks at no extra cost." },
    { k: "04", t: "Final delivery", d: "High-resolution files, ready for any channel." },
  ];
  return (
    <section id="process" className="border-t border-border bg-surface py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-16 grid gap-8 md:grid-cols-2 md:items-end">
          <h2 className="font-display text-5xl leading-none tracking-tight md:text-7xl">
            HOW IT WORKS
          </h2>
          <p className="max-w-md text-lg text-muted-foreground md:justify-self-end">
            No fuss. No 40-page briefing. You send. We deliver.
          </p>
        </div>

        <div className="space-y-px">
          {steps.map((s) => (
            <div
              key={s.k}
              className="group grid items-center gap-6 border-b border-border py-8 transition hover:bg-background md:grid-cols-12 md:gap-12 md:px-6"
            >
              <div className="font-display text-5xl text-ember md:col-span-2 md:text-6xl">
                {s.k}
              </div>
              <h3 className="font-display text-3xl tracking-wide text-foreground md:col-span-3 md:text-4xl">
                {s.t}
              </h3>
              <p className="text-base text-muted-foreground md:col-span-6 md:text-lg">
                {s.d}
              </p>
              <div className="hidden text-ember opacity-0 transition group-hover:opacity-100 md:col-span-1 md:block md:justify-self-end">
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
  return (
    <section
      id="contact"
      className="relative grain overflow-hidden border-t border-border py-24 md:py-36"
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />

      <div className="relative mx-auto max-w-4xl px-6 text-center md:px-12">
        <h2 className="font-display text-6xl leading-[0.9] tracking-tight md:text-8xl">
          LIKE WHAT YOU SEE?
          <br />
          <span className="font-editorial text-gradient-ember">let's talk.</span>
        </h2>
        <p className="mx-auto mt-8 max-w-xl text-lg text-muted-foreground">
          This is our portfolio. Drop us a line and we'll put together a quote
          tailored to your fleet, lot or personal collection.
        </p>
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="mailto:aspecttdigital@gmail.com"
            className="rounded-sm bg-ember px-10 py-4 font-display text-base tracking-widest text-accent-foreground transition hover:bg-ember-glow"
          >
            EMAIL US →
          </a>
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
