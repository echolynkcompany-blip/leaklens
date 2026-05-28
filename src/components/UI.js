import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { fmt } from '../engine';

export function MetricCard({ label, value, color, sub }) {
  const colors = {
    red:   'var(--red)',
    teal:  'var(--teal)',
    amber: 'var(--amber)',
    blue:  'var(--blue)',
    text:  'var(--text)',
  };
  return (
    <div style={S.metricCard}>
      <div style={S.metricLabel}>{label}</div>
      <div style={{ ...S.metricVal, color: colors[color] || 'var(--text)' }}>{value}</div>
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
  const m = {
    high:   { bg:'var(--red-dim)',    c:'var(--red)'   },
    medium: { bg:'var(--amber-dim)',  c:'var(--amber)' },
    low:    { bg:'var(--bg3)',        c:'var(--text3)' },
    done:   { bg:'var(--teal-dim)',   c:'var(--teal)'  },
  };
  const t = m[(type||'').toLowerCase()] || m.low;
  return (
    <span style={{ display:'inline-block', padding:'3px 8px', borderRadius:5, fontSize:11,
      fontWeight:600, background:t.bg, color:t.c }}>
      {children}
    </span>
  );
}

export function Divider() {
  return <div style={{ height:1, background:'var(--border)', margin:'1rem 0' }} />;
}

export function InsightBox({ children }) {
  return (
    <div style={{ background:'var(--teal-dim)', border:'1px solid var(--teal-border)',
      borderRadius:'var(--radius)', padding:'0.875rem 1rem', marginTop:'1rem' }}>
      <div style={{ fontSize:10, fontWeight:700, color:'var(--teal)', letterSpacing:'0.1em',
        textTransform:'uppercase', marginBottom:5 }}>✦ AI Insight</div>
      <div style={{ fontSize:13, color:'var(--text2)', lineHeight:1.65 }}>{children}</div>
    </div>
  );
}

export function LeakBarChart({ data }) {
  const chartColors = ['var(--chart-red)','var(--chart-amber)','var(--chart-purple)','var(--chart-blue)'];
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barSize={32}>
        <XAxis dataKey="name" tick={{ fill:'var(--text3)', fontSize:11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill:'var(--text3)', fontSize:11 }} axisLine={false} tickLine={false}
          tickFormatter={v => '$'+(v/1000).toFixed(0)+'k'} />
        <Tooltip
          formatter={v => [fmt(v), 'Leak']}
          contentStyle={{ background:'var(--bg2)', border:'1px solid var(--border)',
            borderRadius:8, fontSize:12, boxShadow:'var(--shadow)', color:'var(--text)' }}
          cursor={{ fill:'rgba(29,158,117,0.08)' }}
        />
        <Bar dataKey="amount" radius={[6,6,0,0]}>
          {data.map((d, i) => <Cell key={i} fill={chartColors[i % chartColors.length]} />)}
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
        <YAxis tick={{ fill:'var(--text3)', fontSize:11 }} axisLine={false} tickLine={false}
          tickFormatter={v => '$'+(v/1000).toFixed(0)+'k'} />
        <Tooltip
          formatter={v => [fmt(v), 'Total leak']}
          contentStyle={{ background:'var(--bg2)', border:'1px solid var(--border)',
            borderRadius:8, fontSize:12, boxShadow:'var(--shadow)', color:'var(--text)' }}
        />
        <Line type="monotone" dataKey="amount" stroke="var(--teal)" strokeWidth={2.5}
          dot={{ fill:'var(--teal)', r:4, strokeWidth:0 }} activeDot={{ r:6 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function ScoreGauge({ score }) {
  const color = score >= 75 ? 'var(--teal)' : score >= 50 ? 'var(--amber)' : 'var(--red)';
  const label = score >= 75 ? 'Healthy' : score >= 50 ? 'Needs attention' : 'Critical';
  return (
    <div style={{ textAlign:'center', padding:'0.75rem 0' }}>
      <div style={{ fontSize:52, fontWeight:700, color, fontFamily:'var(--mono)', letterSpacing:-2 }}>
        {score}
      </div>
      <div style={{ fontSize:12, color:'var(--text3)', marginTop:2 }}>out of 100 — {label}</div>
      <div style={{ height:8, background:'var(--bg3)', borderRadius:999, margin:'0.875rem 0 0.4rem',
        overflow:'hidden', border:'1px solid var(--border)' }}>
        <div style={{ width:score+'%', height:'100%', background:color, borderRadius:999,
          transition:'width 1s ease' }} />
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, color:'var(--text3)' }}>
        <span>Critical</span><span>Healthy</span>
      </div>
    </div>
  );
}

const S = {
  metricCard: {
    background: 'var(--bg2)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '1rem 1.25rem',
    boxShadow: 'var(--shadow-sm)',
  },
  metricLabel: { fontSize:11, fontWeight:600, color:'var(--text3)', marginBottom:8, letterSpacing:'0.04em', textTransform:'uppercase' },
  metricVal:   { fontSize:26, fontWeight:700, fontFamily:'var(--mono)', letterSpacing:-0.5, lineHeight:1 },
  metricSub:   { fontSize:11, color:'var(--text3)', marginTop:6 },
  card: {
    background: 'var(--bg2)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '1.25rem',
    marginBottom: '1.25rem',
    boxShadow: 'var(--shadow-sm)',
  },
  cardTitle: {
    fontSize:11, fontWeight:700, color:'var(--text3)', marginBottom:'1rem',
    letterSpacing:'0.08em', textTransform:'uppercase',
  },
};
