import { useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const SERVICE_TYPES = [
  { label: 'Entry Audit — One-time',           defaultAmount: 297,  description: 'Revenue leak audit — one-time assessment' },
  { label: 'Tier 1 — Visibility (Monthly)',     defaultAmount: 497,  description: 'Monthly revenue intelligence monitoring' },
  { label: 'Tier 2 — Recovery (Monthly)',       defaultAmount: 1500, description: 'Monthly revenue recovery management' },
  { label: 'Tier 3 — Intelligence (Monthly)',   defaultAmount: 3500, description: 'Monthly operational intelligence platform' },
  { label: 'Custom Service',                    defaultAmount: 0,    description: '' },
];

function generateInvoiceNumber() {
  const now = new Date();
  const y = now.getFullYear().toString().slice(2);
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const r = String(Math.floor(Math.random() * 900) + 100);
  return `INV-${y}${m}-${r}`;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function addDays(dateStr, days) {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export function InvoiceModal({ client, settings, onClose }) {
  const today = new Date().toISOString().split('T')[0];
  const [serviceType, setServiceType] = useState(0);
  const [amount,      setAmount]      = useState(SERVICE_TYPES[0].defaultAmount);
  const [description, setDescription]= useState(SERVICE_TYPES[0].description);
  const [issueDate,   setIssueDate]   = useState(today);
  const [dueDate,     setDueDate]     = useState(addDays(today, 14));
  const [billingPeriod, setBillingPeriod] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [notes,       setNotes]       = useState('');
  const [invoiceNum]                  = useState(generateInvoiceNumber);
  const [downloading, setDownloading] = useState(false);

  function handleServiceChange(idx) {
    setServiceType(idx);
    setAmount(SERVICE_TYPES[idx].defaultAmount);
    setDescription(SERVICE_TYPES[idx].description);
  }

  function buildPDF() {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const W = 210;

    // Colors
    const pageBg   = [247, 248, 245];
    const white    = [255, 255, 255];
    const sage     = [90,  122, 74 ];
    const sageDim  = [236, 243, 231];
    const textDark = [26,  33,  18 ];
    const textMid  = [74,  92,  58 ];
    const textLight= [138, 154, 120];
    const border   = [226, 230, 218];
    const red      = [192, 57,  43 ];

    // Page background
    doc.setFillColor(...pageBg);
    doc.rect(0, 0, W, 297, 'F');

    // Top accent bar
    doc.setFillColor(...sage);
    doc.rect(0, 0, W, 4, 'F');

    // White header
    doc.setFillColor(...white);
    doc.rect(0, 4, W, 45, 'F');

    // LL logo mark
    doc.setFillColor(...sage);
    doc.roundedRect(15, 10, 16, 16, 2, 2, 'F');
    doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(...white);
    doc.text('LL', 23, 20.5, { align: 'center' });

    // LeakLens + company
    doc.setFontSize(16); doc.setFont('helvetica', 'bold'); doc.setTextColor(...textDark);
    doc.text('LeakLens', 35, 18);
    doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(...textLight);
    doc.text('An Echolynk Product', 35, 24);
    doc.text(settings?.contact_email || 'hello@leaklens.co', 35, 30);

    // INVOICE label top right
    doc.setFontSize(22); doc.setFont('helvetica', 'bold'); doc.setTextColor(...sage);
    doc.text('INVOICE', W - 15, 18, { align: 'right' });
    doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(...textLight);
    doc.text(invoiceNum, W - 15, 25, { align: 'right' });

    // Divider
    doc.setDrawColor(...border); doc.setLineWidth(0.4);
    doc.line(15, 49, W - 15, 49);

    // Bill To / Invoice Details two columns
    let y = 58;
    doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(...textLight);
    doc.text('BILL TO', 15, y);
    doc.text('INVOICE DETAILS', 120, y);
    y += 5;

    doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(...textDark);
    doc.text(client?.name || 'Client Name', 15, y);
    y += 5;

    if (clientAddress) {
      doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(...textMid);
      const addrLines = doc.splitTextToSize(clientAddress, 80);
      doc.text(addrLines, 15, y);
      y += addrLines.length * 4.5;
    }

    if (clientEmail) {
      doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(...textMid);
      doc.text(clientEmail, 15, y);
    }

    // Details right column
    const details = [
      ['Issue Date:', formatDate(issueDate)],
      ['Due Date:', formatDate(dueDate)],
      ['Invoice #:', invoiceNum],
      billingPeriod ? ['Billing Period:', billingPeriod] : null,
    ].filter(Boolean);

    let dy = 63;
    details.forEach(([label, value]) => {
      doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(...textLight);
      doc.text(label, 120, dy);
      doc.setFont('helvetica', 'normal'); doc.setTextColor(...textDark);
      doc.text(value, 165, dy);
      dy += 6;
    });

    // Services table
    y = Math.max(y + 12, dy + 6);
    doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(...textDark);
    doc.text('Services', 15, y); y += 3;

    doc.autoTable({
      startY: y,
      head: [['Description', 'Type', 'Amount']],
      body: [
        [description || SERVICE_TYPES[serviceType].description, SERVICE_TYPES[serviceType].label, '$' + Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })],
      ],
      styles: { fontSize: 10, cellPadding: { top: 6, right: 8, bottom: 6, left: 8 }, textColor: textMid, lineColor: border, lineWidth: 0.3, fillColor: white },
      headStyles: { fillColor: sageDim, textColor: sage, fontStyle: 'bold', fontSize: 8, lineColor: border, lineWidth: 0.3 },
      columnStyles: {
        0: { cellWidth: 95, textColor: textDark, fontStyle: 'bold' },
        1: { cellWidth: 65 },
        2: { cellWidth: 30, halign: 'right', textColor: textDark, fontStyle: 'bold' },
      },
      margin: { left: 15, right: 15 },
    });

    y = doc.lastAutoTable.finalY + 6;

    // Total box
    doc.setFillColor(...sageDim);
    doc.setDrawColor(...border); doc.setLineWidth(0.3);
    doc.roundedRect(W - 80, y, 65, 20, 2, 2, 'FD');
    doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(...textLight);
    doc.text('TOTAL DUE', W - 74, y + 8);
    doc.setFontSize(16); doc.setFont('helvetica', 'bold'); doc.setTextColor(...sage);
    doc.text('$' + Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2 }), W - 19, y + 15, { align: 'right' });

    y += 28;

    // Payment info box
    doc.setFillColor(...white);
    doc.setDrawColor(...border); doc.setLineWidth(0.3);
    doc.roundedRect(15, y, W - 30, 28, 2, 2, 'FD');
    doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(...sage);
    doc.text('PAYMENT INFORMATION', 22, y + 8);
    doc.setFont('helvetica', 'normal'); doc.setTextColor(...textMid);
    doc.text('Please make payment by the due date shown above.', 22, y + 14);
    doc.text('Questions? Contact us at ' + (settings?.contact_email || 'hello@leaklens.co') + '  ·  ' + (settings?.phone || '813-904-2995'), 22, y + 20);

    y += 36;

    // Notes
    if (notes) {
      doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(...textLight);
      doc.text('NOTES', 15, y); y += 5;
      doc.setFont('helvetica', 'normal'); doc.setTextColor(...textMid);
      const noteLines = doc.splitTextToSize(notes, W - 30);
      doc.text(noteLines, 15, y);
      y += noteLines.length * 4.5 + 8;
    }

    // Footer
    doc.setFillColor(...white);
    doc.rect(0, 280, W, 17, 'F');
    doc.setDrawColor(...border); doc.setLineWidth(0.3);
    doc.line(0, 280, W, 280);
    doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(...textLight);
    doc.text('LeakLens  ·  An Echolynk Product', 15, 290);
    doc.text('Thank you for your business.', W - 15, 290, { align: 'right' });

    return doc;
  }

  function handleDownload() {
    setDownloading(true);
    const doc = buildPDF();
    const safeName = (client?.name || 'Client').replace(/\s+/g, '-');
    doc.save(`LeakLens-Invoice-${invoiceNum}-${safeName}.pdf`);
    setTimeout(() => setDownloading(false), 1000);
  }

  function handleEmail() {
    const doc = buildPDF();
    const safeName = (client?.name || 'Client').replace(/\s+/g, '-');
    const filename = `LeakLens-Invoice-${invoiceNum}-${safeName}.pdf`;

    // Download the PDF first
    doc.save(filename);

    // Open email client with pre-filled fields
    const subject = encodeURIComponent(`LeakLens Invoice ${invoiceNum} — ${client?.name || 'Invoice'}`);
    const body = encodeURIComponent(
      `Hi,\n\nPlease find attached your LeakLens invoice ${invoiceNum} for ${SERVICE_TYPES[serviceType].label}.\n\nAmount Due: $${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}\nDue Date: ${formatDate(dueDate)}\n\nThank you for your business.\n\n${settings?.company_name || 'Echolynk'}\n${settings?.contact_email || 'hello@leaklens.co'}\n${settings?.phone || ''}`
    );
    const to = encodeURIComponent(clientEmail || '');
    window.open(`mailto:${to}?subject=${subject}&body=${body}`, '_blank');
  }

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(26,33,18,0.35)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
      <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)',
        width:'100%', maxWidth:560, maxHeight:'90vh', overflow:'auto', boxShadow:'var(--shadow-lg)' }}>

        {/* Modal header */}
        <div style={{ padding:'1.25rem', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontSize:16, fontWeight:700, color:'var(--text)' }}>Generate Invoice</div>
            <div style={{ fontSize:12, color:'var(--text3)', marginTop:2 }}>{client?.name}  ·  {invoiceNum}</div>
          </div>
          <button onClick={onClose} style={{ background:'transparent', border:'none', fontSize:20, color:'var(--text3)', cursor:'pointer', lineHeight:1 }}>✕</button>
        </div>

        {/* Form */}
        <div style={{ padding:'1.25rem', display:'flex', flexDirection:'column', gap:'1rem' }}>

          {/* Service type */}
          <div style={F.field}>
            <label style={F.label}>Service type</label>
            <select value={serviceType} onChange={e => handleServiceChange(Number(e.target.value))} style={F.input}>
              {SERVICE_TYPES.map((s, i) => <option key={i} value={i}>{s.label}</option>)}
            </select>
          </div>

          {/* Description */}
          <div style={F.field}>
            <label style={F.label}>Service description</label>
            <input value={description} onChange={e => setDescription(e.target.value)} style={F.input} placeholder="Describe the service..." />
          </div>

          {/* Amount */}
          <div style={F.field}>
            <label style={F.label}>Amount ($)</label>
            <input type="number" value={amount} onChange={e => setAmount(parseFloat(e.target.value)||0)} style={F.input} />
          </div>

          {/* Dates row */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            <div style={F.field}>
              <label style={F.label}>Issue date</label>
              <input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} style={F.input} />
            </div>
            <div style={F.field}>
              <label style={F.label}>Due date</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={F.input} />
            </div>
          </div>

          {/* Billing period */}
          <div style={F.field}>
            <label style={F.label}>Billing period <span style={{ color:'var(--text3)', fontWeight:400 }}>(optional)</span></label>
            <input value={billingPeriod} onChange={e => setBillingPeriod(e.target.value)} style={F.input} placeholder="e.g. June 2026 or June 1 – June 30, 2026" />
          </div>

          {/* Client email */}
          <div style={F.field}>
            <label style={F.label}>Client email <span style={{ color:'var(--text3)', fontWeight:400 }}>(for email option)</span></label>
            <input type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} style={F.input} placeholder="practicemanager@clinic.com" />
          </div>

          {/* Client address */}
          <div style={F.field}>
            <label style={F.label}>Client address <span style={{ color:'var(--text3)', fontWeight:400 }}>(optional)</span></label>
            <input value={clientAddress} onChange={e => setClientAddress(e.target.value)} style={F.input} placeholder="123 Main St, Tampa FL 33602" />
          </div>

          {/* Notes */}
          <div style={F.field}>
            <label style={F.label}>Notes <span style={{ color:'var(--text3)', fontWeight:400 }}>(optional — printed on invoice)</span></label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} style={{ ...F.input, height:60, resize:'vertical' }}
              placeholder="e.g. Payment due within 14 days. Thank you for your business." />
          </div>

          {/* Preview summary */}
          <div style={{ background:'var(--teal-dim)', border:'1px solid var(--teal-border)', borderRadius:'var(--radius)', padding:'0.875rem', fontSize:13 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
              <span style={{ color:'var(--text2)' }}>Invoice for</span>
              <span style={{ fontWeight:600, color:'var(--text)' }}>{client?.name}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
              <span style={{ color:'var(--text2)' }}>Service</span>
              <span style={{ color:'var(--text)' }}>{SERVICE_TYPES[serviceType].label}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
              <span style={{ color:'var(--text2)' }}>Amount due</span>
              <span style={{ fontWeight:700, color:'var(--teal)', fontSize:15 }}>${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <span style={{ color:'var(--text2)' }}>Due date</span>
              <span style={{ color:'var(--text)' }}>{formatDate(dueDate)}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={handleDownload} disabled={downloading}
              style={{ flex:1, padding:'11px', borderRadius:8, border:'none', background:'var(--teal)',
                color:'white', fontSize:13, fontWeight:700, cursor:'pointer' }}>
              {downloading ? 'Generating…' : '↓ Download PDF'}
            </button>
            <button onClick={handleEmail}
              style={{ flex:1, padding:'11px', borderRadius:8, border:'1px solid var(--teal)',
                background:'transparent', color:'var(--teal)', fontSize:13, fontWeight:700, cursor:'pointer' }}>
              ✉ Email Invoice
            </button>
          </div>
          <div style={{ fontSize:11, color:'var(--text3)', textAlign:'center' }}>
            Email option downloads the PDF and opens your mail app with the invoice details pre-filled.
          </div>
        </div>
      </div>
    </div>
  );
}

const F = {
  field: { display:'flex', flexDirection:'column', gap:5 },
  label: { fontSize:12, fontWeight:600, color:'var(--text2)' },
  input: { padding:'9px 12px', borderRadius:8, border:'1px solid var(--border2)', background:'var(--bg3)', color:'var(--text)', fontSize:13, outline:'none', fontFamily:'var(--font)' },
};
