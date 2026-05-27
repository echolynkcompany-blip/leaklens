import { useState } from 'react';

const STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to LeakLens',
    body: 'This is a live demo using sample dental practice data. LeakLens finds hidden revenue leaks from missed calls, no-shows, cancellations, and unbooked leads. Click Next to start the tour.',
    target: null,
    action: null,
  },
  {
    id: 'admin_home',
    title: 'Admin Home — your control room',
    body: 'This is where you see your entire book of business at a glance. Business metrics at the top show MRR, total leak across all clients, and which practices need attention.',
    target: 'home',
    action: 'home',
  },
  {
    id: 'practice',
    title: 'Select a practice',
    body: 'Click on Bright Smile Family Dentistry in the sidebar — this is our high-impact demo practice with four providers and significant revenue leakage.',
    target: null,
    action: 'dashboard',
    practiceId: 'demo3',
  },
  {
    id: 'dashboard',
    title: 'Dashboard — the full picture',
    body: 'The dashboard shows total estimated leak ($27,900), leak score (40/100 — Critical), and all four leak categories. The monthly trend chart shows the leak growing over four months. This is what your practice looks like.',
    target: 'dashboard',
    action: 'dashboard',
  },
  {
    id: 'leaks',
    title: 'Revenue Leaks — where the money goes',
    body: 'This page breaks down exactly what each category costs. Notice the no-show rate is 28% — the healthy benchmark is 8%. That\'s 3.5x the threshold. Every no-show is a chair that sat empty.',
    target: 'leaks',
    action: 'leaks',
  },
  {
    id: 'queue',
    title: 'Recovery Queue — the daily action list',
    body: 'This is what your front desk works every morning. 172 specific items, sorted by value. High priority at the top. Not a report — a to-do list. 15 minutes a day. Check items off as they are handled.',
    target: 'recovery',
    action: 'recovery',
  },
  {
    id: 'providers',
    title: 'Providers — specific insight',
    body: 'No-show and utilization rates broken down by individual provider. This is intelligence your scheduling software does not give you. You can have a specific conversation with a specific provider about a specific problem.',
    target: 'providers',
    action: 'providers',
  },
  {
    id: 'report',
    title: 'PDF Report — your monthly leave-behind',
    body: 'Every month we export a professional PDF report with your numbers, recommendations, and the ROI calculation printed at the bottom. The math makes the argument so you do not have to.',
    target: 'report',
    action: 'report',
  },
  {
    id: 'done',
    title: 'Ready to find your leak?',
    body: 'The first audit is free. No patient data. No commitment. Send us three exports from your existing software and we will have results back to you within 48 hours.',
    target: null,
    action: null,
  },
];

export default function DemoTour({ onNavigate, onSelectPractice, onClose }) {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const current = STEPS[step];
  const isLast  = step === STEPS.length - 1;
  const isFirst = step === 0;

  function handleNext() {
    if (current.action) onNavigate(current.action);
    if (current.practiceId) onSelectPractice(current.practiceId);
    if (isLast) { setVisible(false); onClose?.(); return; }
    setStep(s => s + 1);
  }

  function handleSkip() { setVisible(false); onClose?.(); }

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 999,
      width: 320, background: 'var(--bg2)', border: '1px solid var(--teal-border)',
      borderRadius: 14, boxShadow: '0 8px 32px rgba(26,33,18,0.15)', overflow: 'hidden',
    }}>
      {/* Progress bar */}
      <div style={{ height: 3, background: 'var(--bg3)' }}>
        <div style={{ width: `${((step + 1) / STEPS.length) * 100}%`, height: '100%', background: 'var(--teal)', transition: 'width 0.3s ease' }} />
      </div>

      <div style={{ padding: '18px 20px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: 'var(--teal)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
              {step + 1}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{current.title}</div>
          </div>
          <button onClick={handleSkip} style={{ background: 'transparent', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: '0 0 0 8px' }}>✕</button>
        </div>

        {/* Body */}
        <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.65, marginBottom: 16 }}>
          {current.body}
        </p>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{ height: 3, flex: 1, borderRadius: 2, background: i <= step ? 'var(--teal)' : 'var(--bg3)', transition: 'background 0.2s' }} />
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          {!isFirst && (
            <button onClick={() => setStep(s => s - 1)} style={{ flex: 1, padding: '8px', borderRadius: 7, border: '1px solid var(--border2)', background: 'transparent', color: 'var(--text2)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              ← Back
            </button>
          )}
          <button onClick={handleNext} style={{ flex: 2, padding: '8px', borderRadius: 7, border: 'none', background: 'var(--teal)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            {isLast ? 'Request free audit →' : current.action ? `Go to ${STEPS[step + 1]?.title?.split('—')[0].trim() || 'next'} →` : 'Next →'}
          </button>
        </div>

        {!isFirst && !isLast && (
          <div style={{ textAlign: 'center', marginTop: 10 }}>
            <button onClick={handleSkip} style={{ background: 'transparent', border: 'none', color: 'var(--text3)', fontSize: 11, cursor: 'pointer' }}>
              Skip tour
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
