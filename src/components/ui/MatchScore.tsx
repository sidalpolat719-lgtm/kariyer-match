import { cn } from "../../lib/cn";

interface MatchScoreProps {
  score: number; // 0–100
  size?: "sm" | "md" | "lg";
  label?: boolean;
  className?: string;
}

const sizes = {
  sm: { ring: "w-10 h-10", inner: "inset-1", text: "text-[11px]" },
  md: { ring: "w-14 h-14", inner: "inset-1.5", text: "text-sm" },
  lg: { ring: "w-24 h-24", inner: "inset-2", text: "text-2xl" },
};

export function MatchScore({ score, size = "md", label, className }: MatchScoreProps) {
  const tone =
    score >= 85
      ? { color: "#10b981", text: "Mükemmel uyum" }
      : score >= 70
      ? { color: "#22d3ee", text: "Güçlü uyum" }
      : score >= 55
      ? { color: "#7c3aed", text: "Orta uyum" }
      : { color: "#f59e0b", text: "Düşük uyum" };

  const s = sizes[size];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn("relative rounded-full score-ring", s.ring)}
        style={
          {
            ["--score" as string]: score,
            ["--ring-color" as string]: tone.color,
          } as React.CSSProperties
        }
      >
        <div className={cn("absolute bg-white rounded-full flex items-center justify-center", s.inner)}>
          <span className={cn("font-bold text-midnight-950", s.text)}>{score}%</span>
        </div>
      </div>
      {label && (
        <div>
          <div className="text-xs font-semibold text-ink-700">Eşleşme Skoru</div>
          <div className="text-xs text-ink-500">{tone.text}</div>
        </div>
      )}
    </div>
  );
}
