import { useState } from 'react';
import { supabase } from '../supabase';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      onLogin(data.user);
    }
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.card} className="fade-in">
        <div style={styles.logo}>
          <div style={styles.logoMark}>LL</div>
          <div>
            <div style={styles.logoTitle}>LeakLens</div>
            <div style={styles.logoSub}>Revenue Intelligence · Admin</div>
          </div>
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@echolynk.io"
              required
              style={styles.input}
              autoComplete="email"
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={styles.input}
              autoComplete="current-password"
            />
          </div>
          {error && <div style={styles.error}>{error}</div>}
          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div style={styles.footer}>An Echolynk product</div>
      </div>
    </div>
  );
}

const styles = {
  wrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '1rem' },
  card: { width: '100%', maxWidth: 400, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2.25rem', boxShadow: 'var(--shadow-lg)' },
  logo: { display: 'flex', alignItems: 'center', gap: 14, marginBottom: '2rem' },
  logoMark: { width: 44, height: 44, borderRadius: 11, background: 'var(--teal)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, fontFamily: 'var(--mono)', boxShadow: '0 3px 8px rgba(90,122,74,0.35)' },
  logoTitle: { fontSize: 20, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.4px' },
  logoSub: { fontSize: 12, color: 'var(--text3)', marginTop: 2 },
  form: { display: 'flex', flexDirection: 'column', gap: '1.1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 12, fontWeight: 600, color: 'var(--text2)', letterSpacing: '0.02em' },
  input: { padding: '11px 14px', borderRadius: 9, border: '1.5px solid var(--border2)', background: 'var(--bg3)', color: 'var(--text)', fontSize: 14, outline: 'none', transition: 'border-color 0.15s' },
  error: { fontSize: 13, color: 'var(--red)', background: 'var(--red-dim)', padding: '9px 12px', borderRadius: 8, border: '1px solid rgba(192,57,43,0.15)' },
  btn: { padding: '12px', borderRadius: 9, background: 'var(--teal)', color: '#FFFFFF', fontSize: 14, fontWeight: 700, marginTop: 4, transition: 'opacity 0.15s', boxShadow: '0 2px 6px rgba(90,122,74,0.30)' },
  footer: { textAlign: 'center', fontSize: 11, color: 'var(--text3)', marginTop: '1.5rem' },
};
