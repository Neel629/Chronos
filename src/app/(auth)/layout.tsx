import Link from "next/link";
import { Clock } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-dvh flex flex-col items-center justify-center px-4 py-12">
      {/* Background effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-streak/5 rounded-full blur-3xl" />
      </div>

      {/* Logo */}
      <Link
        href="/"
        className="mb-8 flex items-center gap-2.5 group"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
          <Clock className="h-4.5 w-4.5" />
        </div>
        <span className="text-xl font-bold tracking-tight">Chronos</span>
      </Link>

      {/* Content */}
      <div className="w-full max-w-sm">{children}</div>

      {/* Footer */}
      <p className="mt-8 text-xs text-muted-foreground text-center">
        © {new Date().getFullYear()} Chronos. Built for those who move.
      </p>
    </div>
  );
}
