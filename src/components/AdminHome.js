import { useState } from 'react';
import { fmt } from '../engine';

const scoreColor = (s) => s >= 75 ? 'var(--teal)' : s >= 50 ? 'var(--amber)' : 'var(--red)';
const scoreLabel = (s) => s >= 75 ? 'Healthy' : s >= 50 ? 'Needs attention' : s >= 30 ? 'Critical' : 'Severe';

export default function AdminHome({ practices, setActivePracticeId, setPage, user }) {
  const [filter, setFilter] = useState('all');

  // Separate demos from real clients
  const demos   = practices.filter(p => p.id?.startsWith('demo'));
  const clients = practices.filter(p => !p.id?.startsWith('demo'));
  const allReal = clients; // only count real clients in business metrics

  // Business metrics
  const totalClients      = clients.length;
  const totalLeak         = clients.reduce((s, p) => s + (p.metrics?.totalLeak || 0), 0);
  const totalRecoverable  = clients.reduce((s, p) => s + (p.metrics?.totalLeak || 0) * 0.38, 0);
  const totalQueueItems   = clients.reduce((s, p) => s + (p.metrics?.recoveryQueue?.length || 0), 0);
  const avgScore          = clients.length > 0
    ? Math.round(clients.reduce((s, p) => s + (p.metrics?.leakScore || 0), 0) / clients.length)
    : 0;

  // Estimated MRR — placeholder until billing is tracked
  const estimatedMRR = clients.length * 497;

  const shown = filter === 'demos' ? demos : filter === 'clients' ? clients : [...clients, ...demos];

  function openPractice(id) {
    setActivePracticeId(id);
    setPage('dashboard');
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.4px' }}>
          Admin Home
        </h1>
        <p style={{ color: 'var(--text3)', fontSize: 13, marginTop: 4 }}>
          Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}. Here is your full book of business.
        </p>
      </div>

      {/* Business Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: '1.5rem' }}>
        <MetricCard label="Active clients" value={totalClients} sub="paying practices" color="teal" />
        <MetricCard label="Est. monthly MRR" value={fmt(estimatedMRR)} sub={`${totalClients} × $497`} color="teal" />
        <MetricCard label="Total leak across clients" value={fmt(totalLeak)} sub="combined monthly" color="red" />
        <MetricCard label="Total recoverable" value={fmt(totalRecoverable)} sub="across all clients" color="amber" />
        <MetricCard label="Open recovery items" value={totalQueueItems} sub="across all clients" color="blue" />
        <MetricCard label="Avg leak score" value={totalClients > 0 ? avgScore + '/100' : '—'} sub={totalClients > 0 ? scoreLabel(avgScore) : 'No clients yet'} color={totalClients > 0 ? (avgScore >= 75 ? 'teal' : avgScore >= 50 ? 'amber' : 'red') : 'text'} />
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '1rem' }}>
        {[['all','All practices'],['clients','Clients only'],['demos','Demo practices']].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            style={{ padding: '6px 14px', borderRadius: 20, border: `1px solid ${filter===val?'var(--teal)':'var(--border2)'}`,
              background: filter===val ? 'var(--teal-dim)' : 'transparent',
              color: filter===val ? 'var(--teal)' : 'var(--text2)', fontSize: 12, cursor: 'pointer', fontWeight: filter===val?600:400 }}>
            {label}
          </button>
        ))}
      </div>

      {/* No clients yet callout */}
      {clients.length === 0 && (
        <div style={{ background: 'var(--teal-dim)', border: '1px solid var(--teal-border)', borderRadius: 'var(--radius)', padding: '1.25rem 1.5rem', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--teal)', marginBottom: 6 }}>No real clients yet — demos shown below</div>
          <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>
            Click + Add practice in the sidebar to add your first real client. Upload their CSV data and the dashboard populates immediately. Business metrics above will update as clients are added.
          </div>
        </div>
      )}

      {/* Practice Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
        {shown.map(p => (
          <PracticeCard key={p.id} practice={p} onOpen={() => openPractice(p.id)} />
        ))}
      </div>

      {/* Upcoming actions */}
      {clients.length > 0 && (
        <div style={{ marginTop: '1.5rem', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text3)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Practices needing attention
          </div>
          {clients
            .filter(p => p.metrics?.leakScore < 60)
            .sort((a, b) => (a.metrics?.leakScore || 0) - (b.metrics?.leakScore || 0))
            .map(p => (
              <div key={p.id} onClick={() => openPractice(p.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0',
                  borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: scoreColor(p.metrics?.leakScore || 0), flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>{p.month} · {p.metrics?.recoveryQueue?.length || 0} queue items</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: scoreColor(p.metrics?.leakScore || 0), fontFamily: 'var(--mono)' }}>
                  {p.metrics?.leakScore || 0}/100
                </div>
                <div style={{ fontSize: 12, color: 'var(--text3)' }}>→</div>
              </div>
            ))}
          {clients.filter(p => (p.metrics?.leakScore || 0) < 60).length === 0 && (
            <div style={{ fontSize: 13, color: 'var(--text3)' }}>All clients scoring above 60. Great work.</div>
          )}
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value, sub, color }) {
  const colors = { red:'var(--red)', teal:'var(--teal)', amber:'var(--amber)', blue:'var(--blue)', text:'var(--text)' };
  return (
    <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'1rem' }}>
      <div style={{ fontSize:11, color:'var(--text3)', marginBottom:6 }}>{label}</div>
      <div style={{ fontSize:24, fontWeight:600, color: colors[color]||'var(--text)', fontFamily:'var(--mono)', letterSpacing:-0.5 }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:'var(--text3)', marginTop:4 }}>{sub}</div>}
    </div>
  );
}

