export function Surface({
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-3xl bg-white/70 ring-2 ring-slate-900/10 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/60 ${className}`}
    >
      {children}
    </div>
  );
}
