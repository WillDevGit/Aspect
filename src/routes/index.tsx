import { createFileRoute } from "@tanstack/react-router";
import { BeforeAfter } from "@/components/BeforeAfter";
import { Portfolio } from "@/components/Portfolio";
import { AspectLogo } from "@/components/AspectLogo";
import heroBg from "@/assets/hero-bg.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aspect — Fotos de carro de nível profissional" },
      {
        name: "description",
        content:
          "A Aspect transforma fotos amadoras de carros em imagens cinematográficas dignas de revista. Para concessionárias, lojistas e entusiastas.",
      },
      { property: "og:title", content: "Aspect — Fotos de carro de nível profissional" },
      {
        property: "og:description",
        content: "Transforme fotos comuns de carros em imagens cinematográficas em minutos.",
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
      <Pricing />
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
          <a href="#trabalho" className="transition hover:text-foreground">Trabalho</a>
          <a href="#portfolio" className="transition hover:text-foreground">Portfólio</a>
          <a href="#processo" className="transition hover:text-foreground">Processo</a>
          <a href="#precos" className="transition hover:text-foreground">Preços</a>
        </nav>
        <a
          href="#cta"
          className="hidden rounded-sm border border-ember/40 bg-ember/10 px-5 py-2 text-sm font-medium uppercase tracking-widest text-ember transition hover:bg-ember hover:text-accent-foreground md:inline-block"
        >
          Enviar fotos
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
              FOTOGRAFIA AUTOMOTIVA · IA
            </span>
          </div>

          <h1 className="font-display text-6xl leading-[0.9] tracking-tight text-foreground md:text-8xl lg:text-[10rem]">
            DA GARAGEM
            <br />
            <span className="font-editorial text-5xl text-gradient-ember md:text-7xl lg:text-9xl">
              à capa
            </span>
            <br />
            DE REVISTA.
          </h1>

          <p className="mt-10 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            A Aspect pega aquela foto torta tirada no estacionamento e devolve uma
            imagem cinematográfica que vende. Em minutos. Sem estúdio.
          </p>

          <div className="mt-12 flex flex-col gap-4 sm:flex-row">
            <a
              href="#cta"
              className="group relative overflow-hidden rounded-sm bg-ember px-8 py-4 text-center font-display text-base tracking-widest text-accent-foreground transition hover:bg-ember-glow"
            >
              ENVIAR MINHA FOTO →
            </a>
            <a
              href="#trabalho"
              className="rounded-sm border border-border px-8 py-4 text-center font-display text-base tracking-widest text-foreground transition hover:border-ember hover:text-ember"
            >
              VER TRANSFORMAÇÕES
            </a>
          </div>

          <div className="mt-16 flex items-center gap-8 text-sm text-muted-foreground">
            <Stat n="12k+" label="Fotos tratadas" />
            <div className="h-8 w-px bg-border" />
            <Stat n="48h" label="Entrega média" />
            <div className="h-8 w-px bg-border" />
            <Stat n="320+" label="Lojas atendidas" />
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
    <section id="trabalho" className="border-t border-border bg-surface py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-12 grid gap-8 md:grid-cols-2 md:items-end">
          <div>
            <div className="mb-4 font-display text-sm tracking-[0.3em] text-ember">
              ANTES / DEPOIS
            </div>
            <h2 className="font-display text-5xl leading-none tracking-tight md:text-7xl">
              ARRASTE.
              <br />
              <span className="font-editorial text-gradient-ember">veja a diferença.</span>
            </h2>
          </div>
          <p className="text-lg text-muted-foreground md:text-right">
            Mesma foto. Mesmo carro. Tratamento profissional, fundo
            recriado, iluminação cinematográfica e cor calibrada para venda.
          </p>
        </div>

        <BeforeAfter />

        <p className="mt-6 text-center text-xs uppercase tracking-widest text-muted-foreground">
          Arraste o controle ⇄ para comparar
        </p>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    {
      n: "01",
      title: "Fundo cinematográfico",
      text: "Removemos o estacionamento, a oficina, o trânsito. Inserimos cenários dignos de campanha.",
    },
    {
      n: "02",
      title: "Luz que vende",
      text: "Reflexos na lataria, sombras controladas e color grading que valorizam cada curva.",
    },
    {
      n: "03",
      title: "Detalhe absoluto",
      text: "Pneus restaurados, vidros limpos, faróis brilhando. Pronto para anúncio premium.",
    },
    {
      n: "04",
      title: "Entrega rápida",
      text: "Em até 48 horas suas fotos voltam prontas para Instagram, OLX, Webmotors ou catálogo.",
    },
  ];

  return (
    <section className="border-t border-border py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-16 max-w-2xl">
          <div className="mb-4 font-display text-sm tracking-[0.3em] text-ember">
            O QUE FAZEMOS
          </div>
          <h2 className="font-display text-5xl leading-none tracking-tight md:text-7xl">
            QUATRO PASSOS.
            <br />
            <span className="font-editorial text-gradient-ember">um resultado.</span>
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
    { k: "01", t: "Você envia", d: "Manda suas fotos pelo WhatsApp ou upload no site. Quantas quiser." },
    { k: "02", t: "Nossa equipe trata", d: "IA + retoque humano. Cada imagem passa por um especialista." },
    { k: "03", t: "Aprovação", d: "Você recebe um preview. Pede ajustes se quiser, sem custo extra." },
    { k: "04", t: "Entrega final", d: "Arquivos em alta resolução, prontos para qualquer canal." },
  ];
  return (
    <section id="processo" className="border-t border-border bg-surface py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-16 grid gap-8 md:grid-cols-2 md:items-end">
          <h2 className="font-display text-5xl leading-none tracking-tight md:text-7xl">
            COMO FUNCIONA
          </h2>
          <p className="max-w-md text-lg text-muted-foreground md:justify-self-end">
            Sem complicação. Sem briefing de 40 páginas. Você manda. A gente entrega.
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

function Pricing() {
  const plans = [
    {
      name: "Single",
      price: "R$ 29",
      unit: "por foto",
      desc: "Perfeito para o entusiasta que quer aquela foto especial.",
      perks: ["Tratamento completo", "Fundo recriado", "Entrega em 48h", "1 revisão grátis"],
      featured: false,
    },
    {
      name: "Lojista",
      price: "R$ 19",
      unit: "por foto · pacote 20+",
      desc: "Para quem vende carros e precisa de volume com qualidade.",
      perks: [
        "Tudo do plano Single",
        "Logo da loja embutida",
        "Entrega prioritária 24h",
        "Revisões ilimitadas",
        "Gestor dedicado",
      ],
      featured: true,
    },
    {
      name: "Studio",
      price: "Custom",
      unit: "concessionárias",
      desc: "Volume alto, integração via API e SLA dedicado.",
      perks: ["Pipeline automatizado", "API e webhooks", "Brand kit personalizado", "Suporte 24/7"],
      featured: false,
    },
  ];

  return (
    <section id="precos" className="border-t border-border py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-16 text-center">
          <div className="mb-4 font-display text-sm tracking-[0.3em] text-ember">
            PREÇOS HONESTOS
          </div>
          <h2 className="font-display text-5xl leading-none tracking-tight md:text-7xl">
            ESCOLHA SEU
            <span className="font-editorial text-gradient-ember"> ângulo.</span>
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative flex flex-col border p-8 transition md:p-10 ${
                p.featured
                  ? "border-ember bg-surface glow-ember"
                  : "border-border hover:border-ember/40"
              }`}
            >
              {p.featured && (
                <div className="absolute -top-3 left-8 bg-ember px-3 py-1 font-display text-xs tracking-widest text-accent-foreground">
                  MAIS PEDIDO
                </div>
              )}
              <div className="font-display text-2xl tracking-widest text-muted-foreground">
                {p.name.toUpperCase()}
              </div>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="font-display text-6xl text-foreground">{p.price}</span>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{p.unit}</div>
              <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>

              <ul className="mt-8 space-y-3 text-sm">
                {p.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-3">
                    <span className="mt-1.5 inline-block h-1 w-3 flex-shrink-0 bg-ember" />
                    <span className="text-foreground">{perk}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#cta"
                className={`mt-10 block rounded-sm py-3 text-center font-display text-sm tracking-widest transition ${
                  p.featured
                    ? "bg-ember text-accent-foreground hover:bg-ember-glow"
                    : "border border-border text-foreground hover:border-ember hover:text-ember"
                }`}
              >
                COMEÇAR
              </a>
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
      id="cta"
      className="relative grain overflow-hidden border-t border-border py-24 md:py-36"
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />

      <div className="relative mx-auto max-w-4xl px-6 text-center md:px-12">
        <h2 className="font-display text-6xl leading-[0.9] tracking-tight md:text-8xl">
          MANDA A FOTO.
          <br />
          <span className="font-editorial text-gradient-ember">a gente faz mágica.</span>
        </h2>
        <p className="mx-auto mt-8 max-w-xl text-lg text-muted-foreground">
          Primeira foto por nossa conta. Você só paga se amar o resultado.
        </p>
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="https://wa.me/5511999999999"
            className="rounded-sm bg-ember px-10 py-4 font-display text-base tracking-widest text-accent-foreground transition hover:bg-ember-glow"
          >
            ENVIAR PELO WHATSAPP
          </a>
          <a
            href="mailto:ola@aspect.studio"
            className="rounded-sm border border-border px-10 py-4 font-display text-base tracking-widest transition hover:border-ember hover:text-ember"
          >
            FALAR COM TIME
          </a>
        </div>
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
          © {new Date().getFullYear()} Aspect Studio · Fotografia automotiva
        </p>
        <div className="flex gap-6 text-xs uppercase tracking-widest text-muted-foreground">
          <a href="#" className="transition hover:text-ember">Instagram</a>
          <a href="#" className="transition hover:text-ember">Behance</a>
          <a href="#" className="transition hover:text-ember">Contato</a>
        </div>
      </div>
    </footer>
  );
}
