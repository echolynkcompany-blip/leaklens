import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Card, CardTitle, Divider } from './UI';
import { fmt, pct } from '../engine';
import { Header } from './Dashboard';

export default function ReportPage({ practice, metrics }) {
  if (!practice || !metrics) return null;

  function exportPDF() {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const W = 210;
    const gray  = [120, 130, 145];
    const dark  = [16,  19,  26];
    const teal  = [0,   200, 150];
    const red   = [245, 83,  77];
    const amber = [245, 166, 35];
    const blue  = [79,  142, 247];

    // Background
    doc.setFillColor(...dark);
    doc.rect(0, 0, W, 297, 'F');

    // Top accent bar
    doc.setFillColor(...teal);
    doc.rect(0, 0, W, 3, 'F');

    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(238, 240, 244);
    doc.text('LeakLens', 20, 20);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...gray);
    doc.text('Revenue Intelligence Report — An Echolynk Product', 20, 27);

    // Practice name + month
    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(238, 240, 244);
    doc.text(practice.name, 20, 42);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...gray);
    doc.text(practice.month + '  ·  Generated ' + new Date().toLocaleDateString(), 20, 49);

    // KPI row
    doc.setFillColor(22, 27, 36);
    doc.roundedRect(15, 55, W - 30, 34, 3, 3, 'F');

    // KPI 1
    doc.setFontSize(7); doc.setFont('helvetica','normal'); doc.setTextColor(...gray);
    doc.text('TOTAL ESTIMATED LEAK', 22, 63);
    doc.setFontSize(16); doc.setFont('helvetica','bold'); doc.setTextColor(...red);
    doc.text(fmt(metrics.totalLeak), 22, 73);

    // KPI 2
    doc.setFontSize(7); doc.setFont('helvetica','normal'); doc.setTextColor(...gray);
    doc.text('LEAK SCORE', 88, 63);
    doc.setFontSize(16); doc.setFont('helvetica','bold'); doc.setTextColor(...amber);
    doc.text(metrics.leakScore + '/100', 88, 73);

    // KPI 3
    doc.setFontSize(7); doc.setFont('helvetica','normal'); doc.setTextColor(...gray);
    doc.text('RECOVERY ITEMS', 150, 63);
    doc.setFontSize(16); doc.setFont('helvetica','bold'); doc.setTextColor(...blue);
    doc.text(String(metrics.recoveryQueue.length), 150, 73);

    // Leak table
    let y = 100;
    doc.setFontSize(11); doc.setFont('helvetica','bold'); doc.setTextColor(238,240,244);
    doc.text('Revenue Leak Breakdown', 20, y); y += 3;

    doc.autoTable({
      startY: y,
      head: [['Leak Type', 'Volume', 'Rate', 'Est. Lost Revenue']],
      body: [
        ['Missed calls',          metrics.missedCalls,    pct(metrics.missedCallRate),    fmt(metrics.missedCallLeak)],
        ['No-shows',              metrics.noShows,        pct(metrics.noShowRate),         fmt(metrics.noShowLeak)],
        ['Unfilled cancellations',metrics.canceled,       pct(metrics.cancellationRate),   fmt(metrics.cancellationLeak)],
        ['Unbooked leads',        metrics.unbookedLeads,  pct(metrics.unbookedLeadRate),   fmt(metrics.unbookedLeadLeak)],
        ['TOTAL',                 '',                     '',                              fmt(metrics.totalLeak)],
      ],
      styles: { fontSize: 10, cellPadding: 4, textColor: [180,185,195], lineColor: [30,35,45], lineWidth: 0.3, fillColor: [22,27,36] },
      headStyles: { fillColor: [0,200,150,30], textColor: [0,200,150], fontStyle: 'bold', fontSize: 9 },
      alternateRowStyles: { fillColor: [18,22,30] },
      columnStyles: { 3: { textColor: [...red], fontStyle: 'bold' } },
      margin: { left: 15, right: 15 },
    });

    y = doc.lastAutoTable.finalY + 12;

    // Recommendations
    doc.setFontSize(11); doc.setFont('helvetica','bold'); doc.setTextColor(238,240,244);
    doc.text('Recommendations', 20, y); y += 6;

    const recs = [
      'Add an after-hours text-back to capture missed calls outside business hours.',
      'Implement a no-show rebooking sequence — text patients within 2 hours of missed appointment.',
      'Work the recovery queue daily — prioritize high-value implant and cosmetic consult follow-ups.',
      'Add same-day confirmation calls for all consult appointments over $500.',
    ];

    recs.forEach((rec, i) => {
      doc.setFontSize(9); doc.setFont('helvetica','bold'); doc.setTextColor(...teal);
      doc.text(`${i+1}.`, 20, y);
      doc.setFont('helvetica','normal'); doc.setTextColor(...gray);
      const lines = doc.splitTextToSize(rec, 165);
      doc.text(lines, 27, y);
      y += lines.length * 5 + 2;
    });

    // Bottom statement
    y += 4;
    doc.setFillColor(22, 27, 36);
    doc.roundedRect(15, y, W - 30, 22, 3, 3, 'F');
    doc.setFontSize(9); doc.setFont('helvetica','italic'); doc.setTextColor(...gray);
    const stmt = `Based on data reviewed, ${practice.name} may be losing approximately ${fmt(metrics.totalLeak)}/month. The recovery queue identifies ${fmt(metrics.totalLeak * 0.7)} as immediately actionable.`;
    const stmtLines = doc.splitTextToSize(stmt, W - 50);
    doc.text(stmtLines, 22, y + 7);

    // Footer
    doc.setFillColor(22, 27, 36);
    doc.rect(0, 282, W, 15, 'F');
    doc.setFontSize(8); doc.setFont('helvetica','normal'); doc.setTextColor(...gray);
    doc.text('LeakLens · An Echolynk Product · leaklens.io', 20, 291);
    doc.text(new Date().toLocaleDateString(), W - 30, 291);

    doc.save(`LeakLens-${practice.name.replace(/\s+/g,'-')}-${practice.month.replace(/\s+/g,'-')}.pdf`);
  }

  return (
    <div className="fade-in">
      <Header
        title="Monthly report"
        sub={`${practice.name} · ${practice.month}`}
        action={
          <button onClick={exportPDF} style={S.exportBtn}>↓ Export PDF</button>
        }
      />

      <Card>
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:'1rem'}}>
          <div>
            <div style={{fontSize:18,fontWeight:600,color:'var(--text)'}}>{practice.name}</div>
            <div style={{fontSize:13,color:'var(--text3)',marginTop:3}}>Revenue Leak Report · {practice.month}</div>
          </div>
          <div style={{fontSize:11,color:'var(--text3)'}}>An Echolynk product</div>
        </div>
        <Divider />
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1.5rem',margin:'1rem 0'}}>
          <KPI label="Est. monthly leak"  value={fmt(metrics.totalLeak)}             color="var(--red)" />
          <KPI label="Leak score"         value={metrics.leakScore+'/100'}           color="var(--amber)" />
          <KPI label="Recovery queue"     value={metrics.recoveryQueue.length+' items'} color="var(--blue)" />
        </div>
        <Divider />
        <CardTitle>Top leaks</CardTitle>
        <table style={S.table}>
          <thead><tr>{['Leak type','Volume','Rate','Est. lost revenue'].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
          <tbody>
            {[
              ['Missed calls',          metrics.missedCalls,   pct(metrics.missedCallRate),   metrics.missedCallLeak],
              ['No-shows',              metrics.noShows,       pct(metrics.noShowRate),        metrics.noShowLeak],
              ['Unbooked leads',        metrics.unbookedLeads, pct(metrics.unbookedLeadRate),  metrics.unbookedLeadLeak],
              ['Unfilled cancellations',metrics.canceled,      pct(metrics.cancellationRate),  metrics.cancellationLeak],
            ].map(([label,...rest])=>(
              <tr key={label} style={S.tr}>
                <td style={S.td}>{label}</td>
                <td style={{...S.td,fontFamily:'var(--mono)',fontSize:12}}>{rest[0]}</td>
                <td style={{...S.td,fontFamily:'var(--mono)',fontSize:12}}>{rest[1]}</td>
                <td style={{...S.td,color:'var(--red)',fontWeight:600,fontFamily:'var(--mono)'}}>{fmt(rest[2])}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Divider />
        <CardTitle>Recommendations</CardTitle>
        {['Add an after-hours text-back system to capture missed calls outside business hours.',
          'Implement a no-show rebooking sequence — text within 2 hours of missed appointment.',
          'Work the recovery queue daily — prioritize high-value consult follow-ups.',
        ].map((r,i)=>(
          <div key={i} style={{display:'flex',gap:10,fontSize:13,marginBottom:8}}>
            <span style={{color:'var(--teal)',fontWeight:600,flexShrink:0}}>{i+1}.</span>
            <span style={{color:'var(--text2)'}}>{r}</span>
          </div>
        ))}
        <Divider />
        <p style={{fontSize:13,color:'var(--text3)',lineHeight:1.7,fontStyle:'italic'}}>
          Based on data reviewed, {practice.name} may be losing approximately <strong style={{color:'var(--text)'}}>{fmt(metrics.totalLeak)} per month</strong>. The recovery queue identifies <strong style={{color:'var(--teal)'}}>{fmt(metrics.totalLeak*0.7)}</strong> as immediately actionable.
        </p>
      </Card>
    </div>
  );
}

function KPI({ label, value, color }) {
  return (
    <div>
      <div style={{fontSize:11,color:'var(--text3)',marginBottom:4}}>{label}</div>
      <div style={{fontSize:24,fontWeight:600,color,fontFamily:'var(--mono)'}}>{value}</div>
    </div>
  );
}

const S = {
  exportBtn:{padding:'9px 18px',borderRadius:8,border:'none',background:'var(--teal)',color:'#0a0c10',fontSize:13,fontWeight:600,cursor:'pointer'},
  table:{width:'100%',borderCollapse:'collapse',fontSize:13},
  th:{textAlign:'left',padding:'8px 10px',color:'var(--text3)',borderBottom:'1px solid var(--border)',fontWeight:500,fontSize:10,letterSpacing:'0.06em',textTransform:'uppercase'},
  tr:{borderBottom:'1px solid var(--border)'},
  td:{padding:'10px',color:'var(--text2)'},
};
