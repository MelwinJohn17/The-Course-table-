/* global React */
// Game prompt → Game select → Ludo playable, with order progress bar
const { useState: useSG, useEffect: useEG, useRef: useRG } = React;

function GamePromptScreen({ onPlay, onSkip, onBack }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", padding: 16, position: "relative" }}>
      <div style={{ position: "absolute", top: 10, left: 12 }}><Back onClick={onBack} label="Cart" /></div>
      <div style={{ textAlign: "center", maxWidth: 360 }} className="fade-in">
        <Eyebrow style={{ fontSize: 9 }}>Order confirmed · 18 min prep</Eyebrow>
        <div className="t-cursive" style={{ fontSize: 34, color: "var(--gold)", lineHeight: 1, marginTop: 8 }}>
          while you wait…
        </div>
        <div className="t-italic" style={{ fontSize: 14, color: "var(--cream)", marginTop: 6, lineHeight: 1.3 }}>
          Would you like to play something<br/>at the table?
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 14 }}>
          <button className="btn btn-primary btn-sm" onClick={onPlay}>Yes, play</button>
          <button className="btn btn-sm" onClick={onSkip}>Maybe later</button>
        </div>
      </div>
    </div>
  );
}

function GameSelectScreen({ onPick, onBack }) {
  const games = [
    { id: "ludo",   label: "Ludo",           desc: "2–4 players · roll & race", available: true },
    { id: "snl",    label: "Snake & Ladder", desc: "climbs, slips, gasps",      available: false },
    { id: "golf",   label: "Mini Golf",      desc: "swipe the green",            available: false },
    { id: "bowl",   label: "Bowling",        desc: "strike or spare",            available: false },
  ];
  return (
    <div style={{ width: "100%", height: "100%", padding: "10px 14px 12px", position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Back onClick={onBack} label="Back" />
        <Eyebrow style={{ fontSize: 9 }}>Choose a game</Eyebrow>
        <div style={{ width: 40 }} />
      </div>
      <div className="t-italic" style={{ fontSize: 15, color: "var(--cream)", marginTop: 6, lineHeight: 1.2 }}>
        Four to choose from.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 8 }}>
        {games.map(g => (
          <button key={g.id}
            onClick={() => g.available && onPick(g.id)}
            style={{
              background: g.available ? "var(--bg-forest-2)" : "transparent",
              border: "1px solid " + (g.available ? "var(--gold-soft)" : "var(--line-soft)"),
              color: "var(--cream)", padding: "8px 10px", borderRadius: 4,
              cursor: g.available ? "pointer" : "not-allowed", textAlign: "left",
              opacity: g.available ? 1 : 0.5, minHeight: 62,
              display: "flex", flexDirection: "column", justifyContent: "space-between",
              fontFamily: "var(--body)",
            }}>
            <div>
              <div className="t-italic" style={{ fontSize: 14, color: g.available ? "var(--gold)" : "var(--cream-soft)" }}>{g.label}</div>
              <div style={{ fontSize: 9, color: "var(--cream-soft)", marginTop: 2 }}>{g.desc}</div>
            </div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 8, letterSpacing: "0.15em", color: g.available ? "var(--ok)" : "var(--cream-soft)" }}>
              {g.available ? "PLAYABLE" : "DEMO SOON"}
            </div>
          </button>
        ))}
      </div>
      <button onClick={onBack} className="btn btn-ghost" style={{ marginTop: 6, fontSize: 10, fontFamily: "var(--mono)", letterSpacing: "0.15em" }}>
        ← Skip games
      </button>
    </div>
  );
}

