/* global React */
// Menu browse + item detail + cart review
const { useState: useSM, useMemo: useMM, useRef: useRM } = React;

function MenuScreen({ cart, addItem, removeItem, onBack, onGoCart, onRequestItemBounds }) {
  const menu = window.BUNGALOW_MENU;
  const [cat, setCat] = useSM("starters");
  const [detail, setDetail] = useSM(null);

  // Only Ana's items show in the personal sidebar — others are at the center.
  const myCart = cart.filter(c => (c.addedBy || "Ana") === "Ana");
  const items = menu.items.filter(i => i.cat === cat);
  const cartCount = myCart.reduce((a, b) => a + b.qty, 0);
  const cartTotal = myCart.reduce((a, b) => a + b.qty * b.price, 0);
  const hasItems = cartCount > 0;

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", padding: "10px 0 12px 14px", position: "relative" }}>
      {/* Main column */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, paddingRight: 10 }}>
        {/* Top bar — compact */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Back onClick={onBack} label="Welcome" />
          <div className="t-italic" style={{ fontSize: 13, color: "var(--gold)", letterSpacing: "0.02em" }}>Bungalow</div>
          <div style={{ width: 40 }} />
        </div>

        {/* Category chips */}
        <div style={{ display: "flex", gap: 5, marginTop: 8, flexWrap: "wrap" }}>
          {menu.categories.map(c => (
            <button key={c.id} onClick={() => setCat(c.id)}
              className={"chip " + (c.id === cat ? "active" : "")}
              style={{ padding: "4px 10px", fontSize: 10, letterSpacing: "0.04em" }}>
              {c.label}
            </button>
          ))}
        </div>

        {/* Item list */}
        <div className="scroll-y" style={{ flex: 1, marginTop: 8, paddingRight: 4, minHeight: 0 }}>
          {items.map(it => {
          const inCart = cart.find(c => c.id === it.id);
          const allergens = it.allergens || [];
          return (
            <div key={it.id}
              className="menu-item fade-in"
              data-item-id={it.id}
              onClick={() => setDetail(it)}
              style={{
                display: "flex", gap: 10, padding: "9px 2px",
                borderBottom: "1px solid var(--line-soft)",
                alignItems: "center",
                cursor: "pointer",
              }}>
              <DishImage tint={it.tint} name={it.name.split(" ")[0]} style={{ width: 48, height: 48, borderRadius: 2, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="t-italic" style={{ fontSize: 14, color: "var(--cream)", lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.name}</div>
                <div style={{ marginTop: 3, display: "flex", alignItems: "center", gap: 8, fontSize: 9, fontFamily: "var(--mono)", color: "var(--cream-soft)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  <span style={{ color: "var(--gold)" }}>₹{it.price}</span>
                  {allergens.length > 0 && (
                    <>
                      <span style={{ opacity: 0.4 }}>·</span>
                      <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", minWidth: 0 }}>
                        {allergens.join(" · ")}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div style={{ flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
                {inCart ? (
                  <QtyStepper small
                    value={inCart.qty}
                    onInc={() => addItem(it)}
                    onDec={() => removeItem(it.id)} />
                ) : (
                  <button className="btn btn-sm" style={{ padding: "4px 10px", fontSize: 10.5 }} onClick={() => addItem(it)}>Add</button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tags legend — tiny */}
        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 3, fontSize: 8.5, fontFamily: "var(--mono)", color: "var(--cream-soft)", letterSpacing: "0.12em" }}>
          <span>✦ SIGNATURE</span>
          <span>PRICES INCL. TAXES</span>
        </div>
      </div>

      {/* ——— Subtle cart sidebar — slides in only when Ana has items ——— */}
      {hasItems && (
      <div className="cart-sidebar-in" style={{
        width: 108, flexShrink: 0,
        borderLeft: "1px solid var(--line-soft)",
        background: "linear-gradient(180deg, rgba(175,162,49,0.03) 0%, rgba(175,162,49,0.01) 100%)",
        display: "flex", flexDirection: "column",
        padding: "10px 8px 10px 10px",
        minHeight: 0,
        overflow: "hidden",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span className="eyebrow" style={{ fontSize: 8, color: "var(--gold)" }}>Your order</span>
          <span style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--cream-soft)", letterSpacing: "0.1em" }}>{cartCount}</span>
        </div>

        <div className="scroll-y" style={{ flex: 1, marginTop: 6, minHeight: 0, paddingRight: 2 }}>
          {myCart.map(it => (
              <div key={it.id} data-cart-item-id={it.id} style={{
                padding: "5px 0",
                borderBottom: "1px solid var(--line-soft)",
              }}>
                <div className="t-italic" style={{
                  fontSize: 10.5, color: "var(--cream)", lineHeight: 1.15,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>{it.name}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 8.5, color: "var(--cream-soft)" }}>×{it.qty}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <button onClick={() => removeItem(it.id)} style={{
                      appearance: "none", background: "transparent", border: "1px solid var(--line-soft)",
                      color: "var(--cream-soft)", width: 14, height: 14, borderRadius: 2,
                      fontSize: 11, lineHeight: 1, cursor: "pointer", padding: 0,
                    }}>−</button>
                    <button onClick={() => addItem(it)} style={{
                      appearance: "none", background: "transparent", border: "1px solid var(--line-soft)",
                      color: "var(--cream-soft)", width: 14, height: 14, borderRadius: 2,
                      fontSize: 11, lineHeight: 1, cursor: "pointer", padding: 0,
                    }}>+</button>
                  </div>
                </div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 8.5, color: "var(--gold)", marginTop: 1 }}>₹{it.qty * it.price}</div>
              </div>
            ))}
        </div>

        <div style={{ marginTop: 6 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span className="eyebrow" style={{ fontSize: 8 }}>Total</span>
            <span className="t-italic" style={{ fontSize: 14, color: "var(--gold)" }}>₹{cartTotal}</span>
          </div>
          <button
            onClick={onGoCart}
            className="btn btn-primary"
            style={{
              width: "100%", justifyContent: "center",
              marginTop: 6, padding: "6px 4px", fontSize: 9.5,
              letterSpacing: "0.06em",
            }}>
            Send to kitchen ↗
          </button>
        </div>
      </div>
      )}

      {/* Item detail sheet */}
      {detail && (
        <div className="sheet fade-in" onClick={() => setDetail(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{
            margin: "auto", width: "92%", background: "var(--bg-card)",
            border: "1px solid var(--gold-soft)", borderRadius: 6, padding: 16,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <Back onClick={() => setDetail(null)} label="Menu" />
              <div className="eyebrow" style={{ color: "var(--gold)" }}>{detail.tags.includes("signature") ? "✦ Signature" : detail.tags.includes("veg") ? "Veg" : "Non-veg"}</div>
            </div>
            <DishImage tint={detail.tint} name={detail.name} style={{ width: "100%", height: 110, borderRadius: 3 }} />
            <div className="t-italic" style={{ fontSize: 22, color: "var(--cream)", marginTop: 12, lineHeight: 1.1 }}>{detail.name}</div>
            <div style={{ fontSize: 12, color: "var(--cream-dim)", marginTop: 8, lineHeight: 1.5 }}>{detail.desc}</div>
            <div style={{ marginTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 14, color: "var(--gold)" }}>₹{detail.price}</div>
              <button className="btn btn-primary btn-sm" onClick={() => { addItem(detail); setDetail(null); }}>
                Add to order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Cart review ---------- */
function CartScreen({ cart, addItem, removeItem, onBack, onConfirm }) {
  const total = cart.reduce((a, b) => a + b.qty * b.price, 0);
  const count = cart.reduce((a, b) => a + b.qty, 0);
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "10px 14px 12px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Back onClick={onBack} label="Menu" />
        <div className="eyebrow" style={{ fontSize: 9 }}>Your order · Ana</div>
        <div style={{ width: 40 }} />
      </div>

      <div className="t-italic" style={{ fontSize: 16, color: "var(--cream)", marginTop: 8, lineHeight: 1.15 }}>
        {count > 0 ? "Before it goes to the kitchen…" : "Your order is empty."}
      </div>

      <div className="scroll-y" style={{ flex: 1, marginTop: 8, paddingRight: 4, minHeight: 0 }}>
        {cart.length === 0 && (
          <div style={{ color: "var(--cream-soft)", fontSize: 11, marginTop: 12, fontStyle: "italic" }}>
            Head back to the menu to add something.
          </div>
        )}
        {cart.map(it => (
          <div key={it.id} data-cart-item-id={it.id} className="cart-row fade-in" style={{
            display: "flex", alignItems: "center", gap: 8, padding: "6px 0",
            borderBottom: "1px solid var(--line-soft)",
          }}>
            <DishImage tint={it.tint} name={it.name.split(" ")[0]} style={{ width: 38, height: 28, borderRadius: 2 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="t-italic" style={{ fontSize: 12, color: "var(--cream)", lineHeight: 1.15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.name}</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--cream-soft)", marginTop: 1 }}>₹{it.price} each</div>
            </div>
            <QtyStepper small value={it.qty} onInc={() => addItem(it)} onDec={() => removeItem(it.id)} />
            <div style={{ width: 40, textAlign: "right", fontFamily: "var(--mono)", fontSize: 10, color: "var(--gold)" }}>₹{it.qty * it.price}</div>
          </div>
        ))}
      </div>

      <Hairline style={{ marginTop: 4 }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 4 }}>
        <span className="eyebrow" style={{ fontSize: 9 }}>Total</span>
        <span className="t-italic" style={{ fontSize: 18, color: "var(--gold)" }}>₹{total}</span>
      </div>
      <button className="btn btn-primary" style={{ marginTop: 6, justifyContent: "center", padding: "8px 14px", fontSize: 11 }}
        disabled={count === 0}
        onClick={onConfirm}>
        Send to kitchen ↗
      </button>
    </div>
  );
}

Object.assign(window, { MenuScreen, CartScreen });
