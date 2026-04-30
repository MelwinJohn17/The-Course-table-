/* global React */
// Welcome card (menu-card size) + book-open → Menu
const { useState: useSW, useEffect: useEW } = React;

function WelcomeCard({ dinerName, onOpen }) {
  const [opening, setOpening] = useSW(false);

  const trigger = () => {
    if (opening) return;
    setOpening(true);
    setTimeout(onOpen, 1100);
  };

  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", position: "relative", padding: 14 }}>
      <div style={{ position: "relative", width: 340, height: 220, perspective: 1200 }}>
        {/* back page (revealed when cover opens) */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: 4,
          background: "linear-gradient(180deg, var(--bg-forest-2) 0%, var(--bg-card) 100%)",
          border: "1px solid var(--gold-soft)",
          display: "grid", placeItems: "center", color: "var(--gold)",
          fontFamily: "var(--display)", fontStyle: "italic", fontSize: 16,
        }}>
          <div style={{ textAlign: "center" }}>
            <Monogram size={32} />
            <div style={{ marginTop: 8, fontSize: 10, color: "var(--cream-soft)", fontFamily: "var(--mono)", letterSpacing: "0.2em" }}>OPENING MENU</div>
          </div>
        </div>

        {/* cover */}
        <div
          className={opening ? "book-cover" : ""}
          onClick={trigger}
          style={{
            position: "absolute", inset: 0, cursor: opening ? "default" : "pointer",
            background: "linear-gradient(135deg, var(--bg-forest) 0%, var(--bg-deep) 100%)",
            border: "1px solid var(--gold)",
            borderRadius: 4,
            boxShadow: opening ? "none" : "0 20px 60px rgba(0,0,0,0.5), inset 0 0 30px rgba(175,162,49,0.05)",
            padding: "16px 22px",
            display: "flex", flexDirection: "column", justifyContent: "space-between",
          }}>
          <div>
            <div className="eyebrow" style={{ color: "var(--gold)", fontSize: 9 }}>Bungalow · Goa</div>
            <Hairline soft style={{ marginTop: 6 }} />
          </div>
          <div style={{ textAlign: "center" }}>
            <div className="t-cursive" style={{ fontSize: 44, color: "var(--cream)", lineHeight: 1 }}>Welcome,</div>
            <div className="t-cursive" style={{ fontSize: 44, color: "var(--gold)", lineHeight: 1, marginTop: 2, fontStyle: "italic" }}>{dinerName}.</div>
            <div className="t-italic" style={{ fontSize: 12, color: "var(--cream-dim)", marginTop: 10, lineHeight: 1.4 }}>
              A curated evening of <br/>Goan premium cuisine.
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Hairline soft style={{ flex: 1 }} />
            <div className="eyebrow" style={{ margin: "0 10px", color: "var(--cream-soft)", fontSize: 9 }}>tap to open</div>
            <Hairline soft style={{ flex: 1 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

window.WelcomeCard = WelcomeCard;
