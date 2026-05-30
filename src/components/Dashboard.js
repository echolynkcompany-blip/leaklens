import { MetricCard, Card, CardTitle, LeakBarChart, TrendLineChart, ScoreGauge, InsightBox } from './UI';
import { fmt, pct } from '../engine';

const TREND = [
  {month:'Jan',amount:9400},{month:'Feb',amount:10200},{month:'Mar',amount:11800},{month:'Apr',amount:10900},{month:'May',amount:12100},
];

export default function Dashboard({ practice, metrics, setPage }) {
  if (!practice || !metrics) return <Empty />;

  const leakData = [
    {name:'Missed calls', amount:metrics.missedCallLeak, color:'var(--red)'},
    {name:'No-shows',     amount:metrics.noShowLeak,     color:'var(--amber)'},
    {name:'Cancellations',amount:metrics.cancellationLeak,color:'var(--purple)'},
    {name:'Unbooked leads',amount:metrics.unbookedLeadLeak,color:'var(--blue)'},
  ];
  const trend = (practice.trend && practice.trend.length > 1) ? practice.trend : (practice.name === 'Sunrise Dental Studio' ? TREND : [{month: practice.month || 'Current', amount: metrics.totalLeak}]);

  return (
    <div className="fade-in">
      <Header title="Overview" sub={`${practice.name} · ${practice.month}`} />
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:12,marginBottom:'1.25rem'}}>
        <MetricCard label="Total estimated leak" value={fmt(metrics.totalLeak)} color="red" />
        <MetricCard label="Leak score" value={metrics.leakScore+'/100'} color={metrics.leakScore>=75?'teal':metrics.leakScore>=50?'amber':'red'} />
        <MetricCard label="Missed calls" value={metrics.missedCalls} color="blue" sub={pct(metrics.missedCallRate)+' rate'} />
        <MetricCard label="No-shows" value={metrics.noShows} color="blue" sub={pct(metrics.noShowRate)+' rate'} />
        <MetricCard label="Cancellations" value={metrics.canceled} color="blue" sub={pct(metrics.cancellationRate)+' rate'} />
        <MetricCard label="Unbooked leads" value={metrics.unbookedLeads} color="blue" sub={metrics.totalLeads+' total'} />
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1.4fr 1fr',gap:'1.25rem',marginBottom:'1.25rem'}}>
        <Card><CardTitle>Leak breakdown</CardTitle><LeakBarChart data={leakData} /></Card>
        <Card>
          <CardTitle>Leak score</CardTitle>
          <ScoreGauge score={metrics.leakScore} />
          <div style={{fontSize:13,color:'var(--text3)',lineHeight:1.6,marginTop:'0.5rem'}}>
            Recovery queue has <span style={{color:'var(--text)',fontWeight:500}}>{metrics.recoveryQueue.length} open items</span>.{' '}
            <span style={{color:'var(--teal)',cursor:'pointer'}} onClick={()=>setPage('recovery')}>View queue →</span>
          </div>
        </Card>
      </div>
      <Card><CardTitle>Monthly leak trend</CardTitle><TrendLineChart data={trend} /></Card>
      <InsightBox>
        {metrics.missedCalls > 0
          ? `${metrics.missedCalls} missed calls this period = ${fmt(metrics.missedCallLeak)} in potential lost revenue. After-hours text-back is the fastest single recovery action.`
          : `No missed calls detected. Focus on no-show recovery — ${metrics.noShows} patients need rebooking outreach.`}
      </InsightBox>
    </div>
  );
}

function Empty() {
  return <div style={{color:'var(--text3)',padding:'2rem'}}>Select or add a practice to get started.</div>;
}

export function Header({ title, sub, action }) {
  return (
    <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:'1.5rem'}}>
      <div>
        <h1 style={{fontSize:20,fontWeight:600,color:'var(--text)',letterSpacing:'-0.4px'}}>{title}</h1>
        {sub && <p style={{color:'var(--text3)',fontSize:13,marginTop:3}}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}
