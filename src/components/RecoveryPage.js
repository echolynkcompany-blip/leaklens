import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Card, CardTitle, Badge } from './UI';
import { Header } from './Dashboard';

export default function RecoveryPage({ practice, metrics }) {
  const [done, setDone] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!practice?.id) return;
    loadStatus();
  }, [practice?.id]);

  async function loadStatus() {
    setLoading(true);
    const { data } = await supabase
      .from('recovery_status')
      .select('item_key, done')
      .eq('practice_id', practice.id);
    const map = {};
    (data || []).forEach(r => { if (r.done) map[r.item_key] = true; });
    setDone(map);
    setLoading(false);
  }

  async function toggleDone(key, currentlyDone) {
    const newDone = !currentlyDone;
    setDone(d => ({ ...d, [key]: newDone }));

    await supabase
      .from('recovery_status')
      .upsert({ practice_id: practice.id, item_key: key, done: newDone }, { onConflict: 'practice_id,item_key' });
  }

  if (!metrics) return null;
  const queue = metrics.recoveryQueue;
  const openCount = queue.filter((_,i) => !done[itemKey(i,queue[i])]).length;
  const doneCount = queue.length - openCount;

  return (
    <div className="fade-in">
      <Header
        title="Recovery queue"
        sub={`${practice?.name} · ${practice?.month}`}
        action={
          <div style={{display:'flex',gap:16,fontSize:13,color:'var(--text3)'}}>
            <span><span style={{color:'var(--red)',fontWeight:600}}>{openCount}</span> open</span>
            <span><span style={{color:'var(--teal)',fontWeight:600}}>{doneCount}</span> done</span>
          </div>
        }
      />

      {loading ? (
        <div style={{color:'var(--text3)',padding:'2rem',textAlign:'center'}}>Loading…</div>
      ) : queue.length === 0 ? (
        <div style={{color:'var(--text3)',padding:'2rem',textAlign:'center'}}>No recovery items. Upload call, appointment, or lead data to generate the queue.</div>
      ) : (
        <>
          {openCount === 0 && <div style={{textAlign:'center',padding:'2rem',color:'var(--teal)',fontSize:15,fontWeight:500}}>🎉 All items cleared! Great work.</div>}

          {openCount > 0 && (
            <Card>
              <CardTitle>Open items ({openCount})</CardTitle>
              <QueueTable rows={queue.filter((_,i)=>!done[itemKey(i,queue[i])])} indexMap={queue.map((r,i)=>({r,i}))} done={done} onToggle={toggleDone} showDone={false} queue={queue} />
            </Card>
          )}

          {doneCount > 0 && (
            <Card style={{opacity:0.6}}>
              <CardTitle>Completed ({doneCount})</CardTitle>
              <QueueTable rows={queue.filter((_,i)=>done[itemKey(i,queue[i])])} indexMap={queue.map((r,i)=>({r,i}))} done={done} onToggle={toggleDone} showDone queue={queue} />
            </Card>
          )}
        </>
      )}
    </div>
  );
}

function itemKey(i, row) {
  return `${i}-${row?.name}-${row?.reason}`;
}

function QueueTable({ queue, done, onToggle }) {
  return (
    <div style={{overflowX:'auto'}}>
      <table style={T.table}>
        <thead>
          <tr>{['Patient','Phone','Reason','Priority','Action',''].map(h=><th key={h} style={T.th}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {queue.map((item,i) => {
            const key = itemKey(i, item);
            const isDone = done[key];
            return (
              <tr key={key} style={{...T.tr, opacity:isDone?0.5:1, textDecoration:isDone?'line-through':'none'}}>
                <td style={{...T.td,fontWeight:500,color:'var(--text)'}}>{item.name}</td>
                <td style={{...T.td,color:'var(--text3)',fontFamily:'var(--mono)',fontSize:12}}>{item.phone||'—'}</td>
                <td style={T.td}>{item.reason}</td>
                <td style={T.td}><Badge type={isDone?'done':item.priority}>{isDone?'Done':item.priority}</Badge></td>
                <td style={{...T.td,color:'var(--text2)'}}>{item.action}</td>
                <td style={T.td}>
                  <button onClick={()=>onToggle(key,isDone)} style={T.btn}>{isDone?'Undo':'Mark done'}</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const T = {
  table:{width:'100%',borderCollapse:'collapse',fontSize:13},
  th:{textAlign:'left',padding:'8px 10px',color:'var(--text3)',borderBottom:'1px solid var(--border)',fontWeight:500,fontSize:10,letterSpacing:'0.06em',textTransform:'uppercase'},
  tr:{borderBottom:'1px solid var(--border)'},
  td:{padding:'10px 10px',color:'var(--text2)',verticalAlign:'middle'},
  btn:{padding:'4px 10px',borderRadius:6,border:'1px solid var(--border2)',background:'transparent',color:'var(--teal)',fontSize:11,cursor:'pointer',fontFamily:'var(--font)'},
};
