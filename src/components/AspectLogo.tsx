export function AspectLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-ember">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-foreground">
          {/* Target rings */}
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5.5" />
          <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
          {/* Arrow shaft + head crossing the target */}
          <path d="M3 21L13 11" strokeLinecap="round" />
          <path d="M13 11L17 7" strokeLinecap="round" />
          <path d="M14 6h3v3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span className="font-display text-2xl tracking-[0.2em] text-foreground">
        ASPECT
      </span>
    </div>
  );
}