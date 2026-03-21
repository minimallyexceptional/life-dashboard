import { today, formatWeekRange, addDays, getWeekStart, fmtSlot, slotHrs, findOverlaps } from "../../constants";

export default function WeekView({
  T, PILLARS, PILLAR_MAP,
  weekDates, weekBlocks, weekStats, weekStart, setWeekStart,
  reflForm, setReflForm, currentRefl, saveReflection,
  blocks, setSelectedDate, openAdd, openEdit, setView,
}) {
  const card_ = { background:T.surface, border:`1px solid ${T.border}`, borderRadius:12 };

  return (
    <div>
      {/* ── Header ── */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div>
          <div style={{ fontSize:22, fontWeight:700 }}>{formatWeekRange(weekStart)}</div>
          <div style={{ fontSize:12, color:T.textSub, marginTop:2 }}>
            {weekBlocks.length} blocks · {weekStats.total.toFixed(1)}h · avg {weekStats.avgRating}/10
          </div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {[["←",-7],["THIS WEEK",0],["→",7]].map(([lbl,n]) => (
            <button
              key={lbl}
              onClick={() => n===0 ? setWeekStart(getWeekStart(today())) : setWeekStart(w => addDays(w, n))}
              style={{ background:T.surface, border:`1px solid ${T.border}`, color:T.textMid, borderRadius:8, padding:"8px 14px", cursor:"pointer", fontSize: lbl==="THIS WEEK" ? 11 : 14, letterSpacing: lbl==="THIS WEEK" ? "0.1em" : 0 }}
            >
              {lbl}
            </button>
          ))}
        </div>
      </div>

      {/* ── Pillar summary cards ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24 }}>
        {PILLARS.map(p => {
          const hrs = weekStats.pillarHours[p.id];
          const pct = weekStats.total > 0 ? Math.round((hrs / weekStats.total) * 100) : 0;
          return (
            <div key={p.id} style={{ background:T.surface, border:`1px solid ${p.color}33`, borderRadius:10, padding:"14px 16px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <span style={{ fontSize:11, color:p.color }}>{p.icon} {p.label}</span>
                <span style={{ fontSize:11, color:T.textSub }}>{pct}%</span>
              </div>
              <div style={{ fontSize:22, fontWeight:700, lineHeight:1 }}>
                {hrs.toFixed(1)}<span style={{ fontSize:11, color:T.textSub, fontWeight:400 }}>h</span>
              </div>
              <div style={{ marginTop:8, height:3, background:T.border, borderRadius:2 }}>
                <div style={{ height:"100%", width:`${pct}%`, background:p.color, borderRadius:2, transition:"width 0.5s" }}/>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Weekly reflection ── */}
      <div style={{ ...card_, padding:24, marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div>
            <div style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em", color:T.text }}>✎ WEEKLY REFLECTION</div>
            <div style={{ fontSize:11, color:T.textSub, marginTop:2 }}>How did this week go? What would you change?</div>
          </div>
          {currentRefl && <div style={{ fontSize:11, color:T.textSub }}>Last saved {new Date(currentRefl.updatedAt).toLocaleDateString()}</div>}
        </div>
        <div style={{ display:"flex", gap:16, marginBottom:14, alignItems:"center" }}>
          <label style={{ fontSize:10, color:T.textMuted, letterSpacing:"0.12em", whiteSpace:"nowrap" }}>WEEK RATING</label>
          <div style={{ display:"flex", gap:5, flex:1 }}>
            {[1,2,3,4,5,6,7,8,9,10].map(n => (
              <button
                key={n}
                onClick={() => setReflForm(f => ({ ...f, overallRating:n }))}
                style={{ flex:1, padding:"7px 0", background: reflForm.overallRating>=n ? T.navBorder+"33" : "transparent", border: reflForm.overallRating>=n ? `1px solid ${T.navBorder}` : `1px solid ${T.borderMid}`, borderRadius:4, cursor:"pointer", color: reflForm.overallRating>=n ? T.text : T.textFaint, fontSize:11, fontWeight:700, transition:"all 0.1s" }}
              >
                {n}
              </button>
            ))}
          </div>
          <span style={{ fontSize:16, fontWeight:700, color:T.text, minWidth:32, textAlign:"center" }}>{reflForm.overallRating}/10</span>
        </div>
        <textarea
          value={reflForm.text}
          onChange={e => setReflForm(f => ({ ...f, text:e.target.value }))}
          placeholder="What went well? What drained you? What will you do differently next week?"
          rows={4}
          style={{ width:"100%", background:T.inputBg, border:`1px solid ${T.borderMid}`, borderRadius:8, padding:"12px 14px", color:T.text, fontSize:13, outline:"none", resize:"vertical", fontFamily:"inherit", boxSizing:"border-box", marginBottom:12 }}
        />
        <button
          onClick={saveReflection}
          style={{ background:T.addBtn, color:T.addBtnTxt, border:"none", borderRadius:8, padding:"9px 20px", cursor:"pointer", fontSize:11, fontWeight:700, letterSpacing:"0.1em" }}
        >
          SAVE REFLECTION
        </button>
      </div>

      {/* ── Day rows ── */}
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {weekDates.map(date => {
          const isToday = date === today();
          const dayBs   = weekBlocks.filter(b => b.date === date);
          const dayHrs  = dayBs.reduce((a,b) => a + slotHrs(b.startHour, b.endHour), 0);
          const dayAvg  = dayBs.length ? (dayBs.reduce((a,b) => a+b.rating, 0) / dayBs.length).toFixed(1) : null;
          const d       = new Date(date+"T12:00:00");
          return (
            <div key={date} style={{ background:T.surface, border: isToday ? `1px solid ${T.navBorder}` : `1px solid ${T.border}`, borderRadius:12, overflow:"hidden" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 20px", borderBottom: dayBs.length>0 ? `1px solid ${T.border}` : "none", background: isToday ? T.todayBg : "transparent" }}>
                <div style={{ display:"flex", alignItems:"baseline", gap:10 }}>
                  {isToday && <span style={{ fontSize:9, letterSpacing:"0.15em", background:T.navActive, padding:"2px 7px", borderRadius:4, color:T.text }}>TODAY</span>}
                  <span style={{ fontSize:14, fontWeight:700, color: isToday ? T.text : T.textMid }}>{d.toLocaleDateString("en-US",{weekday:"long"})}</span>
                  <span style={{ fontSize:12, color:T.textMuted }}>{d.toLocaleDateString("en-US",{month:"short",day:"numeric"})}</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                  {dayBs.length > 0 && <span style={{ fontSize:11, color:T.textSub }}>{dayHrs.toFixed(1)}h · <span style={{ color:T.textMid }}>{dayAvg}/10</span></span>}
                  <div style={{ display:"flex", gap:4 }}>
                    {PILLARS.map(p => <div key={p.id} style={{ width:6, height:6, borderRadius:"50%", background: dayBs.some(b => b.pillar===p.id) ? p.color : T.border }}/>)}
                  </div>
                  <button
                    onClick={() => { setSelectedDate(date); openAdd(date); setView("today"); }}
                    style={{ background:"transparent", border:`1px solid ${T.borderMid}`, color:T.textSub, borderRadius:6, padding:"4px 10px", cursor:"pointer", fontSize:11 }}
                  >
                    +
                  </button>
                </div>
              </div>
              {dayBs.length === 0
                ? <div style={{ padding:"14px 20px", fontSize:12, color:T.emptyFaint, fontStyle:"italic" }}>Nothing logged</div>
                : dayBs.map((block, i) => {
                    const p     = PILLAR_MAP[block.pillar];
                    const hasOv = findOverlaps(block, blocks).length > 0;
                    return (
                      <div
                        key={block.id}
                        onClick={() => { setSelectedDate(date); openEdit(block); }}
                        style={{ display:"grid", gridTemplateColumns:"80px 3px 1fr auto", alignItems:"stretch", borderBottom: i < dayBs.length-1 ? `1px solid ${T.borderSub}` : "none", cursor:"pointer", transition:"background 0.15s", background: hasOv ? T.warnBg : "transparent" }}
                        onMouseEnter={e => e.currentTarget.style.background = hasOv ? T.warnBg : T.surfaceAlt}
                        onMouseLeave={e => e.currentTarget.style.background = hasOv ? T.warnBg : "transparent"}
                      >
                        <div style={{ padding:"10px 10px 10px 20px", textAlign:"right" }}>
                          <div style={{ fontSize:10, color:T.textSub }}>{fmtSlot(block.startHour)}</div>
                          <div style={{ fontSize:9, color:T.textFaint }}>{slotHrs(block.startHour, block.endHour).toFixed(1)}h</div>
                        </div>
                        <div style={{ background:p.color, opacity:0.8 }}/>
                        <div style={{ padding:"10px 14px", display:"flex", alignItems:"center", gap:10 }}>
                          {hasOv && <span style={{ fontSize:10, color:T.warnText }}>⚠</span>}
                          <span style={{ fontSize:11, color:p.color }}>{p.icon}</span>
                          <span style={{ fontSize:13, color:T.textMid }}>{block.activity}</span>
                        </div>
                        <div style={{ padding:"10px 16px", display:"flex", alignItems:"center" }}>
                          <span style={{ fontSize:12, fontWeight:700, color:p.color }}>{block.rating}</span>
                        </div>
                      </div>
                    );
                  })
              }
            </div>
          );
        })}
      </div>
    </div>
  );
}
