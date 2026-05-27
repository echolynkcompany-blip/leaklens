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

    // ── Sage green light theme colors ──
    const white      = [255, 255, 255];
    const pageBg     = [247, 248, 245];   // --bg
    const cardBg     = [255, 255, 255];   // --bg2
    const bg3        = [240, 242, 236];   // --bg3
    const border     = [226, 230, 218];   // --border
    const textDark   = [26,  33,  18 ];   // --text
    const textMid    = [74,  92,  58 ];   // --text2
    const textLight  = [138, 154, 120];   // --text3
    const sage       = [90,  122, 74 ];   // --teal (sage green)
    const sageDim    = [236, 243, 231];   // sage tinted background
    const red        = [192, 57,  43 ];   // --red
    const amber      = [176, 125, 42 ];   // --amber
    const blue       = [46,  110, 166];   // --blue

    // ── Page background ──
    doc.setFillColor(...pageBg);
    doc.rect(0, 0, W, 297, 'F');

    // ── Top accent bar — sage green ──
    doc.setFillColor(...sage);
    doc.rect(0, 0, W, 4, 'F');

    // ── Header block ──
    doc.setFillColor(...white);
    doc.rect(0, 4, W, 38, 'F');

    // Logo mark
    doc.setFillColor(...sage);
    doc.roundedRect(15, 10, 16, 16, 2, 2, 'F');
    doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(...white);
    doc.text('LL', 23, 20.5, { align: 'center' });

    // LeakLens title
    doc.setFontSize(16); doc.setFont('helvetica', 'bold'); doc.setTextColor(...textDark);
    doc.text('LeakLens', 35, 18);
    doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(...textLight);
    doc.text('Revenue Intelligence · An Echolynk Product', 35, 24);

    // Right side — practice info
    doc.setFontSize(13); doc.setFont('helvetica', 'bold'); doc.setTextColor(...textDark);
    doc.text(practice.name, W - 15, 16, { align: 'right' });
    doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(...textLight);
    doc.text(practice.month + '   ·   Generated ' + new Date().toLocaleDateString(), W - 15, 22, { align: 'right' });

    // Divider line under header
    doc.setDrawColor(...border);
    doc.setLineWidth(0.4);
    doc.line(15, 42, W - 15, 42);

    // ── KPI row ──
    let y = 50;
    const kpiW = (W - 40) / 3;

    const kpis = [
      { label: 'TOTAL ESTIMATED LEAK',  value: fmt(metrics.totalLeak),              color: red   },
      { label: 'LEAK SCORE',            value: metrics.leakScore + '/100',           color: metrics.leakScore >= 75 ? sage : metrics.leakScore >= 50 ? amber : red },
      { label: 'RECOVERABLE REVENUE',   value: fmt(Math.round(metrics.totalLeak * 0.38)), color: sage  },
    ];

    kpis.forEach((kpi, i) => {
      const x = 15 + i * (kpiW + 5);
      doc.setFillColor(...cardBg);
      doc.setDrawColor(...border);
      doc.setLineWidth(0.3);
      doc.roundedRect(x, y, kpiW, 22, 2, 2, 'FD');
      doc.setFontSize(7); doc.setFont('helvetica', 'bold'); doc.setTextColor(...textLight);
      doc.text(kpi.label, x + 6, y + 7);
      doc.setFontSize(15); doc.setFont('helvetica', 'bold'); doc.setTextColor(...kpi.color);
      doc.text(kpi.value, x + 6, y + 17);
    });

    y += 30;

    // ── Recovery items + Score ──
    const recoverableItems = [
      { label: 'Missed calls', count: metrics.missedCalls, color: red },
      { label: 'No-shows', count: metrics.noShows, color: amber },
      { label: 'Cancellations', count: metrics.canceled, color: [123, 94, 167] },
      { label: 'Unbooked leads', count: metrics.unbookedLeads, color: blue },
    ];

    // ── Leak breakdown table ──
    doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(...textDark);
    doc.text('Revenue Leak Breakdown', 15, y); y += 4;

    doc.autoTable({
      startY: y,
      head: [['Leak Type', 'Volume', 'Rate', 'Est. Lost Revenue']],
      body: [
        ['Missed calls',           metrics.missedCalls,    pct(metrics.missedCallRate),    fmt(metrics.missedCallLeak)],
        ['No-shows',               metrics.noShows,        pct(metrics.noShowRate),        fmt(metrics.noShowLeak)],
        ['Unfilled cancellations', metrics.canceled,       pct(metrics.cancellationRate),  fmt(metrics.cancellationLeak)],
        ['Unbooked leads',         metrics.unbookedLeads,  pct(metrics.unbookedLeadRate),  fmt(metrics.unbookedLeadLeak)],
        ['TOTAL',                  '',                     '',                             fmt(metrics.totalLeak)],
      ],
      styles: {
        fontSize: 10,
        cellPadding: { top: 5, right: 6, bottom: 5, left: 6 },
        textColor: textMid,
        lineColor: border,
        lineWidth: 0.3,
        fillColor: white,
      },
      headStyles: {
        fillColor: sageDim,
        textColor: sage,
        fontStyle: 'bold',
        fontSize: 8,
        lineColor: border,
        lineWidth: 0.3,
      },
      alternateRowStyles: { fillColor: pageBg },
      columnStyles: {
        0: { fontStyle: 'bold', textColor: textDark },
        3: { textColor: red, fontStyle: 'bold' },
      },
      foot: [],
      margin: { left: 15, right: 15 },
      tableLineColor: border,
      tableLineWidth: 0.3,
    });

    y = doc.lastAutoTable.finalY + 10;

    // ── Recommendations ──
    doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(...textDark);
    doc.text('Recommendations', 15, y); y += 6;

    const recs = [
      'Add an after-hours text-back system to capture calls outside business hours and convert them within 15 minutes.',
      'Implement a no-show rebooking sequence — send a text message within 2 hours of any missed appointment.',
      'Work the recovery queue daily — prioritize high-value implant and cosmetic consult follow-ups first.',
      'Add same-day confirmation calls for all consult appointments over $500 to reduce no-show rate.',
    ];

    recs.forEach((rec, i) => {
      // Number circle
      doc.setFillColor(...sageDim);
      doc.circle(19, y - 1.5, 3.5, 'F');
      doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(...sage);
      doc.text(String(i + 1), 19, y + 0.5, { align: 'center' });

      doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(...textMid);
      const lines = doc.splitTextToSize(rec, 162);
      doc.text(lines, 26, y);
      y += lines.length * 5 + 4;
    });

    y += 2;

    // ── Bottom statement box ──
    doc.setFillColor(...sageDim);
    doc.setDrawColor(...border);
    doc.setLineWidth(0.3);
    const stmt = `Based on data reviewed, ${practice.name} may be losing approximately ${fmt(metrics.totalLeak)} per month. The recovery queue identifies ${fmt(Math.round(metrics.totalLeak * 0.38))} as the realistically recoverable amount within 60 days.`;
    const stmtLines = doc.splitTextToSize(stmt, W - 56);
    const boxH = stmtLines.length * 5 + 14;
    doc.roundedRect(15, y, W - 30, boxH, 3, 3, 'FD');

    // Sage left border accent
    doc.setFillColor(...sage);
    doc.roundedRect(15, y, 3, boxH, 1, 1, 'F');

    doc.setFontSize(9); doc.setFont('helvetica', 'italic'); doc.setTextColor(...textMid);
    doc.text(stmtLines, 24, y + 8);

    y += boxH + 8;

    // ── Provider breakdown if available ──
    if (metrics.providers && metrics.providers.length > 0) {
      doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(...textDark);
      doc.text('Provider Summary', 15, y); y += 4;

      doc.autoTable({
        startY: y,
        head: [['Provider', 'Total Appts', 'No-Shows', 'Canceled', 'Utilization']],
        body: metrics.providers.map(p => [
          p.name,
          p.total,
          p.noShows,
          p.canceled,
          p.utilization + '%',
        ]),
        styles: { fontSize: 9, cellPadding: { top: 4, right: 6, bottom: 4, left: 6 }, textColor: textMid, lineColor: border, lineWidth: 0.3, fillColor: white },
        headStyles: { fillColor: sageDim, textColor: sage, fontStyle: 'bold', fontSize: 8, lineColor: border, lineWidth: 0.3 },
        alternateRowStyles: { fillColor: pageBg },
        columnStyles: { 0: { fontStyle: 'bold', textColor: textDark } },
        margin: { left: 15, right: 15 },
      });
    }

    // ── Footer ──
    doc.setFillColor(...cardBg);
    doc.rect(0, 280, W, 17, 'F');
    doc.setDrawColor(...border);
    doc.setLineWidth(0.3);
    doc.line(0, 280, W, 280);
    doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(...textLight);
    doc.text('LeakLens  ·  An Echolynk Product', 15, 290);
    doc.text(new Date().toLocaleDateString(), W - 15, 290, { align: 'right' });

    doc.save(`LeakLens-${practice.name.replace(/\s+/g, '-')}-${practice.month.replace(/\s+/g, '-')}.pdf`);
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
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'1rem' }}>
          <div>
            <div style={{ fontSize:18, fontWeight:700, color:'var(--text)' }}>{practice.name}</div>
            <div style={{ fontSize:13, color:'var(--text3)', marginTop:3 }}>Revenue Intelligence Report · {practice.month}</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:11, color:'var(--text3)' }}>An Echolynk product</div>

          </div>
        </div>
        <Divider />

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.5rem', margin:'1rem 0' }}>
          <KPI label="Est. monthly leak"    value={fmt(metrics.totalLeak)}                             color="var(--red)" />
          <KPI label="Realistically recoverable" value={fmt(Math.round(metrics.totalLeak * 0.38))}   color="var(--teal)" />
          <KPI label="Leak score"           value={metrics.leakScore + '/100'}                        color={metrics.leakScore >= 75 ? 'var(--teal)' : metrics.leakScore >= 50 ? 'var(--amber)' : 'var(--red)'} />
        </div>

        <Divider />
        <CardTitle>Revenue leak breakdown</CardTitle>
        <table style={S.table}>
          <thead>
            <tr>{['Leak type','Volume','Rate','Est. lost revenue'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {[
              ['Missed calls',           metrics.missedCalls,    pct(metrics.missedCallRate),    metrics.missedCallLeak],
              ['No-shows',               metrics.noShows,        pct(metrics.noShowRate),        metrics.noShowLeak],
              ['Unbooked leads',         metrics.unbookedLeads,  pct(metrics.unbookedLeadRate),  metrics.unbookedLeadLeak],
              ['Unfilled cancellations', metrics.canceled,       pct(metrics.cancellationRate),  metrics.cancellationLeak],
            ].map(([label, ...rest]) => (
              <tr key={label} style={S.tr}>
                <td style={{ ...S.td, fontWeight:600, color:'var(--text)' }}>{label}</td>
                <td style={{ ...S.td, fontFamily:'var(--mono)', fontSize:12 }}>{rest[0]}</td>
                <td style={{ ...S.td, fontFamily:'var(--mono)', fontSize:12 }}>{rest[1]}</td>
                <td style={{ ...S.td, color:'var(--red)', fontWeight:700, fontFamily:'var(--mono)' }}>{fmt(rest[2])}</td>
              </tr>
            ))}
            <tr style={{ background:'var(--bg3)' }}>
              <td style={{ ...S.td, fontWeight:700, color:'var(--text)' }}>TOTAL</td>
              <td style={S.td} /><td style={S.td} />
              <td style={{ ...S.td, color:'var(--red)', fontWeight:700, fontFamily:'var(--mono)' }}>{fmt(metrics.totalLeak)}</td>
            </tr>
          </tbody>
        </table>

        <Divider />
        <CardTitle>Recommendations</CardTitle>
        {[
          'Add an after-hours text-back to capture missed calls outside business hours.',
          'Implement a no-show rebooking sequence — text patients within 2 hours of missed appointment.',
          'Work the recovery queue daily — prioritize high-value implant and cosmetic consult follow-ups.',
          'Add same-day confirmation calls for all consult appointments over $500.',
        ].map((r, i) => (
          <div key={i} style={{ display:'flex', gap:12, fontSize:13, marginBottom:10, alignItems:'flex-start' }}>
            <span style={{ width:22, height:22, borderRadius:'50%', background:'var(--teal-dim)', color:'var(--teal)',
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, flexShrink:0 }}>
              {i+1}
            </span>
            <span style={{ color:'var(--text2)', lineHeight:1.6 }}>{r}</span>
          </div>
        ))}

        <Divider />
        <div style={{ background:'var(--teal-dim)', border:'1px solid var(--teal-border)', borderRadius:'var(--radius)',
          padding:'1rem', borderLeft:'3px solid var(--teal)' }}>
          <p style={{ fontSize:13, color:'var(--text2)', lineHeight:1.7 }}>
            Based on data reviewed, <strong style={{ color:'var(--text)' }}>{practice.name}</strong> may be losing approximately{' '}
            <strong style={{ color:'var(--red)' }}>{fmt(metrics.totalLeak)} per month</strong>. The realistically recoverable amount within 60 days is{' '}
            <strong style={{ color:'var(--teal)' }}>{fmt(Math.round(metrics.totalLeak * 0.38))}</strong> — at a monitoring cost of $497/month, that is a{' '}
            <strong style={{ color:'var(--text)' }}>{(metrics.totalLeak * 0.38 / 497).toFixed(1)}x return</strong>.
          </p>
        </div>
      </Card>
    </div>
  );
}

function KPI({ label, value, color }) {
  return (
    <div style={{ textAlign:'center', padding:'0.5rem 0' }}>
      <div style={{ fontSize:10, color:'var(--text3)', marginBottom:6, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase' }}>{label}</div>
      <div style={{ fontSize:26, fontWeight:700, color, fontFamily:'var(--mono)' }}>{value}</div>
    </div>
  );
}

const S = {
  exportBtn: { padding:'9px 20px', borderRadius:8, border:'none', background:'var(--teal)', color:'#FFFFFF', fontSize:13, fontWeight:700, cursor:'pointer', boxShadow:'0 2px 6px rgba(90,122,74,0.30)' },
  table: { width:'100%', borderCollapse:'collapse', fontSize:13 },
  th: { textAlign:'left', padding:'8px 10px', color:'var(--text3)', borderBottom:'2px solid var(--border)', fontWeight:700, fontSize:10, letterSpacing:'0.06em', textTransform:'uppercase' },
  tr: { borderBottom:'1px solid var(--border)' },
  td: { padding:'11px 10px', color:'var(--text2)' },
};
