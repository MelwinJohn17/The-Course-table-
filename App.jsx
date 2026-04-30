/* global React, ReactDOM */
// Bungalow — main app: table shell + state machine + send-to-kitchen animation
const { useState, useEffect, useRef, useCallback, useMemo } = React;

function App() {
  // core state
  const [step, setStep] = useState(() => localStorage.getItem("bungalow.step") || "booking");
  const [diners, setDiners] = useState(() => parseInt(localStorage.getItem("bungalow.diners") || "4", 10));
  const [cart, setCart] = useState(() => {
    // Seed with a couple of picks by companions so the center plate grid has life.
    const M = (window.BUNGALOW_MENU && window.BUNGALOW_MENU.items) || [];
    const find = (id) => M.find(x => x.id === id);
    const seed = [];
    const kabir = find("m1"); if (kabir) seed.push({ ...kabir, qty: 1, addedBy: "Kabir" });
    const ravi  = find("s3"); if (ravi)  seed.push({ ...ravi,  qty: 1, addedBy: "Ravi" });
    const meera = find("m5"); if (meera) seed.push({ ...meera, qty: 1, addedBy: "Meera" });
    return seed;
  });
  const [leavingOwners, setLeavingOwners] = useState([]);
  const [rolls, setRolls] = useState([]);
  const [lastRoll, setLastRoll] = useState(0);
  const [orderProgress, setOrderProgress] = useState(0);
  const [reorderOpen, setReorderOpen] = useState(false);
  const [billChoice, setBillChoice] = useState(null);
  const [manualAmount, setManualAmount] = useState(0);
  const [guestCount, setGuestCount] = useState(0); // walk-ins
  const [flyingDishes, setFlyingDishes] = useState([]);

  useEffect(() => { localStorage.setItem("bungalow.step", step); }, [step]);
  useEffect(() => { localStorage.setItem("bungalow.diners", String(diners)); }, [diners]);

  const dinerNames = window.BUNGALOW_DINERS[diners] || window.BUNGALOW_DINERS[4];
  const focusName = dinerNames[0]; // Ana
  const totalDiners = dinerNames.length + guestCount;

  /* ---- Cart helpers ---- */
  const addItem = useCallback((it) => {
    const owner = it.addedBy || "Ana";
    setCart(c => {
      const ex = c.find(x => x.id === it.id && (x.addedBy || "Ana") === owner);
      if (ex) return c.map(x => (x.id === it.id && (x.addedBy || "Ana") === owner) ? { ...x, qty: x.qty + 1 } : x);
      return [...c, { ...it, qty: 1, addedBy: owner }];
    });
  }, []);
  const removeItem = useCallback((id) => {
    setCart(c => c.flatMap(x => (x.id === id && (x.addedBy || "Ana") === "Ana") ? (x.qty > 1 ? [{ ...x, qty: x.qty - 1 }] : []) : [x]));
  }, []);

  const cartTotal = cart.reduce((a, b) => a + b.qty * b.price, 0);
  const cartCount = cart.reduce((a, b) => a + b.qty, 0);
  // my share = half of cart for Ana as a rough estimate
  const myShare = Math.round(cartTotal * 0.7);
  const tableTotal = Math.max(cartTotal, 2940); // add imagined sides from others

  /* ---- Send to kitchen: fly ANA's dishes off the table, keep others ---- */
  const sendToKitchen = useCallback(() => {
    const owner = "Ana";
    // Animate ana's dish tiles on the center out toward the top edge (leaving the table).
    const tiles = document.querySelectorAll(`[data-center-owner="${owner}"]`);
    const flights = [];
    tiles.forEach((el, i) => {
      const r = el.getBoundingClientRect();
      flights.push({
        id: `fly-kitchen-${i}-${Date.now()}`,
        x: r.left, y: r.top, w: r.width, h: r.height,
        // Fly upward & shrink swiftly — off the table
        dx: 0, dy: -(r.top + r.height + 60),
        delay: i * 90,
        label: el.getAttribute("data-center-name") || "",
        tint: el.getAttribute("data-center-tint") || "#afa231",
      });
    });
    // Hide Ana's tiles in the center while flights are visible
    setLeavingOwners(o => [...o, owner]);
    setFlyingDishes(flights);
    setStep("sending");
    // After flight duration, clear ana's cart and continue
    const totalTime = flights.length * 90 + 1500;
    setTimeout(() => {
      setFlyingDishes([]);
      setCart(c => c.filter(x => (x.addedBy || "Ana") !== owner));
      setLeavingOwners(o => o.filter(x => x !== owner));
      setStep("game_prompt");
      setOrderProgress(10);
    }, totalTime);
  }, []);

  /* ---- Order progress ticker when active ---- */
  useEffect(() => {
    if (!["game_prompt","game_select","game_play"].includes(step)) return;
    if (orderProgress >= 100) return;
    const iv = setInterval(() => {
      setOrderProgress(p => Math.min(100, p + (step === "game_play" ? 1.3 : 0.8)));
    }, 380);
    return () => clearInterval(iv);
  }, [step, orderProgress]);

  // When order completes during game, trigger food arrival
  useEffect(() => {
    if (step === "game_play" && orderProgress >= 100) {
      setTimeout(() => setStep("food_ready"), 800);
    }
  }, [orderProgress, step]);

  // Seated → Welcome: slow 1200ms transition so the "everyone's settled" beat reads
  useEffect(() => {
    if (step !== "seated") return;
    const t = setTimeout(() => setStep("welcome"), 1200);
    return () => clearTimeout(t);
  }, [step]);

  /* ---- Ludo turn simulation ---- */
  const players = ["yellow","red","green","blue"];
  const rollDice = useCallback(() => {
    const value = Math.ceil(Math.random() * 6);
    setLastRoll(value);
    setRolls(r => [...r, { who: "yellow", value }]);
    // Simulate other players rolling (visual only)
    players.slice(1).forEach((p, i) => {
      setTimeout(() => {
        setRolls(r => [...r, { who: p, value: Math.ceil(Math.random() * 6) }]);
      }, 600 + i * 500);
    });
  }, []);

  /* ---- Double-tap handler on ambient personal screen ---- */
  const tapRef = useRef({ count: 0, timer: null, x: 0, y: 0 });
  const onTripleTap = useCallback((e) => {
    const now = Date.now();
    const s = tapRef.current;
    if (!s.lastAt || now - s.lastAt > 500) s.count = 0;
    s.count += 1;
    s.lastAt = now;
    if (s.count >= 2) {
      s.count = 0;
      setReorderOpen(true);
    }
  }, []);

  const addGuest = useCallback(() => {
    setGuestCount(g => g + 1);
    setDiners(d => Math.min(5, d + 1 === diners ? d : Math.min(5, d + 1)));
  }, [diners]);

  /* ============ RENDER TABLE ============ */
  const dinerFocus = 0; // top personal is the focus / Ana
  // Each personal zone renders a snapshot of the flow for that diner; focus one drives state.
  const personalContent = (i, name, position) => {
    const isFocus = i === dinerFocus;
    // In early states (booking/arrival/seated), personals are empty
    if (["booking","arrival","seated"].includes(step)) return null;

    if (!isFocus) {
      // Companion screens reflect broad state but don't accept interaction
      return <CompanionScreen step={step} name={name} orderProgress={orderProgress} />;
    }

    // Focus screen — interactive
    switch (step) {
      case "welcome":
        return <WelcomeCard dinerName={name} onOpen={() => setStep("menu")} />;
      case "menu":
        return <MenuScreen cart={cart} addItem={addItem} removeItem={removeItem}
                 onBack={() => setStep("welcome")} onGoCart={() => setStep("cart")} />;
      case "cart":
        return <CartScreen cart={cart} addItem={addItem} removeItem={removeItem}
                 onBack={() => setStep("menu")} onConfirm={sendToKitchen} />;
      case "sending":
        return <SendingPersonal count={cartCount} total={cartTotal} />;
      case "game_prompt":
        return <GamePromptScreen onPlay={() => setStep("game_select")}
                 onSkip={() => setStep("ambient_waiting")}
                 onBack={() => setStep("cart")} />;
      case "game_select":
        return <GameSelectScreen onPick={() => setStep("game_play")}
                 onBack={() => setStep("game_prompt")} />;
      case "game_play":
        return <LudoControls orderProgress={orderProgress} onRoll={rollDice}
                 lastRoll={lastRoll}
                 onExit={() => setStep("ambient_waiting")}
                 onOpenMenu={() => setReorderOpen(true)} />;
      case "ambient_waiting":
        return <AmbientPersonal dinerName={name} isFocus
                 onTapTab={() => setReorderOpen(true)} />;
      case "food_ready":
        return <FoodArrivalPersonal dinerName={name} onContinue={() => setStep("ambient")} />;
      case "ambient":
        return (
          <div style={{ width: "100%", height: "100%" }} onClick={onTripleTap}>
            <AmbientPersonal dinerName={name} isFocus
              onTapTab={(e) => { e.stopPropagation(); setReorderOpen(true); }} />
          </div>
        );
      case "bill_ask":
        return <BillAskScreen
                 onChoose={(id) => { setBillChoice(id);
                   if (id === "someone") setStep("guest_paid");
                   else if (id === "split_m") setStep("bill_manual");
                   else setStep("bill_split"); }}
                 onBack={() => setStep("ambient")} />;
      case "bill_split":
        return <SplitSummaryScreen mode={billChoice} total={tableTotal} count={totalDiners}
                 myShare={myShare}
                 onPay={() => setStep("bill_pay")} onBack={() => setStep("bill_ask")} />;
      case "bill_manual":
        return <ManualSplitScreen total={tableTotal}
                 onPay={(v) => { setManualAmount(v); setStep("bill_pay"); }}
                 onBack={() => setStep("bill_ask")} />;
      case "bill_pay": {
        const amount = billChoice === "split_eq" ? Math.round(tableTotal / totalDiners)
                       : billChoice === "split_m" ? manualAmount
                       : myShare;
        return <PayMethodScreen amount={amount}
                 onPay={() => setStep("thankyou")}
                 onBack={() => setStep(billChoice === "split_m" ? "bill_manual" : "bill_split")} />;
      }
      case "guest_paid":
        return <GuestPaidScreen name={name} onDone={() => setStep("ambient")} />;
      case "thankyou":
        return <ThankYouScreen name={name} />;
      default:
        return null;
    }
  };

  // Center cart content by state
  const centerContent = () => {
    if (["booking","arrival"].includes(step)) return null;
    if (step === "seated") return <SeatedTransition />;
    if (step === "sending") return <CenterReceiving cart={cart} />;
    if (step === "game_play") return <LudoBoard rolls={rolls} />;
    if (step === "food_ready") return <FoodArrivalCenter />;
    if (["ambient","ambient_waiting","bill_ask","bill_split","bill_manual","bill_pay","thankyou","guest_paid"].includes(step)) {
      return <AmbientCenter onAddGuest={addGuest} />;
    }
    // menu / cart / prompts / etc: center shows order-in-progress context
    return <CenterReady cart={cart} cartTotal={cartTotal} cartCount={cartCount} totalDiners={totalDiners} step={step} orderProgress={orderProgress} leavingOwners={leavingOwners} dinerNames={dinerNames} />;
  };

  // Positions: Ana (focus, i=0) sits at BOTTOM-LEFT where content reads right-side-up for the viewer
  // Clockwise around table: Ana (bl) → Kabir (br) → Meera (tr) → Ravi (tl)
  const positions = ["is-bl","is-br","is-tr","is-tl"];

  const showBooking = step === "booking";

  return (
    <>
      <div className="stage-wrap">
        <div className="stage-ambient" />
        <div className="stage" id="stage">
          {/* THE TABLE */}
          <div className="table">
            {/* ARRIVAL overlay covers the whole table, above any grid */}
            {step === "arrival" && (
              <div style={{ position: "absolute", inset: 0, zIndex: 10 }}>
                <ArrivalTableView onSeated={() => setStep("seated")} />
              </div>
            )}

            {/* 4 personals (hidden during arrival) */}
            {!["arrival"].includes(step) && Array.from({ length: Math.min(4, diners) }).map((_, i) => {
              const name = dinerNames[i];
              const pos = positions[i];
              return (
                <div key={i}
                  className={`personal ${pos} ${i === dinerFocus ? "is-focus" : ""} ${step === "ambient" || step === "ambient_waiting" ? (i === dinerFocus ? "" : "ambient") : ""}`}>
                  <div className="personal-inner">
                    <div className="step-fade" key={`${i}-${step}`}>
                      {personalContent(i, name, pos)}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Center */}
            {!["booking","arrival"].includes(step) && (
              <div className={"center-cart " + (step === "game_play" ? "expanded-game" : "")}>
                <div className="step-fade" key={`center-${step}`}>
                  {centerContent()}
                </div>
              </div>
            )}

            {/* Hint pip */}
            <div className="hint-pip" style={{ bottom: 8, right: 16 }}>
              BUNGALOW · TABLE 09 · GOA
            </div>
            <div className="hint-pip" style={{ bottom: 8, left: 16 }}>
              {step.toUpperCase().replace(/_/g, " ")}
            </div>
          </div>
        </div>
      </div>

      {/* Phone booking screen overlays everything initially */}
      {showBooking && <BookingScreen diners={diners} onComplete={() => setStep("arrival")} />}

      {/* Reorder / double-tap panel — centered horizontally, shifted down so it floats
          closer to the focused diner (Ana, bottom-left) rather than dead center */}
      {reorderOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          display: "flex", justifyContent: "center", alignItems: "center",
          paddingTop: "22vh",
        }}>
          <div style={{ width: 500, height: 360, position: "relative" }}>
            <ReorderPanel
              cart={cart} addItem={addItem} removeItem={removeItem}
              onClose={() => setReorderOpen(false)}
              onRequestBill={() => { setReorderOpen(false); setStep("bill_ask"); }}
              onReorder={(items) => {
                items.forEach(it => { for (let n=0; n<it.qty; n++) addItem(it); });
                setReorderOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Flying dish clones during send-to-kitchen */}
      {flyingDishes.map(f => (
        <div key={f.id} className="flying-dish"
          style={{
            left: f.x, top: f.y, width: f.w, height: f.h,
            animationDelay: `${f.delay}ms`,
            "--fly-target": `translate(${f.dx}px, ${f.dy}px)`,
          }}>
          <div style={{
            width: "100%", height: "100%",
            background: "var(--bg-card)", border: `1px solid ${f.tint || "var(--gold)"}`,
            borderRadius: 3,
            display: "flex", flexDirection: "column",
            boxShadow: "0 16px 50px rgba(0,0,0,0.55)",
            overflow: "hidden",
          }}>
            <div style={{
              flex: 1,
              backgroundImage:
                `repeating-linear-gradient(135deg, rgba(255,255,255,0.05) 0 6px, transparent 6px 12px), linear-gradient(180deg, ${f.tint || "#afa231"}, #1a0002)`,
            }} />
            <div style={{
              padding: "4px 6px",
              fontFamily: "var(--mono)", fontSize: 8.5, letterSpacing: "0.1em",
              color: "var(--gold)", textAlign: "center",
            }}>→ KITCHEN</div>
          </div>
        </div>
      ))}

      {/* Tweaks */}
      <Tweaks step={step} setStep={setStep}
        diners={diners} setDiners={setDiners}
        addGuest={addGuest} />
    </>
  );
}

/* ---------- Center cart views ---------- */

function CenterReady({ cart, cartTotal, cartCount, totalDiners, step, orderProgress, leavingOwners = [], dinerNames = [] }) {
  // Show tiles for every cart item (quantity > 1 → repeat), hiding owners that are currently flying away.
  const tiles = [];
  cart.forEach((it) => {
    const owner = it.addedBy || "Ana";
    if (leavingOwners.includes(owner)) return;
    for (let k = 0; k < it.qty; k++) tiles.push({ ...it, owner, key: `${it.id}-${owner}-${k}` });
  });

  return (
    <div style={{ width: "100%", height: "100%", padding: 18, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <BungalowMark size={0.6} />
        <div className="eyebrow" style={{ color: "var(--gold)" }}>Table 09 · Party of {totalDiners}</div>
      </div>

      <div style={{ flex: 1, minHeight: 0, display: "grid", placeItems: "center" }}>
        {tiles.length === 0 ? (
          <div style={{ textAlign: "center" }}>
            <div className="t-cursive" style={{ fontSize: 48, color: "var(--gold-soft)", lineHeight: 1 }}>the table</div>
            <div className="t-italic" style={{ fontSize: 14, color: "var(--cream-dim)", marginTop: 6 }}>
              Everyone's building their own order.
            </div>
            <div style={{ marginTop: 14, display: "flex", gap: 22, justifyContent: "center" }}>
              {dinerNames.slice(0, totalDiners).map((n, i) => (
                <div key={n} style={{ textAlign: "center" }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    border: "1px solid var(--gold-soft)", display: "grid", placeItems: "center",
                    margin: "0 auto",
                    fontFamily: "var(--display)", fontStyle: "italic", color: "var(--gold)", fontSize: 16,
                    background: i === 0 ? "rgba(175,162,49,0.1)" : "transparent",
                  }}>{n[0]}</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 8, letterSpacing: "0.15em", color: "var(--cream-soft)", marginTop: 4 }}>{n.toUpperCase()}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{
            width: "100%", height: "100%",
            display: "grid",
            gridTemplateColumns: `repeat(${Math.min(4, Math.max(2, tiles.length))}, 1fr)`,
            gap: 8, alignContent: "center",
          }}>
            {tiles.slice(0, 8).map(t => (
              <div key={t.key}
                data-center-owner={t.owner}
                data-center-name={t.name}
                data-center-tint={t.tint}
                className="fade-in"
                style={{
                  display: "flex", flexDirection: "column",
                  border: "1px dashed rgba(175,162,49,0.25)",
                  background: "rgba(255,255,255,0.015)",
                  borderRadius: 3,
                  padding: 6,
                  transition: "opacity 0.3s ease",
                }}>
                <div style={{
                  aspectRatio: "1 / 1",
                  backgroundImage:
                    `repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0 6px, transparent 6px 12px), radial-gradient(circle at 50% 50%, ${t.tint} 0%, #1a0002 90%)`,
                  borderRadius: 999,
                  position: "relative",
                  boxShadow: "inset 0 0 0 4px rgba(220,209,137,0.08)",
                }}>
                  <div style={{
                    position: "absolute", inset: "12%",
                    borderRadius: "50%",
                    background:
                      `repeating-linear-gradient(135deg, rgba(0,0,0,0.08) 0 4px, transparent 4px 9px), ${t.tint}`,
                    boxShadow: "inset 0 2px 8px rgba(0,0,0,0.35)",
                  }} />
                </div>
                <div style={{
                  marginTop: 5,
                  fontFamily: "var(--italic)", fontStyle: "italic",
                  fontSize: 10, color: "var(--cream)", lineHeight: 1.15,
                  textAlign: "center",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>{t.name}</div>
                <div style={{
                  fontFamily: "var(--mono)", fontSize: 8, letterSpacing: "0.12em",
                  color: "var(--cream-soft)", textAlign: "center",
                  textTransform: "uppercase", marginTop: 1,
                }}>Added by <span style={{ color: "var(--gold)" }}>{t.owner}</span></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {orderProgress > 0 && (
        <div style={{ marginTop: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span className="eyebrow">Kitchen status</span>
            <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--cream-dim)", letterSpacing: "0.1em" }}>
              {orderProgress < 35 ? "RECEIVED" : orderProgress < 65 ? "COOKING" : orderProgress < 95 ? "PLATING" : "READY"}
            </span>
          </div>
          <div style={{ height: 3, background: "var(--bg-forest-2)", borderRadius: 2, overflow: "hidden" }}>
            <div className="shimmer" style={{ height: "100%", width: `${orderProgress}%`, borderRadius: 2, transition: "width 0.6s ease" }} />
          </div>
        </div>
      )}
    </div>
  );
}

function CenterReceiving({ cart }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", padding: 24 }}>
      <div style={{ textAlign: "center" }}>
        <div className="eyebrow" style={{ color: "var(--gold)" }}>KITCHEN RECEIVING</div>
        <div className="t-cursive" style={{ fontSize: 48, color: "var(--gold)", lineHeight: 1, marginTop: 10 }}>
          sending to the chef…
        </div>
        <div style={{
          marginTop: 22,
          width: 140, height: 140, margin: "22px auto 0",
          border: "1px solid var(--gold)", borderRadius: "50%",
          display: "grid", placeItems: "center",
          animation: "breathe 1.4s ease-in-out infinite",
        }}>
          <Monogram size={60} />
        </div>
      </div>
    </div>
  );
}

function SendingPersonal({ count, total }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", padding: 20 }}>
      <div style={{ textAlign: "center" }}>
        <div className="eyebrow">ORDER CONFIRMED</div>
        <div className="t-cursive" style={{ fontSize: 44, color: "var(--gold)", lineHeight: 1, marginTop: 8 }}>
          off it goes.
        </div>
        <div style={{ marginTop: 10, color: "var(--cream-dim)", fontSize: 13 }}>
          {count} items · ₹{total}
        </div>
      </div>
    </div>
  );
}

/* Companion screens — simple state readouts, non-interactive */
function CompanionScreen({ step, name, orderProgress }) {
  const showOrderStatus = ["sending","game_prompt","game_select","game_play"].includes(step);
  const isAmbient = ["ambient","ambient_waiting","bill_ask","bill_split","bill_manual","bill_pay","thankyou","guest_paid","food_ready"].includes(step);

  if (isAmbient) {
    return (
      <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", opacity: 0.35 }}>
        <div className="t-cursive" style={{ fontSize: 30, color: "var(--cream-soft)" }}>{name}</div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "100%", padding: 20, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="eyebrow">{name}</div>
        <div className="breathe" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--gold)", boxShadow: "0 0 6px var(--gold)" }} />
      </div>

      <div style={{ textAlign: "center" }}>
        {step === "welcome" && <div className="t-italic" style={{ fontSize: 18, color: "var(--cream-dim)" }}>Reading the menu card…</div>}
        {step === "menu" && <div className="t-italic" style={{ fontSize: 18, color: "var(--cream-dim)" }}>Browsing the menu</div>}
        {step === "cart" && <div className="t-italic" style={{ fontSize: 18, color: "var(--cream-dim)" }}>Reviewing order</div>}
        {step === "sending" && <div className="t-italic" style={{ fontSize: 18, color: "var(--gold)" }}>→ Sent to kitchen</div>}
        {(step === "game_prompt" || step === "game_select") && <div className="t-italic" style={{ fontSize: 18, color: "var(--cream-dim)" }}>Considering a game…</div>}
        {step === "game_play" && <div className="t-italic" style={{ fontSize: 18, color: "var(--gold)" }}>Playing Ludo</div>}
      </div>

      {showOrderStatus && (
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Order status</div>
          <div style={{ height: 3, background: "var(--bg-forest-2)", borderRadius: 2, overflow: "hidden" }}>
            <div className="shimmer" style={{ height: "100%", width: `${orderProgress}%`, borderRadius: 2, transition: "width 0.6s ease" }} />
          </div>
        </div>
      )}
      {!showOrderStatus && <div />}
    </div>
  );
}

/* ---- Mount ---- */
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
