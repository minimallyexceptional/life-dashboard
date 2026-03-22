import { useState, useEffect, useRef } from "react";
import { PRESET_COLORS } from "../constants";

export default function ColorPicker({ value, onChange, T }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} style={{ position:"relative" }}>
      <button
        type="button"
        aria-label="Choose color"
        onClick={() => setOpen(o => !o)}
        style={{ width:36, height:36, borderRadius:8, background:value, cursor:"pointer", border:`2px solid ${T.border}`, boxShadow: open ? `0 0 0 2px ${value}44` : "none", transition:"box-shadow 0.15s", padding:0 }}
      />
      {open && (
        <div style={{ position:"absolute", top:44, left:0, zIndex:300, background:T.surface, border:`1px solid ${T.border}`, borderRadius:12, padding:12, display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:6, width:172, boxShadow:"0 8px 32px rgba(0,0,0,0.3)" }}>
          {PRESET_COLORS.map(c => (
            <button
              key={c}
              type="button"
              aria-label={`Select color ${c}`}
              onClick={() => { onChange(c); setOpen(false); }}
              style={{ width:32, height:32, borderRadius:6, background:c, cursor:"pointer", border: value === c ? `2px solid ${T.text}` : "2px solid transparent", transition:"border 0.1s", boxSizing:"border-box", padding:0 }}
            />
          ))}
          <div style={{ gridColumn:"span 4", marginTop:4 }}>
            <div style={{ fontSize:10, color:T.textMuted, letterSpacing:"0.1em", marginBottom:6 }}>CUSTOM HEX</div>
            <input
              defaultValue={value}
              onBlur={e => { const v=e.target.value; if (/^#[0-9a-fA-F]{6}$/.test(v)) { onChange(v); setOpen(false); } }}
              onKeyDown={e => { if (e.key==="Enter") { const v=e.target.value; if (/^#[0-9a-fA-F]{6}$/.test(v)) { onChange(v); setOpen(false); } } }}
              placeholder="#RRGGBB"
              style={{ width:"100%", background:T.inputBg, border:`1px solid ${T.border}`, borderRadius:6, padding:"6px 8px", color:T.text, fontSize:11, outline:"none", boxSizing:"border-box" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
