import { useState } from 'react';
import { supabase } from '../supabase';
import { VERTICALS } from '../verticals';

const ADMIN_NAV = [
  { id: 'home',          label: 'Admin Home',      icon: '⌂' },
  { id: 'admin_settings',label: 'Admin Settings',  icon: '⚙' },
];

const PRACTICE_NAV = [
  { id: 'onboarding',label: 'Onboarding',      icon: '◎' },
  { id: 'dashboard', label: 'Dashboard',       icon: '⬡' },
  { id: 'leaks',     label: 'Revenue leaks',   icon: '◈' },
  { id: 'recovery',  label: 'Recovery queue',  icon: '◎' },
  { id: 'providers', label: 'Providers',       icon: '◇' },
  { id: 'upload',    label: 'Upload data',     icon: '↑' },
  { id: 'report',    label: 'Report',          icon: '▤' },
  { id: 'settings',  label: 'Client Settings', icon: '◉' },
];

export default function Sidebar({ page, setPage, practices, activePracticeId, setActivePracticeId, onAddPractice, user, activeVertical, setActiveVertical }) {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [month, setMonth] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.reload();
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    await onAddPractice(name.trim(), month.trim() || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
    setName(''); setMonth(''); setShowAdd(false); setSaving(false);
  }

  return (
    <aside style={S.sidebar}>
      {/* Logo */}
      <div style={S.logo}>
        <div style={S.mark}>LL</div>
        <div>
          <div style={S.title}>LeakLens</div>
          <div style={S.sub}>Revenue Intelligence</div>
        </div>
      </div>

      {/* Practices */}

      {/* Vertical badge */}
      {activeVertical && (
        <div style={{ padding:'0.5rem 0.875rem', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <span style={{ fontSize:14 }}>{(VERTICALS[activeVertical]||VERTICALS.dental).icon}</span>
            <span style={{ fontSize:11, fontWeight:700, color:(VERTICALS[activeVertical]||VERTICALS.dental).color }}>{(VERTICALS[activeVertical]||VERTICALS.dental).label}</span>
          </div>
          <button onClick={() => setPage('vertical_selector')}
            style={{ fontSize:10, color:'var(--text3)', background:'transparent', border:'0.5px solid var(--border2)', padding:'2px 8px', borderRadius:5, cursor:'pointer' }}>
            Switch
          </button>
        </div>
      )}

      <div style={S.section}>
        <div style={S.label}>Practices</div>
        <div style={{ maxHeight: 180, overflowY: 'auto' }}>
          {practices.map(p => (
            <button key={p.id} style={{ ...S.practiceBtn, ...(p.id === activePracticeId ? S.practiceBtnActive : {}) }}
              onClick={() => { setActivePracticeId(p.id); setPage('dashboard'); }}>
              <div style={{ ...S.dot, background: p.id === activePracticeId ? 'var(--teal)' : 'var(--text3)' }} />
              <div style={{ flex: 1, textAlign: 'left', overflow: 'hidden' }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: p.id === activePracticeId ? 'var(--text)' : 'var(--text2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                <div style={{ fontSize: 10, color: 'var(--text3)', display: 'flex', gap: 5, alignItems: 'center' }}><span>{p.month}</span>{p.tag && <span style={{ background: p.tag === 'Demo' ? 'rgba(79,142,247,0.15)' : 'rgba(0,200,150,0.12)', color: p.tag === 'Demo' ? 'var(--blue)' : 'var(--teal)', padding: '0px 4px', borderRadius: 3, fontSize: 9, fontWeight: 600 }}>{p.tag}</span>}</div>
              </div>
            </button>
          ))}
        </div>

        {showAdd ? (
          <form onSubmit={handleAdd} style={{ marginTop: 6 }}>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Practice name" style={S.input} autoFocus />
            <input value={month} onChange={e => setMonth(e.target.value)} placeholder="Month (e.g. June 2026)" style={{ ...S.input, marginTop: 5 }} />
            <div style={{ display: 'flex', gap: 5, marginTop: 6 }}>
              <button type="submit" disabled={saving} style={S.addOk}>{saving ? '…' : 'Add'}</button>
              <button type="button" onClick={() => setShowAdd(false)} style={S.addCancel}>Cancel</button>
            </div>
          </form>
        ) : (
          <button onClick={() => setShowAdd(true)} style={S.addBtn}>+ Add practice</button>
        )}
      </div>

      {/* Nav */}
      <div style={{ ...S.section, flex: 1, borderBottom: 'none', overflowY: 'auto' }}>
        <div style={S.label}>Admin</div>
        {ADMIN_NAV.map(item => (
          <button key={item.id} style={{ ...S.navBtn, ...(page === item.id ? S.navActive : {}) }} onClick={() => setPage(item.id)}>
            <span style={{ fontSize: 15, opacity: 0.65 }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
        <div style={{ ...S.label, marginTop: '1rem' }}>Practice</div>
        {PRACTICE_NAV.map(item => (
          <button key={item.id} style={{ ...S.navBtn, ...(page === item.id ? S.navActive : {}) }} onClick={() => setPage(item.id)}>
            <span style={{ fontSize: 15, opacity: 0.65 }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* User */}
      <div style={S.userRow}>
        <div style={S.userAvatar}>{(user?.email?.[0] || 'A').toUpperCase()}</div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div style={{ fontSize: 11, color: 'var(--text2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
          <div style={{ fontSize: 10, color: 'var(--text3)' }}>Admin</div>
        </div>
        <button onClick={handleSignOut} style={S.signOut} title="Sign out">⎋</button>
      </div>
    </aside>
  );
}

const S = {
  sidebar: { width: 'var(--sidebar)', background: 'var(--bg2)', borderRight: '1px solid var(--border)', position: 'fixed', top: 0, left: 0, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 100, boxShadow: 'var(--shadow)' },
  logo: { display: 'flex', alignItems: 'center', gap: 10, padding: '1.25rem 1rem', borderBottom: '1px solid var(--border)', flexShrink: 0 },
  mark: { width: 34, height: 34, borderRadius: 9, background: 'var(--teal)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, fontFamily: 'var(--mono)', flexShrink: 0, boxShadow: '0 2px 6px rgba(90,122,74,0.35)' },
  title: { fontSize: 14, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.3px' },
  sub: { fontSize: 10, color: 'var(--text3)', marginTop: 1 },
  section: { padding: '0.875rem', borderBottom: '1px solid var(--border)', flexShrink: 0 },
  label: { fontSize: 10, fontWeight: 700, color: 'var(--text3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem', padding: '0 4px' },
  practiceBtn: { display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '7px 8px', borderRadius: 8, border: '1px solid transparent', background: 'transparent', cursor: 'pointer', marginBottom: 2, textAlign: 'left' },
  practiceBtnActive: { background: 'var(--teal-dim)', border: '1px solid var(--teal-border)' },
  dot: { width: 7, height: 7, borderRadius: '50%', flexShrink: 0 },
  input: { width: '100%', padding: '7px 10px', borderRadius: 7, border: '1px solid var(--border2)', background: 'var(--bg3)', color: 'var(--text)', fontSize: 12, outline: 'none' },
  addBtn: { width: '100%', padding: '7px 10px', borderRadius: 8, border: '1px dashed var(--border2)', background: 'transparent', color: 'var(--text3)', cursor: 'pointer', fontSize: 12, marginTop: 4, textAlign: 'left' },
  addOk: { flex: 1, padding: '6px', borderRadius: 7, border: 'none', background: 'var(--teal)', color: '#FFFFFF', fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  addCancel: { flex: 1, padding: '6px', borderRadius: 7, border: '1px solid var(--border2)', background: 'transparent', color: 'var(--text2)', fontSize: 12, cursor: 'pointer' },
  navBtn: { display: 'flex', alignItems: 'center', gap: 9, width: '100%', padding: '8px 12px', borderRadius: 8, border: 'none', background: 'transparent', color: 'var(--text2)', cursor: 'pointer', fontSize: 13, marginBottom: 1, textAlign: 'left', fontWeight: 500 },
  navActive: { background: 'var(--teal-dim)', color: 'var(--teal)', fontWeight: 600 },
  userRow: { padding: '0.875rem', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 },
  userAvatar: { width: 30, height: 30, borderRadius: '50%', background: 'var(--teal-dim)', color: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0, border: '1.5px solid var(--teal-border)' },
  signOut: { padding: '5px 8px', borderRadius: 7, border: '1px solid var(--border2)', background: 'transparent', color: 'var(--text3)', fontSize: 13, cursor: 'pointer' },
};
