import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Check } from "lucide-react";

interface QuarterSubmitProps {
  quarter: string;
  patriotsScore: number;
  seahawksScore: number;
  onSubmitQuarter: () => void;
  submittedQuarters: string[];
}

export function QuarterSubmit({
  quarter,
  patriotsScore,
  seahawksScore,
  onSubmitQuarter,
  submittedQuarters,
}: QuarterSubmitProps) {
  const isQuarterSubmitted = submittedQuarters.includes(quarter);
  const isFinal = quarter === "Final";

  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold mb-3">QUARTER SUBMISSION</h3>
      
      <div className="space-y-3">
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Current Quarter:</span>
            <span className="font-bold">{quarter}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Score at End:</span>
            <span className="font-bold">{patriotsScore} - {seahawksScore}</span>
          </div>
        </div>

        {isQuarterSubmitted ? (
          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-md">
            <Check className="w-4 h-4" />
            <span className="font-medium">
              {isFinal ? "Final score submitted" : `${quarter} winner locked in`}
            </span>
          </div>
        ) : (
          <Button 
            onClick={onSubmitQuarter}
            className="w-full"
            disabled={quarter === "Final" && submittedQuarters.length < 4}
          >
            {isFinal ? "Submit Final Score" : `Lock in ${quarter} Winner`}
          </Button>
        )}

        <div className="text-xs text-muted-foreground">
          <div className="flex items-center justify-between mb-1">
            <span>Submitted Quarters:</span>
            <span className="font-medium">{submittedQuarters.length}/5</span>
          </div>
          <div className="flex gap-1">
            {["Q1", "Q2", "Q3", "Q4", "Final"].map((q) => (
              <div
                key={q}
                className={`flex-1 h-1.5 rounded ${
                  submittedQuarters.includes(q)
                    ? "bg-green-600"
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
