import { useMemo, useState } from "react";
import {
  Briefcase,
  Calendar,
  Copy,
  ExternalLink,
  Eye,
  MoreVertical,
  Pause,
  Pencil,
  Play,
  Plus,
  Search,
  Trash2,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useCompanyData } from "../../context/CompanyDataContext";
import { Button } from "../../components/ui/Button";
import { Tabs } from "../../components/ui/Tabs";
import { useToast } from "../../context/ToastContext";
import { Modal } from "../../components/ui/Modal";
import { NewPostingModal } from "../../components/company/NewPostingModal";
import type { CompanyPosting, PostingStatus } from "../../types/company";
import { cn } from "../../lib/cn";

const statusStyle: Record<PostingStatus, { label: string; class: string; dot: string }> = {
  active: { label: "Aktif", class: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  draft: { label: "Taslak", class: "bg-ink-100 text-ink-700", dot: "bg-ink-400" },
  paused: { label: "Durduruldu", class: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  closed: { label: "Kapatıldı", class: "bg-rose-50 text-rose-700", dot: "bg-rose-500" },
};

export default function CompanyPostingsPage() {
  const { postings, setPostingStatus, removePosting, duplicatePosting, updatePosting } =
    useCompanyData();
  const toast = useToast();
  const [tab, setTab] = useState<PostingStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [openNew, setOpenNew] = useState(false);
  const [editing, setEditing] = useState<CompanyPosting | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = [...postings];
    if (tab !== "all") list = list.filter((p) => p.status === tab);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q));
    }
    return list;
  }, [postings, tab, search]);

  const stats = useMemo(() => {
    return {
      active: postings.filter((p) => p.status === "active").length,
      draft: postings.filter((p) => p.status === "draft").length,
      paused: postings.filter((p) => p.status === "paused").length,
      closed: postings.filter((p) => p.status === "closed").length,
    };
  }, [postings]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-midnight-950 tracking-tight">
            İlanlarım
          </h1>
          <p className="text-sm text-ink-600 mt-1">
            {postings.length} ilan · {stats.active} aktif · Toplam{" "}
            {postings.reduce((s, p) => s + p.applicants, 0)} başvuru
          </p>
        </div>
        <Button
          iconLeft={<Plus className="w-4 h-4" />}
          onClick={() => setOpenNew(true)}
          className="!bg-grad-corp-cta !shadow-[0_14px_40px_-16px_rgba(139,92,246,0.55)]"
        >
          Yeni İlan Oluştur
        </Button>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatTile label="Aktif" value={stats.active} dot="bg-emerald-500" />
        <StatTile label="Taslak" value={stats.draft} dot="bg-ink-400" />
        <StatTile label="Durduruldu" value={stats.paused} dot="bg-amber-500" />
        <StatTile label="Kapatıldı" value={stats.closed} dot="bg-rose-500" />
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <Tabs
          tabs={[
            { id: "all", label: "Tümü", badge: postings.length },
            { id: "active", label: "Aktif", badge: stats.active },
            { id: "draft", label: "Taslak", badge: stats.draft },
            { id: "paused", label: "Durduruldu", badge: stats.paused },
            { id: "closed", label: "Kapatıldı", badge: stats.closed },
          ]}
          active={tab}
          onChange={(t) => setTab(t as PostingStatus | "all")}
        />
        <div className="ml-auto relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="İlan ara..."
            className="input pl-9 py-2 text-sm"
          />
        </div>
      </div>

      {/* Postings */}
      <div className="bg-white rounded-3xl border border-ink-100 shadow-soft overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-ink-500">İlan bulunamadı.</div>
        ) : (
          <ul className="divide-y divide-ink-100">
            {filtered.map((p) => (
              <PostingRow
                key={p.id}
                posting={p}
                onEdit={() => setEditing(p)}
                onDelete={() => setConfirmDelete(p.id)}
                onDuplicate={() => {
                  duplicatePosting(p.id);
                  toast.success("İlan kopyalandı");
                }}
                onStatusChange={(s) => {
                  setPostingStatus(p.id, s);
                  toast.success(`İlan ${statusStyle[s].label.toLowerCase()} oldu`);
                }}
              />
            ))}
          </ul>
        )}
      </div>

      <NewPostingModal open={openNew} onClose={() => setOpenNew(false)} />

      {/* Edit modal */}
      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="İlanı Düzenle"
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditing(null)}>
              Vazgeç
            </Button>
            <Button
              onClick={() => {
                if (editing) {
                  updatePosting(editing.id, editing);
                  toast.success("İlan güncellendi");
                  setEditing(null);
                }
              }}
              className="!bg-grad-corp-cta"
            >
              Kaydet
            </Button>
          </>
        }
      >
        {editing && (
          <div className="space-y-3">
            <div>
              <label className="label">Başlık</label>
              <input
                className="input mt-1.5"
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              />
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className="label">Departman</label>
                <input
                  className="input mt-1.5"
                  value={editing.department}
                  onChange={(e) => setEditing({ ...editing, department: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Lokasyon</label>
                <input
                  className="input mt-1.5"
                  value={editing.location}
                  onChange={(e) => setEditing({ ...editing, location: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Son Başvuru</label>
                <input
                  className="input mt-1.5"
                  value={editing.deadline}
                  onChange={(e) => setEditing({ ...editing, deadline: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="label">Açıklama</label>
              <textarea
                rows={4}
                className="input mt-1.5 resize-none"
                value={editing.description}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              />
            </div>
          </div>
        )}
      </Modal>

      {/* Delete confirmation */}
      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="İlanı silmek istiyor musun?"
        description="Bu işlem geri alınamaz. İlan ve aday bağlantıları kaldırılacak."
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
                  removePosting(confirmDelete);
                  toast.success("İlan silindi");
                  setConfirmDelete(null);
                }
              }}
            >
              Evet, Sil
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-700">İlan kalıcı olarak silinecek.</p>
      </Modal>
    </div>
  );
}

function StatTile({ label, value, dot }: { label: string; value: number; dot: string }) {
  return (
    <div className="rounded-2xl bg-white border border-ink-100 p-4 shadow-soft">
      <div className="flex items-center gap-2">
        <span className={cn("w-2 h-2 rounded-full", dot)} />
        <span className="text-[10px] uppercase tracking-wider font-bold text-ink-500">{label}</span>
      </div>
      <div className="text-2xl font-extrabold text-midnight-950 mt-1">{value}</div>
    </div>
  );
}

function PostingRow({
  posting,
  onEdit,
  onDelete,
  onDuplicate,
  onStatusChange,
}: {
  posting: CompanyPosting;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onStatusChange: (s: PostingStatus) => void;
}) {
  const [openMenu, setOpenMenu] = useState(false);
  const status = statusStyle[posting.status];

  return (
    <li className="p-5 hover:bg-royal-50/20 transition relative">
      <div className="flex flex-wrap items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-grad-corp-cta text-white flex items-center justify-center shrink-0">
          <Briefcase className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-bold text-midnight-950 truncate">{posting.title}</h3>
            <span className={cn("text-[10px] font-bold uppercase px-2 py-0.5 rounded-md inline-flex items-center gap-1", status.class)}>
              <span className={cn("w-1.5 h-1.5 rounded-full", status.dot)} /> {status.label}
            </span>
          </div>
          <div className="text-xs text-ink-500 mt-1 flex flex-wrap gap-x-3 gap-y-1">
            <span className="inline-flex items-center gap-1">
              <Briefcase className="w-3 h-3" /> {posting.department}
            </span>
            <span>{posting.location}</span>
            <span className="px-1.5 py-0.5 rounded bg-royal-50 text-royal-700 font-semibold">
              {posting.workType}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-electric-50 text-electric-700 font-semibold">
              {posting.employmentType}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Son: {posting.deadline}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 sm:gap-5 text-center">
          <PostingStat label="Görüntülenme" value={posting.views.toLocaleString("tr-TR")} icon={<Eye className="w-3.5 h-3.5" />} />
          <PostingStat label="Başvuru" value={posting.applicants.toString()} icon={<Users className="w-3.5 h-3.5" />} />
          <PostingStat label="Eşleşme" value={posting.matches.toString()} icon={<TrendingUp className="w-3.5 h-3.5" />} />
          <PostingStat label="Mülakat" value={posting.interviewed.toString()} icon={<Calendar className="w-3.5 h-3.5" />} />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {posting.status === "active" ? (
            <Button
              size="sm"
              variant="outline"
              iconLeft={<Pause className="w-4 h-4" />}
              onClick={() => onStatusChange("paused")}
            >
              Durdur
            </Button>
          ) : posting.status === "paused" || posting.status === "draft" ? (
            <Button
              size="sm"
              iconLeft={<Play className="w-4 h-4" />}
              onClick={() => onStatusChange("active")}
              className="!bg-grad-corp-cta"
            >
              Yayınla
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              iconLeft={<Play className="w-4 h-4" />}
              onClick={() => onStatusChange("active")}
            >
              Yeniden Aç
            </Button>
          )}

          <div className="relative">
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
                    icon={<Pencil className="w-4 h-4" />}
                    label="Düzenle"
                    onClick={() => {
                      setOpenMenu(false);
                      onEdit();
                    }}
                  />
                  <MenuItem
                    icon={<Copy className="w-4 h-4" />}
                    label="Kopyala"
                    onClick={() => {
                      setOpenMenu(false);
                      onDuplicate();
                    }}
                  />
                  <MenuItem
                    icon={<ExternalLink className="w-4 h-4" />}
                    label="Önizle"
                    onClick={() => setOpenMenu(false)}
                  />
                  {posting.status !== "closed" && (
                    <MenuItem
                      icon={<X className="w-4 h-4" />}
                      label="Kapat"
                      onClick={() => {
                        setOpenMenu(false);
                        onStatusChange("closed");
                      }}
                    />
                  )}
                  <div className="h-px bg-ink-100 my-1" />
                  <MenuItem
                    icon={<Trash2 className="w-4 h-4" />}
                    label="Sil"
                    danger
                    onClick={() => {
                      setOpenMenu(false);
                      onDelete();
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

function PostingStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div>
      <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-ink-500">
        {icon}
        {label}
      </div>
      <div className="text-base font-bold text-midnight-950">{value}</div>
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
