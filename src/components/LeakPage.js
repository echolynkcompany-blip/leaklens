import { Card, CardTitle, InsightBox, Divider } from './UI';
import { fmt, pct } from '../engine';
import { Header } from './Dashboard';

export default function LeakPage({ practice, metrics }) {
  if (!metrics) return null;

  const leaks = [
    { label:'Missed calls',         icon:'◌', color:'var(--red)',    dim:'var(--red-dim)',    amount:metrics.missedCallLeak,    desc:`${metrics.missedCalls} unanswered · ${pct(metrics.missedCallRate)} rate` },
    { label:'No-shows',             icon:'◇', color:'var(--amber)',  dim:'var(--amber-dim)',  amount:metrics.noShowLeak,        desc:`${metrics.noShows} patients · ${pct(metrics.noShowRate)} rate` },
    { label:'Unfilled cancellations',icon:'◈', color:'var(--purple)',dim:'var(--purple-dim)', amount:metrics.cancellationLeak,  desc:`${metrics.canceled} slots · ${pct(metrics.cancellationRate)} rate` },
    { label:'Unbooked leads',       icon:'◉', color:'var(--blue)',   dim:'var(--blue-dim)',   amount:metrics.unbookedLeadLeak,  desc:`${metrics.unbookedLeads} unconverted · ${pct(metrics.unbookedLeadRate)} rate` },
  ];

  return (
    <div className="fade-in">
      <Header title="Revenue leaks" sub={`${practice?.name} · ${practice?.month}`} />

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:'1.25rem'}}>
        {leaks.map(l => (
          <div key={l.label} style={{background:l.dim,border:`1px solid ${l.color}28`,borderRadius:'var(--radius)',padding:'1rem'}}>
            <div style={{fontSize:10,fontWeight:600,color:l.color,letterSpacing:'0.07em',textTransform:'uppercase',marginBottom:6}}>{l.label}</div>
            <div style={{fontSize:24,fontWeight:600,color:l.color,fontFamily:'var(--mono)'}}>{fmt(l.amount)}</div>
          </div>
        ))}
      </div>

      <Card>
        <CardTitle>Active leaks</CardTitle>
        {leaks.map((l,i) => (
          <div key={l.label}>
            <div style={{display:'flex',alignItems:'center',gap:12,padding:'0.875rem 0'}}>
              <div style={{width:36,height:36,borderRadius:8,background:l.dim,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,color:l.color,flexShrink:0}}>{l.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:500,color:'var(--text)'}}>{l.label}</div>
                <div style={{fontSize:12,color:'var(--text3)',marginTop:2}}>{l.desc}</div>
              </div>
              <div style={{fontSize:16,fontWeight:600,color:l.color,fontFamily:'var(--mono)'}}>{fmt(l.amount)}</div>
            </div>
            {i < leaks.length-1 && <Divider />}
          </div>
        ))}
      </Card>

      <Card>
        <CardTitle>Total estimated leak</CardTitle>
        <div style={{display:'flex',alignItems:'baseline',gap:10}}>
          <div style={{fontSize:40,fontWeight:600,color:'var(--red)',fontFamily:'var(--mono)'}}>{fmt(metrics.totalLeak)}</div>
          <div style={{fontSize:13,color:'var(--text3)'}}>per month</div>
        </div>
        <p style={{fontSize:13,color:'var(--text2)',marginTop:'0.75rem',lineHeight:1.65}}>
          Based on data reviewed, this practice may be losing approximately <strong style={{color:'var(--text)'}}>{fmt(metrics.totalLeak)} per month</strong>. The recovery queue identifies <strong style={{color:'var(--teal)'}}>{fmt(metrics.totalLeak * 0.7)}</strong> as immediately actionable.
        </p>
      </Card>

      <InsightBox>
        {metrics.missedCallLeak >= metrics.noShowLeak
          ? `Missed calls are your biggest leak at ${fmt(metrics.missedCallLeak)}/mo. An after-hours text-back could recover ~${fmt(metrics.missedCallLeak * 0.3)}/mo based on industry rebooking rates.`
          : `No-shows are your biggest leak at ${fmt(metrics.noShowLeak)}/mo. Same-day confirmation calls reduce no-show rates by up to 40% on average.`}
      </InsightBox>
    </div>
  );
}
