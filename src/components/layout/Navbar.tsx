import { useEffect, useState } from "react";
import { Menu, TrendingUp, X } from "lucide-react";
import { scrollToSection } from "@/lib/scrollToSection";

const NAV_LINKS = [
  { id: "servicos", label: "Serviços" },
  { id: "calculadoras", label: "Calculadoras" },
  { id: "finbot", label: "FinBot" },
  { id: "agendar", label: "Agendar" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function navigate(id: string) {
    setMenuOpen(false);
    scrollToSection(id);
  }

  const onDark = !scrolled && !menuOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        onDark ? "bg-transparent" : "border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate("inicio")}
          className="flex items-center gap-2.5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500">
            <TrendingUp className="h-5 w-5 text-white" aria-hidden="true" />
          </span>
          <span className={`text-base font-bold tracking-tight transition-colors ${onDark ? "text-white" : "text-slate-900"}`}>
            FinFlow Capital
          </span>
        </button>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.id}>
              <button
                type="button"
                onClick={() => navigate(link.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                  onDark ? "text-slate-200 hover:bg-white/10 hover:text-white" : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => navigate("agendar")}
          className="hidden rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 md:inline-flex"
        >
          Falar com consultor
        </button>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          className={`inline-flex h-10 w-10 items-center justify-center rounded-lg transition md:hidden ${
            onDark ? "text-white hover:bg-white/10" : "text-slate-900 hover:bg-slate-100"
          }`}
        >
          {menuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-6 pb-6 pt-2 shadow-lg md:hidden">
          <ul className="space-y-1">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <button
                  type="button"
                  onClick={() => navigate(link.id)}
                  className="w-full rounded-lg px-3 py-3 text-left text-base font-medium text-slate-800 hover:bg-slate-100"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
