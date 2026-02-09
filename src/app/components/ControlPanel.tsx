import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface ControlPanelProps {
  patriotsScore: number;
  seahawksScore: number;
  quarter: string;
  possession: 'patriots' | 'seahawks';
  onPatriotsScoreChange: (score: number) => void;
  onSeahawksScoreChange: (score: number) => void;
  onQuarterChange: (quarter: string) => void;
  onPossessionChange: (possession: 'patriots' | 'seahawks') => void;
}

export function ControlPanel({
  patriotsScore,
  seahawksScore,
  quarter,
  possession,
  onPatriotsScoreChange,
  onSeahawksScoreChange,
  onQuarterChange,
  onPossessionChange,
}: ControlPanelProps) {
  const [isOpen, setIsOpen] = useState(true);
  const patriotsLastDigit = patriotsScore % 10;
  const seahawksLastDigit = seahawksScore % 10;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="p-6 space-y-6">
        <div>
          <CollapsibleTrigger className="w-full flex items-center justify-between hover:opacity-70 transition-opacity">
            <h2 className="text-xl font-semibold">Game Control Panel</h2>
            <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? '' : '-rotate-90'}`} />
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <div className="space-y-4 mt-4">
              {/* Score Inputs */}
              <div className="space-y-3">
                <div>
                  <Label htmlFor="patriots-score" className="text-sm font-medium">
                    Patriots Score
                  </Label>
                  <Input
                    id="patriots-score"
                    type="number"
                    min="0"
                    value={patriotsScore}
                    onChange={(e) => onPatriotsScoreChange(Number(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="seahawks-score" className="text-sm font-medium">
                    Seahawks Score
                  </Label>
                  <Input
                    id="seahawks-score"
                    type="number"
                    min="0"
                    value={seahawksScore}
                    onChange={(e) => onSeahawksScoreChange(Number(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Quarter Selection */}
              <div>
                <Label htmlFor="quarter" className="text-sm font-medium mb-1 block">
                  Quarter
                </Label>
                <Select value={quarter} onValueChange={onQuarterChange}>
                  <SelectTrigger id="quarter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Q1">Q1</SelectItem>
                    <SelectItem value="Q2">Q2</SelectItem>
                    <SelectItem value="Q3">Q3</SelectItem>
                    <SelectItem value="Q4">Q4</SelectItem>
                    <SelectItem value="Final">Final</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Possession Toggle */}
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Possession
                </Label>
                <ToggleGroup 
                  type="single" 
                  value={possession} 
                  onValueChange={(value) => value && onPossessionChange(value as 'patriots' | 'seahawks')}
                  className="grid grid-cols-2 gap-2"
                >
                  <ToggleGroupItem 
                    value="patriots" 
                    className="data-[state=on]:bg-blue-600 data-[state=on]:text-white"
                  >
                    Patriots Ball
                  </ToggleGroupItem>
                  <ToggleGroupItem 
                    value="seahawks"
                    className="data-[state=on]:bg-green-700 data-[state=on]:text-white"
                  >
                    Seahawks Ball
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
          </CollapsibleContent>
        </div>

        {/* Derived Display */}
        <div className="pt-4 border-t">
          <h3 className="text-sm font-semibold mb-3 text-muted-foreground">DERIVED VALUES</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Patriots Last Digit:</span>
              <span className="font-bold text-lg">{patriotsLastDigit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Seahawks Last Digit:</span>
              <span className="font-bold text-lg">{seahawksLastDigit}</span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="text-muted-foreground">Current Active Square:</span>
              <span className="font-bold">({patriotsLastDigit}, {seahawksLastDigit})</span>
            </div>
          </div>
        </div>
      </Card>
    </Collapsible>
  );
}