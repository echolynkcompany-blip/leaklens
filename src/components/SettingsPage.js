import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Card, CardTitle, Divider } from './UI';
import { Header } from './Dashboard';

const PRESETS = [
  { label: 'Family / General',    avg: 300, note: 'Cleanings, fillings, exams.' },
  { label: 'Cosmetic Focus',      avg: 550, note: 'Whitening, veneers, bonding.' },
  { label: 'Implant Focus',       avg: 900, note: 'Implants, bone grafts, surgical.' },
  { label: 'Orthodontics',        avg: 450, note: 'Braces, Invisalign, retainers.' },
  { label: 'Pediatric',           avg: 220, note: 'Children focused, high recall.' },
  { label: 'Multi-Specialty',     avg: 480, note: 'Blended average across services.' },
];

export default function SettingsPage({ practice, updatePractice, deletePractice }) {
  const [form,   setForm]   = useState(null);
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

  const isDemo = practice.isDemo || practice.id?.startsWith('demo');

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const { name, month, ...settings } = form;
    if (!isDemo) {
      await supabase.from('practices').update({ name, month, settings: JSON.stringify(settings) }).eq('id', practice.id);
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
        <input type="number" step={step} value={form[key]}
          onChange={e => setForm(f => ({ ...f, [key]: parseFloat(e.target.value) || 0 }))}
          style={S.input} disabled={isDemo} />
      </div>
    );
  }

  function txt(key, label, hint) {
    return (
      <div style={S.field}>
        <label style={S.label}>{label}</label>
        {hint && <div style={S.hint}>{hint}</div>}
        <input type="text" value={form[key]}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          style={S.input} disabled={isDemo} />
      </div>
    );
  }

  return (
    <div className="fade-in">
      <Header title="Client Settings" sub={practice.name} />

      {isDemo && (
        <div style={{ background:'var(--blue-dim)', border:'1px solid rgba(91,200,245,0.2)', borderRadius:'var(--radius)', padding:'0.875rem 1rem', marginBottom:'1.25rem', fontSize:13, color:'var(--blue)' }}>
          This is a demo practice. Settings are read-only. Add a real practice to configure settings.
        </div>
      )}

      <form onSubmit={handleSave}>
        <Card>
          <CardTitle>Practice info</CardTitle>
          {txt('name',  'Practice name', '')}
          {txt('month', 'Reporting month', 'e.g. May 2026')}
        </Card>

        <Card>
          <CardTitle>Practice type presets</CardTitle>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:'1rem' }}>
            {PRESETS.map(p => (
              <button key={p.label} type="button"
                onClick={() => applyPreset(p)}
                disabled={isDemo}
                style={{ padding:'7px 14px', borderRadius:8, border:`1px solid ${preset===p.label?'var(--teal)':'var(--border2)'}`,
                  background: preset===p.label ? 'var(--teal-dim)' : 'transparent',
                  color: preset===p.label ? 'var(--teal)' : 'var(--text2)', fontSize:12, cursor:'pointer' }}>
                {p.label}
                <span style={{ fontSize:10, color:'var(--text3)', marginLeft:4 }}>${p.avg}</span>
              </button>
            ))}
          </div>
          {num('avg_patient_value', 'Average patient value ($)', 'Used to calculate dollar estimates for all leak categories.')}
        </Card>

        <Card>
          <CardTitle>Revenue assumptions</CardTitle>
          {num('missed_call_booking_rate', 'Missed call booking rate', 'Estimated % of missed calls that would have booked. Default: 0.30', '0.01')}
          {num('lead_conversion_rate',     'Lead conversion rate',     'Estimated % of unbooked leads that would convert. Default: 0.40', '0.01')}
        </Card>

        <Card>
          <CardTitle>Leak score thresholds</CardTitle>
          {num('missed_call_threshold',   'Missed call rate threshold',   'Score deductions start above this rate. Default: 0.10', '0.01')}
          {num('no_show_threshold',       'No-show rate threshold',       'Score deductions start above this rate. Default: 0.08', '0.01')}
          {num('cancellation_threshold',  'Cancellation rate threshold',  'Score deductions start above this rate. Default: 0.10', '0.01')}
          {num('unbooked_lead_threshold', 'Unbooked lead rate threshold', 'Score deductions start above this rate. Default: 0.20', '0.01')}
        </Card>

        {!isDemo && (
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:'1.25rem' }}>
            <button type="submit" disabled={saving} style={S.saveBtn}>
              {saving ? 'Saving…' : 'Save settings'}
            </button>
            {saved && <span style={{fontSize:13,color:'var(--teal)',fontWeight:500}}>✓ Saved — dashboard updated</span>}
          </div>
        )}
      </form>

      {!isDemo && deletePractice && (
        <div style={{ marginTop:'1rem', padding:'1.25rem', background:'var(--red-dim)', border:'1px solid rgba(255,107,107,0.2)', borderRadius:'var(--radius)' }}>
          <div style={{ fontSize:13, fontWeight:700, color:'var(--red)', marginBottom:6 }}>Delete this practice</div>
          <p style={{ fontSize:12, color:'var(--text2)', lineHeight:1.6, marginBottom:12 }}>
            Permanently deletes all data for {practice?.name}. This cannot be undone.
          </p>
          <button onClick={() => {
            if (window.confirm('Permanently delete ' + (practice?.name||'this practice') + '? This cannot be undone.')) {
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
  saveBtn: { padding:'10px 20px', borderRadius:8, border:'none', background:'var(--teal)', color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer' },
};
