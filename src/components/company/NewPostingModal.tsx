import { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { useCompanyData } from "../../context/CompanyDataContext";
import { useToast } from "../../context/ToastContext";
import { departments } from "../../data/companySeed";
import type { CompanyPosting } from "../../types/company";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const blank = {
  title: "",
  department: "Mühendislik",
  location: "İstanbul",
  workType: "Hibrit" as CompanyPosting["workType"],
  employmentType: "Tam Zamanlı" as CompanyPosting["employmentType"],
  level: "Mid" as CompanyPosting["level"],
  status: "draft" as CompanyPosting["status"],
  description: "",
  skills: [] as string[],
  salaryMin: undefined as number | undefined,
  salaryMax: undefined as number | undefined,
  deadline: "",
};

export function NewPostingModal({ open, onClose }: Props) {
  const { createPosting } = useCompanyData();
  const toast = useToast();
  const [draft, setDraft] = useState(blank);
  const [skill, setSkill] = useState("");

  function reset() {
    setDraft(blank);
    setSkill("");
  }

  function submit(status: "active" | "draft") {
    if (!draft.title.trim()) {
      toast.error("Pozisyon başlığı zorunlu");
      return;
    }
    createPosting({ ...draft, status });
    toast.success(status === "active" ? "İlan yayınlandı" : "Taslak kaydedildi");
    reset();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
      }}
      title="Yeni İlan Oluştur"
      description="Pozisyon detaylarını gir, AI eşleşme algoritması adayları otomatik bulacak."
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Vazgeç
          </Button>
          <Button variant="outline" onClick={() => submit("draft")}>
            Taslağı Kaydet
          </Button>
          <Button onClick={() => submit("active")}>Yayınla</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="label">Pozisyon Başlığı *</label>
          <input
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            className="input mt-1.5"
            placeholder="Örn. Senior Frontend Engineer"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="label">Departman</label>
            <select
              className="input mt-1.5"
              value={draft.department}
              onChange={(e) => setDraft({ ...draft, department: e.target.value })}
            >
              {departments.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Lokasyon</label>
            <input
              className="input mt-1.5"
              value={draft.location}
              onChange={(e) => setDraft({ ...draft, location: e.target.value })}
              placeholder="Örn. İstanbul"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <div>
            <label className="label">Çalışma Şekli</label>
            <select
              className="input mt-1.5"
              value={draft.workType}
              onChange={(e) => setDraft({ ...draft, workType: e.target.value as CompanyPosting["workType"] })}
            >
              <option>Uzaktan</option>
              <option>Hibrit</option>
              <option>Ofis</option>
            </select>
          </div>
          <div>
            <label className="label">Pozisyon Türü</label>
            <select
              className="input mt-1.5"
              value={draft.employmentType}
              onChange={(e) =>
                setDraft({ ...draft, employmentType: e.target.value as CompanyPosting["employmentType"] })
              }
            >
              <option>Staj</option>
              <option>Tam Zamanlı</option>
              <option>Yarı Zamanlı</option>
            </select>
          </div>
          <div>
            <label className="label">Seviye</label>
            <select
              className="input mt-1.5"
              value={draft.level}
              onChange={(e) => setDraft({ ...draft, level: e.target.value as CompanyPosting["level"] })}
            >
              <option>Öğrenci</option>
              <option>Yeni Mezun</option>
              <option>Junior</option>
              <option>Mid</option>
              <option>Senior</option>
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <div>
            <label className="label">Maaş Min (₺)</label>
            <input
              type="number"
              className="input mt-1.5"
              value={draft.salaryMin || ""}
              onChange={(e) =>
                setDraft({ ...draft, salaryMin: e.target.value ? Number(e.target.value) : undefined })
              }
              placeholder="20000"
            />
          </div>
          <div>
            <label className="label">Maaş Max (₺)</label>
            <input
              type="number"
              className="input mt-1.5"
              value={draft.salaryMax || ""}
              onChange={(e) =>
                setDraft({ ...draft, salaryMax: e.target.value ? Number(e.target.value) : undefined })
              }
              placeholder="35000"
            />
          </div>
          <div>
            <label className="label">Son Başvuru</label>
            <input
              type="date"
              className="input mt-1.5"
              value={draft.deadline}
              onChange={(e) => setDraft({ ...draft, deadline: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="label">Aranan Yetenekler</label>
          <div className="mt-1.5 flex items-center gap-2">
            <input
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (skill.trim()) {
                    setDraft({ ...draft, skills: [...draft.skills, skill.trim()] });
                    setSkill("");
                  }
                }
              }}
              placeholder="React, TypeScript, ..."
              className="input"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (skill.trim()) {
                  setDraft({ ...draft, skills: [...draft.skills, skill.trim()] });
                  setSkill("");
                }
              }}
            >
              Ekle
            </Button>
          </div>
          {draft.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {draft.skills.map((s, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-royal-50 text-royal-700"
                >
                  {s}
                  <button
                    onClick={() => setDraft({ ...draft, skills: draft.skills.filter((_, j) => j !== i) })}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="label">Açıklama</label>
          <textarea
            rows={4}
            className="input mt-1.5 resize-none"
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            placeholder="Pozisyonun sorumlulukları, ekip ve teknik ortam hakkında bilgi ver…"
          />
        </div>
      </div>
    </Modal>
  );
}
