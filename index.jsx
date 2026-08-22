import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, ReferenceLine,
} from "recharts";
import {
  Plus, Trash2, Pencil, X, Check, TrendingUp, Percent, Wallet,
  AlertTriangle, Search, Home, Rows3, BarChart3, Settings as SettingsIcon,
  ChevronDown, ArrowUpRight, ArrowDownRight,
} from "lucide-react";

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600&display=swap');

.app-backdrop {
  min-height: 100vh;
  width: 100%;
  background: radial-gradient(circle at 50% 0%, #1a1d25 0%, #0a0b0e 70%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 12px;
}
.app-root {
  --bg: #0f1116;
  --bg-elev: #171a21;
  --surface: #1c1f28;
  --surface-hover: #232732;
  --border: #2a2e39;
  --border-soft: #20232c;
  --text: #edeef3;
  --text-dim: #8b90a0;
  --text-faint: #565b6a;
  --profit: #4fae7c;
  --profit-soft: rgba(79,174,124,0.14);
  --loss: #c75c4f;
  --loss-soft: rgba(199,92,79,0.14);
  --accent: #d9a441;
  --accent-soft: rgba(217,164,65,0.16);
  --font-display: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;
  --font-body: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --font-mono: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  height: 700px;
  max-height: 90vh;
  width: 100%;
  max-width: 420px;
  border-radius: 26px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border);
  box-shadow: 0 30px 60px rgba(0,0,0,0.45);
}
.app-root * { box-sizing: border-box; }
.mono { font-family: var(--font-mono); font-variant-numeric: tabular-nums; }
.display { font-family: var(--font-display); }
.pnl-pos { color: var(--profit); }
.pnl-neg { color: var(--loss); }
.pnl-zero { color: var(--text-dim); }
.no-scrollbar::-webkit-scrollbar { width: 0; height: 6px; }
.no-scrollbar::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

