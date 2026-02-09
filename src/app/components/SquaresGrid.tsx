import { useState } from "react";
import { Card } from "./ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface SquaresGridProps {
  patriotsScore: number;
  seahawksScore: number;
  possession: 'patriots' | 'seahawks';
  quarterWinners: Array<{ patriots: number; seahawks: number }>;
}

// Sample data - 100 participants
const PLAYER_NAMES = [
  // Row 0 (Patriots digit 0)
  "Steve", "Steve", "Steve", "Steve", "Steve", "Chrissie", "Travis", "Rachel", "jei", "Luca",
  // Row 1 (Patriots digit 1)
  "Dubs", "Liza", "MikEeEeEe", "Dani", "Rachel", "Blake", "Donnie", "MikEeEeEe", "Josh S", "Kelby",
  // Row 2 (Patriots digit 9)
  "Josh S", "Lonnie", "K•A•T", "Dubs", "Jemm", "K•A•T", "jei", "ziggy", "Elizabeth", "Dubs",
  // Row 3 (Patriots digit 4)
  "Sam", "ziggy", "Mom", "Archer", "Arthur", "Cgoods", "Beth", "Kelly P", "Tritia", "Bogie",
  // Row 4 (Patriots digit 7)
  "Meeners", "Rachel", "Josh S", "Arthur", "Lola", "Jemm", "Amber", "Donnie", "Sam", "K•A•T",
  // Row 5 (Patriots digit 2)
  "Travis", "Meeners", "Tritia", "K•A•T", "Rachel", "Levi", "Reynee", "Tritia", "Chrissie", "Jemm",
  // Row 6 (Patriots digit 3)
  "Dani", "Chrissie", "Johnsbro", "Elizabeth", "MikEeEeEe", "Josh S", "Kelby", "Cgoods", "MikEeEeEe", "Travis",
  // Row 7 (Patriots digit 6)
  "Blake", "Donnie", "Harper", "Dani", "Kelby", "ziggy", "Bogie", "Momo", "Arthur", "Dad",
  // Row 8 (Patriots digit 5)
  "MikEeEeEe", "K•A•T", "Jemm", "Blake", "Kelly P", "Sam", "Travis", "Elizabeth", "Rachel", "Reynee",
  // Row 9 (Patriots digit 8)
  "Jemm", "Arthur", "Sam", "Travis", "Cgoods", "Arthur", "Chrissie", "jei", "Blake", "Josh S"
];

// Randomized digit order (from the image reference)
const SEAHAWKS_DIGITS = [3, 1, 9, 7, 2, 4, 6, 0, 5, 8];
const PATRIOTS_DIGITS = [0, 1, 9, 4, 7, 2, 3, 6, 5, 8];

interface ProbabilitySquare {
  row: number;
  col: number;
  type: 'fg' | 'td' | 'td-missed' | 'td-2pt' | 'pick6' | 'safety';
  intensity: number; // 1-3 for visual weight
}

