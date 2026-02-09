import { Card } from "./ui/card";

export function Legend() {
  return (
    <Card className="p-4">
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