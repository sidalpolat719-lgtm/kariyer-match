import { useMemo, useState } from "react";
import { Filter, Search, Sparkles, X } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Tabs } from "../components/ui/Tabs";
import { useAppData } from "../context/AppDataContext";
import { InternshipCard } from "../components/ui/InternshipCard";
import { EmptyState } from "../components/ui/EmptyState";
import { cn } from "../lib/cn";
import type { EmploymentType, Internship, WorkType } from "../types";

const allWorkTypes: WorkType[] = ["Uzaktan", "Hibrit", "Ofis"];
const allEmployments: EmploymentType[] = ["Staj", "Tam Zamanlı", "Yarı Zamanlı"];
const allLocations = ["İstanbul", "Ankara", "İzmir", "Bursa", "Uzaktan"];
const allIndustries = [
  "Teknoloji",
  "Veri & Yapay Zeka",
  "Tasarım",
  "Bulut & Altyapı",
  "Pazarlama",
  "İnsan Kaynakları",
];
const experienceLevels = ["Öğrenci", "Yeni Mezun", "Junior"];
const companySizes = ["Startup", "Orta Ölçek", "Büyük Kurumsal"];

const sortOptions = [
  { id: "match", label: "En İyi Eşleşme" },
  { id: "recent", label: "En Yeni" },
  { id: "stipend", label: "En Yüksek Maaş" },
];

