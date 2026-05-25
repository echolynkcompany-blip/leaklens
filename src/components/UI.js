import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { fmt } from '../engine';

export function MetricCard({ label, value, color, sub }) {
  const c = { red:'var(--red)', teal:'var(--teal)', amber:'var(--amber)', blue:'var(--blue)', text:'var(--text)' };
  return (
    <div style={S.metricCard}>
      <div style={S.metricLabel}>{label}</div>
      <div style={{ ...S.metricVal, color: c[color] || 'var(--text)' }}>{value}</div>
      {sub && <div style={S.metricSub}>{sub}</div>}
    </div>
  );
}

export function Card({ children, style }) {
  return <div style={{ ...S.card, ...style }}>{children}</div>;
}

export function CardTitle({ children }) {
  return <div style={S.cardTitle}>{children}</div>;
}

export function Badge({ children, type }) {
  const m = { high:{bg:'var(--red-dim)',c:'var(--red)'}, medium:{bg:'var(--amber-dim)',c:'var(--amber)'}, low:{bg:'rgba(255,255,255,0.05)',c:'var(--text3)'}, done:{bg:'var(--teal-dim)',c:'var(--teal)'} };
  const t = m[(type||'').toLowerCase()] || m.low;
  return <span style={{ display:'inline-block', padding:'3px 8px', borderRadius:5, fontSize:11, fontWeight:500, background:t.bg, color:t.c }}>{children}</span>;
}

export function Divider() {
  return <div style={{ height:1, background:'var(--border)', margin:'1rem 0' }} />;
}

export function InsightBox({ children }) {
  return (
    <div style={{ background:'var(--blue-dim)', border:'1px solid rgba(79,142,247,0.18)', borderRadius:'var(--radius)', padding:'0.875rem 1rem', marginTop:'1rem' }}>
      <div style={{ fontSize:10, fontWeight:600, color:'var(--blue)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:5 }}>✦ AI Insight</div>
      <div style={{ fontSize:13, color:'var(--text2)', lineHeight:1.65 }}>{children}</div>
    </div>
  );
}

export function LeakBarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barSize={28}>
        <XAxis dataKey="name" tick={{ fill:'var(--text3)', fontSize:11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill:'var(--text3)', fontSize:11 }} axisLine={false} tickLine={false} tickFormatter={v=>'$'+(v/1000).toFixed(0)+'k'} />
        <Tooltip formatter={v=>[fmt(v),'Leak']} contentStyle={{ background:'var(--bg3)', border:'1px solid var(--border2)', borderRadius:8, fontSize:12 }} cursor={{ fill:'rgba(255,255,255,0.03)' }} />
        <Bar dataKey="amount" radius={[5,5,0,0]}>
          {data.map((d,i) => <Cell key={i} fill={d.color} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function TrendLineChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <LineChart data={data}>
        <XAxis dataKey="month" tick={{ fill:'var(--text3)', fontSize:11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill:'var(--text3)', fontSize:11 }} axisLine={false} tickLine={false} tickFormatter={v=>'$'+(v/1000).toFixed(0)+'k'} />
        <Tooltip formatter={v=>[fmt(v),'Total leak']} contentStyle={{ background:'var(--bg3)', border:'1px solid var(--border2)', borderRadius:8, fontSize:12 }} />
        <Line type="monotone" dataKey="amount" stroke="var(--red)" strokeWidth={2} dot={{ fill:'var(--red)', r:4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function ScoreGauge({ score }) {
  const color = score >= 75 ? 'var(--teal)' : score >= 50 ? 'var(--amber)' : 'var(--red)';
  const label = score >= 75 ? 'Healthy' : score >= 50 ? 'Needs attention' : 'Critical';
  return (
    <div style={{ textAlign:'center', padding:'0.75rem 0' }}>
      <div style={{ fontSize:52, fontWeight:600, color, fontFamily:'var(--mono)', letterSpacing:-2 }}>{score}</div>
      <div style={{ fontSize:12, color:'var(--text3)', marginTop:2 }}>out of 100 — {label}</div>
      <div style={{ height:6, background:'var(--bg3)', borderRadius:999, margin:'0.875rem 0 0.4rem', overflow:'hidden' }}>
        <div style={{ width:score+'%', height:'100%', background:color, borderRadius:999, transition:'width 1s ease' }} />
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, color:'var(--text3)' }}>
        <span>Critical</span><span>Healthy</span>
      </div>
    </div>
  );
}

const S = {
  metricCard: { background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'1rem' },
  metricLabel: { fontSize:11, color:'var(--text3)', marginBottom:6 },
  metricVal: { fontSize:26, fontWeight:600, fontFamily:'var(--mono)', letterSpacing:-0.5 },
  metricSub: { fontSize:11, color:'var(--text3)', marginTop:4 },
  card: { background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', padding:'1.25rem', marginBottom:'1.25rem' },
  cardTitle: { fontSize:12, fontWeight:500, color:'var(--text3)', marginBottom:'1rem', letterSpacing:'0.02em', textTransform:'uppercase' },
};
