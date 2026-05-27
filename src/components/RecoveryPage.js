import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { supabase } from '../supabase';
import { Card, CardTitle, Badge } from './UI';
import { Header } from './Dashboard';
import { fmt } from '../engine';

export default function RecoveryPage({ practice, metrics }) {
  const [sent,    setSent]    = useState({});
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('all'); // all | high | medium | low

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
    setSent(map);
    setLoading(false);
  }

  async function toggleSent(key, currentlySent) {
    const newSent = !currentlySent;
    setSent(d => ({ ...d, [key]: newSent }));
    await supabase
      .from('recovery_status')
      .upsert({ practice_id: practice.id, item_key: key, done: newSent }, { onConflict: 'practice_id,item_key' });
  }

  function itemKey(i, row) {
    return `${i}-${row?.name}-${row?.reason}`;
  }

  function exportCSV() {
    const queue = metrics.recoveryQueue || [];
    const rows = queue.map((item, i) => ({
      Priority:         item.priority || '',
      Time:             item.time || item.date || '',
      Type:             item.type || '',
      Reason:           item.reason || '',
      Action:           item.action || '',
      'Est. Value':     item.value ? `$${item.value}` : '',
      'Contacted?':     '',   // blank column for front desk to fill in
      'Result':         '',   // blank column for outcome
      'Notes':          '',   // blank column for free text
    }));

    const headers = Object.keys(rows[0]);
    const csvRows = [
      // Header row
      headers.join(','),
      // Practice info rows
      `Recovery List — ${practice?.name}`,
      `Reporting Month: ${practice?.month}`,
      `Generated: ${new Date().toLocaleDateString()}`,
      `Total items: ${queue.length}  |  High priority: ${queue.filter(r=>r.priority==='High').length}`,
      '',
      headers.join(','),
      ...rows.map(row => headers.map(h => {
        const val = String(row[h] || '').replace(/"/g, '""');
        return val.includes(',') ? `"${val}"` : val;
      }).join(','))
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `LeakLens-RecoveryList-${(practice?.name||'Practice').replace(/\s+/g,'-')}-${(practice?.month||'').replace(/\s+/g,'-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportPDF() {
    const doc  = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const W    = 210;
    const queue = metrics.recoveryQueue || [];

    const white=[255,255,255], sage=[90,122,74], sagedim=[236,243,231];
    const dark=[26,33,18], mid=[74,92,58], light=[138,154,120];
    const border=[226,230,218], pageBg=[247,248,245];
    const red=[192,57,43], amber=[176,125,42], blue=[46,110,166];

    // Page bg
    doc.setFillColor(...pageBg); doc.rect(0,0,W,297,'F');
    // Top bar
    doc.setFillColor(...sage); doc.rect(0,0,W,4,'F');
    // White header
    doc.setFillColor(...white); doc.rect(0,4,W,38,'F');

    // Logo
    doc.setFillColor(...sage); doc.roundedRect(15,10,16,16,2,2,'F');
    doc.setFontSize(9); doc.setFont('helvetica','bold'); doc.setTextColor(...white);
    doc.text('LL',23,20.5,{align:'center'});

    // Title
    doc.setFontSize(15); doc.setFont('helvetica','bold'); doc.setTextColor(...dark);
    doc.text('Recovery List',35,18);
    doc.setFontSize(8); doc.setFont('helvetica','normal'); doc.setTextColor(...light);
    doc.text('LeakLens · An Echolynk Product',35,24);

    // Practice info right
    doc.setFontSize(12); doc.setFont('helvetica','bold'); doc.setTextColor(...dark);
    doc.text(practice?.name||'',W-15,16,{align:'right'});
    doc.setFontSize(8); doc.setFont('helvetica','normal'); doc.setTextColor(...light);
    doc.text(`${practice?.month||''}  ·  Generated ${new Date().toLocaleDateString()}`,W-15,22,{align:'right'});

    // Divider
    doc.setDrawColor(...border); doc.setLineWidth(0.4);
    doc.line(15,42,W-15,42);

    // Summary row
    const high  = queue.filter(r=>r.priority==='High').length;
    const med   = queue.filter(r=>r.priority==='Medium').length;
    const low   = queue.filter(r=>r.priority==='Low').length;
    const total = queue.reduce((s,r) => s + (parseFloat(r.value)||0), 0);

    let y = 52;
    const kpis = [
      {label:'Total items',  value: String(queue.length), color: dark},
      {label:'High priority',value: String(high),          color: red},
      {label:'Total value',  value: fmt(total),            color: sage},
    ];
    const kw = (W-40)/3;
    kpis.forEach((k,i) => {
      const x = 15 + i*(kw+5);
      doc.setFillColor(...white); doc.setDrawColor(...border); doc.setLineWidth(0.3);
      doc.roundedRect(x,y,kw,18,2,2,'FD');
      doc.setFontSize(7); doc.setFont('helvetica','bold'); doc.setTextColor(...light);
      doc.text(k.label.toUpperCase(),x+5,y+7);
      doc.setFontSize(14); doc.setFont('helvetica','bold'); doc.setTextColor(...k.color);
      doc.text(k.value,x+5,y+15);
    });

    y += 26;

    // Instructions box
    doc.setFillColor(...sagedim); doc.setDrawColor(...border); doc.setLineWidth(0.3);
    doc.roundedRect(15,y,W-30,16,2,2,'FD');
    doc.setFillColor(...sage); doc.roundedRect(15,y,3,16,1,1,'F');
    doc.setFontSize(8); doc.setFont('helvetica','normal'); doc.setTextColor(...mid);
    doc.text('HOW TO USE THIS LIST:',22,y+6);
    doc.setFont('helvetica','normal');
    doc.text('Work High priority items first. Use your phone system to find the contact. Fill in Contacted? and Result columns. Return the completed list to your LeakLens contact.',22,y+12);
    y += 22;

    // Table
    doc.autoTable({
      startY: y,
      head: [['Priority','Time/Date','Type','Action Needed','Est. Value','Contacted?','Result']],
      body: queue.map(item => [
        item.priority || '',
        item.time || item.date || '',
        item.type || '',
        item.action || item.reason || '',
        item.value ? `$${item.value}` : '',
        '',
        '',
      ]),
      styles: {
        fontSize: 8,
        cellPadding: {top:4,right:4,bottom:4,left:4},
        textColor: mid,
        lineColor: border,
        lineWidth: 0.3,
        fillColor: white,
        overflow: 'linebreak',
      },
      headStyles: {
        fillColor: dark,
        textColor: [0,200,150],
        fontStyle: 'bold',
        fontSize: 7,
      },
      alternateRowStyles: { fillColor: pageBg },
      columnStyles: {
        0: { cellWidth: 18, fontStyle: 'bold',
             textColor: (data) => {
               const v = data?.cell?.raw;
               return v === 'High' ? red : v === 'Medium' ? amber : light;
             }
           },
        1: { cellWidth: 22 },
        2: { cellWidth: 30 },
        3: { cellWidth: 55 },
        4: { cellWidth: 20, halign: 'right', textColor: red, fontStyle: 'bold' },
        5: { cellWidth: 22 },
        6: { cellWidth: 23 },
      },
      margin: { left:15, right:15 },
      didParseCell: (data) => {
        if (data.column.index === 0 && data.section === 'body') {
          const v = data.cell.raw;
          data.cell.styles.textColor = v === 'High' ? red : v === 'Medium' ? amber : light;
          data.cell.styles.fontStyle = 'bold';
        }
      },
    });

    // Footer
    doc.setFillColor(...white); doc.rect(0,280,W,17,'F');
    doc.setDrawColor(...border); doc.setLineWidth(0.3); doc.line(0,280,W,280);
    doc.setFontSize(8); doc.setFont('helvetica','normal'); doc.setTextColor(...light);
    doc.text('LeakLens  ·  An Echolynk Product  ·  hello@leaklens.cloud',15,290);
    doc.text(new Date().toLocaleDateString(),W-15,290,{align:'right'});

    doc.save(`LeakLens-RecoveryList-${(practice?.name||'Practice').replace(/\s+/g,'-')}-${(practice?.month||'').replace(/\s+/g,'-')}.pdf`);
  }

  if (!metrics) return null;
  const queue = metrics.recoveryQueue || [];

  const filtered = filter === 'all' ? queue : queue.filter(r => r.priority?.toLowerCase() === filter);
  const sentCount = queue.filter((_,i) => sent[itemKey(i, queue[i])]).length;
  const openCount = queue.length - sentCount;
  const highCount = queue.filter(r => r.priority === 'High').length;

  return (
    <div className="fade-in">
      <Header
        title="Recovery queue"
        sub={`${practice?.name} · ${practice?.month}`}
        action={
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <button onClick={exportCSV} style={B.exportBtn}>↓ CSV</button>
            <button onClick={exportPDF} style={B.exportBtn}>↓ PDF</button>
          </div>
        }
      />

      {/* Summary cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:'1.25rem' }}>
        {[
          { label:'Total items',   value: queue.length,   color:'var(--text)'  },
          { label:'High priority', value: highCount,       color:'var(--red)'   },
          { label:'Sent to practice', value: sentCount,   color:'var(--teal)'  },
          { label:'Still open',    value: openCount,       color:'var(--amber)' },
        ].map(c => (
          <div key={c.label} style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'0.875rem 1rem' }}>
            <div style={{ fontSize:11, color:'var(--text3)', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.04em' }}>{c.label}</div>
            <div style={{ fontSize:22, fontWeight:700, color:c.color, fontFamily:'var(--mono)' }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* How to use callout */}
      <div style={{ background:'var(--teal-dim)', border:'1px solid var(--teal-border)', borderRadius:'var(--radius)', padding:'0.875rem 1rem', marginBottom:'1.25rem', fontSize:13, color:'var(--text2)', lineHeight:1.6 }}>
        <strong style={{ color:'var(--teal)' }}>How to use this list.</strong> Export as PDF or CSV to send to the practice. The exported list includes blank Contacted? and Result columns the front desk fills in manually using their phone system to look up contact info. Mark items as Sent below to track which lists you have delivered.
      </div>

      {loading ? (
        <div style={{ color:'var(--text3)', padding:'2rem', textAlign:'center' }}>Loading…</div>
      ) : queue.length === 0 ? (
        <div style={{ color:'var(--text3)', padding:'2rem', textAlign:'center' }}>No recovery items. Upload call, appointment, or lead data to generate the queue.</div>
      ) : (
        <>
          {/* Filter tabs */}
          <div style={{ display:'flex', gap:8, marginBottom:'1rem' }}>
            {[['all','All'],['high','High only'],['medium','Medium'],['low','Low']].map(([val,label]) => (
              <button key={val} onClick={() => setFilter(val)}
                style={{ padding:'5px 14px', borderRadius:20, border:`1px solid ${filter===val?'var(--teal)':'var(--border2)'}`,
                  background: filter===val ? 'var(--teal-dim)' : 'transparent',
                  color: filter===val ? 'var(--teal)' : 'var(--text2)', fontSize:12, cursor:'pointer', fontWeight: filter===val?600:400 }}>
                {label}
              </button>
            ))}
          </div>

          <Card>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem' }}>
              <CardTitle>Recovery items ({filtered.length})</CardTitle>
              <div style={{ fontSize:12, color:'var(--text3)' }}>Mark Sent when you export and deliver this list to the practice</div>
            </div>
            <div style={{ overflowX:'auto' }}>
              <table style={T.table}>
                <thead>
                  <tr>
                    {['Priority','Time / Date','Type','Action Needed','Est. Value','Sent to Practice'].map(h => (
                      <th key={h} style={T.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item, idx) => {
                    const origIdx = queue.indexOf(item);
                    const key     = itemKey(origIdx, item);
                    const isSent  = !!sent[key];
                    return (
                      <tr key={key} style={{ ...T.tr, opacity: isSent ? 0.55 : 1 }}>
                        <td style={T.td}>
                          <Badge type={item.priority?.toLowerCase()}>{item.priority}</Badge>
                        </td>
                        <td style={{ ...T.td, color:'var(--text3)', fontFamily:'var(--mono)', fontSize:12 }}>
                          {item.time || item.date || '—'}
                        </td>
                        <td style={{ ...T.td, color:'var(--text)', fontWeight:500 }}>
                          {item.type || '—'}
                        </td>
                        <td style={{ ...T.td, color:'var(--text2)', maxWidth:280 }}>
                          {item.action || item.reason || '—'}
                        </td>
                        <td style={{ ...T.td, color:'var(--red)', fontFamily:'var(--mono)', fontWeight:700 }}>
                          {item.value ? `$${item.value}` : '—'}
                        </td>
                        <td style={T.td}>
                          <button onClick={() => toggleSent(key, isSent)}
                            style={{ ...T.btn, ...(isSent ? T.btnSent : {}) }}>
                            {isSent ? '✓ Sent' : 'Mark sent'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

const B = {
  exportBtn: { padding:'7px 14px', borderRadius:7, border:'1px solid var(--border2)', background:'var(--bg2)', color:'var(--teal)', fontSize:12, fontWeight:600, cursor:'pointer' },
};

const T = {
  table: { width:'100%', borderCollapse:'collapse', fontSize:13 },
  th:    { textAlign:'left', padding:'8px 10px', color:'var(--text3)', borderBottom:'1px solid var(--border)', fontWeight:500, fontSize:10, letterSpacing:'0.06em', textTransform:'uppercase' },
  tr:    { borderBottom:'1px solid var(--border)' },
  td:    { padding:'10px 10px', color:'var(--text2)', verticalAlign:'middle' },
  btn:   { padding:'5px 12px', borderRadius:6, border:'1px solid var(--border2)', background:'transparent', color:'var(--teal)', fontSize:11, cursor:'pointer', fontWeight:500 },
  btnSent: { background:'var(--teal-dim)', borderColor:'var(--teal-border)', color:'var(--teal)' },
};