export default function MatchingPage() {
  const { internships, saved } = useAppData();
  const [tab, setTab] = useState<"all" | "saved" | "applied">("all");
  const [openFilters, setOpenFilters] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("match");

  const [filters, setFilters] = useState({
    workType: [] as WorkType[],
    employment: [] as EmploymentType[],
    location: [] as string[],
    industry: [] as string[],
    experience: [] as string[],
    size: [] as string[],
    skills: [] as string[],
  });

  const allSkills = useMemo(() => {
    const set = new Set<string>();
    internships.forEach((i) => i.skills.forEach((s) => set.add(s)));
    return Array.from(set).sort();
  }, [internships]);

  const filtered = useMemo(() => {
    let list: Internship[] = [...internships];
    if (tab === "saved") list = list.filter((i) => saved.includes(i.id));
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.company.toLowerCase().includes(q) ||
          i.skills.some((s) => s.toLowerCase().includes(q))
      );
    }
    if (filters.workType.length) list = list.filter((i) => filters.workType.includes(i.workType));
    if (filters.employment.length)
      list = list.filter((i) => filters.employment.includes(i.employmentType));
    if (filters.location.length) list = list.filter((i) => filters.location.includes(i.location));
    if (filters.industry.length) list = list.filter((i) => filters.industry.includes(i.industry));
    if (filters.experience.length)
      list = list.filter((i) => filters.experience.includes(i.experienceLevel));
    if (filters.size.length) list = list.filter((i) => filters.size.includes(i.companySize));
    if (filters.skills.length)
      list = list.filter((i) => filters.skills.every((s) => i.skills.includes(s)));

    if (sortBy === "recent")
      list.sort((a, b) => (a.postedAt > b.postedAt ? -1 : 1));
    else if (sortBy === "stipend")
      list.sort(
        (a, b) =>
          parseInt((b.stipend || "0").replace(/[^\d]/g, "") || "0") -
          parseInt((a.stipend || "0").replace(/[^\d]/g, "") || "0")
      );
    else list.sort((a, b) => b.matchScore - a.matchScore);

    return list;
  }, [internships, tab, saved, filters, search, sortBy]);

  const activeFilterCount = Object.values(filters).reduce((s, v) => s + v.length, 0);

  function toggle<T extends string>(key: keyof typeof filters, value: T) {
    setFilters((prev) => {
      const arr = prev[key] as T[];
      const next = arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value];
      return { ...prev, [key]: next };
    });
  }

  function clearAll() {
    setFilters({
      workType: [],
      employment: [],
      location: [],
      industry: [],
      experience: [],
      size: [],
      skills: [],
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="h-display text-2xl sm:text-3xl">Sana Özel Eşleşmeler</h1>
          <p className="text-ink-600 mt-1 text-sm">
            {filtered.length} fırsat senin profiline göre sıralandı.
          </p>
        </div>
        <Tabs
          tabs={[
            { id: "all", label: "Tümü", badge: internships.length },
            { id: "saved", label: "Kayıtlı", badge: saved.length },
            { id: "applied", label: "Başvurduğum" },
          ]}
          active={tab}
          onChange={(t) => setTab(t as "all" | "saved" | "applied")}
        />
      </div>

      <Card padded={false}>
        <div className="p-4 flex flex-wrap items-center gap-3 border-b border-ink-100">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pozisyon, şirket veya yetenek…"
              className="input pl-10"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input max-w-[200px]"
          >
            {sortOptions.map((o) => (
              <option key={o.id} value={o.id}>
                Sırala: {o.label}
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            iconLeft={<Filter className="w-4 h-4" />}
            onClick={() => setOpenFilters((v) => !v)}
          >
            Filtreler {activeFilterCount > 0 && `(${activeFilterCount})`}
          </Button>
        </div>

        {openFilters && (
          <div className="p-5 border-b border-ink-100 grid lg:grid-cols-4 gap-5 bg-ink-50/40 animate-fadeUp">
            <FilterGroup
              title="Çalışma Şekli"
              options={allWorkTypes}
              selected={filters.workType}
              onToggle={(v) => toggle("workType", v)}
            />
            <FilterGroup
              title="Pozisyon Türü"
              options={allEmployments}
              selected={filters.employment}
              onToggle={(v) => toggle("employment", v)}
            />
            <FilterGroup
              title="Lokasyon"
              options={allLocations}
              selected={filters.location}
              onToggle={(v) => toggle("location", v)}
            />
            <FilterGroup
              title="Sektör"
              options={allIndustries}
              selected={filters.industry}
              onToggle={(v) => toggle("industry", v)}
            />
            <FilterGroup
              title="Deneyim Seviyesi"
              options={experienceLevels}
              selected={filters.experience}
              onToggle={(v) => toggle("experience", v)}
            />
            <FilterGroup
              title="Şirket Büyüklüğü"
              options={companySizes}
              selected={filters.size}
              onToggle={(v) => toggle("size", v)}
            />
            <div className="lg:col-span-2">
              <div className="text-xs font-bold uppercase tracking-wider text-ink-500 mb-2">
                Yetenekler
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-2">
                {allSkills.map((s) => {
                  const active = filters.skills.includes(s);
                  return (
                    <button
                      key={s}
                      onClick={() => toggle("skills", s)}
                      className={cn(
                        "text-xs font-medium px-2.5 py-1 rounded-full border transition",
                        active
                          ? "bg-electric-500 text-white border-electric-500"
                          : "bg-white text-ink-700 border-ink-200 hover:border-electric-400"
                      )}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="lg:col-span-4 flex items-center justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={clearAll}>
                Tümünü Temizle
              </Button>
              <Button size="sm" onClick={() => setOpenFilters(false)}>
                Uygula
              </Button>
            </div>
          </div>
        )}

        {/* Active filters */}
        {activeFilterCount > 0 && (
          <div className="px-4 py-3 border-b border-ink-100 flex flex-wrap gap-1.5 items-center">
            <span className="text-xs font-semibold text-ink-500 mr-1">Aktif:</span>
            {Object.entries(filters).flatMap(([k, vals]) =>
              (vals as string[]).map((v) => (
                <button
                  key={k + v}
                  onClick={() => toggle(k as keyof typeof filters, v as never)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-electric-50 text-electric-700 text-xs font-medium hover:bg-electric-100"
                >
                  {v}
                  <X className="w-3 h-3" />
                </button>
              ))
            )}
            <button
              onClick={clearAll}
              className="ml-auto text-xs font-semibold text-ink-600 hover:text-rose-600"
            >
              Temizle
            </button>
          </div>
        )}
      </Card>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Sparkles className="w-6 h-6" />}
            title="Sonuç bulunamadı"
            description="Filtreleri esneterek daha fazla fırsata göz atabilirsin."
            action={
              <Button onClick={clearAll} variant="outline">
                Filtreleri Temizle
              </Button>
            }
          />
        ) : (
          filtered.map((i) => <InternshipCard key={i.id} internship={i} />)
        )}
      </div>
    </div>
  );
}

function FilterGroup<T extends string>({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: T[];
  selected: T[];
  onToggle: (v: T) => void;
}) {
  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-wider text-ink-500 mb-2">{title}</div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => {
          const active = selected.includes(o);
          return (
            <button
              key={o}
              onClick={() => onToggle(o)}
              className={cn(
                "text-xs font-medium px-2.5 py-1 rounded-full border transition",
                active
                  ? "bg-midnight-900 text-white border-midnight-900"
                  : "bg-white text-ink-700 border-ink-200 hover:border-midnight-700"
              )}
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}
