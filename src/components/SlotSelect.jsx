import { SLOTS } from "../constants";

export default function SlotSelect({ value, onChange, T, style }) {
  return (
    <select
      value={value}
      onChange={e => onChange(Number(e.target.value))}
      style={{ width:"100%", background:T.inputBg, border:`1px solid ${T.borderMid}`, borderRadius:8, padding:"10px 14px", color:T.text, fontSize:13, outline:"none", cursor:"pointer", ...style }}
    >
      {SLOTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
    </select>
  );
}
