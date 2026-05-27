import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Card, CardTitle } from './UI';
import { Header } from './Dashboard';

const STEPS = [
  {
    id: 'add_practice',
    phase: 'Setup',
    title: 'Practice added to LeakLens',
    detail: 'Practice name and reporting month saved to your database.',
    time: '2 min',
    action: null,
    autoComplete: true,
  },
  {
    id: 'configure_settings',
    phase: 'Setup',
    title: 'Configure client settings',
    detail: 'Go to Client Settings and select the practice type preset. This sets the average patient value that drives all leak calculations. Family/General = $300, Cosmetic = $550, Implant = $900.',
    time: '3 min',
    action: 'settings',
    actionLabel: 'Open Client Settings →',
    autoComplete: false,
  },
  {
    id: 'send_email',
    phase: 'Outreach',
    title: 'Send data request email to practice',
    detail: 'Email them the data request checklist. Use the template from your LeakLens-Client-Onboarding.docx. Subject line: "LeakLens Revenue Audit — Getting Started". They need to send: call log CSV, appointments CSV, and optionally a leads CSV.',
    time: '5 min',
    action: null,
    autoComplete: false,
    tip: 'They only need 15 minutes to export. Weave exports call logs in one click. Dentrix and Eaglesoft require removing the patient name column before sending.',
  },
  {
    id: 'receive_files',
    phase: 'Outreach',
    title: 'Receive CSV files from practice',
    detail: 'Check each file before uploading. Open in Excel or Numbers and confirm: no patient names, no phone numbers, no SSNs, no insurance IDs. If you see any personal identifiers, email them back and ask them to remove that column.',
    time: '5 min',
    action: null,
    autoComplete: false,
    tip: 'Most practices will accidentally leave a "Patient Name" column in the appointments export. This is the most common mistake. Just ask them to delete that column and resend.',
  },
  {
    id: 'upload_data',
    phase: 'Processing',
    title: 'Upload all three CSV files',
    detail: 'Go to Upload Data. Drop the call log into the Call log zone, appointments into Appointments, and leads into Leads. Wait for the green checkmark on each. All three uploads save a monthly snapshot automatically.',
    time: '10 min',
    action: 'upload',
    actionLabel: 'Open Upload Data →',
    autoComplete: false,
    tip: 'If a zone shows an error, the column names may not match. Check that Call Status, Appointment Type, and Booked? columns are present. The engine handles most naming variations automatically.',
  },
  {
    id: 'review_dashboard',
    phase: 'Processing',
    title: 'Review dashboard and note top leaks',
    detail: 'Open the Dashboard and identify the top 2–3 findings before the call. Write them down. Know the total leak, the leak score, and the single biggest category. Go to Providers and note which provider has the highest no-show rate — specific provider-level insight is powerful on the call.',
    time: '5 min',
    action: 'dashboard',
    actionLabel: 'Open Dashboard →',
    autoComplete: false,
  },
  {
    id: 'export_pdf',
    phase: 'Delivery',
    title: 'Export the PDF report',
    detail: 'Go to Report and click Export PDF. The file downloads as LeakLens-PracticeName-Month.pdf. Open it and review it before the call. Make sure the numbers match what you see on the dashboard.',
    time: '2 min',
    action: 'report',
    actionLabel: 'Open Report →',
    autoComplete: false,
  },
  {
    id: 'schedule_call',
    phase: 'Delivery',
    title: 'Schedule the results call',
    detail: 'Email the practice within 24 hours of receiving their files. Offer two time slots for a 20-minute screen share. Use Google Meet or Zoom. Subject line: "Your LeakLens Audit Results — [Practice Name]". Do not send the PDF before the call — walk them through it live.',
    time: '5 min',
    action: null,
    autoComplete: false,
    tip: 'Do not send the PDF in advance. The call is where you frame the numbers correctly. Sending it cold risks them misreading the total leak number without the context of what is recoverable.',
  },
  {
    id: 'deliver_results',
    phase: 'Delivery',
    title: 'Deliver results on screen share call',
    detail: 'Share your screen logged into LeakLens on their practice. Walk through: Dashboard (lead with recoverable revenue, not total leak), Revenue Leaks (each category with one specific fix), Recovery Queue (show them what the front desk works each morning), PDF (ROI math at the bottom). End with: "This is what monthly monitoring looks like — would this be valuable to have every month?"',
    time: '20 min',
    action: 'dashboard',
    actionLabel: 'Open Dashboard →',
    autoComplete: false,
    tip: 'The framing that closes: "Your team is already doing the work — scheduling, answering phones, following up. This tells them exactly where to focus first."',
  },
  {
    id: 'close_client',
    phase: 'Close',
    title: 'Present $497/month monitoring plan',
    detail: 'After walking through results: "What I just showed you takes me about 30 minutes a month. For $497 I do this every month, track your progress, and give you a monthly call. Based on what we saw today, you have $[recoverable] in realistic recovery opportunity — that is [X]x the cost of monitoring." Then stop talking.',
    time: '10 min',
    action: null,
    autoComplete: false,
    tip: 'The ROI math is already printed on the PDF they are looking at. You are not selling — you are asking if they want to keep the thing they just saw working.',
  },
  {
    id: 'add_billing',
    phase: 'Close',
    title: 'Add to billing tracker',
    detail: 'If they say yes, go to Admin Settings → Billing Tracker → find their practice row → set status to Active → confirm rate at $497 → add their start date. This updates your MRR on the Admin Home dashboard.',
    time: '2 min',
    action: 'admin_settings',
    actionLabel: 'Open Admin Settings →',
    autoComplete: false,
  },
];

