import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

function classes({ variant, size }: { variant: Variant; size: Size }) {
  const base =
    "inline-flex items-center justify-center whitespace-nowrap rounded-full font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-yellow/35 disabled:cursor-not-allowed disabled:opacity-50";

  const sizes: Record<Size, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm"
  };

  const variants: Record<Variant, string> = {
    primary: "bg-brand-red text-white shadow-sm hover:bg-brand-red/90",
    secondary:
      "border border-brand-red/20 bg-white text-brand-red shadow-sm hover:bg-brand-yellow/20 hover:border-brand-red/30",
    ghost: "text-slate-700 hover:bg-brand-yellow/20 hover:text-slate-900"
  };

  return `${base} ${sizes[size]} ${variants[variant]}`;
}

export function ButtonLink({
  href,
  children,
  variant = "secondary",
  size = "md",
  className = "",
  ...rest
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
} & Omit<React.ComponentProps<typeof Link>, "href" | "className" | "children">) {
  return (
    <Link href={href} className={`${classes({ variant, size })} ${className}`} {...rest}>
      {children}
    </Link>
  );
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...rest
}: {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">) {
  return (
    <button className={`${classes({ variant, size })} ${className}`} {...rest}>
      {children}
    </button>
  );
}

