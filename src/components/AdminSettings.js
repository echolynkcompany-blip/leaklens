import { useState, useEffect } from 'react';
import { InvoiceModal } from './InvoiceGenerator';
import { supabase } from '../supabase';
import { Card, CardTitle, Divider } from './UI';

const STORAGE_KEY = 'leaklens_admin_settings';

const DEFAULT_SETTINGS = {
  company_name: 'Echolynk',
  product_name: 'LeakLens',
  admin_email: 'echolynkcompany@gmail.com',
  contact_email: 'hello@leaklens.co',
  phone: '813-904-2995',
  website: 'leaklens.co',
  tier1_rate: 497,
  tier2_rate: 1500,
  audit_rate: 297,
  notify_data_collection: true,
  notify_review_call: true,
  notify_overdue: true,
  data_collection_day: 1,
};

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS };
  } catch { return { ...DEFAULT_SETTINGS }; }
}

function saveSettings(s) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
}

export default function AdminSettings({ practices }) {
  const [form, setForm] = useState(loadSettings());
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('business');

  // Billing state — stored in component memory (no DB needed for now)
  const [billing, setBilling] = useState(() => {
    try {
      const raw = localStorage.getItem('leaklens_billing');
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  });
  const [newClient, setNewClient] = useState({ name: '', rate: 497, tier: 'Tier 1 — Visibility', status: 'Active', start_date: '', notes: '' });
  const [addingClient, setAddingClient] = useState(false);
  const [invoiceClient, setInvoiceClient] = useState(null);

  const clients = practices.filter(p => !p.id?.startsWith('demo'));

  // Sync billing records with actual practices
  useEffect(() => {
    const existing = billing.map(b => b.practice_id);
    const newEntries = clients
      .filter(p => !existing.includes(p.id))
      .map(p => ({ practice_id: p.id, name: p.name, rate: form.tier1_rate, tier: 'Tier 1 — Visibility', status: 'Active', start_date: '', notes: '' }));
    if (newEntries.length > 0) {
      const updated = [...billing, ...newEntries];
      setBilling(updated);
      localStorage.setItem('leaklens_billing', JSON.stringify(updated));
    }
  }, [clients.length]);

  function handleSave() {
    saveSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function updateBilling(id, field, value) {
    const updated = billing.map(b => b.practice_id === id ? { ...b, [field]: value } : b);
    setBilling(updated);
    localStorage.setItem('leaklens_billing', JSON.stringify(updated));
  }

  function addManualClient() {
    const entry = { ...newClient, practice_id: 'manual_' + Date.now() };
    const updated = [...billing, entry];
    setBilling(updated);
    localStorage.setItem('leaklens_billing', JSON.stringify(updated));
    setNewClient({ name: '', rate: 497, tier: 'Tier 1 — Visibility', status: 'Active', start_date: '', notes: '' });
    setAddingClient(false);
  }

  function removeClient(id) {
    const updated = billing.filter(b => b.practice_id !== id);
    setBilling(updated);
    localStorage.setItem('leaklens_billing', JSON.stringify(updated));
  }

  const activeClients = billing.filter(b => b.status === 'Active');
  const mrr = activeClients.reduce((s, b) => s + (parseFloat(b.rate) || 0), 0);
  const arr = mrr * 12;

  const inp = (key, label, hint, type='text') => (
    <div style={S.field}>
      <label style={S.label}>{label}</label>
      {hint && <div style={S.hint}>{hint}</div>}
      <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: type==='number' ? parseFloat(e.target.value)||0 : e.target.value }))}
        style={S.input} />
    </div>
  );

  const tog = (key, label, hint) => (
    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16, marginBottom:'1rem' }}>
      <div>
        <div style={{ fontSize:13, fontWeight:500, color:'var(--text2)' }}>{label}</div>
        {hint && <div style={{ fontSize:11, color:'var(--text3)', marginTop:2 }}>{hint}</div>}
      </div>
      <button type="button" onClick={() => setForm(f => ({ ...f, [key]: !f[key] }))}
        style={{ width:40, height:22, borderRadius:11, border:'none', cursor:'pointer', flexShrink:0, marginTop:2,
          background: form[key] ? 'var(--teal)' : 'var(--bg3)',
          position:'relative', transition:'background 0.2s' }}>
        <div style={{ width:16, height:16, borderRadius:'50%', background:'white', position:'absolute',
          top:3, left: form[key] ? 21 : 3, transition:'left 0.2s' }} />
      </button>
    </div>
  );

  const TABS = [
    { id:'business', label:'Business Info' },
    { id:'billing',  label:'Billing Tracker' },
    { id:'notify',   label:'Notifications' },
  ];

  return (
    <div className="fade-in">
      <div style={{ marginBottom:'1.5rem' }}>
        <h1 style={{ fontSize:20, fontWeight:600, color:'var(--text)', letterSpacing:'-0.4px' }}>Admin Settings</h1>
        <p style={{ color:'var(--text3)', fontSize:13, marginTop:4 }}>Your business configuration, billing, and preferences.</p>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:4, marginBottom:'1.5rem', borderBottom:'1px solid var(--border)', paddingBottom:0 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            style={{ padding:'8px 16px', border:'none', background:'transparent', cursor:'pointer', fontSize:13,
              fontWeight: activeTab===t.id ? 600 : 400,
              color: activeTab===t.id ? 'var(--teal)' : 'var(--text3)',
              borderBottom: activeTab===t.id ? '2px solid var(--teal)' : '2px solid transparent',
              marginBottom:-1 }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── BUSINESS INFO ── */}
      {activeTab === 'business' && (
        <>
          <Card>
            <CardTitle>Company identity</CardTitle>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
              {inp('company_name', 'Company name', 'Your LLC name — Echolynk Company')}
              {inp('product_name', 'Product name', 'The product you sell — LeakLens')}
              {inp('admin_email',  'Admin login email', 'Your Supabase login')}
              {inp('contact_email','Client-facing email', 'What you give to practices')}
              {inp('phone',        'Contact phone', 'Dispatch line or direct number')}
              {inp('website',      'Website / domain', 'leaklens.co when purchased')}
            </div>
          </Card>
          <Card>
            <CardTitle>Pricing reference</CardTitle>
            <div style={{ fontSize:13, color:'var(--text3)', marginBottom:'1rem' }}>
              These are reference values used in the billing tracker and PDF reports.
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'1rem' }}>
              {inp('audit_rate',  'Entry audit rate ($)', 'One-time audit price', 'number')}
              {inp('tier1_rate',  'Tier 1 monthly rate ($)', 'Visibility — $497/mo', 'number')}
              {inp('tier2_rate',  'Tier 2 monthly rate ($)', 'Recovery — $1,200–$2,000/mo', 'number')}
            </div>
          </Card>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button onClick={handleSave} style={S.saveBtn}>Save settings</button>
            {saved && <span style={{ fontSize:13, color:'var(--teal)', fontWeight:500 }}>✓ Saved</span>}
          </div>
        </>
      )}

      {/* ── BILLING TRACKER ── */}
      {activeTab === 'billing' && (
        <>
          {/* MRR Summary */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:'1.25rem' }}>
            {[
              { label:'Active clients', value: activeClients.length, color:'var(--teal)' },
              { label:'Monthly MRR', value: '$' + mrr.toLocaleString(), color:'var(--teal)' },
              { label:'Annual ARR', value: '$' + arr.toLocaleString(), color:'var(--text)' },
              { label:'Avg per client', value: activeClients.length ? '$' + Math.round(mrr/activeClients.length).toLocaleString() : '—', color:'var(--text)' },
            ].map(m => (
              <div key={m.label} style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'1rem' }}>
                <div style={{ fontSize:11, color:'var(--text3)', marginBottom:6 }}>{m.label}</div>
                <div style={{ fontSize:22, fontWeight:700, color:m.color, fontFamily:'var(--mono)' }}>{m.value}</div>
              </div>
            ))}
          </div>

          <Card>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
              <CardTitle>Client billing records</CardTitle>
              <button onClick={() => setAddingClient(true)} style={{ ...S.saveBtn, padding:'6px 14px', fontSize:12 }}>
                + Add client
              </button>
            </div>

            {/* Add client form */}
            {addingClient && (
              <div style={{ background:'var(--bg3)', borderRadius:'var(--radius)', padding:'1rem', marginBottom:'1rem', border:'1px solid var(--border2)' }}>
                <div style={{ fontSize:12, fontWeight:600, color:'var(--teal)', marginBottom:'0.75rem' }}>New billing record</div>
                <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:8, marginBottom:8 }}>
                  <input placeholder="Practice name" value={newClient.name} onChange={e => setNewClient(c=>({...c,name:e.target.value}))} style={S.input} />
                  <input type="number" placeholder="Monthly rate" value={newClient.rate} onChange={e => setNewClient(c=>({...c,rate:parseFloat(e.target.value)||0}))} style={S.input} />
                  <select value={newClient.status} onChange={e => setNewClient(c=>({...c,status:e.target.value}))} style={S.input}>
                    <option>Active</option><option>Trial</option><option>Paused</option><option>Churned</option>
                  </select>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:8, marginBottom:8 }}>
                  <select value={newClient.tier} onChange={e => setNewClient(c=>({...c,tier:e.target.value}))} style={S.input}>
                    <option>Entry — Audit</option>
                    <option>Tier 1 — Visibility</option>
                    <option>Tier 2 — Recovery</option>
                    <option>Tier 3 — Intelligence</option>
                  </select>
                  <input type="date" value={newClient.start_date} onChange={e => setNewClient(c=>({...c,start_date:e.target.value}))} style={S.input} />
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <button onClick={addManualClient} style={{ ...S.saveBtn, padding:'6px 14px', fontSize:12 }}>Save record</button>
                  <button onClick={() => setAddingClient(false)} style={{ ...S.saveBtn, padding:'6px 14px', fontSize:12, background:'var(--bg3)', color:'var(--text2)', border:'1px solid var(--border2)' }}>Cancel</button>
                </div>
              </div>
            )}

            {billing.length === 0 ? (
              <div style={{ fontSize:13, color:'var(--text3)', padding:'1rem 0' }}>
                No billing records yet. Add a real practice from the sidebar and it will appear here automatically, or click + Add client to create a manual record.
              </div>
            ) : (
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
                <thead>
                  <tr>{['Practice','Tier','Rate/mo','Status','Start date',''].map(h => (
                    <th key={h} style={{ textAlign:'left', padding:'8px 8px', color:'var(--text3)', borderBottom:'1px solid var(--border)', fontWeight:500, fontSize:10, letterSpacing:'0.06em', textTransform:'uppercase' }}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {billing.map(b => (
                    <tr key={b.practice_id} style={{ borderBottom:'1px solid var(--border)' }}>
                      <td style={{ padding:'10px 8px', color:'var(--text)', fontWeight:500 }}>{b.name}</td>
                      <td style={{ padding:'10px 8px' }}>
                        <select value={b.tier} onChange={e => updateBilling(b.practice_id, 'tier', e.target.value)}
                          style={{ background:'transparent', border:'none', color:'var(--text2)', fontSize:12, cursor:'pointer' }}>
                          <option>Entry — Audit</option>
                          <option>Tier 1 — Visibility</option>
                          <option>Tier 2 — Recovery</option>
                          <option>Tier 3 — Intelligence</option>
                        </select>
                      </td>
                      <td style={{ padding:'10px 8px' }}>
                        <input type="number" value={b.rate} onChange={e => updateBilling(b.practice_id, 'rate', parseFloat(e.target.value)||0)}
                          style={{ width:70, background:'transparent', border:'none', color:'var(--teal)', fontSize:12, fontFamily:'var(--mono)', fontWeight:600 }} />
                      </td>
                      <td style={{ padding:'10px 8px' }}>
                        <select value={b.status} onChange={e => updateBilling(b.practice_id, 'status', e.target.value)}
                          style={{ background:'transparent', border:'none', fontSize:12, cursor:'pointer',
                            color: b.status==='Active' ? 'var(--teal)' : b.status==='Trial' ? 'var(--amber)' : b.status==='Churned' ? 'var(--red)' : 'var(--text3)' }}>
                          <option>Active</option><option>Trial</option><option>Paused</option><option>Churned</option>
                        </select>
                      </td>
                      <td style={{ padding:'10px 8px', color:'var(--text3)' }}>
                        <input type="date" value={b.start_date||''} onChange={e => updateBilling(b.practice_id, 'start_date', e.target.value)}
                          style={{ background:'transparent', border:'none', color:'var(--text3)', fontSize:12, cursor:'pointer' }} />
                      </td>
                      <td style={{ padding:'10px 8px', whiteSpace:'nowrap' }}>
                        <button onClick={() => setInvoiceClient(b)}
                          style={{ background:'var(--teal-dim)', border:'1px solid var(--teal-border)', color:'var(--teal)', cursor:'pointer', fontSize:11, fontWeight:600, padding:'4px 8px', borderRadius:6, marginRight:6 }}>Invoice</button>
                        <button onClick={() => removeClient(b.practice_id)}
                          style={{ background:'transparent', border:'none', color:'var(--text3)', cursor:'pointer', fontSize:12 }}>✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        </>
      )}

      {/* ── NOTIFICATIONS ── */}
      {activeTab === 'notify' && (
        <>
          <Card>
            <CardTitle>Monthly workflow reminders</CardTitle>
            <div style={{ fontSize:13, color:'var(--text3)', marginBottom:'1.25rem', lineHeight:1.6 }}>
              These are personal reminders for your monthly client workflow. LeakLens will surface alerts on the Admin Home dashboard when these conditions are met.
            </div>
            {tog('notify_data_collection', 'Data collection reminder', 'Flag clients who have not sent monthly data by day ' + form.data_collection_day + ' of the month')}
            {tog('notify_review_call', 'Monthly review call reminder', 'Flag clients who have not had a review call this month')}
            {tog('notify_overdue', 'Overdue recovery queue alert', 'Flag practices where recovery queue has not been worked in 7+ days')}
            <Divider />
            <div style={S.field}>
              <label style={S.label}>Data collection deadline — day of month</label>
              <div style={S.hint}>Clients who have not sent exports by this day will be flagged on Admin Home</div>
              <input type="number" min="1" max="28" value={form.data_collection_day}
                onChange={e => setForm(f => ({ ...f, data_collection_day: parseInt(e.target.value)||1 }))}
                style={{ ...S.input, maxWidth:80 }} />
            </div>
          </Card>

          <Card>
            <CardTitle>How alerts work</CardTitle>
            <div style={{ fontSize:13, color:'var(--text2)', lineHeight:1.8 }}>
              <div style={{ marginBottom:8 }}><strong style={{ color:'var(--text)' }}>Admin Home dashboard</strong> — the Practices Needing Attention section surfaces any client with a leak score below 60 or overdue data.</div>
              <div style={{ marginBottom:8 }}><strong style={{ color:'var(--text)' }}>Email reminders</strong> — not yet built. Planned for Phase 3 when client count justifies automation.</div>
              <div><strong style={{ color:'var(--text)' }}>For now</strong> — use the Admin Home dashboard as your daily check-in. It gives you everything you need to stay on top of your book of clients at a glance.</div>
            </div>
          </Card>

          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button onClick={handleSave} style={S.saveBtn}>Save preferences</button>
            {saved && <span style={{ fontSize:13, color:'var(--teal)', fontWeight:500 }}>✓ Saved</span>}
          </div>
        </>
      )}
    {invoiceClient && (
      <InvoiceModal
        client={invoiceClient}
        settings={form}
        onClose={() => setInvoiceClient(null)}
      />
    )}
    </div>
  );
}

const S = {
  field:   { display:'flex', flexDirection:'column', gap:5, marginBottom:'1rem' },
  label:   { fontSize:13, fontWeight:500, color:'var(--text2)' },
  hint:    { fontSize:11, color:'var(--text3)' },
  input:   { padding:'9px 12px', borderRadius:8, border:'1px solid var(--border2)', background:'var(--bg3)', color:'var(--text)', fontSize:13, outline:'none' },
  saveBtn: { padding:'10px 20px', borderRadius:8, border:'none', background:'var(--teal)', color:'#0a0c10', fontSize:13, fontWeight:600, cursor:'pointer' },
};
