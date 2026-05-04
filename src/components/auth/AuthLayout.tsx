import { Link } from "react-router-dom";
import { Logo } from "../ui/Logo";
import { Sparkles, ShieldCheck, Star, Quote } from "lucide-react";

export function AuthLayout({
  title,
  subtitle,
  children,
  side = "default",
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  side?: "default" | "company";
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* Left brand panel */}
      <aside className="hidden lg:flex relative flex-col justify-between p-10 bg-grad-primary text-white overflow-hidden">
        <div className="absolute inset-0 -z-0 bg-grad-mesh opacity-25 mix-blend-overlay" />
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-electric-400/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-royal-500/20 blur-3xl" />

        <div className="relative">
          <Logo variant="light" />
        </div>

        <div className="relative max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-electric-300" />
            {side === "company" ? "Şirketler için akıllı yetenek havuzu" : "Yeteneğine en uygun kariyer rotası"}
          </div>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight leading-tight">
            {side === "company"
              ? "Doğru aday, doğru zamanda — sana göre eşleşmiş."
              : "Geleceğini tek bir akıllı platformda inşa et."}
          </h1>
          <p className="mt-4 text-white/80">
            {side === "company"
              ? "Yetenek havuzunu otomatik filtrele, eşleşme skorlarıyla en güçlü adaylara ulaş ve süreçlerini PathMatch ile yönet."
              : "Profilini bir kez oluştur, AI tabanlı eşleşme motoru sana en uygun staj ve iş fırsatlarını otomatik olarak getirsin."}
          </p>

          <div className="mt-10 space-y-3">
            <Highlight icon={<Sparkles className="w-4 h-4" />} text="AI tabanlı yetenek eşleşmesi" />
            <Highlight icon={<ShieldCheck className="w-4 h-4" />} text="KVKK uyumlu, güvenli profil" />
            <Highlight icon={<Star className="w-4 h-4" />} text="850+ şirket ortağı" />
          </div>
        </div>

        <div className="relative">
          <div className="rounded-2xl p-4 bg-white/10 backdrop-blur-xl border border-white/20 max-w-md">
            <Quote className="w-5 h-5 text-electric-200" />
            <p className="mt-2 text-sm text-white/90">
              "PathMatch ile bir hafta içinde Nova Labs'ta stajıma başladım. Eşleşme skoru gerçekten doğruydu."
            </p>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-electric-400" />
              <div>
                <div className="text-xs font-bold">Selin K.</div>
                <div className="text-[10px] text-white/60">Frontend Stajyer · Nova Labs</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Right form */}
      <main className="flex flex-col">
        <div className="flex items-center justify-between p-5">
          <Link to="/" className="lg:hidden">
            <Logo />
          </Link>
          <div className="lg:hidden" />
          <Link
            to="/"
            className="ml-auto text-xs font-semibold text-ink-600 hover:text-midnight-950"
          >
            ← Ana sayfa
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center px-5 pb-10">
          <div className="w-full max-w-md">
            <h2 className="h-display text-3xl">{title}</h2>
            <p className="mt-2 text-ink-600">{subtitle}</p>
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Highlight({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur border border-white/20 text-sm">
      <span className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center text-electric-200">
        {icon}
      </span>
      {text}
    </div>
  );
}
