import { Card } from "./ui/card";

interface LegendProps {
  possession: "patriots" | "seahawks";
}

export function Legend({ possession }: LegendProps) {
  const possessionLabel = possession === "patriots" ? "Patriots" : "Seahawks";
  const possessionColorClass =
    possession === "patriots"
      ? "bg-blue-700 text-blue-50 ring-blue-200"
      : "bg-green-700 text-green-50 ring-green-200";

  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center justify-between rounded-lg border bg-muted/40 px-3 py-2 text-sm">
        <span className="text-muted-foreground">Possession</span>
        <span
          className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${possessionColorClass}`}
        >
          <span className="h-2 w-2 rounded-full bg-white/80"></span>
          {possessionLabel}
        </span>
      </div>
      <h3 className="text-sm font-semibold mb-3">LEGEND</h3>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-blue-500 shadow-lg shadow-blue-500/50"></div>
          <span>Current Score Square</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-green-600"></div>
          <span>Quarter Winner</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-yellow-400 to-yellow-500"></div>
          <span>Most Likely Next (+3, +7)</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200"></div>
          <span>Less Likely Next (+6, +8)</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-orange-300 to-orange-400"></div>
          <span>Defensive Score Risk</span>
        </div>
      </div>
    </Card>
  );
}