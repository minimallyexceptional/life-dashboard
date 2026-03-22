import ColorPicker from "../ColorPicker";
import { DEFAULT_PILLARS, fmtSlot, slotHrs } from "../../constants";

export default function SettingsView({
  T, PILLARS, PILLAR_MAP,
  isDark, setIsDark,
  pillarColors, setPillarColors,
  templates, openAddTpl, openEditTpl,
}) {
  const card_ = { background:T.surface, border:`1px solid ${T.border}`, borderRadius:12 };

  return (
    <div style={{ maxWidth:640 }}>
      <div style={{ marginBottom:32 }}>
        <div style={{ fontSize:22, fontWeight:700 }}>Settings</div>
        <div style={{ fontSize:12, color:T.textSub, marginTop:2 }}>Customize your Existence experience</div>
      </div>

      {/* ── Appearance ── */}
      <div style={{ ...card_, padding:28, marginBottom:20 }}>
        <div style={{ fontSize:11, color:T.textMuted, letterSpacing:"0.15em", marginBottom:20 }}>APPEARANCE</div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontSize:14, color:T.text, marginBottom:4 }}>Theme</div>
            <div style={{ fontSize:12, color:T.textSub }}>Choose between dark and light mode</div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            {[["☽ Dark",true],["☀ Light",false]].map(([lbl,val]) => (
              <button
                key={lbl}
                onClick={() => setIsDark(val)}
                style={{ background: isDark===val ? T.navActive : "transparent", border:`1px solid ${isDark===val ? T.navBorder : T.borderMid}`, color: isDark===val ? T.text : T.textSub, borderRadius:8, padding:"8px 16px", cursor:"pointer", fontSize:12, transition:"all 0.15s" }}
              >
                {lbl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Pillar colors ── */}
      <div style={{ ...card_, padding:28, marginBottom:20 }}>
        <div style={{ fontSize:11, color:T.textMuted, letterSpacing:"0.15em", marginBottom:8 }}>PILLAR COLORS</div>
        <div style={{ fontSize:12, color:T.textSub, marginBottom:24 }}>Click a swatch to change. Colors apply everywhere across the app.</div>
        {PILLARS.map(p => (
          <div key={p.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 0", borderBottom:`1px solid ${T.border}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              <span style={{ fontSize:22, color:p.color }}>{p.icon}</span>
              <div>
                <div style={{ fontSize:14, color:T.text, fontWeight:600 }}>{p.label}</div>
                <div style={{ fontSize:11, color:T.textSub, marginTop:2 }}>{p.color.toUpperCase()}</div>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ background:`${p.color}22`, border:`1px solid ${p.color}55`, borderRadius:20, padding:"4px 12px", fontSize:11, color:p.color }}>{p.label} Block</div>
              <ColorPicker value={p.color} onChange={color => setPillarColors(prev => ({ ...prev, [p.id]:color }))} T={T}/>
            </div>
          </div>
        ))}
        <button
          onClick={() => setPillarColors(Object.fromEntries(DEFAULT_PILLARS.map(p => [p.id, p.color])))}
          style={{ marginTop:20, background:"transparent", border:`1px solid ${T.borderMid}`, color:T.textSub, borderRadius:8, padding:"8px 16px", cursor:"pointer", fontSize:12 }}
        >
          Reset to defaults
        </button>
      </div>

      {/* ── Templates ── */}
      <div style={{ ...card_, padding:28 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
          <div style={{ fontSize:11, color:T.textMuted, letterSpacing:"0.15em" }}>RECURRING TEMPLATES</div>
          <button
            onClick={openAddTpl}
            style={{ background:"transparent", border:`1px solid ${T.borderMid}`, color:T.textSub, borderRadius:6, padding:"5px 12px", cursor:"pointer", fontSize:11 }}
          >
            + New Template
          </button>
        </div>
        <div style={{ fontSize:12, color:T.textSub, marginBottom:20 }}>Templates appear as quick-add shortcuts on the Today view.</div>
        {templates.length === 0
          ? <div style={{ padding:"20px 0", textAlign:"center", color:T.emptyFaint, fontSize:13, fontStyle:"italic" }}>No templates yet — create one to get started.</div>
          : templates.map(t => {
              const p = PILLAR_MAP[t.pillar];
              return (
                <div key={t.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:`1px solid ${T.border}` }}>
                  <span style={{ fontSize:18, color:p?.color }}>{p?.icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, color:T.text }}>{t.activity}</div>
                    <div style={{ fontSize:11, color:T.textSub, marginTop:2 }}>{p?.label} · {fmtSlot(t.startHour)} – {fmtSlot(t.endHour)} ({slotHrs(t.startHour, t.endHour).toFixed(1)}h)</div>
                  </div>
                  <button
                    onClick={() => openEditTpl(t)}
                    style={{ background:"transparent", border:`1px solid ${T.borderMid}`, color:T.textSub, borderRadius:6, padding:"5px 10px", cursor:"pointer", fontSize:11 }}
                  >
                    Edit
                  </button>
                </div>
              );
            })
        }
      </div>
    </div>
  );
}
