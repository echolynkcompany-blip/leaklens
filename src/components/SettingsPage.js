import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Card, CardTitle, Divider } from './UI';
import { Header } from './Dashboard';

const PRESETS = [
  { label: 'Family / General',    avg: 300, note: 'Cleanings, fillings, exams. Most common practice type.' },
  { label: 'Cosmetic Focus',      avg: 550, note: 'Whitening, veneers, bonding. Higher avg value per visit.' },
  { label: 'Implant Focus',       avg: 900, note: 'Implants, bone grafts, surgical. Highest avg patient value.' },
  { label: 'Orthodontics',        avg: 450, note: 'Braces, Invisalign, retainers.' },
  { label: 'Pediatric',           avg: 220, note: 'Lower production per visit, high recall volume.' },
  { label: 'Multi-Specialty',     avg: 480, note: 'Mix of general, ortho, implant. Use blended average.' },
];

export default function SettingsPage({ practice, updatePractice, deletePractice }) {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [preset, setPreset] = useState('');

  useEffect(() => {
    if (practice) {
      setForm({
        name:                     practice.name || '',
        month:                    practice.month || '',
        avg_patient_value:        practice.settings?.avg_patient_value || 300,
        missed_call_booking_rate: practice.settings?.missed_call_booking_rate || 0.30,
        lead_conversion_rate:     practice.settings?.lead_conversion_rate || 0.40,
        no_show_threshold:        practice.settings?.no_show_threshold || 0.08,
        missed_call_threshold:    practice.settings?.missed_call_threshold || 0.10,
        cancellation_threshold:   practice.settings?.cancellation_threshold || 0.10,
        unbooked_lead_threshold:  practice.settings?.unbooked_lead_threshold || 0.20,
      });
    }
  }, [practice?.id]);

  if (!practice || !form) return <div style={{color:'var(--text3)',padding:'2rem'}}>Select a practice first.</div>;

  const isDemo = practice.id?.startsWith('demo');

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const { name, month, ...settings } = form;
    if (!isDemo) {
      await supabase.from('practices').update({ name, month, ...settings }).eq('id', practice.id);
    }
    updatePractice({ name, month, settings });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function applyPreset(p) {
    setPreset(p.label);
    setForm(f => ({ ...f, avg_patient_value: p.avg }));
  }

  function num(key, label, hint, step = '1') {
    return (
      <div style={S.field}>
        <label style={S.label}>{label}</label>
        {hint && <div style={S.hint}>{hint}</div>}
        <input
          type="number" step={step}
          value={form[key]}
          onChange={e => setForm(f => ({ ...f, [key]: parseFloat(e.target.value) || 0 }))}
          style={S.input}
          disabled={isDemo}
        />
      </div>
    );
  }

  function txt(key, label, hint) {
    return (
      <div style={S.field}>
        <label style={S.label}>{label}</label>
        {hint && <div style={S.hint}>{hint}</div>}
        <input
          type="text"
          value={form[key]}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          style={S.input}
          disabled={isDemo}
        />
      </div>
    );
  }

  return (
    <div className="fade-in">
      <Header title="Settings" sub={practice.name} />

      {isDemo && (
        <div style={{ background:'var(--blue-dim)', border:'1px solid rgba(79,142,247,0.2)', borderRadius:'var(--radius)', padding:'0.875rem 1rem', marginBottom:'1.25rem', fontSize:13, color:'var(--text2)' }}>
          <strong style={{color:'var(--blue)'}}>Demo practice.</strong> Settings are read-only for demo clinics. Add a real practice using the + button in the sidebar to configure custom settings.
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* Practice Info */}
        <Card>
          <CardTitle>Practice info</CardTitle>
          {txt('name',  'Practice name', null)}
          {txt('month', 'Reporting month', 'e.g. June 2026')}
        </Card>

        {/* Practice Type Presets */}
        {!isDemo && (
          <Card>
            <CardTitle>Practice type — quick setup</CardTitle>
            <div style={{fontSize:13,color:'var(--text3)',marginBottom:'1rem',lineHeight:1.6}}>
              Select your practice type to auto-fill the average patient value. You can adjust it manually after.
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginBottom:'1rem'}}>
              {PRESETS.map(p => (
                <button key={p.label} type="button" onClick={() => applyPreset(p)}
                  style={{ padding:'10px 12px', borderRadius:8, border:`1px solid ${preset===p.label?'var(--teal)':'var(--border2)'}`,
                    background: preset===p.label ? 'var(--teal-dim)' : 'var(--bg3)', cursor:'pointer', textAlign:'left' }}>
                  <div style={{fontSize:12,fontWeight:600,color:preset===p.label?'var(--teal)':'var(--text)',marginBottom:2}}>{p.label}</div>
                  <div style={{fontSize:11,color:'var(--text3)'}}>${p.avg} avg value</div>
                </button>
              ))}
            </div>
            {preset && <div style={{fontSize:12,color:'var(--text3)',marginTop:4}}>Selected: {preset} — {PRESETS.find(p=>p.label===preset)?.note}</div>}
          </Card>
        )}

        {/* Revenue Assumptions */}
        <Card>
          <CardTitle>Revenue assumptions</CardTitle>
          <div style={{fontSize:13,color:'var(--text3)',marginBottom:'1rem',lineHeight:1.6}}>
            These values calculate estimated revenue leaks. Match them to this practice's actual averages.
          </div>
          {num('avg_patient_value',        'Average patient value ($)',       'Typical revenue per completed appointment')}

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
            {num('missed_call_booking_rate', 'Missed call booking rate',  'e.g. 0.30 = 30% of missed calls would have booked', '0.01')}
            {num('lead_conversion_rate',     'Lead conversion rate',       'e.g. 0.40 = 40% of unbooked leads would convert', '0.01')}
          </div>

          <Divider />
          <div style={{fontSize:12,color:'var(--text3)',marginBottom:'0.75rem',fontStyle:'italic'}}>
            Industry benchmarks: booking rate 25–35% · lead conversion 35–45%
          </div>
        </Card>

        {/* Leak Score Thresholds */}
        <Card>
          <CardTitle>Leak score thresholds</CardTitle>
          <div style={{fontSize:13,color:'var(--text3)',marginBottom:'1rem',lineHeight:1.6}}>
            When a rate exceeds these thresholds, points are deducted from the leak score.
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
            {num('missed_call_threshold',   'Missed call rate threshold',    'Deducts 15 pts · industry standard: 10%', '0.01')}
            {num('no_show_threshold',       'No-show rate threshold',        'Deducts 15 pts · industry standard: 8%',  '0.01')}
            {num('cancellation_threshold',  'Cancellation rate threshold',   'Deducts 10 pts · industry standard: 10%', '0.01')}
            {num('unbooked_lead_threshold', 'Unbooked lead rate threshold',  'Deducts 20 pts · industry standard: 20%', '0.01')}
          </div>
        </Card>

        {!isDemo && (
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <button type="submit" disabled={saving} style={S.saveBtn}>
              {saving ? 'Saving…' : 'Save settings'}
            </button>
            {saved && <span style={{fontSize:13,color:'var(--teal)',fontWeight:500}}>✓ Saved — dashboard recalculated</span>}
          </div>
        )}
      </form>
    {/* Delete Practice */}
    {!practice?.isDemo && (
      <div style={{ marginTop:'2rem', padding:'1.25rem', background:'var(--red-dim)', border:'1px solid rgba(192,57,43,0.2)', borderRadius:'var(--radius)' }}>
        <div style={{ fontSize:13, fontWeight:700, color:'var(--red)', marginBottom:6 }}>Delete this practice</div>
        <p style={{ fontSize:12, color:'var(--text2)', lineHeight:1.6, marginBottom:12 }}>
          This permanently deletes all data for {practice?.name} including calls, appointments, leads, and snapshots. This cannot be undone.
        </p>
        <button onClick={() => {
          if (window.confirm('Permanently delete ' + practice?.name + ' and all its data? This cannot be undone.')) {
            deletePractice(practice.id);
          }
        }} style={{ padding:'8px 16px', borderRadius:7, border:'none', background:'var(--red)', color:'white', fontSize:12, fontWeight:700, cursor:'pointer' }}>
          Delete practice permanently
        </button>
      </div>
    )}
    </div>
  );
}

const S = {
  field:   { display:'flex', flexDirection:'column', gap:5, marginBottom:'1rem' },
  label:   { fontSize:13, fontWeight:500, color:'var(--text2)' },
  hint:    { fontSize:11, color:'var(--text3)' },
  input:   { padding:'9px 12px', borderRadius:8, border:'1px solid var(--border2)', background:'var(--bg3)', color:'var(--text)', fontSize:14, outline:'none', maxWidth:280 },
  saveBtn: { padding:'10px 20px', borderRadius:8, border:'none', background:'var(--teal)', color:'#0a0c10', fontSize:14, fontWeight:600, cursor:'pointer' },
};
