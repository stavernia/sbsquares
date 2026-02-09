import { useState, useEffect } from "react";
import { ControlPanel } from "./components/ControlPanel";
import { SquaresGrid } from "./components/SquaresGrid";
import { Legend } from "./components/Legend";
import { QuarterSubmit } from "./components/QuarterSubmit";
import { getGameState, updateGameState, submitQuarter } from "./api/gameState";
import patriotsLogo from "figma:asset/30f90a11621ee6592b57efec61f850918684c5f9.png";
import { toast } from "sonner";
import { Toaster } from "./components/ui/sonner";

interface QuarterWinner {
  patriots: number;
  seahawks: number;
}

export default function App() {
  const [patriotsScore, setPatriotsScore] = useState(0);
  const [seahawksScore, setSeahawksScore] = useState(0);
  const [quarter, setQuarter] = useState("Q1");
  const [possession, setPossession] = useState<'patriots' | 'seahawks'>('patriots');
  const [quarterWinners, setQuarterWinners] = useState<QuarterWinner[]>([]);
  const [submittedQuarters, setSubmittedQuarters] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial game state
  useEffect(() => {
    loadGameState();
  }, []);

  // Poll for updates every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadGameState();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const loadGameState = async () => {
    const state = await getGameState();
    if (state) {
      setPatriotsScore(state.patriotsScore);
      setSeahawksScore(state.seahawksScore);
      setQuarter(state.quarter);
      setPossession(state.possession);
      setQuarterWinners(state.quarterWinners);
      setSubmittedQuarters(state.submittedQuarters);
    }
    setIsLoading(false);
  };

  const handlePatriotsScoreChange = async (score: number) => {
    setPatriotsScore(score);
    await updateGameState({ patriotsScore: score });
  };

  const handleSeahawksScoreChange = async (score: number) => {
    setSeahawksScore(score);
    await updateGameState({ seahawksScore: score });
  };

  const handleQuarterChange = async (newQuarter: string) => {
    setQuarter(newQuarter);
    await updateGameState({ quarter: newQuarter });
  };

  const handlePossessionChange = async (newPossession: 'patriots' | 'seahawks') => {
    setPossession(newPossession);
    await updateGameState({ possession: newPossession });
  };

  const handleSubmitQuarter = async () => {
    const success = await submitQuarter(quarter, patriotsScore, seahawksScore);
    if (success) {
      toast.success(`${quarter} winner locked in!`);
      // Reload state to get updated winners and submitted quarters
      await loadGameState();
    } else {
      toast.error('Failed to submit quarter. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading game state...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-2">
            <img src={patriotsLogo} alt="Super Bowl" className="w-16 h-16 object-contain" />
            <div>
              <h1 className="text-3xl font-bold">Super Bowl Squares</h1>
              <p className="text-xl text-muted-foreground">Patriots vs Seahawks</p>
            </div>
          </div>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>
              <span className="font-medium">Buy-in:</span> $10 per square (max 5 per person)
            </p>
            <p>
              <span className="font-medium">Payout:</span> $200 per quarter winner + $200 final winner
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Control Panel - Left Side on Desktop */}
          <div className="lg:col-span-3 space-y-4">
            <Legend />
            <QuarterSubmit
              quarter={quarter}
              patriotsScore={patriotsScore}
              seahawksScore={seahawksScore}
              onSubmitQuarter={handleSubmitQuarter}
              submittedQuarters={submittedQuarters}
            />
            <ControlPanel
              patriotsScore={patriotsScore}
              seahawksScore={seahawksScore}
              quarter={quarter}
              possession={possession}
              onPatriotsScoreChange={handlePatriotsScoreChange}
              onSeahawksScoreChange={handleSeahawksScoreChange}
              onQuarterChange={handleQuarterChange}
              onPossessionChange={handlePossessionChange}
            />
          </div>

          {/* Squares Grid - Right Side on Desktop */}
          <div className="lg:col-span-9">
            <SquaresGrid
              patriotsScore={patriotsScore}
              seahawksScore={seahawksScore}
              possession={possession}
              quarterWinners={quarterWinners}
            />
          </div>
        </div>
      </main>
    </div>
  );
}