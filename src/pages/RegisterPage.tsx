import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Building2, GraduationCap, Briefcase } from "lucide-react";
import { AuthLayout } from "../components/auth/AuthLayout";
import { Button } from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import type { UserRole } from "../types";
import { cn } from "../lib/cn";

const roles: { id: UserRole; title: string; description: string; icon: React.ReactNode; gradient: string }[] = [
  {
    id: "student",
    title: "Öğrenci / Yeni Mezun",
    description: "Stajlar ve junior pozisyonlarla eşleş.",
    icon: <GraduationCap className="w-5 h-5" />,
    gradient: "from-electric-400 to-royal-500",
  },
  {
    id: "company",
    title: "Şirket / Recruiter",
    description: "Yetenek havuzuna ulaş, akıllı eşleştir.",
    icon: <Building2 className="w-5 h-5" />,
    gradient: "from-royal-500 to-emerald-500",
  },
  {
    id: "mentor",
    title: "Mentor",
    description: "Bilgini paylaş, yeni nesle yön ver.",
    icon: <Briefcase className="w-5 h-5" />,
    gradient: "from-emerald-400 to-electric-500",
  },
];

export default function RegisterPage() {
  const [role, setRole] = useState<UserRole>("student");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organization, setOrganization] = useState("");
  const [show, setShow] = useState(false);
  const [accept, setAccept] = useState(true);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      toast.error("Lütfen zorunlu alanları doldur");
      return;
    }
    if (!accept) {
      toast.error("Devam etmek için sözleşmeyi onaylamalısın");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      register({ fullName, email, role, organization });
      toast.success("Hesabın oluşturuldu", "Şimdi profilini kişiselleştirelim.");
      navigate("/dashboard");
    }, 700);
  };

  const orgLabel =
    role === "student" ? "Üniversite (opsiyonel)" : role === "company" ? "Şirket adı" : "Uzmanlık alanı";
  const orgPlaceholder =
    role === "student"
      ? "Örn. Boğaziçi Üniversitesi"
      : role === "company"
      ? "Örn. Nova Labs"
      : "Örn. Ürün Yönetimi · 8 yıl deneyim";

  return (
    <AuthLayout
      side={role === "company" ? "company" : "default"}
      title="PathMatch'e katıl"
      subtitle="Akıllı kariyer eşleşmesinin tüm gücünü ücretsiz keşfet."
    >
      <form onSubmit={submit} className="space-y-5">
        <div>
          <label className="label">Hesap türünü seç</label>
          <div className="mt-2 grid sm:grid-cols-3 gap-2">
            {roles.map((r) => (
              <button
                type="button"
                key={r.id}
                onClick={() => setRole(r.id)}
                className={cn(
                  "text-left p-3 rounded-2xl border transition-all",
                  role === r.id
                    ? "border-electric-400 bg-electric-50 ring-4 ring-electric-100"
                    : "border-ink-200 hover:border-electric-300 bg-white"
                )}
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center text-white bg-gradient-to-br shadow-soft",
                    r.gradient
                  )}
                >
                  {r.icon}
                </div>
                <div className="mt-2 text-sm font-bold text-midnight-950">{r.title}</div>
                <div className="text-[11px] text-ink-600 mt-0.5">{r.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Ad Soyad</label>
          <div className="mt-1.5 relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Örn. Ada Yılmaz"
              className="input pl-10"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="label">E-posta</label>
            <div className="mt-1.5 relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@email.com"
                className="input pl-10"
              />
            </div>
          </div>
          <div>
            <label className="label">Şifre</label>
            <div className="mt-1.5 relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="En az 8 karakter"
                className="input pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-ink-500 hover:text-midnight-950"
                aria-label={show ? "Gizle" : "Göster"}
              >
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="label">{orgLabel}</label>
          <div className="mt-1.5 relative">
            <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
            <input
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder={orgPlaceholder}
              className="input pl-10"
            />
          </div>
        </div>

        <label className="flex items-start gap-2 text-sm text-ink-700">
          <input
            type="checkbox"
            checked={accept}
            onChange={(e) => setAccept(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-ink-300 text-electric-500 focus:ring-electric-400"
          />
          <span>
            <a href="#" className="font-semibold text-electric-700 hover:underline">
              Kullanım Şartları
            </a>{" "}
            ve{" "}
            <a href="#" className="font-semibold text-electric-700 hover:underline">
              Gizlilik Politikası
            </a>
            'nı kabul ediyorum.
          </span>
        </label>

        <Button type="submit" loading={loading} fullWidth size="lg">
          Hesap Oluştur
        </Button>

        <p className="text-center text-sm text-ink-600">
          Zaten üye misin?{" "}
          <Link to="/login" className="font-semibold text-electric-700 hover:text-electric-800">
            Giriş yap
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
