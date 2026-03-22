import {
  LineChart, Line, BarChart, Bar, ComposedChart, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from "recharts";
import ChartCard from "../ChartCard";
import { formatWeekRange } from "../../constants";

export default function DashboardView({
  T, PILLARS, PILLAR_MAP, TT,
  dashData, sleepScatterData, pillarTrendData, workBurnoutData, pillarStackData,
  reflections,
}) {
  const card_ = { background:T.surface, border:`1px solid ${T.border}`, borderRadius:12 };

  return (
    <div>
      <div style={{ marginBottom:28 }}>
        <div style={{ fontSize:22, fontWeight:700 }}>Dashboard</div>
        <div style={{ fontSize:12, color:T.textSub, marginTop:2 }}>Trends across the last 14 days</div>
      </div>

      {dashData.length < 2
        ? <div style={{ padding:60, textAlign:"center", color:T.empty, fontSize:14 }}>Log at least 2 days of data to see charts.</div>
        : <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>

            <ChartCard title="◐  Sleep Quality → Next-Day Life Quality" subtitle="Does better sleep drive better days? Each dot = one day." T={T}>
              <ResponsiveContainer width="100%" height={220}>
                <ScatterChart margin={{ top:4, right:16, bottom:16, left:-10 }}>
                  <CartesianGrid stroke={T.gridLine} strokeDasharray="3 3"/>
                  <XAxis dataKey="sleepRating" type="number" domain={[0,10]} tick={{ fill:T.textMuted, fontSize:10 }} label={{ value:"Sleep Rating", position:"insideBottom", offset:-8, fill:T.textMuted, fontSize:10 }}/>
                  <YAxis dataKey="nextDayOverall" type="number" domain={[0,10]} tick={{ fill:T.textMuted, fontSize:10 }}/>
                  <Tooltip contentStyle={TT} formatter={(v,n) => [v, n==="nextDayOverall" ? "Next-day score" : "Sleep rating"]} labelFormatter={() => ""}/>
                  <ReferenceLine x={7} stroke={T.refLine} strokeDasharray="4 4"/>
                  <ReferenceLine y={7} stroke={T.refLine} strokeDasharray="4 4"/>
                  <Scatter data={sleepScatterData} fill={PILLAR_MAP.sleep.color} opacity={0.85}/>
                </ScatterChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="✦  Daily Quality Score" subtitle="Your overall life quality rating day by day" T={T}>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={dashData} margin={{ top:4, right:16, bottom:4, left:-10 }}>
                  <CartesianGrid stroke={T.gridLine} strokeDasharray="3 3"/>
                  <XAxis dataKey="label" tick={{ fill:T.textMuted, fontSize:10 }}/>
                  <YAxis domain={[0,10]} tick={{ fill:T.textMuted, fontSize:10 }}/>
                  <Tooltip contentStyle={TT}/>
                  <ReferenceLine y={7} stroke={T.refLine} strokeDasharray="4 4"/>
                  <Line type="monotone" dataKey="overall" stroke={T.text} strokeWidth={2.5} dot={{ r:3, fill:T.text }} name="Overall Score" connectNulls/>
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="◈  Pillar Quality Trends" subtitle="How each area of life has been rated over time" span={2} T={T}>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={pillarTrendData} margin={{ top:4, right:16, bottom:4, left:-10 }}>
                  <CartesianGrid stroke={T.gridLine} strokeDasharray="3 3"/>
                  <XAxis dataKey="label" tick={{ fill:T.textMuted, fontSize:10 }}/>
                  <YAxis domain={[0,10]} tick={{ fill:T.textMuted, fontSize:10 }}/>
                  <Tooltip contentStyle={TT}/>
                  <Legend wrapperStyle={{ fontSize:11, color:T.textSub, paddingTop:8 }}/>
                  <ReferenceLine y={7} stroke={T.refLine} strokeDasharray="4 4"/>
                  {PILLARS.map(p => <Line key={p.id} type="monotone" dataKey={p.label} stroke={p.color} strokeWidth={2} dot={{ r:2.5, fill:p.color }} connectNulls/>)}
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="◈  Work Hours vs Quality" subtitle="Are long days helping or hurting your output?" T={T}>
              <ResponsiveContainer width="100%" height={220}>
                <ComposedChart data={workBurnoutData} margin={{ top:4, right:16, bottom:4, left:-10 }}>
                  <CartesianGrid stroke={T.gridLine} strokeDasharray="3 3"/>
                  <XAxis dataKey="label" tick={{ fill:T.textMuted, fontSize:10 }}/>
                  <YAxis yAxisId="hrs" orientation="left" domain={[0,14]} tick={{ fill:T.textMuted, fontSize:10 }}/>
                  <YAxis yAxisId="qual" orientation="right" domain={[0,10]} tick={{ fill:T.textMuted, fontSize:10 }}/>
                  <Tooltip contentStyle={TT}/>
                  <Legend wrapperStyle={{ fontSize:11, color:T.textSub, paddingTop:8 }}/>
                  <Bar yAxisId="hrs" dataKey="Work Hours" fill={PILLAR_MAP.work.color+"25"} stroke={PILLAR_MAP.work.color+"66"} strokeWidth={1} radius={[3,3,0,0]}/>
                  <Line yAxisId="qual" dataKey="Work Quality" stroke={PILLAR_MAP.work.color} strokeWidth={2} dot={{ r:3, fill:PILLAR_MAP.work.color }} connectNulls/>
                </ComposedChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="✦  Daily Time Distribution" subtitle="How your hours are split across pillars each day" T={T}>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={pillarStackData} margin={{ top:4, right:16, bottom:4, left:-10 }}>
                  <CartesianGrid stroke={T.gridLine} strokeDasharray="3 3"/>
                  <XAxis dataKey="label" tick={{ fill:T.textMuted, fontSize:10 }}/>
                  <YAxis tick={{ fill:T.textMuted, fontSize:10 }}/>
                  <Tooltip contentStyle={TT}/>
                  <Legend wrapperStyle={{ fontSize:11, color:T.textSub, paddingTop:8 }}/>
                  {PILLARS.map(p => <Bar key={p.id} dataKey={p.label} stackId="a" fill={p.color} opacity={0.85}/>)}
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
      }

      {/* ── Past reflections ── */}
      {Object.values(reflections).length > 0 && (
        <div style={{ marginTop:32 }}>
          <div style={{ fontSize:11, color:T.textMuted, letterSpacing:"0.15em", marginBottom:16 }}>WEEKLY REFLECTIONS</div>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {Object.values(reflections).sort((a,b) => b.weekStart.localeCompare(a.weekStart)).map(r => (
              <div key={r.weekStart} style={{ ...card_, padding:20 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                  <span style={{ fontSize:12, fontWeight:700, color:T.text }}>{formatWeekRange(r.weekStart)}</span>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:11, color:T.textSub }}>Week rating</span>
                    <div style={{ width:32, height:32, borderRadius:"50%", border:`2px solid ${T.navBorder}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:T.text }}>{r.overallRating}</div>
                  </div>
                </div>
                {r.text && <div style={{ fontSize:13, color:T.textMid, lineHeight:1.6, fontStyle:"italic" }}>"{r.text}"</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
