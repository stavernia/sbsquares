// API helper functions for game state management

import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-47261854`;

interface GameState {
  patriotsScore: number;
  seahawksScore: number;
  quarter: string;
  possession: 'patriots' | 'seahawks';
  quarterWinners: Array<{ patriots: number; seahawks: number }>;
  submittedQuarters: string[];
}

export async function getGameState(): Promise<GameState | null> {
  try {
    const response = await fetch(`${API_BASE}/game-state`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch game state:', await response.text());
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching game state:', error);
    return null;
  }
}

export async function updateGameState(state: Partial<GameState>): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/game-state`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(state),
    });

    if (!response.ok) {
      console.error('Failed to update game state:', await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating game state:', error);
    return false;
  }
}

export async function submitQuarter(
  quarter: string,
  patriotsScore: number,
  seahawksScore: number
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/submit-quarter`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quarter,
        patriotsScore,
        seahawksScore,
      }),
    });

    if (!response.ok) {
      console.error('Failed to submit quarter:', await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error submitting quarter:', error);
    return false;
  }
}
