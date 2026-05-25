import { Card, CardTitle, InsightBox } from './UI';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Header } from './Dashboard';

export default function ProvidersPage({ practice, metrics }) {
  if (!metrics?.providers?.length) return (
    <div className="fade-in">
      <Header title="Providers" sub={practice?.name} />
      <div style={{color:'var(--text3)',fontSize:14}}>No appointment data yet. Upload an appointments CSV to see provider stats.</div>
    </div>
  );

  const { providers } = metrics;
  const top = [...providers].sort((a,b)=>b.utilization-a.utilization)[0];

  return (
    <div className="fade-in">
      <Header title="Providers" sub={`${practice?.name} · ${practice?.month}`} />

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:12,marginBottom:'1.25rem'}}>
        {providers.map(p=>(
          <div key={p.name} style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'var(--radius-lg)',padding:'1.25rem'}}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:'1rem'}}>
              <div style={S.avatar}>{p.name.split(' ').filter(Boolean).map(w=>w[0]).join('').slice(0,2)}</div>
              <div>
                <div style={{fontWeight:500,color:'var(--text)',fontSize:14}}>{p.name}</div>
                <div style={{fontSize:11,color:'var(--text3)'}}>{p.total} appointments</div>
              </div>
            </div>
            <StatBar label="Utilization" value={p.utilization+'%'} pct={p.utilization} color={p.utilization>=85?'var(--teal)':p.utilization>=65?'var(--amber)':'var(--red)'} />
            <StatBar label="No-shows"    value={p.noShows}         pct={p.noShowRate}   color="var(--red)" />
            <StatBar label="Completed"   value={p.completed}       pct={p.total>0?Math.round(p.completed/p.total*100):0} color="var(--teal)" />
          </div>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.25rem'}}>
        <Card>
          <CardTitle>Utilization by provider</CardTitle>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={providers.map(p=>({name:p.name.replace('Dr. ',''),value:p.utilization,color:p.utilization>=85?'var(--teal)':p.utilization>=65?'var(--amber)':'var(--red)'}))} barSize={32}>
              <XAxis dataKey="name" tick={{fill:'var(--text3)',fontSize:11}} axisLine={false} tickLine={false} />
              <YAxis tick={{fill:'var(--text3)',fontSize:11}} axisLine={false} tickLine={false} domain={[0,100]} tickFormatter={v=>v+'%'} />
              <Tooltip formatter={v=>[v+'%','Utilization']} contentStyle={{background:'var(--bg3)',border:'1px solid var(--border2)',borderRadius:8,fontSize:12}} cursor={{fill:'rgba(255,255,255,0.03)'}} />
              <Bar dataKey="value" radius={[5,5,0,0]}>
                {providers.map((p,i)=><Cell key={i} fill={p.utilization>=85?'var(--teal)':p.utilization>=65?'var(--amber)':'var(--red)'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <CardTitle>No-shows by provider</CardTitle>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={providers.map(p=>({name:p.name.replace('Dr. ',''),value:p.noShows}))} barSize={32}>
              <XAxis dataKey="name" tick={{fill:'var(--text3)',fontSize:11}} axisLine={false} tickLine={false} />
              <YAxis tick={{fill:'var(--text3)',fontSize:11}} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip formatter={v=>[v,'No-shows']} contentStyle={{background:'var(--bg3)',border:'1px solid var(--border2)',borderRadius:8,fontSize:12}} cursor={{fill:'rgba(255,255,255,0.03)'}} />
              <Bar dataKey="value" fill="var(--red)" radius={[5,5,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <InsightBox>
        {top ? `${top.name} leads with ${top.utilization}% utilization. Review scheduling patterns for providers below 75% to identify slot optimization opportunities.` : ''}
      </InsightBox>
    </div>
  );
}

function StatBar({ label, value, pct, color }) {
  return (
    <div style={{marginBottom:10}}>
      <div style={{display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:3}}>
        <span style={{color:'var(--text3)'}}>{label}</span>
        <span style={{color,fontWeight:500,fontFamily:'var(--mono)'}}>{value}</span>
      </div>
      <div style={{height:4,background:'var(--bg3)',borderRadius:999,overflow:'hidden'}}>
        <div style={{width:Math.min(pct,100)+'%',height:'100%',background:color,borderRadius:999}} />
      </div>
    </div>
  );
}

const S = {
  avatar:{width:36,height:36,borderRadius:'50%',background:'var(--blue-dim)',color:'var(--blue)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:600,flexShrink:0},
};
