const VIEWS = ["today", "week", "dashboard", "analytics", "settings"];

export default function Header({ T, view, setView, isDark, setIsDark, overallScore }) {
  const navBtn = active => ({
    background: active ? T.navActive : "transparent",
    border: active ? `1px solid ${T.navBorder}` : "1px solid transparent",
    color: active ? T.text : T.textSub,
    padding: "6px 16px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 11,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    transition: "all 0.2s",
  });

  return (
    <header style={{ borderBottom:`1px solid ${T.border}`, padding:"0 32px", display:"flex", alignItems:"center", justifyContent:"space-between", height:64, background:T.headerBg, position:"sticky", top:0, zIndex:100 }}>
      <div style={{ display:"flex", alignItems:"baseline", gap:12 }}>
        <span style={{ fontSize:22, fontWeight:700, letterSpacing:"0.15em" }}>EXISTENCE</span>
        <span style={{ fontSize:11, color:T.textMuted, letterSpacing:"0.2em" }}>TIME INTELLIGENCE</span>
      </div>
      <nav style={{ display:"flex", gap:4 }}>
        {VIEWS.map(v => (
          <button key={v} onClick={() => setView(v)} style={navBtn(view === v)}>{v}</button>
        ))}
      </nav>
      <div style={{ display:"flex", alignItems:"center", gap:16 }}>
        <button
          onClick={() => setIsDark(d => !d)}
          style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:8, padding:"7px 12px", cursor:"pointer", fontSize:15, lineHeight:1, color:T.text }}
        >
          {isDark ? "☀" : "☽"}
        </button>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:10, color:T.textMuted, letterSpacing:"0.1em" }}>QUALITY SCORE</div>
          <div style={{ fontSize:20, fontWeight:700, lineHeight:1 }}>
            {overallScore}<span style={{ fontSize:11, color:T.textSub }}>/10</span>
          </div>
        </div>
      </div>
    </header>
  );
}
