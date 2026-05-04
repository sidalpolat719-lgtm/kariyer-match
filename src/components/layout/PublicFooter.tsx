import { Logo } from "../ui/Logo";

const cols = [
  {
    title: "Ürün",
    links: ["Eşleşme", "Kariyer Yol Haritası", "Mentorluk", "Şirket Çözümleri"],
  },
  {
    title: "Şirket",
    links: ["Hakkımızda", "Kariyer", "Basın", "İletişim"],
  },
  {
    title: "Kaynaklar",
    links: ["Blog", "Yardım Merkezi", "Topluluk", "Sözlük"],
  },
  {
    title: "Yasal",
    links: ["Gizlilik", "Kullanım Şartları", "KVKK", "Çerezler"],
  },
];

export function PublicFooter() {
  return (
    <footer className="border-t border-ink-100 bg-white">
      <div className="section py-14">
        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 text-sm text-ink-600 max-w-sm">
              PathMatch, öğrencilerin yeteneklerini ve hedeflerini analiz ederek onları en uygun staj
              ve iş fırsatlarıyla buluşturan modern kariyer ekosistemidir.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {["LI", "X", "IG", "YT"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-ink-100 hover:bg-electric-50 hover:text-electric-700 text-ink-700 inline-flex items-center justify-center text-xs font-bold"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <div className="text-sm font-bold text-midnight-950 mb-3">{c.title}</div>
              <ul className="space-y-2">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-ink-600 hover:text-midnight-950">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-ink-100">
        <div className="section py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-ink-500">
          <div>© {new Date().getFullYear()} PathMatch. Tüm hakları saklıdır.</div>
          <div>İstanbul · Ankara · İzmir · Uzaktan</div>
        </div>
      </div>
    </footer>
  );
}
