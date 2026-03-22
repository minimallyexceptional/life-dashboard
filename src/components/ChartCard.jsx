export default function ChartCard({ title, subtitle, children, span, T }) {
  return (
    <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:14, padding:"22px 24px", gridColumn: span ? `span ${span}` : undefined }}>
      <div style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em", color:T.text, marginBottom: subtitle ? 4 : 18 }}>{title}</div>
      {subtitle && <div style={{ fontSize:11, color:T.textMuted, marginBottom:18 }}>{subtitle}</div>}
      {children}
    </div>
  );
}
