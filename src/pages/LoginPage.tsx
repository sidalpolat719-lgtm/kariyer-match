import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { AuthLayout } from "../components/auth/AuthLayout";
import { Button } from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function LoginPage() {
  const [email, setEmail] = useState("ada@pathmatch.com");
  const [password, setPassword] = useState("demo1234");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Lütfen tüm alanları doldur");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      login({ email });
      toast.success("Hoş geldin!", "PathMatch panele yönlendiriliyorsun.");
      navigate("/dashboard");
    }, 600);
  };

  return (
    <AuthLayout title="Tekrar hoş geldin" subtitle="Kariyer yolculuğuna kaldığın yerden devam et.">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label">E-posta</label>
          <div className="mt-1.5 relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@email.com"
              className="input pl-10"
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="label">Şifre</label>
            <a href="#" className="text-xs font-semibold text-electric-700 hover:text-electric-800">
              Şifremi unuttum
            </a>
          </div>
          <div className="mt-1.5 relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
            <input
              type={show ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
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

        <label className="flex items-center gap-2 text-sm text-ink-700">
          <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-ink-300 text-electric-500 focus:ring-electric-400" />
          Beni hatırla
        </label>

        <Button type="submit" loading={loading} fullWidth size="lg">
          Giriş Yap
        </Button>

        <div className="relative my-2">
          <div className="divider" />
          <span className="absolute left-1/2 -top-2.5 -translate-x-1/2 px-3 bg-white text-[10px] font-bold uppercase tracking-wider text-ink-400">
            veya
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              login({ email: "demo.google@pathmatch.com" });
              toast.success("Google ile giriş yapıldı");
              navigate("/dashboard");
            }}
            className="btn-outline"
          >
            <span className="font-bold text-rose-500">G</span> Google
          </button>
          <button
            type="button"
            onClick={() => {
              login({ email: "demo.linkedin@pathmatch.com" });
              toast.success("LinkedIn ile giriş yapıldı");
              navigate("/dashboard");
            }}
            className="btn-outline"
          >
            <span className="font-bold text-blue-600">in</span> LinkedIn
          </button>
        </div>

        <p className="text-center text-sm text-ink-600 mt-4">
          Hesabın yok mu?{" "}
          <Link to="/register" className="font-semibold text-electric-700 hover:text-electric-800">
            Hemen kayıt ol
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
