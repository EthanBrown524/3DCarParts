// Load .env if present (optional — can also set env vars directly)
try { require('fs').readFileSync('.env').toString().split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length) process.env[k.trim()] = v.join('=').trim();
}); } catch {}

const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();

app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json());

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── Full catalog knowledge baked into the system prompt ──────────────────────
const CATALOG_CONTEXT = `
SUPPORTED VEHICLES (5 cars):
• 2024 Honda Civic Sport (ID: civic-2024) — $28,500 MSRP. 5x114.3 bolt, 64.1mm bore, stock 17". Mod slots: wheels, spoiler, front bumper, exhaust, paint, side skirts, hood.
• 2024 Ford Mustang GT (ID: mustang-2024) — $42,000 MSRP. 5x114.3 bolt, 70.5mm bore, stock 19". Mod slots: wheels, spoiler, front bumper, rear bumper, side skirts, exhaust, paint.
• 2024 Subaru WRX Premium (ID: wrx-2024) — $32,000 MSRP. 5x114.3 bolt, 56.1mm bore, stock 18". Mod slots: wheels, spoiler, front bumper, exhaust, paint, side skirts, hood.
• 2024 Toyota Camry SE (ID: camry-2024) — $29,500 MSRP. 5x114.3 bolt, 60.1mm bore, stock 17". Mod slots: wheels, spoiler, paint, side skirts.
• 2024 Tesla Model 3 Performance (ID: model3-2024) — $50,000 MSRP. 5x114.3 bolt, 64.1mm bore, stock 20". Mod slots: wheels, spoiler, paint, side skirts.

PARTS CATALOG:

Wheels:
• Enkei RPF1 18x9.5 +38 — $380/ea (set of 4: $1,520). 8.2kg. Fits all 5 cars. Lightweight forged, motorsport proven.
• Volk Racing TE37 Saga 18x10 +40 — $680/ea (set of 4: $2,720). 7.8kg. Fits Civic, WRX, Mustang, Camry. Iconic forged monoblock.
• Konig Hypergram 17x8 +45 — $180/ea (set of 4: $720). 8.0kg. Fits Civic, WRX, Camry. Budget flow-formed option.
• Work Meister S1 3P 20x10 +25 — $1,200/ea (set of 4: $4,800). 11.5kg. Fits Mustang, Model 3. Luxury 3-piece forged.

Spoilers:
• APR Performance GTC-300 Carbon Wing — $1,450 + $200 labor. Fits Civic, WRX, Mustang. 67" carbon fiber, adjustable angle.
• Generic OEM-Style Ducktail Spoiler — $120 + $80 labor. Fits all 5 cars. Subtle ABS trunk lip.

Front Bumpers:
• Varis Aero Front Bumper (FRP) — $1,800 + $400 labor. Fits Civic, WRX. Full replacement with integrated splitter.
• RTR Aero Front Bumper — $2,200 + $500 labor. Fits Mustang only. Aggressive FRP/carbon aero design.

Paint / Wraps:
• 3M Satin Black Full Wrap — $3,500 + $1,500 labor. All cars.
• 3M Midnight Blue Metallic Wrap — $3,800 + $1,500 labor. All cars.
• Custom Pearl White Respray — $5,000 + $3,000 labor. All cars. Tri-coat.
• Avery Dennison Racing Green Gloss Wrap — $3,600 + $1,500 labor. All cars.

Exhaust:
• Invidia Q300 Cat-Back — $1,100 + $300 labor. Fits WRX, Civic. Stainless, dual tip.
• Borla ATAK Cat-Back — $1,650 + $350 labor. Fits Mustang only. Aggressive quad tip, T-304 stainless.

Side Skirts:
• Generic Universal Side Skirt Extensions — $250 + $150 labor (pair). All cars. Bolt-on ABS.

Hoods:
• Seibon Carbon Fiber Vented Hood — $1,400 + $200 labor. Fits Civic, WRX. Dry carbon with vents.

FITMENT RULES (for reference):
• All cars share 5x114.3 bolt pattern
• Wheel offset within ±10mm of stock = good; ±10-20mm = warning (fender rolling may be needed); >20mm aggressive = error
• Width > 2" over stock = clearance warning; > 3" = fitment error
• Tax rate: 8% applied on parts + labor subtotal
`;

const SYSTEM_PROMPT = `You are an expert car modification advisor for the 3DCarParts configurator — a web app where users pick a car and add aftermarket parts to build and price their dream build.

Your role:
- Help users choose the right parts for their goals (performance, aesthetics, budget)
- Explain fitment rules, compatibility, and potential issues
- Give honest assessments (e.g., warn about heavy 3-piece wheels hurting performance)
- Suggest logical build progressions and part pairings
- Answer general questions about car modification

When a user's current build is included, reference it specifically and give personalized advice.

Be concise, direct, and enthusiastic — like a knowledgeable friend at a car meet. Don't pad responses.

${CATALOG_CONTEXT}`;

// ── SSE streaming chat endpoint ───────────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
  const { messages, buildContext } = req.body;

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY is not set. Add it to server/.env' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const system = buildContext
    ? `${SYSTEM_PROMPT}\n\n--- USER'S CURRENT BUILD ---\n${buildContext}`
    : SYSTEM_PROMPT;

  try {
    const stream = client.messages.stream({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      system,
      messages,
    });

    for await (const text of stream.text_stream) {
      res.write(`data: ${JSON.stringify({ text })}\n\n`);
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
});

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n3DCarParts AI server running on http://localhost:${PORT}`);
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('⚠  ANTHROPIC_API_KEY not set — copy server/.env.example to server/.env\n');
  }
});
