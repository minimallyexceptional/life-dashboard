import { formatDate, fmtSlot, slotHrs, findOverlaps } from "../../constants";

export default function TodayView({
  T, PILLARS, PILLAR_MAP,
  dayBlocks, allDates, selectedDate, setSelectedDate,
  hoveredBlock, setHoveredBlock,
  templates, blocks,
  openAdd, openEdit, applyTemplate,
}) {
  const card_ = { background:T.surface, border:`1px solid ${T.border}`, borderRadius:12 };

  return (
    <div style={{ display:"grid", gridTemplateColumns:"220px 1fr", gap:24 }}>
      {/* ── Left sidebar ── */}
      <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

        {/* Pillar summary */}
        <div style={{ ...card_, padding:20 }}>
          <div style={{ fontSize:10, color:T.textMuted, letterSpacing:"0.15em", marginBottom:16 }}>TODAY'S PILLARS</div>
          {PILLARS.map(p => {
            const hrs = dayBlocks.filter(b => b.pillar === p.id).reduce((a,b) => a + slotHrs(b.startHour, b.endHour), 0);
            const rs  = dayBlocks.filter(b => b.pillar === p.id).map(b => b.rating);
            const avg = rs.length ? (rs.reduce((a,b) => a+b, 0) / rs.length).toFixed(1) : "—";
            return (
              <div key={p.id} style={{ marginBottom:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ color:p.color, fontSize:14 }}>{p.icon}</span>
                    <span style={{ fontSize:12, color:T.textMid }}>{p.label}</span>
                  </div>
                  <div style={{ fontSize:11, color:T.textSub }}>{hrs}h · {avg}</div>
                </div>
                <div style={{ height:3, background:T.border, borderRadius:2 }}>
                  <div style={{ height:"100%", width:`${Math.min((hrs/24)*100,100)}%`, background:p.color, borderRadius:2, transition:"width 0.4s" }}/>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick-apply templates */}
        {templates.length > 0 && (
          <div style={{ ...card_, padding:16 }}>
            <div style={{ fontSize:10, color:T.textMuted, letterSpacing:"0.15em", marginBottom:12 }}>QUICK ADD</div>
            {templates.map(t => {
              const p = PILLAR_MAP[t.pillar];
              return (
                <div
                  key={t.id}
                  onClick={() => applyTemplate(t)}
                  style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 8px", borderRadius:6, cursor:"pointer", marginBottom:2, transition:"background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = T.surfaceAlt}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <span style={{ color:p?.color, fontSize:12 }}>{p?.icon}</span>
                  <span style={{ fontSize:12, color:T.textMid, flex:1 }}>{t.activity}</span>
                  <span style={{ fontSize:10, color:T.textSub }}>{fmtSlot(t.startHour).replace(":00","")}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Date list */}
        <div style={{ ...card_, padding:16 }}>
          <div style={{ fontSize:10, color:T.textMuted, letterSpacing:"0.15em", marginBottom:12 }}>DATES</div>
          {allDates.slice(0, 7).map(d => (
            <div
              key={d}
              onClick={() => setSelectedDate(d)}
              style={{ padding:"8px 10px", borderRadius:6, cursor:"pointer", background: selectedDate===d ? T.navActive : "transparent", color: selectedDate===d ? T.text : T.textSub, fontSize:12, marginBottom:2, transition:"all 0.15s" }}
            >
              {formatDate(d)}
            </div>
          ))}
        </div>
      </div>

      {/* ── Timeline ── */}
      <div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div>
            <div style={{ fontSize:22, fontWeight:700 }}>{formatDate(selectedDate)}</div>
            <div style={{ fontSize:12, color:T.textSub, marginTop:2 }}>
              {dayBlocks.length} blocks · {dayBlocks.reduce((a,b) => a + slotHrs(b.startHour, b.endHour), 0).toFixed(1)}h logged
            </div>
          </div>
          <button
            onClick={() => openAdd()}
            style={{ background:T.addBtn, color:T.addBtnTxt, border:"none", borderRadius:8, padding:"10px 20px", fontSize:12, fontWeight:700, letterSpacing:"0.1em", cursor:"pointer" }}
          >
            + ADD BLOCK
          </button>
        </div>

        <div style={{ ...card_, overflow:"hidden" }}>
          {dayBlocks.length === 0
            ? <div style={{ padding:60, textAlign:"center", color:T.empty, fontSize:14 }}>
                No blocks logged.<br/><span style={{ fontSize:12 }}>Click "+ Add Block" to start.</span>
              </div>
            : dayBlocks.map((block, i) => {
                const p          = PILLAR_MAP[block.pillar] || { color: "#666", icon: "❓", label: "Unknown" };
                const hrs        = slotHrs(block.startHour, block.endHour);
                const hasOverlap = findOverlaps(block, blocks).length > 0;
                return (
                  <div
                    key={block.id}
                    onMouseEnter={() => setHoveredBlock(block.id)}
                    onMouseLeave={() => setHoveredBlock(null)}
                    onClick={() => openEdit(block)}
                    style={{ display:"grid", gridTemplateColumns:"88px 4px 1fr auto", alignItems:"stretch", borderBottom: i < dayBlocks.length-1 ? `1px solid ${T.borderSub}` : "none", cursor:"pointer", background: hasOverlap ? T.warnBg : hoveredBlock===block.id ? T.surfaceAlt : "transparent", transition:"background 0.15s" }}
                  >
                    <div style={{ padding:"14px 12px", textAlign:"right" }}>
                      <div style={{ fontSize:11, color: hasOverlap ? "#ff6b6b" : T.textSub }}>{fmtSlot(block.startHour)}</div>
                      <div style={{ fontSize:10, color:T.textFaint, marginTop:2 }}>→ {fmtSlot(block.endHour)}</div>
                      <div style={{ fontSize:10, color:T.textMuted, marginTop:1 }}>{hrs === Math.floor(hrs) ? hrs : hrs.toFixed(1)}h</div>
                    </div>
                    <div style={{ background:p.color, opacity:0.85 }}/>
                    <div style={{ padding:"12px 16px" }}>
                      {hasOverlap && <div style={{ fontSize:10, color:T.warnText, marginBottom:4, letterSpacing:"0.08em" }}>⚠ OVERLAP</div>}
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                        <span style={{ fontSize:10, color:p.color, letterSpacing:"0.1em", textTransform:"uppercase" }}>{p.icon} {p.label}</span>
                      </div>
                      <div style={{ fontSize:14, color:T.text }}>{block.activity}</div>
                      {block.note && <div style={{ fontSize:11, color:T.textSub, marginTop:4, fontStyle:"italic" }}>{block.note}</div>}
                    </div>
                    <div style={{ padding:"12px 20px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <div style={{ width:34, height:34, borderRadius:"50%", border:`2px solid ${p.color}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:p.color }}>{block.rating}</div>
                    </div>
                  </div>
                );
              })
          }
        </div>
      </div>
    </div>
  );
}
