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
  card: { width: '100%', maxWidth: 380, background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 'var(--radius-lg)', padding: '2rem' },
  logo: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: '2rem' },
  logoMark: { width: 40, height: 40, borderRadius: 10, background: 'var(--teal)', color: '#0a0c10', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, fontFamily: 'var(--mono)' },
  logoTitle: { fontSize: 18, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.4px' },
  logoSub: { fontSize: 11, color: 'var(--text3)', marginTop: 1 },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 12, fontWeight: 500, color: 'var(--text2)' },
  input: { padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border2)', background: 'var(--bg3)', color: 'var(--text)', fontSize: 14, outline: 'none', transition: 'border-color 0.15s' },
  error: { fontSize: 13, color: 'var(--red)', background: 'var(--red-dim)', padding: '8px 12px', borderRadius: 7 },
  btn: { padding: '11px', borderRadius: 8, background: 'var(--teal)', color: '#0a0c10', fontSize: 14, fontWeight: 600, marginTop: 4, transition: 'opacity 0.15s' },
  footer: { textAlign: 'center', fontSize: 11, color: 'var(--text3)', marginTop: '1.5rem' },
};
