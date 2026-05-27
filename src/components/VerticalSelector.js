import { VERTICAL_LIST } from '../verticals';

export default function VerticalSelector({ activeVertical, onSelect, practiceCounts }) {
  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ marginBottom:'2rem' }}>
        <h1 style={{ fontSize:22, fontWeight:700, color:'var(--text)', letterSpacing:'-0.4px', marginBottom:6 }}>
          Choose your industry
        </h1>
        <p style={{ fontSize:14, color:'var(--text3)', lineHeight:1.6 }}>
          LeakLens adapts its benchmarks, terminology, and demo data to each practice type. Select the vertical you are working in.
        </p>
      </div>

      {/* Vertical cards grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'1rem', marginBottom:'2rem' }}>
        {VERTICAL_LIST.map(v => {
          const isActive  = activeVertical === v.id;
          const count     = practiceCounts?.[v.id] || 0;
          return (
            <button key={v.id} onClick={() => onSelect(v.id)}
              style={{
                background: isActive ? v.colorDim : 'var(--bg2)',
                border: `2px solid ${isActive ? v.color : 'var(--border)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s',
                boxShadow: isActive ? `0 0 0 3px ${v.color}22` : 'var(--shadow-sm)',
              }}>
              {/* Icon and label */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ fontSize:24 }}>{v.icon}</span>
                  <span style={{ fontSize:15, fontWeight:700, color: isActive ? v.color : 'var(--text)' }}>{v.label}</span>
                </div>
                {isActive && (
                  <span style={{ fontSize:10, fontWeight:700, background:v.color, color:'#fff', padding:'2px 8px', borderRadius:20 }}>
                    ACTIVE
                  </span>
                )}
              </div>

              {/* Description */}
              <p style={{ fontSize:12, color:'var(--text3)', lineHeight:1.6, marginBottom:12 }}>{v.description}</p>

              {/* Stats row */}
              <div style={{ display:'flex', gap:16, fontSize:11 }}>
                <div>
                  <span style={{ color:'var(--text3)' }}>Demo practices: </span>
                  <span style={{ fontWeight:600, color:v.color }}>{v.demoPractices.length}</span>
                </div>
                {count > 0 && (
                  <div>
                    <span style={{ color:'var(--text3)' }}>Your clients: </span>
                    <span style={{ fontWeight:600, color:'var(--text)' }}>{count}</span>
                  </div>
                )}
              </div>

              {/* Benchmark pills */}
              <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginTop:10 }}>
                {[
                  `No-show: ${(v.benchmarks.noShowRate*100).toFixed(0)}% threshold`,
                  `Avg: $${v.presets[0]?.avg}–$${v.presets[v.presets.length-1]?.avg}`,
                ].map(pill => (
                  <span key={pill} style={{ fontSize:10, background:'var(--bg3)', color:'var(--text3)', padding:'2px 8px', borderRadius:10, border:'0.5px solid var(--border)' }}>
                    {pill}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Coming soon note */}
      <div style={{ fontSize:12, color:'var(--text3)', textAlign:'center', padding:'1rem', background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius)', lineHeight:1.6 }}>
        More verticals coming soon — Mental Health, Veterinary, and more. Each vertical includes industry-specific benchmarks, demo practices, and average value presets calibrated to that market.
      </div>
    </div>
  );
}
