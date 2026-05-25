import { useState, useRef } from 'react';
import { supabase } from '../supabase';
import { parseCSV, detectCSVType, normalizeCallRow, normalizeApptRow, normalizeLeadRow } from '../engine';
import { Card, CardTitle } from './UI';
import { Header } from './Dashboard';

const TYPES = [
  { id:'calls', label:'Call log',      hint:'calls.csv — from your phone system',               icon:'◌' },
  { id:'appts', label:'Appointments',  hint:'appointments.csv — Dentrix / Eaglesoft / any PMS', icon:'◇' },
  { id:'leads', label:'Leads',         hint:'leads.csv — CRM, web form, or manual list',        icon:'◉' },
];

export default function UploadPage({ practice, updatePractice }) {
  const [statuses, setStatuses] = useState({});
  const [errors, setErrors]     = useState({});
  const refs = { calls:useRef(), appts:useRef(), leads:useRef() };

  async function handleFile(type, file) {
    if (!file || !practice?.id) return;
    setStatuses(s=>({...s,[type]:'processing…'}));
    setErrors(e=>({...e,[type]:null}));

    try {
      const raw = await parseCSV(file);
      if (!raw.length) throw new Error('File is empty');

      const headers = Object.keys(raw[0]);
      const detected = detectCSVType(headers);
      const useType = type; // trust the zone they dropped into

      let normalized = [];
      if (useType === 'calls' || detected === 'calls') {
        normalized = raw.map(normalizeCallRow).filter(r => r.date || r.name);
        // Delete old, insert new
        await supabase.from('calls').delete().eq('practice_id', practice.id);
        if (normalized.length) {
          await supabase.from('calls').insert(normalized.map(r => ({ ...r, practice_id: practice.id })));
        }
        updatePractice({ calls: normalized });
      } else if (useType === 'appts' || detected === 'appointments') {
        normalized = raw.map(normalizeApptRow).filter(r => r.date || r.patient);
        await supabase.from('appointments').delete().eq('practice_id', practice.id);
        if (normalized.length) {
          await supabase.from('appointments').insert(normalized.map(r => ({ ...r, practice_id: practice.id })));
        }
        updatePractice({ appts: normalized });
      } else if (useType === 'leads' || detected === 'leads') {
        normalized = raw.map(normalizeLeadRow).filter(r => r.date || r.name);
        await supabase.from('leads').delete().eq('practice_id', practice.id);
        if (normalized.length) {
          await supabase.from('leads').insert(normalized.map(r => ({ ...r, practice_id: practice.id })));
        }
        updatePractice({ leads: normalized });
      } else {
        throw new Error('Could not detect file type. Check that headers include words like "patient", "status", "missed", "provider".');
      }

      setStatuses(s=>({...s,[type]:`✓ ${normalized.length} rows saved`}));
    } catch (err) {
      setStatuses(s=>({...s,[type]:null}));
      setErrors(e=>({...e,[type]:err.message}));
    }
  }

  return (
    <div className="fade-in">
      <Header title="Upload data" sub={practice ? `${practice.name} · ${practice.month}` : ''} />

      <div style={{background:'var(--amber-dim)',border:'1px solid rgba(245,166,35,0.25)',borderRadius:'var(--radius)',padding:'0.875rem 1rem',marginBottom:'1.25rem',fontSize:13,color:'var(--text2)'}}>
        <strong style={{color:'var(--amber)'}}>Flexible column mapping.</strong> Headers don't need to match exactly — LeakLens auto-detects columns. Once uploaded, data is saved permanently to this practice.
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1rem',marginBottom:'1.5rem'}}>
        {TYPES.map(ut => (
          <div key={ut.id}>
            <input type="file" accept=".csv" ref={refs[ut.id]} style={{display:'none'}}
              onChange={e => handleFile(ut.id, e.target.files[0])} />
            <div onClick={() => refs[ut.id].current?.click()} style={Z.zone}>
              <div style={{fontSize:26,color:'var(--text3)',marginBottom:'0.75rem'}}>{ut.icon}</div>
              <div style={{fontSize:14,fontWeight:500,color:'var(--text)',marginBottom:4}}>{ut.label}</div>
              <div style={{fontSize:12,color:'var(--text3)'}}>{ut.hint}</div>
              {statuses[ut.id] && <div style={{marginTop:10,fontSize:12,color:'var(--teal)',fontWeight:500}}>{statuses[ut.id]}</div>}
              {errors[ut.id]   && <div style={{marginTop:10,fontSize:12,color:'var(--red)'}}>{errors[ut.id]}</div>}
            </div>
          </div>
        ))}
      </div>

      <Card>
        <CardTitle>Current data</CardTitle>
        <table style={Z.table}>
          <thead><tr>{['Dataset','Records','Status'].map(h=><th key={h} style={Z.th}>{h}</th>)}</tr></thead>
          <tbody>
            {[
              {label:'Call log',     count:practice?.calls?.length},
              {label:'Appointments', count:practice?.appts?.length},
              {label:'Leads',        count:practice?.leads?.length},
            ].map(row=>(
              <tr key={row.label} style={Z.tr}>
                <td style={Z.td}>{row.label}</td>
                <td style={{...Z.td,fontFamily:'var(--mono)',fontSize:12}}>{row.count||0} rows</td>
                <td style={Z.td}>
                  {row.count > 0
                    ? <span style={{fontSize:11,color:'var(--teal)',fontWeight:500}}>✓ Loaded</span>
                    : <span style={{fontSize:11,color:'var(--text3)'}}>No data</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card>
        <CardTitle>Expected column names (flexible)</CardTitle>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1rem',fontSize:12,color:'var(--text3)'}}>
          {[
            {label:'Call log', cols:['Date','Time','Caller Name','Phone Number','Call Status','Duration','Booked?','Notes']},
            {label:'Appointments', cols:['Date','Time','Patient Name','Appointment Type','Provider','Status','Estimated Value','Notes']},
            {label:'Leads', cols:['Date','Lead Name','Phone Number','Source','Requested Service','Status','Booked?','Value','Notes']},
          ].map(g=>(
            <div key={g.label}>
              <div style={{color:'var(--text2)',marginBottom:6,fontWeight:500}}>{g.label}</div>
              {g.cols.map(c=><div key={c} style={{padding:'2px 0'}}>{c}</div>)}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

const Z = {
  zone:{border:'1.5px dashed var(--border2)',borderRadius:'var(--radius-lg)',padding:'2rem 1rem',textAlign:'center',cursor:'pointer',background:'var(--bg2)',transition:'background 0.15s'},
  table:{width:'100%',borderCollapse:'collapse',fontSize:13},
  th:{textAlign:'left',padding:'8px 10px',color:'var(--text3)',borderBottom:'1px solid var(--border)',fontWeight:500,fontSize:10,letterSpacing:'0.06em',textTransform:'uppercase'},
  tr:{borderBottom:'1px solid var(--border)'},
  td:{padding:'10px',color:'var(--text2)'},
};
