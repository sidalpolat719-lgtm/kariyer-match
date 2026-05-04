import { useState } from "react";
import { Mail, MoreVertical, Plus, Search, Trash2, UserPlus, Users } from "lucide-react";
import { useCompanyData } from "../../context/CompanyDataContext";
import { Avatar } from "../../components/ui/Avatar";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { useToast } from "../../context/ToastContext";
import { departments } from "../../data/companySeed";
import type { TeamMember } from "../../types/company";
import { cn } from "../../lib/cn";

const roleStyle: Record<TeamMember["role"], string> = {
  Owner: "bg-amber-50 text-amber-700",
  Admin: "bg-rose-50 text-rose-700",
  Recruiter: "bg-royal-50 text-royal-700",
  "Hiring Manager": "bg-electric-50 text-electric-700",
  Interviewer: "bg-emerald-50 text-emerald-700",
};

const roles: TeamMember["role"][] = ["Owner", "Admin", "Recruiter", "Hiring Manager", "Interviewer"];

export default function CompanyTeamPage() {
  const { team, inviteTeamMember, removeTeamMember, changeTeamRole } = useCompanyData();
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [openInvite, setOpenInvite] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = team.filter((m) =>
    `${m.name} ${m.email} ${m.role}`.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: team.length,
    active: team.filter((m) => m.status === "active").length,
    pending: team.filter((m) => m.status === "invited").length,
    hires: team.reduce((s, m) => s + m.hires, 0),
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-midnight-950 tracking-tight">
            Ekibim
          </h1>
          <p className="text-sm text-ink-600 mt-1">
            Recruiter ve hiring manager'ları yönet, rol bazlı erişim ver.
          </p>
        </div>
        <Button
          iconLeft={<UserPlus className="w-4 h-4" />}
          onClick={() => setOpenInvite(true)}
          className="!bg-grad-corp-cta"
        >
          Ekip Üyesi Davet Et
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Tile label="Toplam Üye" value={stats.total} />
        <Tile label="Aktif" value={stats.active} accent="emerald" />
        <Tile label="Bekleyen Davet" value={stats.pending} accent="amber" />
        <Tile label="Toplam İşe Alım" value={stats.hires} accent="purple" />
      </div>

      <div className="bg-white rounded-3xl border border-ink-100 shadow-soft overflow-hidden">
        <div className="p-4 border-b border-ink-100 flex items-center gap-3">
          <Search className="w-4 h-4 text-ink-400 ml-2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Üye ara..."
            className="flex-1 bg-transparent outline-none text-sm py-1.5"
          />
        </div>
        <table className="w-full text-sm">
          <thead className="text-[11px] uppercase tracking-wider text-ink-500 bg-ink-50/50">
            <tr>
              <th className="text-left px-6 py-2.5 font-bold">Üye</th>
              <th className="text-left px-2 py-2.5 font-bold">Rol</th>
              <th className="text-left px-2 py-2.5 font-bold">Departman</th>
              <th className="text-right px-2 py-2.5 font-bold">İşe Alım</th>
              <th className="text-left px-2 py-2.5 font-bold">Son Aktivite</th>
              <th className="text-left px-2 py-2.5 font-bold">Durum</th>
              <th className="px-6"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <TeamRow
                key={m.id}
                member={m}
                onChangeRole={(r) => {
                  changeTeamRole(m.id, r);
                  toast.success("Rol güncellendi");
                }}
                onRemove={() => setConfirmDelete(m.id)}
              />
            ))}
          </tbody>
        </table>
      </div>

      <InviteTeamModal
        open={openInvite}
        onClose={() => setOpenInvite(false)}
        onInvite={(d) => {
          inviteTeamMember(d);
          toast.success(`${d.name} davet edildi`);
          setOpenInvite(false);
        }}
      />

      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Ekip üyesini kaldırmak istiyor musun?"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmDelete(null)}>
              Vazgeç
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (confirmDelete) {
                  removeTeamMember(confirmDelete);
                  toast.success("Üye kaldırıldı");
                  setConfirmDelete(null);
                }
              }}
            >
              Evet, Kaldır
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-700">
          Üyenin tüm erişimleri sonlandırılacak. Bu işlem geri alınamaz.
        </p>
      </Modal>
    </div>
  );
}

