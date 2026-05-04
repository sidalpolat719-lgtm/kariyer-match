import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Briefcase,
  GraduationCap,
  Users,
  Map,
  ListChecks,
  Brain,
  Star,
  Rocket,
  ShieldCheck,
  PlayCircle,
  Quote,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { PublicNavbar } from "../components/layout/PublicNavbar";
import { PublicFooter } from "../components/layout/PublicFooter";
import { HeroPreview } from "../components/landing/HeroPreview";
import { trustedCompanies, universityLogos, seedInternships } from "../data/seed";
import { InternshipCard } from "../components/ui/InternshipCard";

const features = [
  {
    icon: <Brain className="w-6 h-6" />,
    title: "AI Destekli Kariyer Eşleşmesi",
    description:
      "Yetenekleri, hedefleri ve ilgi alanlarını analiz eden algoritmamız sana en uygun fırsatları seçer.",
    color: "from-electric-400 to-royal-500",
  },
  {
    icon: <Briefcase className="w-6 h-6" />,
    title: "Staj Keşif Motoru",
    description:
      "Yüzlerce kurumsal şirket, dinamik startup ve agence ilanını tek bir akışta gör.",
    color: "from-electric-400 to-emerald-500",
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "Yetenek Bazlı Profil",
    description:
      "Geleneksel CV'nin ötesinde — projelerini, sertifikalarını ve potansiyelini öne çıkar.",
    color: "from-royal-500 to-amber-400",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Şirket ve Mentor Ağı",
    description:
      "Sektör profesyonelleriyle birebir mentorluk seansları al, kariyer ağını organik biçimde büyüt.",
    color: "from-royal-500 to-electric-500",
  },
  {
    icon: <ListChecks className="w-6 h-6" />,
    title: "Başvuru Takibi",
    description:
      "Tüm başvurularını Kanban panosunda izle, sonraki adımları kaçırma.",
    color: "from-emerald-400 to-electric-500",
  },
  {
    icon: <Map className="w-6 h-6" />,
    title: "Kişisel Kariyer Yol Haritası",
    description:
      "Hedeflerine ulaşman için adım adım önerilen kurslar, projeler ve kilometre taşları.",
    color: "from-amber-400 to-rose-400",
  },
];

const steps = [
  { n: 1, title: "Profilini oluştur", desc: "Eğitim ve ilgi alanlarını ekle." },
  { n: 2, title: "Yeteneklerini seç", desc: "Hedeflerini ve uzmanlıklarını belirt." },
  { n: 3, title: "Eşleşmelerle tanış", desc: "Sana en uygun staj ve iş fırsatları." },
  { n: 4, title: "Başvurunu takip et", desc: "Süreçleri Kanban panosunda yönet." },
];

