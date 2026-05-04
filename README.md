# PathMatch — Akıllı Kariyer ve Staj Eşleştirme Platformu

Modern, premium ve tamamen Türkçe arayüze sahip bir SaaS frontend prototipi. Öğrencileri, yeni mezunları, şirketleri, recruiter'ları ve mentorları **yetenek bazlı eşleştirme** ile buluşturan kariyer ekosisteminin kullanıcı arayüzünü içerir.

> Bu proje yalnızca **frontend**'tir; backend yoktur. Tüm durum (oturum, başvurular, mesajlar, profil, yol haritası, bildirimler vb.) `localStorage` üzerinden yönetilir.

---

## ✨ Özellikler

- 10 tam sayfa: Landing, Login, Register, Student Dashboard, Matching, Internship Detail, Profile, Company Dashboard, Messaging, Career Roadmap, Application Tracking, Settings
- Tasarım sistemi: Deep navy + electric cyan + royal purple + emerald renk paleti
- Glassmorphism, soft gradient, yuvarlatılmış kartlar, micro-animasyonlar
- Mobil için bottom navigation; tablet ve desktop için sidebar
- Tam fonksiyonel: Tüm butonlar, filtreler, modallar ve formlar çalışır
- Kanban başvuru takip panosu
- Akıllı eşleşme skorları ve "Neden eşleştin?" açıklamaları
- Mesajlaşma (otomatik cevaplı simülasyon ile)
- Kariyer yol haritası, profil gücü, mentor önerileri
- Erişilebilirlik: anlamlı kontrast, klavye odakları, ARIA etiketleri

---

## 🚀 Kurulum

```bash
cd pathmatch
npm install
npm run dev
```

Uygulama `http://localhost:5173/` adresinde başlar.

### Demo Hesap

Login ekranı önceden doldurulmuştur (`ada@pathmatch.com` / `demo1234`). Doğrulama yapılmaz; doğrudan giriş yapabilirsin. Register ekranından farklı rollerle (öğrenci, şirket, mentor) hesap açabilirsin.

> Şirket panelini görmek için kayıt olurken "Şirket / Recruiter" rolünü seç.

---

## 🧱 Teknolojiler

- **Vite + React 19 + TypeScript**
- **Tailwind CSS 3** (özel design tokens, gradient mesh arka planlar)
- **React Router DOM** (yönlendirme + korumalı rotalar)
- **Lucide React** (ikon seti)
- **clsx** (conditional class helper)
- LocalStorage tabanlı durum yönetimi (Context API)

---

## 📁 Proje Yapısı

```
src/
├── components/
│   ├── auth/         # AuthLayout
│   ├── landing/      # Hero ön izleme
│   ├── layout/       # Sidebar, Topbar, BottomNav, AppShell, Public navbar/footer
│   └── ui/           # Button, Card, Badge, Avatar, Modal, Tabs, MatchScore, vb.
├── context/          # AuthContext, AppDataContext, ToastContext
├── data/             # seed.ts (örnek staj/şirket/mentor/notification verileri)
├── lib/              # cn, storage helpers
├── pages/            # 12 sayfa
├── types/            # ortak TypeScript tipleri
├── App.tsx           # Routing
├── main.tsx          # Provider sarmalayıcıları
└── index.css         # Design tokens, base styles
```

---

## 🎨 Renk Paleti

| Renk        | Kullanım                     | Hex           |
| ----------- | ---------------------------- | ------------- |
| Midnight    | Birincil koyu / metin        | `#0d1a3a`     |
| Electric    | İkincil aksiyon / linkler    | `#22d3ee`     |
| Royal       | Vurgu (başarı, premium)      | `#7c3aed`     |
| Emerald     | Pozitif durumlar (eşleşme)   | `#10b981`     |
| Ink         | Nötr ölçek (gri)             | `#0f172a→#f7f9fc` |

CTA gradyanı: `linear-gradient(135deg, #22d3ee 0%, #7c3aed 100%)`.

---

## 📦 Build

```bash
npm run build
npm run preview
```

Üretim çıktısı `dist/` klasörüne yazılır.

---

## 📝 Notlar

- Yetenek seçtikçe profil gücü güncellenir, eşleşme skorları gerçek zamanlı yansır.
- Mesaj gönderdiğinde 1.3s sonra otomatik cevap üretilir (demo amaçlı).
- "Hesabı Sil" butonu (Ayarlar) tüm `localStorage` verisini siler.