function TeamRow({
  member,
  onChangeRole,
  onRemove,
}: {
  member: TeamMember;
  onChangeRole: (r: TeamMember["role"]) => void;
  onRemove: () => void;
}) {
  const [openMenu, setOpenMenu] = useState(false);
  const toast = useToast();

  return (
    <tr className="border-t border-ink-100 hover:bg-royal-50/20 transition">
      <td className="px-6 py-3">
        <div className="flex items-center gap-3">
          <Avatar name={member.name} color={member.avatarColor} />
          <div>
            <div className="font-bold text-midnight-950">{member.name}</div>
            <div className="text-[11px] text-ink-500">{member.email}</div>
          </div>
        </div>
      </td>
      <td className="px-2 py-3">
        <select
          value={member.role}
          onChange={(e) => onChangeRole(e.target.value as TeamMember["role"])}
          disabled={member.status === "invited"}
          className={cn(
            "text-[11px] font-bold px-2 py-1 rounded-md border-0 cursor-pointer outline-none focus:ring-2 focus:ring-royal-300",
            roleStyle[member.role],
            member.status === "invited" && "opacity-60 cursor-not-allowed"
          )}
        >
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </td>
      <td className="px-2 py-3 text-ink-700">{member.department}</td>
      <td className="px-2 py-3 text-right font-bold text-midnight-950">{member.hires}</td>
      <td className="px-2 py-3 text-ink-700">{member.lastActive}</td>
      <td className="px-2 py-3">
        <span
          className={cn(
            "inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-md",
            member.status === "active" && "bg-emerald-50 text-emerald-700",
            member.status === "invited" && "bg-amber-50 text-amber-700",
            member.status === "inactive" && "bg-ink-100 text-ink-700"
          )}
        >
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full",
              member.status === "active" && "bg-emerald-500",
              member.status === "invited" && "bg-amber-500",
              member.status === "inactive" && "bg-ink-400"
            )}
          />
          {member.status === "active" ? "Aktif" : member.status === "invited" ? "Bekliyor" : "Pasif"}
        </span>
      </td>
      <td className="px-6 py-3 text-right relative">
        <button
          onClick={() => setOpenMenu((v) => !v)}
          className="p-2 rounded-lg text-ink-500 hover:bg-ink-100"
          aria-label="Daha fazla"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
        {openMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpenMenu(false)} />
            <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl border border-ink-100 shadow-deep z-50 p-1">
              <MenuItem
                icon={<Mail className="w-4 h-4" />}
                label={member.status === "invited" ? "Daveti Yeniden Gönder" : "E-posta Gönder"}
                onClick={() => {
                  setOpenMenu(false);
                  toast.success(
                    member.status === "invited"
                      ? "Davet yeniden gönderildi"
                      : "E-posta gönderildi"
                  );
                }}
              />
              {member.role !== "Owner" && (
                <MenuItem
                  icon={<Trash2 className="w-4 h-4" />}
                  label="Kaldır"
                  danger
                  onClick={() => {
                    setOpenMenu(false);
                    onRemove();
                  }}
                />
              )}
            </div>
          </>
        )}
      </td>
    </tr>
  );
}

function Tile({ label, value, accent }: { label: string; value: number; accent?: "emerald" | "amber" | "purple" }) {
  const map = {
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    purple: "bg-royal-50 text-royal-700",
  };
  return (
    <div className="rounded-2xl bg-white border border-ink-100 p-4 shadow-soft">
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center",
            accent ? map[accent] : "bg-ink-50 text-ink-700"
          )}
        >
          <Users className="w-4 h-4" />
        </div>
        <div className="text-[10px] uppercase tracking-wider font-bold text-ink-500">{label}</div>
      </div>
      <div className="text-2xl font-extrabold text-midnight-950 mt-2">{value}</div>
    </div>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2 px-2.5 py-1.5 text-sm font-medium rounded-lg",
        danger ? "text-rose-600 hover:bg-rose-50" : "text-ink-700 hover:bg-ink-100"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function InviteTeamModal({
  open,
  onClose,
  onInvite,
}: {
  open: boolean;
  onClose: () => void;
  onInvite: (d: { name: string; email: string; role: TeamMember["role"]; department: string }) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<TeamMember["role"]>("Recruiter");
  const [department, setDepartment] = useState(departments[0]);
  const toast = useToast();

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Ekip Üyesi Davet Et"
      description="Yeni recruiter veya hiring manager davet et."
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Vazgeç
          </Button>
          <Button
            onClick={() => {
              if (!name || !email) {
                toast.error("Ad ve e-posta zorunlu");
                return;
              }
              onInvite({ name, email, role, department });
              setName("");
              setEmail("");
            }}
            iconLeft={<Plus className="w-4 h-4" />}
            className="!bg-grad-corp-cta"
          >
            Davet Gönder
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <div>
          <label className="label">Ad Soyad</label>
          <input className="input mt-1.5" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="label">E-posta</label>
          <input
            type="email"
            className="input mt-1.5"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="label">Rol</label>
            <select
              className="input mt-1.5"
              value={role}
              onChange={(e) => setRole(e.target.value as TeamMember["role"])}
            >
              {roles.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Departman</label>
            <select
              className="input mt-1.5"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              {departments.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </Modal>
  );
}