const stories = [
  {
    name: "Selin K.",
    role: "Frontend Stajyer · Nova Labs",
    quote:
      "PathMatch sayesinde portfolyoma uygun ilk stajımı bir hafta içinde buldum. Mentorum mülakata kadar yanımdaydı.",
    color: "#7c3aed",
  },
  {
    name: "Burak A.",
    role: "Veri Analisti · Atlas Analytics",
    quote:
      "Kariyer yol haritası sayesinde hangi becerilere odaklanmam gerektiğini netleştirdim. 3 ayda ilk işime başladım.",
    color: "#06b6d4",
  },
  {
    name: "Zeynep D.",
    role: "Ürün Tasarımı · Lumen Studio",
    quote:
      "Eşleşme skorları gerçekten doğru. Sadece bana uygun ilanları görmek başvuru sürecimi tamamen değiştirdi.",
    color: "#10b981",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />

      {/* HERO */}
      <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-grad-mesh opacity-60" />
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-electric-200/40 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-royal-200/40 blur-3xl" />
        </div>
        <div className="section">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 animate-fadeUp">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur border border-ink-100 text-xs font-semibold text-midnight-900">
                <Sparkles className="w-3.5 h-3.5 text-electric-500" />
                Yeni nesil kariyer ekosistemi
              </div>
              <h1 className="h-display mt-5 text-4xl sm:text-5xl lg:text-6xl leading-[1.05]">
                Kariyerine En Uygun{" "}
                <span className="text-gradient">Staj ve İş Fırsatlarını</span>{" "}
                Akıllı Eşleştirme ile Keşfet
              </h1>
              <p className="mt-5 text-base sm:text-lg text-ink-700 max-w-xl">
                Yeteneklerini, hedeflerini ve ilgi alanlarını analiz eden modern kariyer
                platformu. Öğrencileri, mezunları ve şirketleri tek bir akıllı ekosistemde buluşturur.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link to="/register">
                  <Button size="lg" iconRight={<ArrowRight className="w-5 h-5" />}>
                    Hemen Başla
                  </Button>
                </Link>
                <a href="#how">
                  <Button variant="outline" size="lg" iconLeft={<PlayCircle className="w-5 h-5" />}>
                    Nasıl Çalışır?
                  </Button>
                </a>
              </div>

              <div className="mt-8 flex items-center gap-5 text-sm text-ink-600">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {["#7c3aed", "#06b6d4", "#10b981", "#f59e0b"].map((c, i) => (
                      <div
                        key={i}
                        className="w-7 h-7 rounded-full ring-2 ring-white"
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                  <span>
                    <strong className="text-midnight-950">12.4K+</strong> öğrenci
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span>
                    <strong className="text-midnight-950">4.9</strong> · 1.2K yorum
                  </span>
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 animate-fadeUp">
              <HeroPreview />
            </div>
          </div>
        </div>
      </section>

      {/* TRUSTED BY */}
      <section className="py-10 border-y border-ink-100 bg-white">
        <div className="section">
          <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-ink-500">
            Türkiye'nin önde gelen üniversite ve şirketlerinin tercihi
          </p>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 items-center">
            {[...universityLogos, ...trustedCompanies].slice(0, 14).map((name, i) => (
              <div
                key={i}
                className="h-10 rounded-xl border border-ink-100 bg-ink-50/60 flex items-center justify-center text-xs font-bold text-ink-500 hover:text-midnight-900 transition"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 lg:py-28">
        <div className="section">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-electric-50 text-electric-700 text-xs font-bold uppercase tracking-wider">
              Özellikler
            </div>
            <h2 className="h-display mt-3 text-3xl sm:text-4xl">
              Kariyerinin tüm aşamaları için akıllı bir ekosistem
            </h2>
            <p className="mt-3 text-ink-600">
              PathMatch, sadece ilan listelemez. Öğrencilerin, mezunların ve şirketlerin doğru
              insanlarla doğru zamanda buluşmasını sağlar.
            </p>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="group relative card p-6 card-hover overflow-hidden"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} text-white flex items-center justify-center shadow-glow`}>
                  {f.icon}
                </div>
                <h3 className="mt-5 text-lg font-bold text-midnight-950">{f.title}</h3>
                <p className="mt-2 text-sm text-ink-600 leading-relaxed">{f.description}</p>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-grad-mesh opacity-0 group-hover:opacity-60 transition-opacity blur-2xl" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-20 lg:py-28 bg-grad-soft">
        <div className="section">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white text-royal-700 border border-royal-100 text-xs font-bold uppercase tracking-wider">
              Nasıl Çalışır?
            </div>
            <h2 className="h-display mt-3 text-3xl sm:text-4xl">
              Sadece 4 adımda doğru fırsatla buluş
            </h2>
            <p className="mt-3 text-ink-600">
              Profilini bir kez oluşturmak yeterli — gerisini PathMatch senin için izler.
            </p>
          </div>

          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-5 relative">
            <div className="hidden lg:block absolute top-12 left-12 right-12 h-px bg-gradient-to-r from-transparent via-electric-300 to-transparent -z-10" />
            {steps.map((s) => (
              <div key={s.n} className="card p-6 text-center relative">
                <div className="mx-auto w-12 h-12 rounded-2xl bg-grad-cta text-white flex items-center justify-center font-bold shadow-glow">
                  {s.n}
                </div>
                <h3 className="mt-4 font-bold text-midnight-950">{s.title}</h3>
                <p className="mt-1.5 text-sm text-ink-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED INTERNSHIPS */}
      <section id="internships" className="py-20 lg:py-28">
        <div className="section">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                Öne Çıkan Fırsatlar
              </div>
              <h2 className="h-display mt-3 text-3xl sm:text-4xl">Bu hafta dikkat çeken stajlar</h2>
              <p className="mt-2 text-ink-600">
                Üye olunca senin yeteneklerinle özel olarak eşleştirilirler.
              </p>
            </div>
            <Link to="/register">
              <Button variant="outline" iconRight={<ArrowRight className="w-4 h-4" />}>
                Tüm fırsatları gör
              </Button>
            </Link>
          </div>
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {seedInternships.slice(0, 6).map((i) => (
              <InternshipCard key={i.id} internship={i} variant="compact" />
            ))}
          </div>
        </div>
      </section>

      {/* STORIES */}
      <section
        id="stories"
        className="py-20 lg:py-28 relative overflow-hidden bg-midnight-950 text-white"
        style={{
          backgroundImage:
            "linear-gradient(135deg, #070f24 0%, #0d1a3a 40%, #1d3057 75%, #243f6e 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-30 mix-blend-screen pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(at 10% 10%, rgba(34,211,238,0.35) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(124,58,237,0.35) 0px, transparent 50%), radial-gradient(at 90% 80%, rgba(16,185,129,0.25) 0px, transparent 55%)",
          }}
        />
        <div className="section relative">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white text-xs font-bold uppercase tracking-wider">
              <GraduationCap className="w-3.5 h-3.5 text-electric-300" /> Başarı Hikayeleri
            </div>
            <h2 className="h-display mt-4 text-3xl sm:text-4xl text-white">
              Öğrencilerden <span className="text-gradient">gerçek geri bildirimler</span>
            </h2>
            <p className="mt-3 text-white/70">
              PathMatch'le hayalindeki kariyer yolculuğuna başlamış binlerce öğrenciden bazıları.
            </p>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-5">
            {stories.map((s, idx) => (
              <article
                key={s.name}
                className="relative rounded-3xl p-6 bg-white/[0.07] backdrop-blur-xl border border-white/15 hover:border-white/30 hover:bg-white/[0.1] transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className="absolute -top-3 -right-3 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-deep"
                  style={{ background: s.color }}
                >
                  <Quote className="w-5 h-5" />
                </div>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-300 text-amber-300" />
                  ))}
                </div>
                <p className="mt-4 text-base text-white leading-relaxed font-medium">
                  "{s.quote}"
                </p>
                <div className="mt-6 pt-5 border-t border-white/15 flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white text-sm shadow-inner ring-1 ring-white/20"
                    style={{
                      background: `linear-gradient(135deg, ${s.color} 0%, ${shadeHex(
                        s.color,
                        -25
                      )} 100%)`,
                    }}
                  >
                    {s.name
                      .split(" ")
                      .map((p) => p[0])
                      .join("")}
                  </div>
                  <div>
                    <div className="font-bold text-white">{s.name}</div>
                    <div className="text-xs text-white/60">{s.role}</div>
                  </div>
                  <div className="ml-auto text-[10px] font-bold text-electric-300 bg-electric-400/10 border border-electric-300/20 px-2 py-1 rounded-md">
                    #0{idx + 1}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-14 grid sm:grid-cols-3 gap-4">
            <Stat k="12.400+" v="Aktif öğrenci" icon={<GraduationCap className="w-5 h-5" />} />
            <Stat k="850+" v="Şirket ortağı" icon={<Briefcase className="w-5 h-5" />} />
            <Stat k="%87" v="Eşleşme isabeti" icon={<Sparkles className="w-5 h-5" />} />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 lg:py-28">
        <div className="section">
          <div className="relative overflow-hidden rounded-4xl p-10 lg:p-16 text-center bg-grad-soft border border-electric-100">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-electric-200/40 blur-3xl -z-10" />
            <Rocket className="w-10 h-10 mx-auto text-electric-600" />
            <h2 className="h-display mt-4 text-3xl sm:text-4xl lg:text-5xl">
              Kariyerini bugün <span className="text-gradient">akıllı bir başlangıçla</span>{" "}
              hızlandır
            </h2>
            <p className="mt-3 text-ink-700 max-w-2xl mx-auto">
              PathMatch'i 60 saniyede dene. İster öğrenci, ister şirket veya mentor ol —
              herkesin yeri var.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link to="/register">
                <Button size="lg" iconRight={<ArrowRight className="w-5 h-5" />}>
                  Ücretsiz Hesap Oluştur
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg">
                  Giriş Yap
                </Button>
              </Link>
            </div>
            <div className="mt-6 inline-flex items-center gap-2 text-xs text-ink-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              KVKK uyumlu · Kart bilgisi gerekmez
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

function Stat({ k, v, icon }: { k: string; v: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-5 bg-white/[0.07] backdrop-blur-xl border border-white/15 flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-electric-400/30 to-royal-500/30 flex items-center justify-center text-electric-200 border border-white/10">
        {icon}
      </div>
      <div>
        <div className="text-2xl font-extrabold text-white">{k}</div>
        <div className="text-xs text-white/70">{v}</div>
      </div>
    </div>
  );
}

function shadeHex(hex: string, percent: number) {
  const f = parseInt(hex.replace("#", ""), 16);
  const t = percent < 0 ? 0 : 255;
  const p = Math.abs(percent) / 100;
  const R = f >> 16;
  const G = (f >> 8) & 0x00ff;
  const B = f & 0x0000ff;
  const v =
    (Math.round((t - R) * p) + R) * 0x10000 +
    (Math.round((t - G) * p) + G) * 0x100 +
    (Math.round((t - B) * p) + B);
  return "#" + v.toString(16).padStart(6, "0");
}
