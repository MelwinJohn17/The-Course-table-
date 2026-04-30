/* global React */
// Bill flow — pay the bill? → split options → payment method → thank you
const { useState: useSP, useMemo: useMP } = React;

function BillAskScreen({ onChoose, onBack }) {
  const options = [
    { id: "someone", label: "Someone else is paying", sub: "I'm a guest tonight" },
    { id: "split_eq", label: "Split equally",        sub: "divide the total 4 ways" },
    { id: "split_m",  label: "Split manually",       sub: "enter your own amount" },
    { id: "my_share", label: "Pay my share",         sub: "only what I ordered", primary: true },
  ];
  return (
    <div style={{ width: "100%", height: "100%", padding: "10px 14px 10px", position: "relative", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Back onClick={onBack} label="Meal" />
        <Eyebrow style={{ fontSize: 9 }}>Settle the bill</Eyebrow>
        <div style={{ width: 40 }} />
      </div>
      <div className="t-cursive" style={{ fontSize: 28, color: "var(--gold)", marginTop: 4, lineHeight: 1 }}>shall we?</div>
      <div className="t-italic" style={{ fontSize: 12, color: "var(--cream-dim)", marginTop: 2 }}>
        Pay the bill — on your terms.
      </div>

      <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 5, flex: 1 }}>
        {options.map(o => (
          <button key={o.id}
            onClick={() => onChoose(o.id)}
            className={o.primary ? "btn btn-primary" : "btn"}
            style={{
              justifyContent: "space-between", padding: "7px 10px", textAlign: "left", fontSize: 11,
            }}>
            <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 1 }}>
              <span style={{ fontSize: 11 }}>{o.label}</span>
              <span style={{ fontSize: 8.5, fontFamily: "var(--mono)", letterSpacing: "0.1em", opacity: 0.65 }}>{o.sub}</span>
            </span>
            <span style={{ fontSize: 12 }}>→</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* Equal split / my share summary */
function SplitSummaryScreen({ mode, total, count, myShare, onPay, onBack }) {
  const per = mode === "split_eq" ? Math.round(total / count) : myShare;
  return (
    <div style={{ width: "100%", height: "100%", padding: "10px 14px 10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Back onClick={onBack} label="Back" />
        <Eyebrow style={{ fontSize: 9 }}>{mode === "split_eq" ? "Split equally" : "Your share"}</Eyebrow>
        <div style={{ width: 40 }} />
      </div>

      <div style={{ marginTop: 8 }}>
        <div className="eyebrow" style={{ fontSize: 9 }}>Table total</div>
        <div className="t-italic" style={{ fontSize: 16, color: "var(--cream-dim)" }}>₹{total}</div>
      </div>
      <Hairline soft style={{ margin: "6px 0" }} />
      <div>
        <div className="eyebrow" style={{ color: "var(--gold)", fontSize: 9 }}>{mode === "split_eq" ? `Your share (÷ ${count})` : "You owe"}</div>
        <div className="t-cursive" style={{ fontSize: 40, color: "var(--gold)", lineHeight: 1, marginTop: 2 }}>₹{per}</div>
      </div>

      {mode === "split_eq" && (
        <div style={{ marginTop: 8, background: "rgba(201,167,90,0.06)", border: "1px solid var(--line-soft)", borderRadius: 4, padding: 6 }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 8.5, letterSpacing: "0.12em", color: "var(--cream-soft)" }}>EVERYONE'S SCREEN SHOWS THE SAME AMOUNT</div>
        </div>
      )}

      <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 10, padding: "8px 14px", fontSize: 11 }} onClick={onPay}>
        Choose payment method →
      </button>
    </div>
  );
}

/* Manual split with numpad */
function ManualSplitScreen({ total, onPay, onBack }) {
  const [val, setVal] = useSP("");
  const push = (d) => setVal(v => (v + d).replace(/^0+/, "") .slice(0, 6));
  const back = () => setVal(v => v.slice(0, -1));
  const n = parseInt(val || "0", 10);

  return (
    <div style={{ width: "100%", height: "100%", padding: "10px 14px 10px", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Back onClick={onBack} label="Back" />
        <Eyebrow style={{ fontSize: 9 }}>Split manually</Eyebrow>
        <div style={{ width: 40 }} />
      </div>

      <div style={{ marginTop: 4, textAlign: "center" }}>
        <div className="eyebrow" style={{ fontSize: 9 }}>Enter your amount · of ₹{total}</div>
        <div className="t-italic" style={{ fontSize: 30, color: "var(--gold)", lineHeight: 1.05, marginTop: 2 }}>
          ₹{val || "0"}
        </div>
      </div>

      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 3, marginTop: 6 }}>
        {["1","2","3","4","5","6","7","8","9",".","0","⌫"].map(k => (
          <button key={k}
            onClick={() => k === "⌫" ? back() : k !== "." ? push(k) : null}
            style={{
              background: "var(--bg-forest-2)", border: "1px solid var(--line-soft)",
              color: "var(--cream)", padding: "4px 0", borderRadius: 4, cursor: "pointer",
              fontFamily: "var(--display)", fontSize: 15,
            }}>{k}</button>
        ))}
      </div>

      <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 6, padding: "6px 14px", fontSize: 11 }}
        disabled={n <= 0} onClick={() => onPay(n)}>
        Confirm ₹{n || 0} →
      </button>
    </div>
  );
}

