/* global React */
// Tweaks panel — control the prototype from one place
const { useState: useStateT, useEffect: useEffectT } = React;

function Tweaks({ state, setState, setStep, step, diners, setDiners, addGuest }) {
  const [on, setOn] = useStateT(false);

  useEffectT(() => {
    const handler = (e) => {
      if (!e || !e.data) return;
      if (e.data.type === "__activate_edit_mode")   setOn(true);
      if (e.data.type === "__deactivate_edit_mode") setOn(false);
    };
    window.addEventListener("message", handler);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", handler);
  }, []);

  if (!on) return null;

  const steps = window.BUNGALOW_FLOW_STEPS;

  return (
    <div className="tweaks">
      <header>
        <span>Tweaks</span>
        <span style={{ color: "var(--cream-soft)" }}>Bungalow</span>
      </header>
      <div className="content">
        <div className="row">
          <label>Jump to step</label>
          <select value={step} onChange={(e) => setStep(e.target.value)}>
            {steps.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>

        <div className="row">
          <label>Diners at table</label>
          <select value={diners} onChange={(e) => setDiners(parseInt(e.target.value, 10))}>
            <option value={2}>2 — intimate</option>
            <option value={3}>3</option>
            <option value={4}>4 — classic party</option>
            <option value={5}>5 — + guest joined</option>
          </select>
        </div>

        <div className="row">
          <label>Walk-in guest</label>
          <button className="btn btn-sm" style={{ width: "100%" }} onClick={addGuest}>
            + Add guest to session
          </button>
          <div style={{ marginTop: 6, color: "var(--cream-soft)", fontSize: 10, lineHeight: 1.5 }}>
            Someone not on the original booking can tap the center cart's <b>+</b> to join.
          </div>
        </div>

        <Hairline soft />

        <div style={{ marginTop: 12, fontSize: 10, color: "var(--cream-soft)", lineHeight: 1.6 }}>
          <div>• Click on the <b>top personal screen</b> to interact — it's the focused diner's zone.</div>
          <div>• Center cart syncs across all 4 screens.</div>
          <div>• Double-tap the edge tab during meal to reorder or get help.</div>
        </div>
      </div>
    </div>
  );
}

window.Tweaks = Tweaks;
