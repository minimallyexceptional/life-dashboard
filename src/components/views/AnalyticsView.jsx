import { formatDate, fmtSlot, slotHrs } from "../../constants";

export default function AnalyticsView({ T, PILLARS, PILLAR_MAP, blocks, allDates, analytics }) {
  const card_ = { background:T.surface, border:`1px solid ${T.border}`, borderRadius:12 };

  return (
    <div>
      <div style={{ marginBottom:28 }}>
        <div style={{ fontSize:22, fontWeight:700 }}>Analytics</div>
        <div style={{ fontSize:12, color:T.textSub, marginTop:2 }}>{blocks.length} total blocks across {allDates.length} days</div>
      </div>

      {/* ── Per-pillar summary cards ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
        {analytics.map(p => (
          <div key={p.id} style={{ background:T.surface, border:`1px solid ${p.color}33`, borderRadius:12, padding:20 }}>
            <div style={{ fontSize:22, color:p.color, marginBottom:8 }}>{p.icon}</div>
            <div style={{ fontSize:11, color:T.textSub, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4 }}>{p.label}</div>
            <div style={{ fontSize:28, fontWeight:700, lineHeight:1 }}>
              {p.hours}<span style={{ fontSize:12, color:T.textSub, fontWeight:400 }}>h</span>
            </div>
            <div style={{ fontSize:11, color:T.textSub, marginTop:4 }}>{p.pct}% of time · avg {p.avgRating}/10</div>
            <div style={{ marginTop:12, height:4, background:T.border, borderRadius:2 }}>
              <div style={{ height:"100%", width:`${p.pct}%`, background:p.color, borderRadius:2, transition:"width 0.6s" }}/>
            </div>
          </div>
        ))}
      </div>

      {/* ── All time blocks table ── */}
      <div style={{ ...card_, overflow:"hidden" }}>
        <div style={{ padding:"16px 20px", borderBottom:`1px solid ${T.border}` }}>
          <span style={{ fontSize:11, color:T.textMuted, letterSpacing:"0.15em" }}>ALL TIME BLOCKS</span>
        </div>
        {[...blocks].sort((a,b) => b.date.localeCompare(a.date) || a.startHour - b.startHour).map((block, i, arr) => {
          const p = PILLAR_MAP[block.pillar];
          return (
            <div
              key={block.id}
              style={{ display:"grid", gridTemplateColumns:"110px 4px 1fr 80px 50px", alignItems:"center", borderBottom: i < arr.length-1 ? `1px solid ${T.borderSub}` : "none", padding:"10px 0" }}
            >
              <div style={{ padding:"0 16px", fontSize:11, color:T.textMuted }}>{formatDate(block.date)}</div>
              <div style={{ background:p.color, height:20, opacity:0.7, borderRadius:2 }}/>
              <div style={{ padding:"0 16px" }}>
                <span style={{ fontSize:12, color:p.color, marginRight:8 }}>{p.icon}</span>
                <span style={{ fontSize:13, color:T.textMid }}>{block.activity}</span>
              </div>
              <div style={{ fontSize:11, color:T.textSub, textAlign:"center" }}>{slotHrs(block.startHour, block.endHour).toFixed(1)}h</div>
              <div style={{ textAlign:"center", fontSize:13, fontWeight:700, color:p.color }}>{block.rating}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