/* Payment method choice */
function PayMethodScreen({ amount, onPay, onBack }) {
  const methods = [
    { id: "upi",   label: "UPI",           sub: "any UPI app" },
    { id: "card",  label: "Tap Card",      sub: "hold card to the screen" },
    { id: "counter", label: "Pay at counter", sub: "handle it after dinner" },
  ];
  return (
    <div style={{ width: "100%", height: "100%", padding: "10px 14px 10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Back onClick={onBack} label="Back" />
        <Eyebrow style={{ fontSize: 9 }}>Payment</Eyebrow>
        <div style={{ width: 40 }} />
      </div>
      <div className="t-cursive" style={{ fontSize: 28, color: "var(--gold)", marginTop: 4, lineHeight: 1 }}>how to settle</div>
      <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--cream-dim)", marginTop: 3, letterSpacing: "0.05em" }}>
        Amount · ₹{amount}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
        {methods.map(m => (
          <button key={m.id} onClick={() => onPay(m.id)} className="btn" style={{ justifyContent: "space-between", padding: "8px 10px", fontSize: 11 }}>
            <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 1 }}>
              <span style={{ fontSize: 11 }}>{m.label}</span>
              <span style={{ fontSize: 8.5, fontFamily: "var(--mono)", letterSpacing: "0.1em", opacity: 0.6 }}>{m.sub}</span>
            </span>
            <span>→</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* Guest paid-for-me screen */
function GuestPaidScreen({ onDone, name }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", padding: 14 }}>
      <div style={{ textAlign: "center" }} className="fade-in">
        <Eyebrow style={{ color: "var(--gold)", fontSize: 9 }}>Hosted tonight</Eyebrow>
        <div className="t-cursive" style={{ fontSize: 44, color: "var(--cream)", lineHeight: 1, marginTop: 6 }}>thank you, {name}.</div>
        <div className="t-italic" style={{ fontSize: 13, color: "var(--cream-dim)", marginTop: 6 }}>
          We hope you enjoyed dining at Bungalow.
        </div>
        <button className="btn btn-sm" style={{ marginTop: 12 }} onClick={onDone}>Close</button>
      </div>
    </div>
  );
}

/* Thank you */
function ThankYouScreen({ name }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", padding: 14, position: "relative" }}>
      <div style={{ textAlign: "center" }} className="fade-in">
        <div style={{ marginBottom: 8 }}><Monogram size={38} /></div>
        <Eyebrow style={{ color: "var(--gold)", fontSize: 9 }}>✓ PAYMENT CONFIRMED</Eyebrow>
        <div className="t-cursive" style={{ fontSize: 50, color: "var(--gold)", lineHeight: 1, marginTop: 8, paddingBottom: 4 }}>thank you, {name}.</div>
        <div className="t-italic" style={{ fontSize: 14, color: "var(--cream)", marginTop: 6 }}>
          Hope you enjoyed dining at Bungalow.
        </div>
        <div style={{ width: 50, height: 1, background: "var(--gold)", margin: "10px auto" }} />
        <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.2em", color: "var(--cream-soft)" }}>
          SEE YOU BY THE ARABIAN SEA AGAIN SOON.
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { BillAskScreen, SplitSummaryScreen, ManualSplitScreen, PayMethodScreen, GuestPaidScreen, ThankYouScreen });
