import { Sparkles, TrendingUp, Building2, MapPin, ArrowUpRight } from "lucide-react";

export function HeroPreview() {
  return (
    <div className="relative">
      {/* Backdrop glow */}
      <div className="absolute -inset-10 bg-grad-mesh opacity-70 blur-3xl pointer-events-none" />

      <div className="relative grid grid-cols-12 gap-4">
        {/* Main dashboard mock */}
        <div className="col-span-12 lg:col-span-8 glass rounded-3xl p-5 shadow-deep">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-electric-700">
                Sana Özel Eşleşmeler
              </div>
              <div className="text-lg font-bold text-midnight-950 mt-0.5">12 yeni fırsat</div>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              <TrendingUp className="w-3.5 h-3.5" /> +18% bu hafta
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {previewMatches.map((m, i) => (
              <div
                key={i}
                className="rounded-2xl border border-ink-100 bg-white p-3.5 hover:shadow-card transition"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shrink-0"
                    style={{ background: m.color }}
                  >
                    {m.short}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-midnight-950 truncate">{m.title}</div>
                    <div className="text-xs text-ink-500 flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3 h-3" /> {m.company}
                      <MapPin className="w-3 h-3 ml-1.5" /> {m.location}
                    </div>
                    <div className="mt-2 flex items-center gap-1.5">
                      {m.skills.slice(0, 3).map((s) => (
                        <span
                          key={s}
                          className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-ink-50 text-ink-700"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div
                    className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md"
                    title="Eşleşme Skoru"
                  >
                    %{m.score}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: profile + roadmap */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
          <div className="glass rounded-3xl p-5 shadow-card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-grad-cta flex items-center justify-center text-white font-bold">
                AY
              </div>
              <div>
                <div className="font-bold text-midnight-950">Ada Yılmaz</div>
                <div className="text-xs text-ink-500">Bilgisayar Müh. · 3. sınıf</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="text-ink-700">Profil Gücü</span>
                <span className="text-midnight-950">78%</span>
              </div>
              <div className="h-2 rounded-full bg-ink-100 overflow-hidden">
                <div
                  className="h-full bg-grad-cta rounded-full"
                  style={{ width: "78%" }}
                />
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <Stat value="87%" label="Match" />
              <Stat value="12" label="Yeni" />
              <Stat value="5" label="Aktif" />
            </div>
          </div>

          <div className="glass rounded-3xl p-5 shadow-card">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wider text-royal-700">
                Kariyer Yol Haritan
              </div>
              <Sparkles className="w-4 h-4 text-royal-500" />
            </div>
            <ul className="mt-3 space-y-3">
              {roadmap.map((r, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div
                    className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center mt-0.5 ${
                      r.done
                        ? "bg-emerald-500 text-white"
                        : r.now
                        ? "bg-electric-500 text-white animate-pulse"
                        : "bg-ink-100 text-ink-500"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <div className="text-xs">
                    <div className="font-semibold text-midnight-950">{r.title}</div>
                    <div className="text-ink-500">{r.meta}</div>
                  </div>
                  {r.now && (
                    <ArrowUpRight className="ml-auto w-4 h-4 text-electric-500" />
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Floating chip */}
      <div className="hidden md:block absolute -top-3 -right-3 glass rounded-2xl px-3 py-2 shadow-glow animate-floaty">
        <div className="text-[10px] font-bold uppercase tracking-wider text-electric-700">Akıllı Eşleşme</div>
        <div className="text-sm font-bold text-midnight-950">Bu fırsat senin için %94 uyumlu</div>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl bg-white border border-ink-100 py-2">
      <div className="text-sm font-bold text-midnight-950">{value}</div>
      <div className="text-[10px] text-ink-500">{label}</div>
    </div>
  );
}

const previewMatches = [
  {
    title: "Frontend Stajyer",
    company: "Nova Labs",
    short: "NL",
    color: "#0d1a3a",
    location: "İstanbul",
    skills: ["React", "TS", "Figma"],
    score: 94,
  },
  {
    title: "Veri Bilimi Stajyeri",
    company: "Atlas Analytics",
    short: "AA",
    color: "#7c3aed",
    location: "Uzaktan",
    skills: ["Python", "SQL"],
    score: 88,
  },
  {
    title: "UX Stajyeri",
    company: "Lumen Studio",
    short: "LS",
    color: "#06b6d4",
    location: "İzmir",
    skills: ["Figma", "UX"],
    score: 81,
  },
  {
    title: "Mobil Geliştirici",
    company: "Skyline",
    short: "SA",
    color: "#10b981",
    location: "Bursa",
    skills: ["Flutter", "Dart"],
    score: 84,
  },
];

const roadmap = [
  { title: "Profilini tamamla", meta: "Tamamlandı", done: true, now: false },
  { title: "Yeteneklerini ekle", meta: "%65", done: false, now: true },
  { title: "İlk başvurunu yap", meta: "Önerilen", done: false, now: false },
  { title: "Mentor ile bağlan", meta: "Sonraki adım", done: false, now: false },
];