const PHASES = ['Setup', 'Outreach', 'Processing', 'Delivery', 'Close'];
const PHASE_COLORS = {
  Setup:      { bg: 'rgba(90,122,74,0.10)',  color: 'var(--teal)'  },
  Outreach:   { bg: 'rgba(46,110,166,0.10)', color: 'var(--blue)'  },
  Processing: { bg: 'rgba(176,125,42,0.10)', color: 'var(--amber)' },
  Delivery:   { bg: 'rgba(123,94,167,0.10)', color: 'var(--purple)'},
  Close:      { bg: 'rgba(90,122,74,0.10)',  color: 'var(--teal)'  },
};

const STORAGE_KEY = (id) => `leaklens_onboarding_${id}`;

export default function OnboardingPage({ practice, setPage }) {
  const [completed, setCompleted] = useState({});
  const [expanded, setExpanded] = useState(null);

  // Load saved progress from localStorage
  useEffect(() => {
    if (!practice?.id) return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY(practice.id));
      const base = saved ? JSON.parse(saved) : {};
      // Auto-complete first step since practice already exists
      base.add_practice = true;
      setCompleted(base);
    } catch {
      setCompleted({ add_practice: true });
    }
  }, [practice?.id]);

  function toggleStep(id, autoComplete) {
    if (autoComplete) return;
    const updated = { ...completed, [id]: !completed[id] };
    setCompleted(updated);
    try {
      localStorage.setItem(STORAGE_KEY(practice?.id), JSON.stringify(updated));
    } catch {}
  }

  function navigate(action) {
    if (action) setPage(action);
  }

  const totalSteps = STEPS.length;
  const doneSteps  = STEPS.filter(s => completed[s.id]).length;
  const pct        = Math.round((doneSteps / totalSteps) * 100);
  const currentPhase = STEPS.find(s => !completed[s.id])?.phase || 'Complete';
  const totalTime  = STEPS.filter(s => !completed[s.id]).reduce((sum, s) => sum + parseInt(s.time), 0);

  function resetProgress() {
    const reset = { add_practice: true };
    setCompleted(reset);
    try { localStorage.setItem(STORAGE_KEY(practice?.id), JSON.stringify(reset)); } catch {}
  }

  return (
    <div className="fade-in">
      <Header title="Client Onboarding" sub={practice?.name || ''} />

      {/* Progress summary */}
      <Card>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem' }}>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:'var(--text)' }}>
              {doneSteps === totalSteps ? '🎉 Onboarding Complete!' : `Step ${doneSteps} of ${totalSteps}`}
            </div>
            <div style={{ fontSize:12, color:'var(--text3)', marginTop:3 }}>
              {doneSteps === totalSteps
                ? 'This client is fully onboarded. Add them to the billing tracker if not already done.'
                : `Current phase: ${currentPhase}  ·  ~${totalTime} min remaining`}
            </div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:28, fontWeight:700, color: pct === 100 ? 'var(--teal)' : 'var(--text)', fontFamily:'var(--mono)' }}>{pct}%</div>
            <div style={{ fontSize:10, color:'var(--text3)' }}>complete</div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height:8, background:'var(--bg3)', borderRadius:999, overflow:'hidden', border:'1px solid var(--border)' }}>
          <div style={{ width:pct+'%', height:'100%', background:'var(--teal)', borderRadius:999, transition:'width 0.4s ease' }} />
        </div>

        {/* Phase pills */}
        <div style={{ display:'flex', gap:6, marginTop:'1rem', flexWrap:'wrap' }}>
          {PHASES.map(phase => {
            const phaseSteps = STEPS.filter(s => s.phase === phase);
            const phaseDone  = phaseSteps.filter(s => completed[s.id]).length;
            const allDone    = phaseDone === phaseSteps.length;
            const pc = PHASE_COLORS[phase];
            return (
              <div key={phase} style={{ padding:'4px 10px', borderRadius:20, fontSize:11, fontWeight:600,
                background: allDone ? pc.bg : 'var(--bg3)',
                color: allDone ? pc.color : 'var(--text3)',
                border: `1px solid ${allDone ? pc.color + '33' : 'var(--border)'}` }}>
                {allDone ? '✓ ' : ''}{phase} ({phaseDone}/{phaseSteps.length})
              </div>
            );
          })}
        </div>
      </Card>

      {/* Steps list */}
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {STEPS.map((step, idx) => {
          const done = !!completed[step.id];
          const isExpanded = expanded === step.id;
          const pc = PHASE_COLORS[step.phase];

          return (
            <div key={step.id}
              style={{ background:'var(--bg2)', border:`1px solid ${done ? 'var(--teal-border)' : 'var(--border)'}`,
                borderRadius:'var(--radius)', overflow:'hidden',
                boxShadow: done ? 'none' : 'var(--shadow-sm)',
                opacity: done ? 0.75 : 1, transition:'all 0.2s' }}>

              {/* Step header */}
              <div style={{ display:'flex', alignItems:'center', gap:12, padding:'0.875rem 1rem', cursor:'pointer' }}
                onClick={() => setExpanded(isExpanded ? null : step.id)}>

                {/* Checkbox */}
                <div onClick={e => { e.stopPropagation(); toggleStep(step.id, step.autoComplete); }}
                  style={{ width:22, height:22, borderRadius:6, border:`2px solid ${done ? 'var(--teal)' : 'var(--border2)'}`,
                    background: done ? 'var(--teal)' : 'transparent', display:'flex', alignItems:'center',
                    justifyContent:'center', flexShrink:0, cursor: step.autoComplete ? 'default' : 'pointer', transition:'all 0.15s' }}>
                  {done && <span style={{ color:'white', fontSize:12, fontWeight:700 }}>✓</span>}
                </div>

                {/* Step number */}
                <div style={{ width:22, height:22, borderRadius:'50%', background:'var(--bg3)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:10, fontWeight:700, color:'var(--text3)', flexShrink:0 }}>
                  {idx + 1}
                </div>

                {/* Title and phase */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                    <span style={{ fontSize:13, fontWeight:600, color: done ? 'var(--text3)' : 'var(--text)',
                      textDecoration: done ? 'line-through' : 'none' }}>
                      {step.title}
                    </span>
                    <span style={{ fontSize:9, fontWeight:700, padding:'2px 7px', borderRadius:10,
                      background: pc.bg, color: pc.color }}>
                      {step.phase}
                    </span>
                  </div>
                </div>

                {/* Time estimate */}
                <div style={{ fontSize:11, color:'var(--text3)', flexShrink:0 }}>{step.time}</div>

                {/* Expand arrow */}
                <div style={{ fontSize:12, color:'var(--text3)', transform: isExpanded ? 'rotate(180deg)' : 'none', transition:'transform 0.2s' }}>▾</div>
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div style={{ padding:'0 1rem 1rem', borderTop:'1px solid var(--border)' }}>
                  <div style={{ paddingTop:'0.875rem' }}>
                    <p style={{ fontSize:13, color:'var(--text2)', lineHeight:1.7, marginBottom: step.tip || step.action ? '0.875rem' : 0 }}>
                      {step.detail}
                    </p>

                    {step.tip && (
                      <div style={{ background:'var(--amber-dim)', border:'1px solid rgba(176,125,42,0.2)',
                        borderRadius:8, padding:'0.75rem', marginBottom:'0.875rem', fontSize:12,
                        color:'var(--text2)', lineHeight:1.6 }}>
                        <strong style={{ color:'var(--amber)' }}>💡 Tip: </strong>{step.tip}
                      </div>
                    )}

                    <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                      {step.action && (
                        <button onClick={() => navigate(step.action)}
                          style={{ padding:'7px 14px', borderRadius:7, border:'none',
                            background:'var(--teal)', color:'white', fontSize:12,
                            fontWeight:600, cursor:'pointer' }}>
                          {step.actionLabel}
                        </button>
                      )}
                      {!step.autoComplete && (
                        <button onClick={() => toggleStep(step.id, false)}
                          style={{ padding:'7px 14px', borderRadius:7,
                            border:'1px solid var(--border2)', background:'transparent',
                            color: done ? 'var(--text3)' : 'var(--teal)',
                            fontSize:12, fontWeight:600, cursor:'pointer' }}>
                          {done ? '↩ Mark incomplete' : '✓ Mark complete'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Reset */}
      <div style={{ marginTop:'1.5rem', textAlign:'center' }}>
        <button onClick={resetProgress}
          style={{ fontSize:12, color:'var(--text3)', background:'transparent', border:'none', cursor:'pointer', textDecoration:'underline' }}>
          Reset onboarding progress
        </button>
      </div>
    </div>
  );
}
