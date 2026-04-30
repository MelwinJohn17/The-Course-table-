/* global React */
// Food arrival, ambient dining state, reorder panel, add-guest flow
const { useState: useSF, useEffect: useEF, useRef: useRF } = React;

/* --- Food arrival: personal screen message --- */
function FoodArrivalPersonal({ dinerName, onContinue }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", padding: 14 }} className="fade-in">
      <div style={{ textAlign: "center" }}>
        <Eyebrow style={{ color: "var(--gold)", fontSize: 9 }}>Your food is here</Eyebrow>
        <div className="t-cursive" style={{ fontSize: 38, color: "var(--cream)", lineHeight: 1.1, marginTop: 6 }}>
          enjoy your meal,<br/>{dinerName}.
        </div>
        <div style={{ width: 36, height: 1, background: "var(--gold)", margin: "10px auto" }} />
        <div style={{ fontSize: 10.5, color: "var(--cream-dim)", lineHeight: 1.5, maxWidth: 260, margin: "0 auto" }}>
          The table will gently fade into the background so nothing gets in the way of dinner.
        </div>
        <button className="btn btn-primary btn-sm" style={{ marginTop: 10 }} onClick={onContinue}>
          Tuck in →
        </button>
      </div>
    </div>
  );
}

/* --- Center during food arrival: "let's pause the game" --- */
function FoodArrivalCenter() {
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center" }} className="fade-in">
      <div style={{ textAlign: "center" }}>
        <div className="eyebrow" style={{ color: "var(--gold)" }}>GAME PAUSED</div>
        <div className="t-cursive" style={{ fontSize: 56, color: "var(--gold)", lineHeight: 1, marginTop: 12 }}>let's pause here.</div>
        <div className="t-italic" style={{ fontSize: 20, color: "var(--cream)", marginTop: 10 }}>
          Your meal is ready. We'll pick this up after.
        </div>
      </div>
    </div>
  );
}

/* --- Ambient dining state: personal screen nearly off --- */
function AmbientPersonal({ dinerName, onTapTab, isFocus }) {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* Minimal ambient pattern */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at center, rgba(201,167,90,0.04) 0%, transparent 70%)",
      }} />
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
        <div style={{ textAlign: "center", opacity: 0.4 }}>
          <div className="t-cursive" style={{ fontSize: 28, color: "var(--cream-soft)" }}>{dinerName}</div>
        </div>
      </div>
      {/* Breathing gold dot as subtle presence indicator */}
      <div className="breathe" style={{
        position: "absolute", top: 20, right: 24, width: 5, height: 5, borderRadius: "50%",
        background: "var(--gold)", boxShadow: "0 0 10px var(--gold)",
      }} />
      {/* Tap tab */}
      <button className="tap-tab" onClick={onTapTab}>
        DOUBLE-TAP FOR MENU / HELP
      </button>
    </div>
  );
}

/* --- Center ambient state --- */
function AmbientCenter({ onAddGuest }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", position: "relative" }}>
      <div style={{ textAlign: "center", opacity: 0.3 }}>
        <BungalowMark size={0.8} color="var(--cream-soft)" />
      </div>
      {/* Walk-in guest "+" button */}
      <button onClick={onAddGuest}
        style={{
          position: "absolute", bottom: 18, right: 18,
          width: 44, height: 44, borderRadius: "50%",
          background: "rgba(201,167,90,0.08)", border: "1px solid var(--gold-soft)",
          color: "var(--gold)", fontSize: 22, lineHeight: 1, cursor: "pointer",
          fontFamily: "var(--body)",
        }}
        title="Add a walk-in guest">+</button>
    </div>
  );
}

/* --- Reorder panel (triple-tap) --- */
function ReorderPanel({ onClose, onRequestBill, onReorder, cart, addItem, removeItem }) {
  const menu = window.BUNGALOW_MENU;
  const [added, setAdded] = useSF([]);

  const total = added.reduce((a, b) => a + b.qty * b.price, 0);
  const popular = menu.items.slice(0, 6);

  return (
    <div className="sheet fade-in" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        margin: "auto",
        width: 340, // ~ 8.3" in the context of personal screen
        maxHeight: "86%",
        background: "var(--bg-card)",
        border: "1px solid var(--gold-soft)",
        borderRadius: 6,
        padding: 14,
        display: "flex", flexDirection: "column",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="eyebrow" style={{ color: "var(--gold)" }}>Something more?</div>
          <button className="btn-ghost btn btn-sm" onClick={onClose}>✕ close</button>
        </div>

        <div className="t-italic" style={{ fontSize: 16, color: "var(--cream)", marginTop: 6 }}>
          Add to the table — no re-browsing needed.
        </div>

        <div className="scroll-y" style={{ flex: 1, marginTop: 10, maxHeight: 200 }}>
          {popular.map(it => {
            const inCart = added.find(c => c.id === it.id);
            return (
              <div key={it.id} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "8px 0",
                borderBottom: "1px solid var(--line-soft)",
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="t-italic" style={{ fontSize: 13, color: "var(--cream)" }}>{it.name}</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--gold)" }}>₹{it.price}</div>
                </div>
                {inCart ? (
                  <QtyStepper small
                    value={inCart.qty}
                    onInc={() => setAdded(a => a.map(x => x.id === it.id ? { ...x, qty: x.qty + 1 } : x))}
                    onDec={() => setAdded(a => a.flatMap(x => x.id === it.id ? (x.qty > 1 ? [{ ...x, qty: x.qty - 1 }] : []) : [x]))}
                  />
                ) : (
                  <button className="btn btn-sm" onClick={() => setAdded(a => [...a, { ...it, qty: 1 }])}>Add</button>
                )}
              </div>
            );
          })}
        </div>

        <Hairline soft style={{ marginTop: 8 }} />

        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <button className="btn btn-sm" style={{ flex: 1 }} onClick={() => alert("A host has been notified.")}>Need assistance</button>
          <button className="btn btn-primary btn-sm" style={{ flex: 1 }} disabled={added.length === 0}
            onClick={() => { onReorder(added); setAdded([]); }}>
            {added.length > 0 ? `Add ₹${total} to order` : "Add to order"}
          </button>
        </div>
        <button className="btn" style={{ marginTop: 8, justifyContent: "center" }} onClick={onRequestBill}>
          Pay the bill →
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { FoodArrivalPersonal, FoodArrivalCenter, AmbientPersonal, AmbientCenter, ReorderPanel });
