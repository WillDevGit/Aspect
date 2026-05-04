const headlineWords = [
  { text: "Your", delay: 0.5 },
  { text: "competitors", delay: 0.62 },
  { text: "are", delay: 0.74 },
  { text: "already", delay: 0.86 },
];

export function HeroHeadline() {
  return (
    <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center px-6 text-center">
      {/* Radial ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(127,119,221,0.08), transparent 70%)",
        }}
      />

      {/* Scanline */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full overflow-hidden"
      >
        <div className="hero-scanline absolute inset-x-0 h-px" />
      </div>

      {/* Eyebrow */}
      <div
        className="hero-fadeup"
        style={{
          fontFamily: "'DM Mono', monospace",
          fontWeight: 300,
          fontSize: "10px",
          color: "#7F77DD",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          marginBottom: "22px",
          animationDelay: "0.2s",
        }}
      >
        · ASPECT · VISUAL INTELLIGENCE ·
      </div>

      {/* Headline */}
      <h1
        style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: "clamp(32px, 5vw, 58px)",
          letterSpacing: "-0.03em",
          lineHeight: 1.05,
          color: "#ffffff",
          margin: 0,
        }}
      >
        {headlineWords.map((w) => (
          <span
            key={w.text}
            className="hero-word"
            style={{ animationDelay: `${w.delay}s` }}
          >
            {w.text}
          </span>
        ))}
        <span
          className="hero-word relative"
          style={{ animationDelay: "0.98s" }}
        >
          <span
            aria-hidden
            className="hero-shimmer absolute inset-0"
            style={{ filter: "blur(18px)", opacity: 0.45 }}
          >
            doing this
          </span>
          <span className="hero-shimmer relative">doing this</span>
        </span>
        <span
          className="hero-word"
          style={{ animationDelay: "1.10s", color: "#7F77DD" }}
        >
          .
        </span>
      </h1>

      {/* Subline */}
      <p
        className="hero-fadeup"
        style={{
          fontFamily: "'DM Mono', monospace",
          fontWeight: 300,
          fontSize: "12.5px",
          color: "rgba(255,255,255,0.42)",
          letterSpacing: "0.04em",
          lineHeight: 1.7,
          maxWidth: "480px",
          marginTop: "28px",
          animationDelay: "1.3s",
        }}
      >
        AI-powered visual intelligence for brands that{" "}
        <span style={{ color: "rgba(192,132,252,0.75)" }}>can't afford</span> to
        fall behind.
      </p>

      {/* Divider */}
      <div
        aria-hidden
        style={{
          width: "40px",
          height: "0.5px",
          background: "rgba(127,119,221,0.3)",
          marginTop: "24px",
          marginBottom: "48px",
        }}
      />
    </div>
  );
}
