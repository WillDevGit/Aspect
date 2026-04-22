import { useState } from "react";
import { BeforeAfter } from "@/components/BeforeAfter";
import suvBefore from "@/assets/portfolio/suv-before.jpg";
import suvAfter from "@/assets/portfolio/suv-after.jpg";
import sedanBefore from "@/assets/portfolio/sedan-before.jpg";
import sedanAfter from "@/assets/portfolio/sedan-after.jpg";
import sportBefore from "@/assets/portfolio/sport-before.jpg";
import sportAfter from "@/assets/portfolio/sport-after.jpg";

type Category = "suv" | "sedan" | "sport";

interface Item {
  key: Category;
  label: string;
  model: string;
  scene: string;
  before: string;
  after: string;
}

const items: Item[] = [
  {
    key: "suv",
    label: "SUV",
    model: "White family SUV",
    scene: "Aspect Showroom · main stage",
    before: suvBefore,
    after: suvAfter,
  },
  {
    key: "sedan",
    label: "Sedan",
    model: "Silver executive sedan",
    scene: "Aspect Showroom · scenic lighting",
    before: sedanBefore,
    after: sedanAfter,
  },
  {
    key: "sport",
    label: "Sport",
    model: "Red sports car",
    scene: "Aspect Showroom · dramatic spotlight",
    before: sportBefore,
    after: sportAfter,
  },
];

export function Portfolio() {
  const [active, setActive] = useState<Category>("suv");
  const current = items.find((i) => i.key === active) ?? items[0];

  return (
    <section
      id="portfolio"
      className="border-t border-border bg-background py-24 md:py-36"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-12 grid gap-8 md:grid-cols-2 md:items-end">
          <div>
            <div className="mb-4 font-display text-sm tracking-[0.3em] text-ember">
              PORTFOLIO
            </div>
            <h2 className="font-display text-5xl leading-none tracking-tight md:text-7xl">
              ANY CAR.
              <br />
              <span className="font-editorial text-gradient-ember">
                any scene.
              </span>
            </h2>
          </div>
          <p className="text-lg text-muted-foreground md:text-right">
            From dusty pickups to collector classics. Every project gets
            tailored treatment, with scenery and lighting that match the
            personality of the vehicle.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="mb-10 flex flex-wrap gap-2 md:gap-3">
          {items.map((it) => {
            const isActive = it.key === active;
            return (
              <button
                key={it.key}
                onClick={() => setActive(it.key)}
                className={`rounded-sm border px-5 py-3 font-display text-sm tracking-widest transition ${
                  isActive
                    ? "border-ember bg-ember text-accent-foreground"
                    : "border-border text-muted-foreground hover:border-ember/60 hover:text-foreground"
                }`}
              >
                {it.label.toUpperCase()}
              </button>
            );
          })}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-start">
          <BeforeAfter
            key={current.key}
            beforeSrc={current.before}
            afterSrc={current.after}
            beforeAlt={`${current.model} before Aspect treatment`}
            afterAlt={`${current.model} after Aspect treatment`}
            afterLabel="AFTER — ASPECT"
          />

          <aside className="flex flex-col justify-between gap-8 border border-border bg-surface p-8 lg:max-w-xs">
            <div>
              <div className="font-display text-xs tracking-[0.3em] text-ember">
                CATEGORY
              </div>
              <div className="mt-2 font-display text-3xl tracking-wide text-foreground">
                {current.label}
              </div>
              <div className="mt-6 font-display text-xs tracking-[0.3em] text-ember">
                MODEL
              </div>
              <div className="mt-2 text-base text-foreground">
                {current.model}
              </div>
              <div className="mt-6 font-display text-xs tracking-[0.3em] text-ember">
                SCENE
              </div>
              <div className="mt-2 text-base text-foreground">
                {current.scene}
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <div className="grid grid-cols-2 gap-4">
                {items.map((it) => (
                  <button
                    key={it.key}
                    onClick={() => setActive(it.key)}
                    className={`group relative aspect-[4/3] overflow-hidden rounded-sm border transition ${
                      it.key === active
                        ? "border-ember"
                        : "border-border hover:border-ember/60"
                    }`}
                    aria-label={`View ${it.label}`}
                  >
                    <img
                      src={it.after}
                      alt={`${it.label} thumbnail`}
                      width={320}
                      height={240}
                      loading="lazy"
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background to-transparent p-2">
                      <div className="font-display text-[10px] tracking-widest text-foreground">
                        {it.label.toUpperCase()}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <p className="mt-6 text-center text-xs uppercase tracking-widest text-muted-foreground">
          Select a category · drag the slider ⇄ to compare
        </p>
      </div>
    </section>
  );
}