import { useState } from 'react';
import { supabase } from '../supabase';
import { Card, CardTitle, Divider } from './UI';
import { Header } from './Dashboard';

export default function SettingsPage({ practice, updatePractice }) {
  const [form, setForm] = useState({
    name:                      practice?.name || '',
    month:                     practice?.month || '',
    avg_patient_value:         practice?.settings?.avg_patient_value || 300,
    missed_call_booking_rate:  practice?.settings?.missed_call_booking_rate || 0.30,
    lead_conversion_rate:      practice?.settings?.lead_conversion_rate || 0.40,
    no_show_threshold:         practice?.settings?.no_show_threshold || 0.08,
    missed_call_threshold:     practice?.settings?.missed_call_threshold || 0.10,
    cancellation_threshold:    practice?.settings?.cancellation_threshold || 0.10,
    unbooked_lead_threshold:   practice?.settings?.unbooked_lead_threshold || 0.20,
  });
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  if (!practice) return <div style={{color:'var(--text3)',padding:'2rem'}}>Select a practice first.</div>;

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const { name, month, ...settings } = form;
    // Update Supabase
    await supabase.from('practices').update({ name, month, ...settings }).eq('id', practice.id);
    // Update local state
    updatePractice({ name, month, settings });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function field(key, label, hint, type='number', step='1') {
    return (
      <div style={S.field}>
        <label style={S.label}>{label}</label>
        {hint && <div style={S.hint}>{hint}</div>}
        <input
          type={type}
          step={step}
          value={form[key]}
          onChange={e => setForm(f=>({...f,[key]: type==='number'? parseFloat(e.target.value)||0 : e.target.value}))}
          style={S.input}
        />
      </div>
    );
  }

  return (
    <div className="fade-in">
      <Header title="Settings" sub={practice.name} />
      <form onSubmit={handleSave}>
        <Card>
          <CardTitle>Practice info</CardTitle>
          {field('name',  'Practice name', null, 'text')}
          {field('month', 'Reporting month', 'e.g. June 2026', 'text')}
        </Card>

        <Card>
          <CardTitle>Revenue assumptions</CardTitle>
          <div style={{fontSize:13,color:'var(--text3)',marginBottom:'1rem',lineHeight:1.6}}>
            These values are used to calculate estimated revenue leaks. Update them to match this practice's actual averages.
          </div>
          {field('avg_patient_value',        'Average patient value ($)',  'Typical revenue per appointment')}
          {field('missed_call_booking_rate',  'Missed call booking rate',  'Estimated % of missed calls that would have booked (e.g. 0.30 = 30%)', 'number', '0.01')}
          {field('lead_conversion_rate',      'Lead conversion rate',      'Estimated % of unbooked leads that would convert (e.g. 0.40 = 40%)', 'number', '0.01')}
        </Card>

        <Card>
          <CardTitle>Leak score thresholds</CardTitle>
          <div style={{fontSize:13,color:'var(--text3)',marginBottom:'1rem',lineHeight:1.6}}>
            When a rate exceeds these thresholds, points are deducted from the leak score. Lower = stricter.
          </div>
          {field('missed_call_threshold',    'Missed call rate threshold',   'Deducts 15 pts if exceeded (e.g. 0.10 = 10%)', 'number', '0.01')}
          {field('no_show_threshold',        'No-show rate threshold',       'Deducts 15 pts if exceeded', 'number', '0.01')}
          {field('cancellation_threshold',   'Cancellation rate threshold',  'Deducts 10 pts if exceeded', 'number', '0.01')}
          {field('unbooked_lead_threshold',  'Unbooked lead rate threshold', 'Deducts 20 pts if exceeded', 'number', '0.01')}
        </Card>

        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <button type="submit" disabled={saving} style={S.saveBtn}>
            {saving ? 'Saving…' : 'Save settings'}
          </button>
          {saved && <span style={{fontSize:13,color:'var(--teal)',fontWeight:500}}>✓ Saved</span>}
        </div>
      </form>
    </div>
  );
}

const S = {
  field:  {display:'flex',flexDirection:'column',gap:5,marginBottom:'1rem'},
  label:  {fontSize:13,fontWeight:500,color:'var(--text2)'},
  hint:   {fontSize:11,color:'var(--text3)'},
  input:  {padding:'9px 12px',borderRadius:8,border:'1px solid var(--border2)',background:'var(--bg3)',color:'var(--text)',fontSize:14,outline:'none',maxWidth:280},
  saveBtn:{padding:'10px 20px',borderRadius:8,border:'none',background:'var(--teal)',color:'#0a0c10',fontSize:14,fontWeight:600,cursor:'pointer'},
};