export function SquaresGrid({ 
  patriotsScore, 
  seahawksScore, 
  possession,
  quarterWinners 
}: SquaresGridProps) {
  const [hoveredSquare, setHoveredSquare] = useState<{ row: number; col: number } | null>(null);

  const patriotsLastDigit = patriotsScore % 10;
  const seahawksLastDigit = seahawksScore % 10;

  // Find current active square position
  const activeRow = PATRIOTS_DIGITS.indexOf(patriotsLastDigit);
  const activeCol = SEAHAWKS_DIGITS.indexOf(seahawksLastDigit);

  // Calculate probability squares based on possession
  const getProbabilitySquares = (): ProbabilitySquare[] => {
    const squares: ProbabilitySquare[] = [];
    
    if (possession === 'patriots') {
      // Patriots offensive scoring
      const fg = (patriotsScore + 3) % 10; // Field goal
      const td = (patriotsScore + 7) % 10; // TD + XP
      const tdMissed = (patriotsScore + 6) % 10; // TD no XP
      const td2pt = (patriotsScore + 8) % 10; // TD + 2pt
      
      const patriotsFgRow = PATRIOTS_DIGITS.indexOf(fg);
      const patriotsTdRow = PATRIOTS_DIGITS.indexOf(td);
      const patriotsTdMissedRow = PATRIOTS_DIGITS.indexOf(tdMissed);
      const patriotsTd2ptRow = PATRIOTS_DIGITS.indexOf(td2pt);
      
      const seahawksCol = SEAHAWKS_DIGITS.indexOf(seahawksLastDigit);
      
      squares.push({ row: patriotsFgRow, col: seahawksCol, type: 'fg', intensity: 2 });
      squares.push({ row: patriotsTdRow, col: seahawksCol, type: 'td', intensity: 3 });
      squares.push({ row: patriotsTdMissedRow, col: seahawksCol, type: 'td-missed', intensity: 1 });
      squares.push({ row: patriotsTd2ptRow, col: seahawksCol, type: 'td-2pt', intensity: 1 });
      
      // Defensive scores against Patriots
      const pick6 = (seahawksScore + 7) % 10;
      const safety = (seahawksScore + 2) % 10;
      
      const seahawksPick6Col = SEAHAWKS_DIGITS.indexOf(pick6);
      const seahawksSafetyCol = SEAHAWKS_DIGITS.indexOf(safety);
      
      const patriotsRow = PATRIOTS_DIGITS.indexOf(patriotsLastDigit);
      
      squares.push({ row: patriotsRow, col: seahawksPick6Col, type: 'pick6', intensity: 2 });
      squares.push({ row: patriotsRow, col: seahawksSafetyCol, type: 'safety', intensity: 1 });
    } else {
      // Seahawks offensive scoring
      const fg = (seahawksScore + 3) % 10;
      const td = (seahawksScore + 7) % 10;
      const tdMissed = (seahawksScore + 6) % 10;
      const td2pt = (seahawksScore + 8) % 10;
      
      const seahawksFgCol = SEAHAWKS_DIGITS.indexOf(fg);
      const seahawksTdCol = SEAHAWKS_DIGITS.indexOf(td);
      const seahawksTdMissedCol = SEAHAWKS_DIGITS.indexOf(tdMissed);
      const seahawksTd2ptCol = SEAHAWKS_DIGITS.indexOf(td2pt);
      
      const patriotsRow = PATRIOTS_DIGITS.indexOf(patriotsLastDigit);
      
      squares.push({ row: patriotsRow, col: seahawksFgCol, type: 'fg', intensity: 2 });
      squares.push({ row: patriotsRow, col: seahawksTdCol, type: 'td', intensity: 3 });
      squares.push({ row: patriotsRow, col: seahawksTdMissedCol, type: 'td-missed', intensity: 1 });
      squares.push({ row: patriotsRow, col: seahawksTd2ptCol, type: 'td-2pt', intensity: 1 });
      
      // Defensive scores against Seahawks
      const pick6 = (patriotsScore + 7) % 10;
      const safety = (patriotsScore + 2) % 10;
      
      const patriotsPick6Row = PATRIOTS_DIGITS.indexOf(pick6);
      const patriotsSafetyRow = PATRIOTS_DIGITS.indexOf(safety);
      
      const seahawksCol = SEAHAWKS_DIGITS.indexOf(seahawksLastDigit);
      
      squares.push({ row: patriotsPick6Row, col: seahawksCol, type: 'pick6', intensity: 2 });
      squares.push({ row: patriotsSafetyRow, col: seahawksCol, type: 'safety', intensity: 1 });
    }
    
    return squares;
  };

  const probabilitySquares = getProbabilitySquares();

  const getSquareClassName = (row: number, col: number): string => {
    const baseClasses = "relative h-12 border border-gray-300 flex items-center justify-center text-xs font-medium transition-all duration-300";
    
    // Check if this is a quarter winner
    const isWinner = quarterWinners.some(
      (winner) =>
        PATRIOTS_DIGITS[row] === winner.patriots &&
        SEAHAWKS_DIGITS[col] === winner.seahawks
    );
    
    // Check if this is the active square
    if (row === activeRow && col === activeCol) {
      // If it's both active AND a winner, show blue with green border
      if (isWinner) {
        return `${baseClasses} bg-blue-500 text-white shadow-lg shadow-blue-500/50 scale-105 z-10 border-4 border-green-600`;
      }
      return `${baseClasses} bg-blue-500 text-white shadow-lg shadow-blue-500/50 scale-105 z-10`;
    }
    
    if (isWinner) {
      return `${baseClasses} bg-green-600 text-white font-bold`;
    }
    
    // Check if this is a probability square
    const probSquare = probabilitySquares.find(ps => ps.row === row && ps.col === col);
    if (probSquare) {
      if (probSquare.type === 'pick6' || probSquare.type === 'safety') {
        const opacity = probSquare.intensity === 2 ? 'from-orange-300 to-orange-400' : 'from-orange-200 to-orange-300';
        return `${baseClasses} bg-gradient-to-br ${opacity} text-gray-800`;
      } else {
        // Stronger yellow for most likely scores (+3, +7), lighter for less likely (+6, +8)
        const opacity = probSquare.intensity === 3 ? 'from-yellow-400 to-yellow-500' : 
                       probSquare.intensity === 2 ? 'from-yellow-300 to-yellow-400' : 
                       'from-yellow-50 to-yellow-100';
        return `${baseClasses} bg-gradient-to-br ${opacity} text-gray-800`;
      }
    }
    
    return `${baseClasses} bg-gray-50 hover:bg-gray-100 text-gray-700`;
  };

  const getWinnerQuarters = (row: number, col: number): string[] => {
    const patriotsDigit = PATRIOTS_DIGITS[row];
    const seahawksDigit = SEAHAWKS_DIGITS[col];
    
    const quarters: string[] = [];
    
    // We need to track which quarter each winner corresponds to
    // Since we don't have that info stored separately, we'll just show that it's a winner
    // But we can check the index in the quarterWinners array
    quarterWinners.forEach((winner, index) => {
      if (winner.patriots === patriotsDigit && winner.seahawks === seahawksDigit) {
        // Map index to quarter (0=Q1, 1=Q2, 2=Q3, 3=Q4, 4=Final)
        const quarterNames = ['Q1', 'Q2', 'Q3', 'Q4', 'Final'];
        if (index < quarterNames.length) {
          quarters.push(quarterNames[index]);
        }
      }
    });
    
    return quarters;
  };

  const getQuarterBadgePosition = (quarter: string): string => {
    switch (quarter) {
      case 'Q1':
        return 'top-0.5 left-0.5';
      case 'Q2':
        return 'top-0.5 right-0.5';
      case 'Q3':
        return 'bottom-0.5 left-0.5';
      case 'Q4':
        return 'bottom-0.5 right-0.5';
      case 'Final':
        return 'bottom-0.5 left-1/2 -translate-x-1/2';
      default:
        return '';
    }
  };

  const getPlayerName = (row: number, col: number): string => {
    return PLAYER_NAMES[row * 10 + col];
  };

  const getTooltipContent = (row: number, col: number): string => {
    const playerName = getPlayerName(row, col);
    const patriotsDigit = PATRIOTS_DIGITS[row];
    const seahawksDigit = SEAHAWKS_DIGITS[col];
    
    let status = "";
    if (row === activeRow && col === activeCol) {
      status = "🎯 CURRENT SCORE";
    } else {
      const isWinner = quarterWinners.some(
        (winner) => winner.patriots === patriotsDigit && winner.seahawks === seahawksDigit
      );
      if (isWinner) {
        const quarters = getWinnerQuarters(row, col).join(', ');
        status = `🏆 QUARTER WINNER (${quarters})`;
      } else {
        const probSquare = probabilitySquares.find(ps => ps.row === row && ps.col === col);
        if (probSquare) {
          if (probSquare.type === 'fg') status = "⚡ Field Goal (3 pts)";
          else if (probSquare.type === 'td') status = "⚡ Touchdown + XP (7 pts)";
          else if (probSquare.type === 'td-missed') status = "⚡ TD no XP (6 pts)";
          else if (probSquare.type === 'td-2pt') status = "⚡ TD + 2pt (8 pts)";
          else if (probSquare.type === 'pick6') status = "🛡️ Pick Six (7 pts)";
          else if (probSquare.type === 'safety') status = "🛡️ Safety (2 pts)";
        }
      }
    }
    
    return `${playerName}\nSquare: (${patriotsDigit}, ${seahawksDigit})\nPotential: $200${status ? '\n' + status : ''}`;
  };

  return (
    <Card className="p-6">
      <TooltipProvider>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            {/* Grid container */}
            <div className="grid gap-0" style={{ gridTemplateColumns: 'auto repeat(10, 1fr)' }}>
              {/* Top-left corner */}
              <div className="h-12 flex items-center justify-center font-bold text-xs bg-gray-200 border border-gray-300">
                SB LX
              </div>
              
              {/* Seahawks header row */}
              {SEAHAWKS_DIGITS.map((digit) => (
                <div
                  key={`sea-${digit}`}
                  className="h-12 flex items-center justify-center font-bold text-white bg-green-700 border border-gray-300"
                >
                  {digit}
                </div>
              ))}
              
              {/* Grid rows */}
              {PATRIOTS_DIGITS.map((patriotsDigit, row) => (
                <div key={`row-${row}`} className="contents">
                  {/* Patriots header column */}
                  <div className="h-12 flex items-center justify-center font-bold text-white bg-blue-700 border border-gray-300">
                    {patriotsDigit}
                  </div>
                  
                  {/* Square cells */}
                  {SEAHAWKS_DIGITS.map((seahawksDigit, col) => {
                    const winnerQuarters = getWinnerQuarters(row, col);
                    const hasWinnerBadge = winnerQuarters.length > 0;
                    
                    return (
                      <Tooltip key={`${row}-${col}`}>
                        <TooltipTrigger asChild>
                          <div
                            className={getSquareClassName(row, col)}
                            onMouseEnter={() => setHoveredSquare({ row, col })}
                            onMouseLeave={() => setHoveredSquare(null)}
                          >
                            <span>{getPlayerName(row, col)}</span>
                            {winnerQuarters.map((quarter) => (
                              <div 
                                key={quarter}
                                className={`absolute bg-green-700 text-white text-[9px] font-bold px-1 py-0.5 rounded shadow-sm ${getQuarterBadgePosition(quarter)}`}
                              >
                                {quarter === 'Final' ? 'F' : quarter}
                              </div>
                            ))}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs whitespace-pre-line">
                          {getTooltipContent(row, col)}
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              ))}
            </div>
            
            {/* Team labels */}
            <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-700 rounded"></div>
                <span className="font-semibold">Patriots (NE)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Seahawks (SEA)</span>
                <div className="w-4 h-4 bg-green-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </Card>
  );
}