/* global React */
// Booking (phone), Arrival, Seated detection screens
const { useState: useSB, useEffect: useEB } = React;

/* =======================================================================
   BOOKING — on a phone (before arrival)
   Simulates: Ana books, sends invite link, Ravi/Meera/Kabir join
   ======================================================================= */
function BookingScreen({ diners, onComplete }) {
  const [stage, setStage] = useSB(0); // 0 form, 1 invite sent, 2 joined, 3 confirmed
  const [size, setSize] = useSB(diners);
  const [date] = useSB("Fri · 24 Apr · 8:30 PM");
  const [joined, setJoined] = useSB(1);

  useEB(() => {
    if (stage !== 1) return;
    const names = window.BUNGALOW_DINERS[size] || [];
    let i = 1;
    const iv = setInterval(() => {
      i += 1;
      setJoined(i);
      if (i >= names.length) { clearInterval(iv); setTimeout(() => setStage(2), 500); }
    }, 700);
    return () => clearInterval(iv);
  }, [stage, size]);

  const names = window.BUNGALOW_DINERS[size] || [];

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 50,
      background: "radial-gradient(ellipse at center, #0b1510 0%, #050805 75%)",
      display: "grid", placeItems: "center",
    }}>
      <div style={{ display: "flex", gap: 60, alignItems: "center" }}>
        <div style={{ maxWidth: 360 }}>
          <Eyebrow>Step 01 / Phone</Eyebrow>
          <div className="t-cursive" style={{ fontSize: 54, color: "var(--gold)", lineHeight: 1, marginTop: 8 }}>
            before you arrive
          </div>
          <div style={{ color: "var(--cream-dim)", fontSize: 15, marginTop: 18, lineHeight: 1.6 }}>
            Ana books Bungalow on her phone, picks the party size,
            and shares a join-link with the group. Everyone confirms
            their name — the table knows exactly who's coming.
          </div>
          <div style={{ marginTop: 28, color: "var(--cream-soft)", fontSize: 12 }}>
            Tap <span style={{ color: "var(--gold)" }}>Continue</span> once you arrive at the restaurant.
          </div>
        </div>

        {/* iPhone frame */}
        <div style={{
          width: 340, height: 700,
          background: "#0a0a0a",
          borderRadius: 48,
          padding: 10,
          boxShadow: "0 30px 100px rgba(0,0,0,0.6), 0 0 0 2px #1a1a1a inset",
          position: "relative",
        }}>
          <div style={{
            position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)",
            width: 120, height: 28, background: "#000", borderRadius: 20, zIndex: 5,
          }} />
          <div style={{
            width: "100%", height: "100%",
            background: "#0b1510", borderRadius: 38, overflow: "hidden",
            display: "flex", flexDirection: "column",
            position: "relative",
          }}>
            {/* status bar */}
            <div style={{
              height: 44, display: "flex", alignItems: "flex-end", justifyContent: "space-between",
              padding: "0 28px 4px", fontSize: 12, fontWeight: 600, color: "var(--cream)",
              fontFamily: "var(--body)",
            }}>
              <span>9:41</span><span>● ● ●</span>
            </div>

            {/* app header */}
            <div style={{ padding: "20px 24px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <BungalowMark size={0.7} />
              <div style={{ fontSize: 18, color: "var(--cream-dim)" }}>×</div>
            </div>

            <div style={{ flex: 1, padding: "10px 24px", overflow: "hidden" }}>
              {stage === 0 && (
                <div className="fade-in">
                  <Eyebrow>Reserve a table</Eyebrow>
                  <div className="t-italic" style={{ fontSize: 28, color: "var(--cream)", marginTop: 8, lineHeight: 1.1 }}>
                    An evening at<br/>Bungalow.
                  </div>
                  <Hairline soft style={{ margin: "20px 0 16px" }} />

                  <div style={{ marginBottom: 14 }}>
                    <label style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.15em", color: "var(--cream-soft)", textTransform: "uppercase" }}>Date & Time</label>
                    <div style={{ color: "var(--cream)", marginTop: 4, fontSize: 14 }}>{date}</div>
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <label style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.15em", color: "var(--cream-soft)", textTransform: "uppercase" }}>Party Size</label>
                    <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                      {[2,3,4,5].map(n => (
                        <button key={n} onClick={() => setSize(n)}
                          className={"chip " + (n === size ? "active" : "")}
                          style={{ flex: 1, justifyContent: "center" }}>
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.15em", color: "var(--cream-soft)", textTransform: "uppercase" }}>Your Name</label>
                    <div style={{ color: "var(--cream)", marginTop: 4, fontSize: 14, paddingBottom: 6, borderBottom: "1px solid var(--line-soft)" }}>Ana</div>
                  </div>

                  <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: 14 }} onClick={() => setStage(1)}>
                    Send join-link to group
                  </button>
                </div>
              )}

              {stage === 1 && (
                <div className="fade-in">
                  <Eyebrow>Invite sent</Eyebrow>
                  <div className="t-italic" style={{ fontSize: 22, color: "var(--cream)", marginTop: 8, lineHeight: 1.2 }}>
                    bungalow.in/join/ANA-24
                  </div>
                  <Hairline soft style={{ margin: "20px 0 16px" }} />
                  <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--cream-soft)", letterSpacing: "0.1em", marginBottom: 12 }}>
                    JOINED {joined} / {size}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {names.map((n, i) => (
                      <div key={n} style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "10px 12px",
                        background: i < joined ? "rgba(201,167,90,0.08)" : "transparent",
                        border: "1px solid " + (i < joined ? "var(--gold)" : "var(--line-soft)"),
                        borderRadius: 4, transition: "all 0.4s ease",
                      }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: "50%",
                          background: i < joined ? "var(--gold)" : "var(--bg-forest-2)",
                          color: i < joined ? "#0a140f" : "var(--cream-soft)",
                          display: "grid", placeItems: "center",
                          fontFamily: "var(--display)", fontStyle: "italic", fontSize: 14,
                        }}>{n[0]}</div>
                        <div style={{ flex: 1, color: i < joined ? "var(--cream)" : "var(--cream-soft)", fontSize: 13 }}>
                          {n}{i === 0 && <span style={{ color: "var(--cream-soft)", fontSize: 10, marginLeft: 8 }}>(host)</span>}
                        </div>
                        <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: i < joined ? "var(--ok)" : "var(--cream-soft)", letterSpacing: "0.1em" }}>
                          {i < joined ? "JOINED" : "invited"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {stage === 2 && (
                <div className="fade-in" style={{ textAlign: "center", paddingTop: 40 }}>
                  <div style={{ fontSize: 38, color: "var(--gold)" }}>09</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--cream-soft)", letterSpacing: "0.2em", marginTop: 4 }}>TABLE NUMBER</div>
                  <Hairline soft style={{ margin: "24px 36px" }} />
                  <div className="t-italic" style={{ fontSize: 22, color: "var(--cream)", lineHeight: 1.2 }}>
                    See you soon, Ana.
                  </div>
                  <div style={{ color: "var(--cream-dim)", fontSize: 12, marginTop: 10, lineHeight: 1.5, padding: "0 20px" }}>
                    Your party of {size} is confirmed for<br/>{date}.
                  </div>
                  <button className="btn btn-primary" style={{ marginTop: 30, padding: "12px 24px" }} onClick={onComplete}>
                    We've arrived →
                  </button>
                </div>
              )}
            </div>

            {/* home indicator */}
            <div style={{ height: 18, display: "grid", placeItems: "center" }}>
              <div style={{ width: 110, height: 4, background: "var(--cream-soft)", borderRadius: 2, opacity: 0.4 }} />
            </div>
          </div>
        </div>
      </div>

      {/* tiny skip */}
      <button onClick={onComplete} className="btn-ghost btn" style={{ position: "absolute", top: 20, right: 20, fontSize: 10, fontFamily: "var(--mono)", letterSpacing: "0.15em" }}>
        skip intro →
      </button>
    </div>
  );
}

