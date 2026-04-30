/* global React */
// Shared UI primitives for Bungalow
const { useState, useEffect, useRef, useMemo, useCallback } = React;

/* ---------- Small UI bits ---------- */

function Eyebrow({ children, style }) {
  return <div className="eyebrow" style={style}>{children}</div>;
}

function Hairline({ soft, style }) {
  return <div className={soft ? "hairline-soft" : "hairline"} style={style} />;
}

function Back({ onClick, label = "Back" }) {
  if (!onClick) return null;
  return (
    <button className="backbtn" onClick={onClick}>
      <span style={{ fontSize: 11 }}>←</span>{label}
    </button>
  );
}

/* Dish image placeholder — tinted, striped, with mono label */
function DishImage({ tint, name, style, className = "" }) {
  return (
    <div
      className={`img-placeholder ${className}`}
      data-label={`[ ${name} ]`}
      style={{ ...style, "--tint": tint }}
    />
  );
}

/* Brand mark */
function BungalowMark({ size = 1, color }) {
  const c = color || "var(--gold)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 * size, color: c }}>
      <svg width={18 * size} height={18 * size} viewBox="0 0 24 24" fill="none">
        <path d="M3 12 L12 4 L21 12" stroke={c} strokeWidth="1.2" strokeLinecap="round" />
        <path d="M5 11 L5 20 L19 20 L19 11" stroke={c} strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="12" cy="15" r="1.2" fill={c} />
      </svg>
      <div style={{ fontFamily: "var(--cursive)", fontSize: 26 * size, lineHeight: 1, transform: "translateY(-1px)" }}>
        Bungalow
      </div>
    </div>
  );
}

/* Monogram (small, e.g. for loading) */
function Monogram({ size = 48 }) {
  return (
    <div
      style={{
        width: size, height: size, borderRadius: "50%",
        border: "1px solid var(--gold)", color: "var(--gold)",
        display: "grid", placeItems: "center",
        fontFamily: "var(--display)", fontStyle: "italic", fontSize: size * 0.42,
      }}
    >B</div>
  );
}

/* Toast / floating notification inside a personal screen */
function Toast({ children, tone = "neutral" }) {
  const bg = tone === "ok" ? "rgba(134,176,115,0.14)" : tone === "warn" ? "rgba(184,90,74,0.14)" : "rgba(201,167,90,0.12)";
  const bd = tone === "ok" ? "var(--ok)" : tone === "warn" ? "var(--red)" : "var(--gold)";
  return (
    <div style={{
      position: "absolute", left: 14, right: 14, bottom: 14,
      padding: "10px 14px", background: bg, border: `1px solid ${bd}`,
      borderRadius: 4, fontSize: 11, color: "var(--cream)",
      display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--body)",
    }}>
      {children}
    </div>
  );
}

/* Cart badge */
function CartBadge({ count, total, onClick }) {
  if (!count) return null;
  return (
    <button onClick={onClick} style={{
      appearance: "none", border: "1px solid var(--gold)", background: "rgba(201,167,90,0.12)",
      color: "var(--cream)", padding: "6px 12px", borderRadius: 999, cursor: "pointer",
      display: "inline-flex", alignItems: "center", gap: 10, fontFamily: "var(--body)", fontSize: 11,
    }}>
      <span style={{ fontFamily: "var(--mono)", color: "var(--gold)" }}>{count} ITEMS</span>
      <span style={{ opacity: 0.4 }}>·</span>
      <span>₹{total}</span>
      <span style={{ opacity: 0.6, marginLeft: 4 }}>→</span>
    </button>
  );
}

/* Quantity stepper */
function QtyStepper({ value, onInc, onDec, small }) {
  const sz = small ? 22 : 28;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", border: "1px solid var(--line)", borderRadius: 3 }}>
      <button onClick={onDec} style={{ width: sz, height: sz, background: "transparent", border: 0, color: "var(--cream-dim)", cursor: "pointer", fontSize: 14 }}>−</button>
      <span style={{ minWidth: 24, textAlign: "center", fontFamily: "var(--mono)", fontSize: 12, color: "var(--gold)" }}>{value}</span>
      <button onClick={onInc} style={{ width: sz, height: sz, background: "transparent", border: 0, color: "var(--cream-dim)", cursor: "pointer", fontSize: 14 }}>+</button>
    </div>
  );
}

Object.assign(window, {
  Eyebrow, Hairline, Back, DishImage, BungalowMark, Monogram, Toast, CartBadge, QtyStepper,
});
