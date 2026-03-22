// ── Pillars ───────────────────────────────────────────────────────────────────
export const DEFAULT_PILLARS = [
  { id: "life",   label: "Life",   color: "#E8C547", icon: "✦" },
  { id: "work",   label: "Work",   color: "#47B8E8", icon: "◈" },
  { id: "health", label: "Health", color: "#47E87A", icon: "◎" },
  { id: "sleep",  label: "Sleep",  color: "#B847E8", icon: "◐" },
];

export const PRESET_COLORS = [
  "#E8C547","#47B8E8","#47E87A","#B847E8","#E84747","#E88047","#47E8D4","#E847A8",
  "#8DE847","#4763E8","#E8E447","#E8476B","#00C9A7","#FF6B6B","#4ECDC4","#FFE66D",
];

// ── Time slots (half-hour, 0–23.5) ───────────────────────────────────────────
export const SLOTS = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2);
  const m = i % 2 === 0 ? "00" : "30";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  const ampm = h < 12 ? "AM" : "PM";
  return { value: i / 2, label: `${h12}:${m} ${ampm}` };
});

// ── Themes ────────────────────────────────────────────────────────────────────
export const THEMES = {
  dark: {
    bg:"#080808", surface:"#0e0e0e", surfaceAlt:"#111", border:"#1a1a1a",
    borderMid:"#222", borderSub:"#131313", text:"#e8e4dc", textMid:"#aaa",
    textSub:"#555", textFaint:"#333", textMuted:"#444", headerBg:"#080808",
    navActive:"#1a1a1a", navBorder:"#2a2a2a", todayBg:"#111", inputBg:"#141414",
    addBtn:"#e8e4dc", addBtnTxt:"#080808", ttBg:"#111", ttBorder:"#222",
    gridLine:"#161616", refLine:"#2a2a2a", empty:"#333", emptyFaint:"#2a2a2a",
    warnBg:"#2a0f0f", warnBorder:"#5a1a1a", warnText:"#ff6b6b",
  },
  light: {
    bg:"#f5f3ef", surface:"#fff", surfaceAlt:"#fafaf8", border:"#e8e4dc",
    borderMid:"#d8d4cc", borderSub:"#eeebe4", text:"#1a1814", textMid:"#4a4640",
    textSub:"#888480", textFaint:"#bbb8b0", textMuted:"#999690", headerBg:"#fff",
    navActive:"#f0ede6", navBorder:"#d8d4cc", todayBg:"#f8f6f0", inputBg:"#f5f3ef",
    addBtn:"#1a1814", addBtnTxt:"#f5f3ef", ttBg:"#fff", ttBorder:"#ddd",
    gridLine:"#eeebe4", refLine:"#d8d4cc", empty:"#aaa8a0", emptyFaint:"#ccc9c0",
    warnBg:"#fff5f5", warnBorder:"#fcc", warnText:"#c44",
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
export const generateId  = () => Math.random().toString(36).slice(2, 9);
export const today       = () => new Date().toISOString().slice(0, 10);
export const formatDate  = d => new Date(d+"T12:00:00").toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"});
export const shortDate   = d => new Date(d+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric"});
export const fmtSlot     = v => { const h=Math.floor(v),m=v%1===0.5?"30":"00",h12=h%12===0?12:h%12; return `${h12}:${m} ${h<12?"AM":"PM"}`; };
export const slotHrs     = (s, e) => e > s ? e - s : (24 - s) + e;

export function getWeekStart(ds) {
  const d = new Date(ds+"T12:00:00");
  d.setDate(d.getDate() - d.getDay());
  return d.toISOString().slice(0, 10);
}
export function addDays(ds, n) {
  const d = new Date(ds+"T12:00:00");
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}
export function getWeekDates(ws) {
  return Array.from({ length: 7 }, (_, i) => addDays(ws, i));
}
export function formatWeekRange(ws) {
  const s = new Date(ws+"T12:00:00"), e = new Date(addDays(ws, 6)+"T12:00:00");
  return `${s.toLocaleDateString("en-US",{month:"short",day:"numeric"})} – ${e.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}`;
}
export function blocksOverlap(a, b) {
  if (a.date !== b.date || a.id === b.id) return false;
  return a.startHour < b.endHour && b.startHour < a.endHour;
}
export function findOverlaps(block, allBlocks) {
  return allBlocks.filter(b => blocksOverlap(block, b));
}