/* =======================================================================
   ARRIVAL — Reserved for ANA · Table 09  (full-table welcome)
   ======================================================================= */
function ArrivalTableView({ onSeated }) {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative", display: "grid", placeItems: "center", cursor: "pointer" }}
         onClick={onSeated}>
      {/* ambient vignette */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(201,167,90,0.1) 0%, transparent 60%)", pointerEvents: "none" }} />
      <div style={{ textAlign: "center", position: "relative", zIndex: 2 }} className="fade-in">
        <BungalowMark size={1.2} color="var(--gold)" />
        <div style={{ margin: "30px auto 0", width: 260 }}>
          <Hairline soft />
        </div>
        <div className="t-cursive" style={{ fontSize: 88, color: "var(--cream)", lineHeight: 1.25, marginTop: 30, paddingBottom: 10 }}>
          Welcome, Ana.
        </div>
        <div className="t-italic" style={{ fontSize: 28, color: "var(--cream-dim)", marginTop: 28, letterSpacing: "0.02em" }}>
          Your table awaits — party of four.
        </div>

        <div style={{ marginTop: 60, display: "inline-flex", alignItems: "baseline", gap: 16 }}>
          <span className="eyebrow">Table</span>
          <span className="t-italic" style={{ fontSize: 84, color: "var(--gold)", lineHeight: 1 }}>09</span>
        </div>

        <div style={{ marginTop: 60, fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.3em", color: "var(--cream-soft)" }}>
          <span className="breathe">[ TAP ANYWHERE TO BE SEATED ]</span>
        </div>
      </div>
    </div>
  );
}

/* Little seated ripple to go from arrival → split screens */
function SeatedTransition() {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative", display: "grid", placeItems: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.3em", color: "var(--gold)" }}>SENSING YOUR PARTY</div>
        <div style={{ marginTop: 24 }}>
          <div style={{
            width: 80, height: 80, margin: "0 auto",
            borderRadius: "50%", border: "2px solid var(--gold)",
            boxShadow: "0 0 60px rgba(201,167,90,0.3)",
            animation: "breathe 1.2s ease-in-out infinite",
          }} />
        </div>
        <div className="t-italic" style={{ fontSize: 28, color: "var(--cream)", marginTop: 32 }}>
          Four guests detected.
        </div>
        <div style={{ marginTop: 8, color: "var(--cream-soft)", fontSize: 13 }}>
          Splitting your table into personal zones…
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { BookingScreen, ArrivalTableView, SeatedTransition });