/* ---- Ludo personal controls (minimized during game) ---- */
function LudoControls({ orderProgress, onRoll, lastRoll, onExit, onOpenMenu }) {
  return (
    <div style={{ width: "100%", height: "100%", padding: "10px 14px 10px", display: "flex", flexDirection: "column", position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Back onClick={onExit} label="Exit game" />
        <Eyebrow style={{ fontSize: 9 }}>Ana · Yellow</Eyebrow>
        <button className="btn-ghost btn" onClick={onOpenMenu} style={{ fontSize: 9, fontFamily: "var(--mono)", letterSpacing: "0.15em", padding: "4px 6px" }}>
          MENU ↗
        </button>
      </div>

      {/* dice */}
      <div style={{ flex: 1, display: "grid", placeItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div className="eyebrow" style={{ marginBottom: 6, fontSize: 9 }}>Tap to roll</div>
          <button onClick={onRoll}
            style={{
              width: 80, height: 80, borderRadius: 12,
              background: "var(--cream)", color: "#0a140f",
              border: "3px solid var(--gold)",
              fontFamily: "var(--display)", fontSize: 40, fontWeight: 700,
              cursor: "pointer", fontStyle: "italic",
              boxShadow: "0 10px 40px rgba(201,167,90,0.3)",
            }}>
            {lastRoll || "·"}
          </button>
          <div style={{ marginTop: 6, fontFamily: "var(--mono)", fontSize: 8.5, letterSpacing: "0.2em", color: "var(--cream-soft)" }}>
            {lastRoll ? `ROLLED ${lastRoll}` : "YOUR TURN"}
          </div>
        </div>
      </div>

      {/* Order status bar */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
          <span className="eyebrow" style={{ color: "var(--gold)", fontSize: 9 }}>Your order · Live</span>
          <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--cream-dim)" }}>
            {orderProgress < 35 ? "Kitchen received" :
             orderProgress < 65 ? "Being prepared" :
             orderProgress < 95 ? "Plating" : "Ready"}
          </span>
        </div>
        <div style={{ height: 5, background: "var(--bg-forest-2)", borderRadius: 3, overflow: "hidden" }}>
          <div className="shimmer" style={{ height: "100%", width: `${orderProgress}%`, transition: "width 0.8s ease", borderRadius: 3 }} />
        </div>
      </div>
    </div>
  );
}

/* ---- Center screen: Ludo board ---- */
function LudoBoard({ rolls }) {
  // 4 tokens, each moves along a simple visual loop of 28 cells when rolled.
  const [positions, setPositions] = useSG({ yellow: 0, red: 0, green: 0, blue: 0 });

  useEG(() => {
    if (!rolls.length) return;
    const last = rolls[rolls.length - 1];
    setPositions(p => {
      // advance active player (yellow = Ana, others simulated)
      const who = last.who;
      return { ...p, [who]: (p[who] + last.value) % 28 };
    });
  }, [rolls.length]);

  // Build visual loop cells along a ring
  const cells = [];
  const rows = 7, cols = 7;
  // top row, right col, bottom row (reversed), left col (reversed)
  for (let c = 0; c < cols; c++) cells.push([0, c]);
  for (let r = 1; r < rows; r++) cells.push([r, cols - 1]);
  for (let c = cols - 2; c >= 0; c--) cells.push([rows - 1, c]);
  for (let r = rows - 2; r >= 1; r--) cells.push([r, 0]);
  // 7+6+6+5 = 24 — need 28; extend by adding inner ring (just cap at 24, use mod)
  const ringLen = cells.length;

  const tokenColors = { yellow: "#c9a75a", red: "#b85a4a", green: "#86b073", blue: "#6ba0c9" };

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: 24, position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <BungalowMark size={0.6} />
        <div className="eyebrow" style={{ color: "var(--gold)" }}>Ludo · House of Bungalow</div>
      </div>

      <div style={{ flex: 1, display: "grid", placeItems: "center", marginTop: 6 }}>
        <div style={{
          width: 380, height: 380, position: "relative",
          border: "1px solid var(--line)", borderRadius: 6,
          background: "radial-gradient(ellipse at center, rgba(201,167,90,0.05) 0%, transparent 70%)",
          display: "grid", gridTemplateRows: `repeat(${rows}, 1fr)`, gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: 2, padding: 10,
        }}>
          {Array.from({ length: rows * cols }).map((_, i) => {
            const r = Math.floor(i / cols), c = i % cols;
            const ringIdx = cells.findIndex(([rr, cc]) => rr === r && cc === c);
            const onRing = ringIdx >= 0;
            const isCorner = (r === 0 || r === rows - 1) && (c === 0 || c === cols - 1);
            return (
              <div key={i} style={{
                background: onRing ? "rgba(201,167,90,0.05)" : "transparent",
                border: onRing ? "1px solid rgba(201,167,90,0.15)" : "1px solid transparent",
                borderRadius: 2,
                position: "relative",
              }}>
                {isCorner && <div style={{
                  position: "absolute", inset: 4, borderRadius: 3,
                  background: [tokenColors.yellow, tokenColors.red, tokenColors.blue, tokenColors.green][([0,cols-1,rows*cols-1,(rows-1)*cols]).indexOf(i)] + "22",
                  border: `1px solid ${[tokenColors.yellow, tokenColors.red, tokenColors.blue, tokenColors.green][([0,cols-1,rows*cols-1,(rows-1)*cols]).indexOf(i)]}`,
                }} />}
              </div>
            );
          })}

          {/* Center medallion */}
          <div style={{
            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
            width: 130, height: 130, borderRadius: "50%",
            border: "1px solid var(--gold-soft)",
            display: "grid", placeItems: "center",
            background: "radial-gradient(circle, rgba(201,167,90,0.1) 0%, transparent 70%)",
          }}>
            <div style={{ textAlign: "center" }}>
              <div className="t-cursive" style={{ fontSize: 28, color: "var(--gold)", lineHeight: 1 }}>home</div>
              <div className="eyebrow" style={{ marginTop: 4 }}>✦ SAFE</div>
            </div>
          </div>

          {/* Tokens */}
          {Object.entries(positions).map(([player, pos]) => {
            const [r, c] = cells[pos % ringLen];
            const cellSize = (380 - 20 - (cols - 1) * 2) / cols;
            const x = 10 + c * (cellSize + 2) + cellSize / 2;
            const y = 10 + r * (cellSize + 2) + cellSize / 2;
            const offsets = { yellow: [-6, -6], red: [6, -6], green: [-6, 6], blue: [6, 6] };
            const [ox, oy] = offsets[player];
            return (
              <div key={player} style={{
                position: "absolute", left: x + ox - 8, top: y + oy - 8,
                width: 16, height: 16, borderRadius: "50%",
                background: tokenColors[player],
                border: "1.5px solid #0a140f",
                boxShadow: `0 0 12px ${tokenColors[player]}88`,
                transition: "all 0.7s cubic-bezier(.5,0,.3,1)",
              }} />
            );
          })}
        </div>
      </div>

      {/* Turn bar */}
      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 6 }}>
        {["yellow","red","green","blue"].map((p, i) => (
          <div key={p} style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.1em", color: "var(--cream-soft)" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: tokenColors[p] }} />
            {["ANA","RAVI","MEERA","KABIR"][i]}
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { GamePromptScreen, GameSelectScreen, LudoControls, LudoBoard });
