import { useState } from "react";
import { BeforeAfter } from "@/components/BeforeAfter";
import suvBefore from "@/assets/portfolio/suv-before.jpg";
import suvAfter from "@/assets/portfolio/suv-after.jpg";
import sedanBefore from "@/assets/portfolio/sedan-before.jpg";
import sedanAfter from "@/assets/portfolio/sedan-after.jpg";
import sportBefore from "@/assets/portfolio/sport-before.jpg";
import sportAfter from "@/assets/portfolio/sport-after.jpg";
import classicBefore from "@/assets/portfolio/classic-before.jpg";
import classicAfter from "@/assets/portfolio/classic-after.jpg";

type Category = "suv" | "sedan" | "esportivo" | "classico";

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
    model: "SUV familiar branco",
    scene: "Estrada de montanha · golden hour",
    before: suvBefore,
    after: suvAfter,
  },
  {
    key: "sedan",
    label: "Sedan",
    model: "Sedan executivo prata",
    scene: "Arquitetura urbana · blue hour",
    before: sedanBefore,
    after: sedanAfter,
  },
  {
    key: "esportivo",
    label: "Esportivo",
    model: "Esportivo vermelho",
    scene: "Rua molhada · neon noir",
    before: sportBefore,
    after: sportAfter,
  },
  {
    key: "classico",
    label: "Clássico",
    model: "Coupé clássico anos 60",
    scene: "Fachada art déco · sépia editorial",
    before: classicBefore,
    after: classicAfter,
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
              PORTFÓLIO
            </div>
            <h2 className="font-display text-5xl leading-none tracking-tight md:text-7xl">
              QUALQUER CARRO.
              <br />
              <span className="font-editorial text-gradient-ember">
                qualquer cenário.
              </span>
            </h2>
          </div>
          <p className="text-lg text-muted-foreground md:text-right">
            De picapes empoeiradas a clássicos de coleção. Cada projeto recebe
            tratamento sob medida, com cenário e iluminação que combinam com a
            personalidade do veículo.
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
            beforeAlt={`${current.model} antes do tratamento Aspect`}
            afterAlt={`${current.model} após tratamento Aspect`}
            afterLabel="DEPOIS — ASPECT"
          />

          <aside className="flex flex-col justify-between gap-8 border border-border bg-surface p-8 lg:max-w-xs">
            <div>
              <div className="font-display text-xs tracking-[0.3em] text-ember">
                CATEGORIA
              </div>
              <div className="mt-2 font-display text-3xl tracking-wide text-foreground">
                {current.label}
              </div>
              <div className="mt-6 font-display text-xs tracking-[0.3em] text-ember">
                MODELO
              </div>
              <div className="mt-2 text-base text-foreground">
                {current.model}
              </div>
              <div className="mt-6 font-display text-xs tracking-[0.3em] text-ember">
                CENÁRIO
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
                    aria-label={`Ver ${it.label}`}
                  >
                    <img
                      src={it.after}
                      alt={`Miniatura ${it.label}`}
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
          Selecione uma categoria · arraste o controle ⇄ para comparar
        </p>
      </div>
    </section>
  );
}