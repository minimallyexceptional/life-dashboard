import SlotSelect from "../SlotSelect";

export default function TemplateModal({
  T, PILLARS, isDark,
  editTpl, tplForm, setTplForm,
  saveTpl, deleteTpl,
  setShowTplModal,
}) {
  const tplPillar = PILLARS.find(p => p.id === tplForm.pillar);
  const lbl_ = { fontSize:10, color:T.textMuted, letterSpacing:"0.15em", display:"block", marginBottom:8 };
  const inp_ = { width:"100%", background:T.inputBg, border:`1px solid ${T.borderMid}`, borderRadius:8, padding:"10px 14px", color:T.text, fontSize:14, outline:"none", boxSizing:"border-box" };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{ position:"fixed", inset:0, background: isDark ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}
      onClick={e => e.target === e.currentTarget && setShowTplModal(false)}
    >
      <div style={{ background:T.surface, border:`1px solid ${tplPillar?.color}55`, borderRadius:16, padding:32, width:460, maxWidth:"92vw", boxShadow:"0 20px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ fontSize:14, fontWeight:700, letterSpacing:"0.1em", marginBottom:24, color:T.text }}>
          {editTpl ? "EDIT TEMPLATE" : "NEW TEMPLATE"}
        </div>

        {/* Pillar */}
        <div style={{ marginBottom:20 }}>
          <label style={lbl_}>PILLAR</label>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
            {PILLARS.map(p => (
              <button
                key={p.id}
                onClick={() => setTplForm(f => ({ ...f, pillar:p.id }))}
                style={{ background: tplForm.pillar===p.id ? `${p.color}22` : T.inputBg, border: tplForm.pillar===p.id ? `1px solid ${p.color}` : `1px solid ${T.borderMid}`, borderRadius:8, padding:"10px 6px", cursor:"pointer", color: tplForm.pillar===p.id ? p.color : T.textSub, fontSize:11, textAlign:"center", transition:"all 0.15s" }}
              >
                <div style={{ fontSize:18, marginBottom:4 }}>{p.icon}</div>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Activity name */}
        <div style={{ marginBottom:16 }}>
          <label style={lbl_}>ACTIVITY NAME</label>
          <input
            value={tplForm.activity}
            onChange={e => setTplForm(f => ({ ...f, activity:e.target.value }))}
            placeholder="e.g. Morning workout"
            style={inp_}
          />
        </div>

        {/* Default times */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:24 }}>
          {[["DEFAULT START","startHour"],["DEFAULT END","endHour"]].map(([lbl,key]) => (
            <div key={key}>
              <label style={lbl_}>{lbl}</label>
              <SlotSelect value={tplForm[key]} onChange={v => setTplForm(f => ({ ...f, [key]:v }))} T={T}/>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display:"flex", gap:10 }}>
          {editTpl && (
            <button
              onClick={() => deleteTpl(editTpl.id)}
              style={{ background:"transparent", border:"1px solid #ff444433", color:"#ff4444", borderRadius:8, padding:"10px 16px", cursor:"pointer", fontSize:12 }}
            >
              Delete
            </button>
          )}
          <button
            onClick={() => setShowTplModal(false)}
            style={{ flex:1, background:"transparent", border:`1px solid ${T.borderMid}`, color:T.textSub, borderRadius:8, padding:"10px", cursor:"pointer", fontSize:12 }}
          >
            Cancel
          </button>
          <button
            onClick={saveTpl}
            style={{ flex:2, background:tplPillar?.color, border:"none", color:"#080808", borderRadius:8, padding:"10px", cursor:"pointer", fontSize:12, fontWeight:700, letterSpacing:"0.08em" }}
          >
            {editTpl ? "SAVE TEMPLATE" : "CREATE TEMPLATE"}
          </button>
        </div>
      </div>
    </div>
  );
}
