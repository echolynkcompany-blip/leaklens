import { useState } from 'react';
import { supabase } from '../supabase';

export default function LoginPage({ onLogin }) {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) { setError(err.message); setLoading(false); }
    else { onLogin?.(); }
  }

  return (
    <div style={S.page}>
      <div style={S.card}>

        {/* ── LEFT PANEL ── */}
        <div style={S.left}>
          {/* Logo */}
          <div style={S.logoRow}>
            <div style={S.logoMark}>LL</div>
            <div>
              <div style={S.logoName}>LeakLens</div>
              <div style={S.logoSub}>Revenue Intelligence</div>
            </div>
          </div>

          <div style={S.tag}>Admin access</div>
          <h1 style={S.headline}>Welcome<br />back.</h1>
          <div style={S.signInSub}>Sign in to your account</div>

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:0 }}>
            <div style={S.field}>
              <div style={S.label}>Email</div>
              <input
                type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="hello@leaklens.cloud"
                style={S.input}
              />
            </div>
            <div style={S.field}>
              <div style={S.label}>Password</div>
              <input
                type="password" required value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={S.input}
              />
            </div>

            {error && (
              <div style={S.error}>{error}</div>
            )}

            <button type="submit" disabled={loading} style={S.btn}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div style={S.footer}>An Echolynk product · leaklens.cloud</div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={S.right}>
          {/* Floating crosses */}
          {CROSSES.map((c, i) => (
            <div key={i} style={{ position:'absolute', top:c.top, right:c.right, transform:`scale(${c.scale})`, opacity:0.22, pointerEvents:'none' }}>
              <svg width="80" height="80" viewBox="0 0 80 80">
                <rect x="28" y="0" width="24" height="80" rx="4" fill={c.color} />
                <rect x="0" y="28" width="80" height="24" rx="4" fill={c.color} />
              </svg>
            </div>
          ))}

          {/* Right panel text */}
          <div style={S.rightContent}>
            <div style={S.rightHeadline}>Revenue<br />intelligence<br />for healthcare.</div>
            <div style={S.rightSub}>
              Find the revenue your practice is already losing — and recover it.
            </div>
            <div style={S.pillRow}>
              {['🦷 Dental','🩺 Medical','✨ Med Spa','🦴 Chiropractic','👁️ Optometry'].map(v => (
                <span key={v} style={S.pill}>{v}</span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

const CROSSES = [
  { top:  40, right:  80, scale: 1.0,  color:'#7ABEAA' },
  { top:  10, right: 200, scale: 0.55, color:'#5DCAA5' },
  { top: 120, right:  30, scale: 1.3,  color:'#9FE1CB' },
  { top: 240, right: 160, scale: 0.70, color:'#5DCAA5' },
  { top: 310, right:  50, scale: 1.1,  color:'#7ABEAA' },
  { top: 380, right: 220, scale: 0.45, color:'#9FE1CB' },
  { top: 420, right:  80, scale: 0.85, color:'#5DCAA5' },
  { top: 160, right: 280, scale: 0.60, color:'#7ABEAA' },
  { top:  70, right: 340, scale: 0.40, color:'#5DCAA5' },
  { top: 280, right: 340, scale: 0.75, color:'#9FE1CB' },
  { top: 470, right: 160, scale: 0.50, color:'#7ABEAA' },
];

const S = {
  page: {
    minHeight: '100vh',
    background: '#0A2420',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    fontFamily: 'Inter, Arial, sans-serif',
  },
  card: {
    display: 'grid',
    gridTemplateColumns: '400px 1fr',
    borderRadius: 14,
    overflow: 'hidden',
    width: '100%',
    maxWidth: 820,
    boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
  },
  left: {
    background: '#0D3D36',
    padding: '48px 44px',
    display: 'flex',
    flexDirection: 'column',
  },
  logoRow: {
    display: 'flex', alignItems: 'center', gap: 10, marginBottom: 44,
  },
  logoMark: {
    width: 36, height: 36, borderRadius: 9, background: '#1D9E75',
    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 12, fontWeight: 700,
  },
  logoName: { fontSize: 15, fontWeight: 700, color: '#fff' },
  logoSub:  { fontSize: 10, color: '#5DCAA5', marginTop: 1 },
  tag: {
    fontSize: 10, color: '#5DCAA5', letterSpacing: '0.12em',
    textTransform: 'uppercase', fontWeight: 600, marginBottom: 16,
  },
  headline: {
    fontSize: 32, fontWeight: 700, color: '#fff',
    lineHeight: 1.2, margin: '0 0 8px',
  },
  signInSub: {
    fontSize: 12, color: '#5DCAA5', marginBottom: 32,
    letterSpacing: '0.04em', textTransform: 'uppercase',
  },
  field: { marginBottom: 18 },
  label: {
    fontSize: 10, color: '#7ABEAA', letterSpacing: '0.1em',
    textTransform: 'uppercase', marginBottom: 7, fontWeight: 600,
  },
  input: {
    width: '100%', padding: '11px 14px',
    background: '#1A5248', border: '0.5px solid #2A7A6A',
    borderRadius: 7, color: '#fff', fontSize: 13, outline: 'none',
    fontFamily: 'Inter, Arial, sans-serif',
  },
  error: {
    fontSize: 12, color: '#FF8A80', background: 'rgba(255,80,80,0.12)',
    border: '0.5px solid rgba(255,80,80,0.25)', borderRadius: 6,
    padding: '8px 12px', marginBottom: 12,
  },
  btn: {
    width: '100%', padding: '13px', background: '#1D9E75',
    border: 'none', borderRadius: 7, color: '#fff', fontSize: 13,
    fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
    cursor: 'pointer', marginTop: 4, fontFamily: 'Inter, Arial, sans-serif',
    transition: 'background 0.15s',
  },
  footer: {
    marginTop: 'auto', paddingTop: 32, fontSize: 11,
    color: '#3A7A6A', textAlign: 'center',
  },
  right: {
    background: '#0A5C5A',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 500,
  },
  rightContent: {
    position: 'relative', zIndex: 1,
    textAlign: 'center', padding: '40px 32px',
  },
  rightHeadline: {
    fontSize: 34, fontWeight: 700, color: '#fff',
    lineHeight: 1.2, marginBottom: 16,
  },
  rightSub: {
    fontSize: 13, color: '#7ABEAA', lineHeight: 1.7,
    maxWidth: 200, margin: '0 auto 24px',
  },
  pillRow: {
    display: 'flex', flexWrap: 'wrap', gap: 6,
    justifyContent: 'center',
  },
  pill: {
    fontSize: 11, background: 'rgba(255,255,255,0.08)',
    color: '#9FE1CB', padding: '4px 10px',
    borderRadius: 20, border: '0.5px solid rgba(157,225,203,0.2)',
  },
};