function PracticeCard({ practice, onOpen }) {
  const m = practice.metrics;
  const isDemo = practice.id?.startsWith('demo');
  const score = m?.leakScore || 0;

  return (
    <div onClick={onOpen}
      style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)',
        padding:'1.25rem', cursor:'pointer', transition:'border-color 0.15s' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border2)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>

      {/* Practice header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'1rem' }}>
        <div>
          <div style={{ fontSize:14, fontWeight:600, color:'var(--text)', marginBottom:3 }}>{practice.name}</div>
          <div style={{ display:'flex', gap:6, alignItems:'center' }}>
            <span style={{ fontSize:11, color:'var(--text3)' }}>{practice.month}</span>
            <span style={{ background: isDemo ? 'rgba(79,142,247,0.12)' : 'var(--teal-dim)',
              color: isDemo ? 'var(--blue)' : 'var(--teal)',
              padding:'1px 6px', borderRadius:4, fontSize:9, fontWeight:700 }}>
              {isDemo ? 'DEMO' : 'CLIENT'}
            </span>
          </div>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:20, fontWeight:700, color:scoreColor(score), fontFamily:'var(--mono)' }}>{score}</div>
          <div style={{ fontSize:10, color:'var(--text3)' }}>leak score</div>
        </div>
      </div>

      {/* Score bar */}
      <div style={{ height:4, background:'var(--bg3)', borderRadius:999, overflow:'hidden', marginBottom:'1rem' }}>
        <div style={{ width:score+'%', height:'100%', background:scoreColor(score), borderRadius:999 }} />
      </div>

      {/* Key metrics */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:'1rem' }}>
        {[
          { label:'Total leak',    value: fmt(m?.totalLeak || 0),    color:'var(--red)' },
          { label:'Missed calls',  value: m?.missedCalls || 0,       color:'var(--text)' },
          { label:'No-shows',      value: m?.noShows || 0,           color:'var(--text)' },
        ].map(item => (
          <div key={item.label} style={{ background:'var(--bg3)', borderRadius:8, padding:'8px 10px' }}>
            <div style={{ fontSize:10, color:'var(--text3)', marginBottom:3 }}>{item.label}</div>
            <div style={{ fontSize:15, fontWeight:600, color:item.color, fontFamily:'var(--mono)' }}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* Recovery queue count */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', fontSize:12, color:'var(--text3)' }}>
        <span>{m?.recoveryQueue?.length || 0} recovery items open</span>
        <span style={{ color:'var(--teal)' }}>Open dashboard →</span>
      </div>
    </div>
  );
}
