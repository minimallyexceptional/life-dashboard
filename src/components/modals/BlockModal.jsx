import SlotSelect from "../SlotSelect";
import { fmtSlot } from "../../constants";

export default function BlockModal({
  T, PILLARS, isDark,
  editBlock, form, setForm, overlapWarn,
  handleFormChange, saveBlock, deleteBlock,
  setShowModal,
}) {
  const activePillar = PILLARS.find(p => p.id === form.pillar);
  const lbl_ = { fontSize:10, color:T.textMuted, letterSpacing:"0.15em", display:"block", marginBottom:8 };
  const inp_ = { width:"100%", background:T.inputBg, border:`1px solid ${T.borderMid}`, borderRadius:8, padding:"10px 14px", color:T.text, fontSize:14, outline:"none", boxSizing:"border-box" };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{ position:"fixed", inset:0, background: isDark ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}
      onClick={e => e.target === e.currentTarget && setShowModal(false)}
    >
      <div style={{ background:T.surface, border:`1px solid ${activePillar?.color}55`, borderRadius:16, padding:32, width:500, maxWidth:"92vw", boxShadow:"0 20px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ fontSize:14, fontWeight:700, letterSpacing:"0.1em", marginBottom:24, color:T.text }}>
          {editBlock ? "EDIT BLOCK" : "ADD TIME BLOCK"}
        </div>

        {/* Pillar */}
        <div style={{ marginBottom:20 }}>
          <label style={lbl_}>PILLAR</label>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
            {PILLARS.map(p => (
              <button
                key={p.id}
                onClick={() => handleFormChange({ pillar:p.id })}
                style={{ background: form.pillar===p.id ? `${p.color}22` : T.inputBg, border: form.pillar===p.id ? `1px solid ${p.color}` : `1px solid ${T.borderMid}`, borderRadius:8, padding:"10px 6px", cursor:"pointer", color: form.pillar===p.id ? p.color : T.textSub, fontSize:11, textAlign:"center", transition:"all 0.15s" }}
              >
                <div style={{ fontSize:18, marginBottom:4 }}>{p.icon}</div>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div style={{ marginBottom:16 }}>
          <label style={lbl_}>ACTIVITY</label>
          <input
            value={form.activity}
            onChange={e => handleFormChange({ activity:e.target.value })}
            placeholder="What were you doing?"
            style={inp_}
          />
        </div>

        {/* Time */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom: overlapWarn.length > 0 ? 8 : 16 }}>
          {[["START TIME","startHour"],["END TIME","endHour"]].map(([lbl,key]) => (
            <div key={key}>
              <label style={lbl_}>{lbl}</label>
              <SlotSelect value={form[key]} onChange={v => handleFormChange({ [key]:v })} T={T}/>
            </div>
          ))}
        </div>

        {/* Overlap warning */}
        {overlapWarn.length > 0 && (
          <div style={{ background:T.warnBg, border:`1px solid ${T.warnBorder}`, borderRadius:8, padding:"10px 14px", marginBottom:14, fontSize:12, color:T.warnText }}>
            ⚠ Overlaps with: {overlapWarn.map(b => `"${b.activity}" (${fmtSlot(b.startHour)}–${fmtSlot(b.endHour)})`).join(", ")}
          </div>
        )}

        {/* Rating */}
        <div style={{ marginBottom:16 }}>
          <label style={lbl_}>QUALITY RATING — <span style={{ color:activePillar?.color }}>{form.rating}/10</span></label>
          <div style={{ display:"flex", gap:6 }}>
            {[1,2,3,4,5,6,7,8,9,10].map(n => (
              <button
                key={n}
                onClick={() => setForm(f => ({ ...f, rating:n }))}
                style={{ flex:1, aspectRatio:"1", background: form.rating>=n ? `${activePillar?.color}33` : T.inputBg, border: form.rating>=n ? `1px solid ${activePillar?.color}` : `1px solid ${T.borderMid}`, borderRadius:4, cursor:"pointer", color: form.rating>=n ? activePillar?.color : T.textFaint, fontSize:11, fontWeight:700, transition:"all 0.1s" }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div style={{ marginBottom:24 }}>
          <label style={lbl_}>NOTE (optional)</label>
          <textarea
            value={form.note}
            onChange={e => setForm(f => ({ ...f, note:e.target.value }))}
            placeholder="Any observations or insights..."
            rows={2}
            style={{ ...inp_, resize:"vertical", fontFamily:"inherit" }}
          />
        </div>

        {/* Actions */}
        <div style={{ display:"flex", gap:10 }}>
          {editBlock && (
            <button
              onClick={() => deleteBlock(editBlock.id)}
              style={{ background:"transparent", border:"1px solid #ff444433", color:"#ff4444", borderRadius:8, padding:"10px 16px", cursor:"pointer", fontSize:12 }}
            >
              Delete
            </button>
          )}
          <button
            onClick={() => setShowModal(false)}
            style={{ flex:1, background:"transparent", border:`1px solid ${T.borderMid}`, color:T.textSub, borderRadius:8, padding:"10px", cursor:"pointer", fontSize:12 }}
          >
            Cancel
          </button>
          <button
            onClick={saveBlock}
            style={{ flex:2, background:activePillar?.color, border:"none", color:"#080808", borderRadius:8, padding:"10px", cursor:"pointer", fontSize:12, fontWeight:700, letterSpacing:"0.08em" }}
          >
            {editBlock ? "SAVE CHANGES" : "ADD BLOCK"}
          </button>
        </div>
      </div>
    </div>
  );
}
