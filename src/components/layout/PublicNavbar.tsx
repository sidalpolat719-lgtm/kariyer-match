import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Logo } from "../ui/Logo";
import { Button } from "../ui/Button";
import { cn } from "../../lib/cn";
import { useAuth } from "../../context/AuthContext";

const links = [
  { label: "Özellikler", href: "#features" },
  { label: "Nasıl Çalışır?", href: "#how" },
  { label: "Stajlar", href: "#internships" },
  { label: "Hikayeler", href: "#stories" },
];

export function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthed } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        scrolled ? "bg-white/85 backdrop-blur-xl border-b border-ink-100 shadow-soft" : "bg-transparent"
      )}
    >
      <div className="section h-16 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3 py-2 text-sm font-semibold text-ink-700 hover:text-midnight-950 rounded-lg hover:bg-ink-100 transition"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-2">
          {isAuthed ? (
            <>
              <Button variant="outline" size="sm" onClick={() => navigate("/app")}>
                Uygulamaya Git
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-midnight-950 hover:text-electric-700"
              >
                Giriş Yap
              </Link>
              <Button size="sm" onClick={() => navigate("/register")}>
                Hemen Başla
              </Button>
            </>
          )}
        </div>
        <button
          className="md:hidden p-2 rounded-lg text-ink-700"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menü"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-ink-100">
          <div className="section py-4 flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 text-sm font-semibold text-ink-700 rounded-lg hover:bg-ink-100"
              >
                {l.label}
              </a>
            ))}
            <div className="h-px bg-ink-100 my-2" />
            {isAuthed ? (
              <Button onClick={() => navigate("/app")} fullWidth>
                Uygulamaya Git
              </Button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => navigate("/login")}>
                  Giriş Yap
                </Button>
                <Button onClick={() => navigate("/register")}>Kayıt Ol</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