.topbar {
  flex: 0 0 auto;
  padding: 18px 18px 12px;
  background: linear-gradient(180deg, var(--bg-elev), var(--bg));
  border-bottom: 1px solid var(--border-soft);
}
.screen {
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 16px 16px 90px;
}
.bottomnav {
  position: absolute;
  left: 0; right: 0; bottom: 0;
  height: 64px;
  background: rgba(23,26,33,0.92);
  backdrop-filter: blur(10px);
  border-top: 1px solid var(--border-soft);
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 30;
}
.nav-item {
  display: flex; flex-direction: column; align-items: center; gap: 3px;
  color: var(--text-faint);
  font-size: 10px; font-weight: 600;
  cursor: pointer; background: none; border: none;
  padding: 6px 10px; border-radius: 10px;
  transition: color 120ms ease;
}
.nav-item.active { color: var(--accent); }
.fab {
  position: absolute;
  right: 18px;
  bottom: 82px;
  width: 52px; height: 52px;
  border-radius: 50%;
  background: var(--accent);
  color: #14161c;
  display: flex; align-items: center; justify-content: center;
  border: none;
  box-shadow: 0 8px 20px rgba(217,164,65,0.35);
  cursor: pointer;
  z-index: 25;
  transition: transform 120ms ease;
}
.fab:active { transform: scale(0.92); }

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
}
.hero-card {
  background: linear-gradient(155deg, #1c1f28 0%, #171a21 100%);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 20px;
}
.pill {
  font-size: 10.5px; font-weight: 700; letter-spacing: 0.04em;
  padding: 3px 8px; border-radius: 6px;
}
.chip {
  font-size: 11.5px; font-weight: 600; padding: 6px 12px; border-radius: 20px;
  border: 1px solid var(--border); background: var(--bg-elev); color: var(--text-dim);
  cursor: pointer; white-space: nowrap;
}
.chip.active { background: var(--accent-soft); border-color: var(--accent); color: var(--accent); }
.btn {
  font-family: var(--font-body); font-weight: 600; font-size: 13px;
  border-radius: 10px; padding: 10px 16px; border: 1px solid var(--border);
  background: var(--surface); color: var(--text); cursor: pointer;
  display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  transition: background 120ms ease, transform 60ms ease;
}
.btn:active { transform: scale(0.98); }
.btn-accent { background: var(--accent); border-color: var(--accent); color: #14161c; }
.btn-ghost { background: transparent; border-color: transparent; padding: 6px; }
.btn-ghost:hover { background: var(--surface-hover); }
.seg-btn {
  flex: 1; text-align: center; padding: 9px 0; font-family: var(--font-mono);
  font-weight: 600; font-size: 12px; letter-spacing: 0.04em; border-radius: 8px;
  cursor: pointer; border: 1px solid transparent; color: var(--text-dim);
}
.seg-long.active { background: var(--profit-soft); color: var(--profit); border-color: var(--profit); }
.seg-short.active { background: var(--loss-soft); color: var(--loss); border-color: var(--loss); }
.field-input {
  width: 100%; background: var(--bg-elev); border: 1px solid var(--border);
  border-radius: 9px; padding: 10px 12px; color: var(--text);
  font-family: var(--font-mono); font-size: 14px; outline: none;
}
.field-input:focus { border-color: var(--accent); }
.field-label {
  font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.07em;
  color: var(--text-faint); font-weight: 600; margin-bottom: 5px; display: block;
}
.stat-label { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-faint); font-weight: 600; }

.sheet-backdrop {
  position: absolute; inset: 0; background: rgba(0,0,0,0.55);
  z-index: 40; opacity: 0; pointer-events: none; transition: opacity 200ms ease;
}
.sheet-backdrop.open { opacity: 1; pointer-events: auto; }
.sheet {
  position: absolute; left: 0; right: 0; bottom: 0;
  background: var(--bg-elev); border-top: 1px solid var(--border);
  border-radius: 20px 20px 0 0;
  max-height: 88%;
  transform: translateY(100%);
  transition: transform 260ms cubic-bezier(.32,.72,0,1);
  z-index: 41;
  display: flex; flex-direction: column;
}
.sheet.open { transform: translateY(0); }
.sheet-handle { width: 36px; height: 4px; border-radius: 3px; background: var(--border); margin: 10px auto 4px; }
.sheet-body { overflow-y: auto; padding: 8px 18px 22px; }

.trade-card { padding: 12px 14px; display: flex; align-items: center; gap: 10px; }
.heat-cell { width: 11px; height: 11px; border-radius: 3px; border: 1px solid var(--border-soft); }
.risk-track { height: 6px; background: var(--bg-elev); border-radius: 4px; overflow: hidden; border: 1px solid var(--border-soft); }
.risk-fill { height: 100%; transition: width 300ms ease; }
`;

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const todayISO = () => new Date().toISOString().slice(0, 10);
const fmtMoney = (n) => {
  const v = Number(n) || 0;
  const sign = v < 0 ? "-" : v > 0 ? "+" : "";
  return `${sign}$${Math.abs(v).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
const pnlClass = (n) => (n > 0 ? "pnl-pos" : n < 0 ? "pnl-neg" : "pnl-zero");

function computePnl(t) {
  if (t.exitPrice === null || t.exitPrice === undefined || t.exitPrice === "") return null;
  const entry = Number(t.entryPrice), exit = Number(t.exitPrice), qty = Number(t.qty), fees = Number(t.fees) || 0;
  const gross = t.side === "long" ? (exit - entry) * qty : (entry - exit) * qty;
  return gross - fees;
}

const emptyForm = { symbol: "", side: "long", qty: "", entryPrice: "", exitPrice: "", fees: "", date: todayISO(), notes: "" };

export default function TradingJournalApp() {
  const [trades, setTrades] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState("home");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [closingId, setClosingId] = useState(null);
  const [closeExit, setCloseExit] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [dailyLimit, setDailyLimit] = useState("");
  const [saveError, setSaveError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const t = await window.storage.get("journalv2:trades");
        if (t && t.value) setTrades(JSON.parse(t.value));
      } catch (e) {}
      try {
        const s = await window.storage.get("journalv2:settings");
        if (s && s.value) {
          const parsed = JSON.parse(s.value);
          if (parsed.dailyLimit) setDailyLimit(parsed.dailyLimit);
        }
      } catch (e) {}
      setLoaded(true);
    })();
  }, []);

  const persistTrades = useCallback(async (next) => {
    setTrades(next);
    try {
      const res = await window.storage.set("journalv2:trades", JSON.stringify(next));
      setSaveError(!res);
    } catch (e) { setSaveError(true); }
  }, []);
  const persistSettings = useCallback(async (limit) => {
    setDailyLimit(limit);
    try { await window.storage.set("journalv2:settings", JSON.stringify({ dailyLimit: limit })); } catch (e) {}
  }, []);

  const enriched = useMemo(() => trades.map((t) => ({ ...t, pnl: computePnl(t) })), [trades]);
  const closed = useMemo(() => enriched.filter((t) => t.pnl !== null), [enriched]);
  const open = useMemo(() => enriched.filter((t) => t.pnl === null), [enriched]);
  const dailyMap = useMemo(() => {
    const m = {};
    closed.forEach((t) => { m[t.date] = (m[t.date] || 0) + t.pnl; });
    return m;
  }, [closed]);
  const today = todayISO();
  const todayPnl = dailyMap[today] || 0;
  const totalPnl = closed.reduce((s, t) => s + t.pnl, 0);
  const wins = closed.filter((t) => t.pnl > 0).length;
  const winRate = closed.length ? (wins / closed.length) * 100 : 0;
  const limitNum = Number(dailyLimit) || 0;
  const limitPct = limitNum > 0 ? Math.min(100, (Math.abs(Math.min(0, todayPnl)) / limitNum) * 100) : 0;
  const limitBreached = limitNum > 0 && todayPnl <= -limitNum;

  const equityData = useMemo(() => {
    const sorted = [...closed].sort((a, b) => (a.date + a.id > b.date + b.id ? 1 : -1));
    let cum = 0;
    return sorted.map((t, i) => { cum += t.pnl; return { idx: i + 1, date: t.date, symbol: t.symbol, equity: Number(cum.toFixed(2)) }; });
  }, [closed]);

  const heatDays = useMemo(() => {
    const days = []; const base = new Date(); base.setHours(0, 0, 0, 0);
    for (let i = 55; i >= 0; i--) {
      const d = new Date(base); d.setDate(d.getDate() - i);
      const iso = d.toISOString().slice(0, 10);
      days.push({ iso, val: dailyMap[iso] || 0, weekday: d.getDay() });
    }
    const padCount = days[0].weekday;
    return Array(padCount).fill(null).concat(days);
  }, [dailyMap]);
  const maxAbsDay = useMemo(() => Math.max(1, ...heatDays.filter(Boolean).map((d) => Math.abs(d.val))), [heatDays]);
  const weeks = useMemo(() => { const cols = []; for (let i = 0; i < heatDays.length; i += 7) cols.push(heatDays.slice(i, i + 7)); return cols; }, [heatDays]);

  const filteredTrades = useMemo(() => {
    let list = [...enriched].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
    if (filter === "open") list = list.filter((t) => t.pnl === null);
    if (filter === "long") list = list.filter((t) => t.side === "long");
    if (filter === "short") list = list.filter((t) => t.side === "short");
    if (search.trim()) { const q = search.trim().toUpperCase(); list = list.filter((t) => t.symbol.toUpperCase().includes(q)); }
    return list;
  }, [enriched, search, filter]);

  const resetForm = () => { setForm(emptyForm); setEditingId(null); };
  const openAddSheet = () => { resetForm(); setSheetOpen(true); };
  const closeSheet = () => { setSheetOpen(false); setTimeout(resetForm, 250); };

  const submitForm = (e) => {
    e.preventDefault();
    if (!form.symbol.trim() || !form.qty || !form.entryPrice) return;
    const record = {
      id: editingId || uid(), symbol: form.symbol.trim().toUpperCase(), side: form.side,
      qty: form.qty, entryPrice: form.entryPrice, exitPrice: form.exitPrice === "" ? null : form.exitPrice,
      fees: form.fees || 0, date: form.date || todayISO(), notes: form.notes || "",
    };
    if (editingId) persistTrades(trades.map((t) => (t.id === editingId ? record : t)));
    else persistTrades([record, ...trades]);
    closeSheet();
  };
  const startEdit = (t) => {
    setEditingId(t.id);
    setForm({ symbol: t.symbol, side: t.side, qty: String(t.qty), entryPrice: String(t.entryPrice),
      exitPrice: t.exitPrice === null ? "" : String(t.exitPrice), fees: String(t.fees || ""), date: t.date, notes: t.notes || "" });
    setSheetOpen(true);
  };
  const deleteTrade = (id) => { persistTrades(trades.filter((t) => t.id !== id)); };
  const confirmClose = (id) => {
    if (!closeExit) return;
    persistTrades(trades.map((t) => (t.id === id ? { ...t, exitPrice: closeExit } : t)));
    setClosingId(null); setCloseExit("");
  };

  if (!loaded) {
    return (
      <div className="app-backdrop">
        <style>{STYLE}</style>
        <div className="app-root" style={{ alignItems: "center", justifyContent: "center" }}>
          <div className="mono" style={{ color: "var(--text-faint)", fontSize: 13 }}>loading ledger…</div>
        </div>
      </div>
    );
  }

  const TradeCard = ({ t }) => (
    <div className="card trade-card" style={{ marginBottom: 8 }}>
      <div style={{
        width: 34, height: 34, borderRadius: 10, flexShrink: 0,
        background: t.side === "long" ? "var(--profit-soft)" : "var(--loss-soft)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {t.side === "long" ? <ArrowUpRight size={16} color="var(--profit)" /> : <ArrowDownRight size={16} color="var(--loss)" />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span className="mono" style={{ fontWeight: 600, fontSize: 14 }}>{t.symbol}</span>
          <span className="mono" style={{ fontSize: 11, color: "var(--text-faint)" }}>{t.qty} sh</span>
        </div>
        <div className="mono" style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 1 }}>
          {t.date} · {Number(t.entryPrice).toFixed(2)} → {t.exitPrice === null ? "open" : Number(t.exitPrice).toFixed(2)}
        </div>
        {closingId === t.id && (
          <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
            <input autoFocus type="number" step="any" placeholder="exit price" className="field-input" style={{ padding: "6px 8px", fontSize: 12 }}
              value={closeExit} onChange={(e) => setCloseExit(e.target.value)} />
            <button className="btn btn-ghost" style={{ padding: 6 }} onClick={() => confirmClose(t.id)}><Check size={14} color="var(--profit)" /></button>
            <button className="btn btn-ghost" style={{ padding: 6 }} onClick={() => { setClosingId(null); setCloseExit(""); }}><X size={14} color="var(--text-faint)" /></button>
          </div>
        )}
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div className={`mono ${pnlClass(t.pnl || 0)}`} style={{ fontWeight: 700, fontSize: 13.5 }}>
          {t.pnl === null ? "—" : fmtMoney(t.pnl)}
        </div>
        <div style={{ display: "flex", gap: 2, marginTop: 4, justifyContent: "flex-end" }}>
          {t.exitPrice === null && closingId !== t.id && (
            <button className="btn btn-ghost" style={{ padding: "3px 6px", fontSize: 10.5 }} onClick={() => { setClosingId(t.id); setCloseExit(""); }}>close</button>
          )}
          <button className="btn btn-ghost" style={{ padding: 4 }} onClick={() => startEdit(t)}><Pencil size={12} color="var(--text-faint)" /></button>
          <button className="btn btn-ghost" style={{ padding: 4 }} onClick={() => deleteTrade(t.id)}><Trash2 size={12} color="var(--text-faint)" /></button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app-backdrop">
      <style>{STYLE}</style>
      <div className="app-root">

      {/* Top bar */}
      <div className="topbar">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="display" style={{ fontSize: 19, fontWeight: 700 }}>Ledger</div>
            <div className="mono" style={{ fontSize: 10.5, color: "var(--text-faint)" }}>
              {new Date().toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="stat-label">Today</div>
            <div className={`mono ${pnlClass(todayPnl)}`} style={{ fontWeight: 700, fontSize: 15 }}>{fmtMoney(todayPnl)}</div>
          </div>
        </div>
        {saveError && (
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10.5, color: "var(--loss)", marginTop: 6 }}>
            <AlertTriangle size={11} /> couldn't save changes
          </div>
        )}
      </div>

      {/* Screens */}
      <div className="screen no-scrollbar">
        {tab === "home" && (
          <>
            <div className="hero-card" style={{ marginBottom: 14 }}>
              <div className="stat-label">Total P&L</div>
              <div className={`mono ${pnlClass(totalPnl)}`} style={{ fontSize: 32, fontWeight: 700, marginTop: 4, letterSpacing: "-0.01em" }}>{fmtMoney(totalPnl)}</div>
              <div style={{ display: "flex", gap: 18, marginTop: 14 }}>
                <div>
                  <div className="stat-label" style={{ display: "flex", alignItems: "center", gap: 4 }}><Percent size={10} /> Win rate</div>
                  <div className="mono" style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>{closed.length ? winRate.toFixed(1) + "%" : "—"}</div>
                </div>
                <div>
                  <div className="stat-label">Trades</div>
                  <div className="mono" style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>{closed.length}</div>
                </div>
                <div>
                  <div className="stat-label">Open</div>
                  <div className="mono" style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>{open.length}</div>
                </div>
              </div>
            </div>

            {limitNum > 0 && (
              <div className="card" style={{ padding: "12px 14px", marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span className="stat-label">Daily loss limit</span>
                  {limitBreached && <span style={{ fontSize: 10.5, fontWeight: 700, color: "var(--loss)", display: "flex", alignItems: "center", gap: 3 }}><AlertTriangle size={11} /> hit</span>}
                </div>
                <div className="risk-track">
                  <div className="risk-fill" style={{ width: `${limitPct}%`, background: limitBreached ? "var(--loss)" : limitPct > 70 ? "var(--accent)" : "var(--profit)" }} />
                </div>
                <div className="mono" style={{ fontSize: 10.5, color: "var(--text-faint)", marginTop: 5 }}>{fmtMoney(Math.min(0, todayPnl))} of -${limitNum}</div>
              </div>
            )}

            <div className="card" style={{ padding: 14, marginBottom: 14 }}>
              <div className="stat-label" style={{ marginBottom: 10 }}>Last 8 weeks</div>
              <div style={{ display: "flex", gap: 3, justifyContent: "space-between" }}>
                {weeks.map((week, wi) => (
                  <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    {week.map((d, di) => {
                      if (!d) return <div key={di} style={{ width: 11, height: 11 }} />;
                      const intensity = d.val === 0 ? 0 : Math.max(0.2, Math.abs(d.val) / maxAbsDay);
                      const color = d.val > 0 ? "var(--profit)" : d.val < 0 ? "var(--loss)" : "var(--bg-elev)";
                      return <div key={di} className="heat-cell" title={`${d.iso}: ${fmtMoney(d.val)}`} style={{ background: color, opacity: d.val === 0 ? 1 : intensity + 0.25 }} />;
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span className="stat-label">Recent trades</span>
              <button className="btn btn-ghost" style={{ padding: "3px 6px", fontSize: 11, color: "var(--accent)" }} onClick={() => setTab("trades")}>see all</button>
            </div>
            {enriched.slice(0, 4).length === 0 ? (
              <div className="card" style={{ padding: 20, textAlign: "center", color: "var(--text-faint)", fontSize: 12.5 }}>No trades logged yet</div>
            ) : (
              [...enriched].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 4).map((t) => <TradeCard key={t.id} t={t} />)
            )}
          </>
        )}

        {tab === "trades" && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, background: "var(--bg-elev)", border: "1px solid var(--border)", borderRadius: 10, padding: "8px 12px" }}>
              <Search size={13} color="#565b6a" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search symbol…"
                style={{ background: "transparent", border: "none", outline: "none", color: "var(--text)", fontFamily: "var(--font-mono)", fontSize: 13, flex: 1 }} />
            </div>
            <div style={{ display: "flex", gap: 6, marginBottom: 12, overflowX: "auto" }}>
              {[["all", "All"], ["open", "Open"], ["long", "Long"], ["short", "Short"]].map(([k, label]) => (
                <div key={k} className={`chip ${filter === k ? "active" : ""}`} onClick={() => setFilter(k)}>{label}</div>
              ))}
            </div>
            {filteredTrades.length === 0 ? (
              <div className="card" style={{ padding: 24, textAlign: "center", color: "var(--text-faint)", fontSize: 12.5 }}>No trades match</div>
            ) : filteredTrades.map((t) => <TradeCard key={t.id} t={t} />)}
          </>
        )}

        {tab === "stats" && (
          <>
            <div className="card" style={{ padding: 14, marginBottom: 14 }}>
              <span className="stat-label">Equity curve</span>
              <div style={{ height: 170, marginTop: 8 }}>
                {equityData.length > 1 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={equityData} margin={{ top: 6, right: 4, left: -22, bottom: 0 }}>
                      <defs>
                        <linearGradient id="eq2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#d9a441" stopOpacity={0.35} />
                          <stop offset="100%" stopColor="#d9a441" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#2a2e39" strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="idx" tick={{ fill: "#565b6a", fontSize: 9 }} axisLine={{ stroke: "#2a2e39" }} tickLine={false} />
                      <YAxis tick={{ fill: "#565b6a", fontSize: 9 }} axisLine={{ stroke: "#2a2e39" }} tickLine={false} width={44} />
                      <ReferenceLine y={0} stroke="#3a3f4d" />
                      <Tooltip contentStyle={{ background: "#0c0d11", border: "1px solid #2a2e39", borderRadius: 8, fontSize: 11, fontFamily: "IBM Plex Mono, monospace" }}
                        labelFormatter={() => ""} formatter={(v, n, p) => [fmtMoney(v), p.payload.symbol + " · " + p.payload.date]} />
                      <Area type="monotone" dataKey="equity" stroke="#d9a441" strokeWidth={2} fill="url(#eq2)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--text-faint)", fontSize: 12 }}>Log 2+ closed trades to see this</div>
                )}
              </div>
            </div>

            <div className="card" style={{ padding: 14, marginBottom: 14 }}>
              <div className="stat-label" style={{ marginBottom: 10 }}>Daily P&L · last 8 weeks</div>
              <div style={{ display: "flex", gap: 3, justifyContent: "space-between" }}>
                {weeks.map((week, wi) => (
                  <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    {week.map((d, di) => {
                      if (!d) return <div key={di} style={{ width: 11, height: 11 }} />;
                      const intensity = d.val === 0 ? 0 : Math.max(0.2, Math.abs(d.val) / maxAbsDay);
                      const color = d.val > 0 ? "var(--profit)" : d.val < 0 ? "var(--loss)" : "var(--bg-elev)";
                      return <div key={di} className="heat-cell" title={`${d.iso}: ${fmtMoney(d.val)}`} style={{ background: color, opacity: d.val === 0 ? 1 : intensity + 0.25 }} />;
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: 14 }}>
              <div className="stat-label" style={{ marginBottom: 10 }}>Breakdown</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div><div className="stat-label">Wins</div><div className="mono pnl-pos" style={{ fontSize: 16, fontWeight: 700 }}>{wins}</div></div>
                <div><div className="stat-label">Losses</div><div className="mono pnl-neg" style={{ fontSize: 16, fontWeight: 700 }}>{closed.length - wins}</div></div>
                <div><div className="stat-label">Avg win</div><div className="mono pnl-pos" style={{ fontSize: 14 }}>{fmtMoney(wins ? closed.filter(t => t.pnl > 0).reduce((s, t) => s + t.pnl, 0) / wins : 0)}</div></div>
                <div><div className="stat-label">Avg loss</div><div className="mono pnl-neg" style={{ fontSize: 14 }}>{fmtMoney((closed.length - wins) ? closed.filter(t => t.pnl < 0).reduce((s, t) => s + t.pnl, 0) / (closed.length - wins) : 0)}</div></div>
              </div>
            </div>
          </>
        )}

        {tab === "settings" && (
          <div className="card" style={{ padding: 16 }}>
            <div className="stat-label" style={{ marginBottom: 8 }}>Daily loss limit</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
              <span className="mono" style={{ color: "var(--text-faint)" }}>$</span>
              <input className="field-input" type="number" min="0" placeholder="e.g. 500" value={dailyLimit} onChange={(e) => persistSettings(e.target.value)} />
            </div>
            <div style={{ fontSize: 11.5, color: "var(--text-faint)" }}>A soft cap for reference — shown as a progress bar on Home once your loss today gets close.</div>
            <div style={{ marginTop: 18, fontSize: 11, color: "var(--text-faint)", borderTop: "1px solid var(--border-soft)", paddingTop: 14 }}>
              Data is saved privately to your account and isn't visible to anyone else.
            </div>
          </div>
        )}
      </div>

      {/* FAB */}
      {(tab === "home" || tab === "trades") && (
        <button className="fab" onClick={openAddSheet}><Plus size={22} /></button>
      )}

      {/* Bottom nav */}
      <div className="bottomnav">
        {[["home", "Home", Home], ["trades", "Trades", Rows3], ["stats", "Stats", BarChart3], ["settings", "Settings", SettingsIcon]].map(([k, label, Icon]) => (
          <button key={k} className={`nav-item ${tab === k ? "active" : ""}`} onClick={() => setTab(k)}>
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>

      {/* Add / edit sheet */}
      <div className={`sheet-backdrop ${sheetOpen ? "open" : ""}`} onClick={closeSheet} />
      <div className={`sheet ${sheetOpen ? "open" : ""}`}>
        <div className="sheet-handle" />
        <div className="sheet-body">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0 14px" }}>
            <span className="display" style={{ fontSize: 16, fontWeight: 700 }}>{editingId ? "Edit Trade" : "Log a Trade"}</span>
            <button className="btn btn-ghost" onClick={closeSheet}><X size={16} color="var(--text-faint)" /></button>
          </div>
          <form onSubmit={submitForm}>
            <div style={{ marginBottom: 10 }}>
              <label className="field-label">Symbol</label>
              <input className="field-input" style={{ textTransform: "uppercase" }} placeholder="AAPL" value={form.symbol} onChange={(e) => setForm({ ...form, symbol: e.target.value })} required />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label className="field-label">Side</label>
              <div style={{ display: "flex", gap: 6, background: "var(--bg)", padding: 3, borderRadius: 9, border: "1px solid var(--border)" }}>
                <div className={`seg-btn seg-long ${form.side === "long" ? "active" : ""}`} onClick={() => setForm({ ...form, side: "long" })}>LONG</div>
                <div className={`seg-btn seg-short ${form.side === "short" ? "active" : ""}`} onClick={() => setForm({ ...form, side: "short" })}>SHORT</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
              <div><label className="field-label">Qty</label><input className="field-input" type="number" step="any" min="0" placeholder="100" value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} required /></div>
              <div><label className="field-label">Date</label><input className="field-input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
              <div><label className="field-label">Entry price</label><input className="field-input" type="number" step="any" min="0" placeholder="0.00" value={form.entryPrice} onChange={(e) => setForm({ ...form, entryPrice: e.target.value })} required /></div>
              <div><label className="field-label">Exit price <span style={{ opacity: 0.6 }}>(optional)</span></label><input className="field-input" type="number" step="any" min="0" placeholder="open" value={form.exitPrice} onChange={(e) => setForm({ ...form, exitPrice: e.target.value })} /></div>
            </div>
            <div style={{ marginBottom: 10 }}>
              <label className="field-label">Fees <span style={{ opacity: 0.6 }}>(optional)</span></label>
              <input className="field-input" type="number" step="any" min="0" placeholder="0.00" value={form.fees} onChange={(e) => setForm({ ...form, fees: e.target.value })} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="field-label">Notes</label>
              <input className="field-input" placeholder="setup, mistake, reason…" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-accent" style={{ width: "100%" }}>
              <Plus size={14} /> {editingId ? "Save changes" : "Add trade"}
            </button>
          </form>
        </div>
      </div>
      </div>
    </div>
  );
}
