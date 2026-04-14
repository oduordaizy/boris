import Link from "next/link";

const navLinks = [
 
  { href: "/dashboard", label: "Dashboard" },
 
  { href: "/login", label: "Login" },
  { href: "/register", label: "Register" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-semibold tracking-tight text-slate-900">
          Boris Tool
        </Link>

        <nav className="hidden items-center gap-4 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 md:hidden">
          <span className="text-sm font-medium text-slate-500">Menu</span>
        </div>
      </div>
    </header>
  );
}
