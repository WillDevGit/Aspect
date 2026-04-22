export function AspectLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`group flex items-center gap-2 ${className}`}>
      <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-sm bg-ember transition-transform duration-500 group-hover:scale-110">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="relative z-10 text-accent-foreground"
        >
          {/* Target rings — outer ring spins slowly */}
          <g className="origin-center animate-spin-slow" style={{ transformOrigin: "12px 12px" }}>
            <circle cx="12" cy="12" r="9" strokeDasharray="3 2" />
          </g>
          <circle cx="12" cy="12" r="5.5" />
          <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
          {/* Arrow shaft + head crossing the target */}
          <path d="M3 21L13 11" strokeLinecap="round" />
          <path d="M13 11L17 7" strokeLinecap="round" />
          <path d="M14 6h3v3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      </div>
      <span className="font-display text-2xl tracking-[0.2em] text-foreground">
        ASPECT
      </span>
    </div>
  );
}