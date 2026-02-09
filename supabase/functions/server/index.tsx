import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-47261854/health", (c) => {
  return c.json({ status: "ok" });
});

// Game state endpoints
app.get("/make-server-47261854/game-state", async (c) => {
  try {
    // Get all game state from KV store
    const keys = [
      'game:patriots-score',
      'game:seahawks-score',
      'game:quarter',
      'game:possession',
      'game:quarter-winners',
      'game:submitted-quarters'
    ];
    
    const values = await kv.mget(keys);
    
    // mget returns results in arbitrary order, so we need to get each individually
    const patriotsScore = await kv.get('game:patriots-score');
    const seahawksScore = await kv.get('game:seahawks-score');
    const quarter = await kv.get('game:quarter');
    const possession = await kv.get('game:possession');
    const quarterWinners = await kv.get('game:quarter-winners');
    const submittedQuarters = await kv.get('game:submitted-quarters');
    
    const gameState = {
      patriotsScore: patriotsScore ?? 0,
      seahawksScore: seahawksScore ?? 0,
      quarter: quarter ?? 'Q1',
      possession: possession ?? 'patriots',
      quarterWinners: quarterWinners ?? [],
      submittedQuarters: submittedQuarters ?? []
    };
    
    return c.json(gameState);
  } catch (error) {
    console.error('Error fetching game state:', error);
    return c.json({ error: 'Failed to fetch game state' }, 500);
  }
});

app.post("/make-server-47261854/game-state", async (c) => {
  try {
    const body = await c.req.json();
    
    // Update only provided fields
    const keys: string[] = [];
    const values: any[] = [];
    
    if (body.patriotsScore !== undefined) {
      keys.push('game:patriots-score');
      values.push(body.patriotsScore);
    }
    if (body.seahawksScore !== undefined) {
      keys.push('game:seahawks-score');
      values.push(body.seahawksScore);
    }
    if (body.quarter !== undefined) {
      keys.push('game:quarter');
      values.push(body.quarter);
    }
    if (body.possession !== undefined) {
      keys.push('game:possession');
      values.push(body.possession);
    }
    if (body.quarterWinners !== undefined) {
      keys.push('game:quarter-winners');
      values.push(body.quarterWinners);
    }
    if (body.submittedQuarters !== undefined) {
      keys.push('game:submitted-quarters');
      values.push(body.submittedQuarters);
    }
    
    if (keys.length > 0) {
      await kv.mset(keys, values);
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error updating game state:', error);
    return c.json({ error: 'Failed to update game state' }, 500);
  }
});

app.post("/make-server-47261854/submit-quarter", async (c) => {
  try {
    const body = await c.req.json();
    const { quarter, patriotsScore, seahawksScore } = body;
    
    if (!quarter) {
      return c.json({ error: 'Quarter is required' }, 400);
    }
    
    // Get current state
    const quarterWinners = await kv.get('game:quarter-winners');
    const submittedQuarters = await kv.get('game:submitted-quarters');
    
    const winners = quarterWinners || [];
    const submitted = submittedQuarters || [];
    
    // Check if already submitted
    if (submitted.includes(quarter)) {
      return c.json({ error: 'Quarter already submitted' }, 400);
    }
    
    // Add winner
    const patriotsLastDigit = patriotsScore % 10;
    const seahawksLastDigit = seahawksScore % 10;
    
    const alreadyWinner = winners.some(
      (w: any) => w.patriots === patriotsLastDigit && w.seahawks === seahawksLastDigit
    );
    
    if (!alreadyWinner) {
      winners.push({ patriots: patriotsLastDigit, seahawks: seahawksLastDigit });
    }
    
    // Add to submitted quarters
    submitted.push(quarter);
    
    // Save
    await kv.mset(
      ['game:quarter-winners', 'game:submitted-quarters'],
      [winners, submitted]
    );
    
    return c.json({ success: true, winners, submitted });
  } catch (error) {
    console.error('Error submitting quarter:', error);
    return c.json({ error: 'Failed to submit quarter' }, 500);
  }
});

Deno.serve(app.fetch);