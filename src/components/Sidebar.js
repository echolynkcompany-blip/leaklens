import { useState } from 'react';
import { supabase } from '../supabase';
import { VERTICALS } from '../verticals';

const ADMIN_NAV = [
  { id: 'home',           label: 'Admin Home',     icon: '⌂' },
  { id: 'admin_settings', label: 'Admin Settings', icon: '⚙' },
];

export default function Sidebar({ page, setPage, practices, activePracticeId, setActivePracticeId, onAddPractice, user, activeVertical, setActiveVertical, isAdmin = true }) {
  const [showAdd, setShowAdd] = useState(false);
  const [name,    setName]    = useState('');
  const [month,   setMonth]   = useState('');
  const [saving,  setSaving]  = useState(false);

  async function handleAdd(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    await onAddPractice(name.trim(), month.trim() || 'May 2026');
    setName(''); setMonth(''); setShowAdd(false); setSaving(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  const email = user?.email || '';
  const initials = email.slice(0, 1).toUpperCase();

  return (
    <div style={S.sidebar}>
      {/* Logo */}
      <div style={S.logo}>
        <div style={S.mark}>LL</div>
        <div>
          <div style={S.title}>LeakLens</div>
          <div style={S.sub}>Revenue Intelligence</div>
        </div>
      </div>

      {/* Vertical badge */}
      {activeVertical && (
        <div style={{ padding:'0.5rem 0.875rem', borderBottom:'1px solid #2A7A6A', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <span style={{ fontSize:14 }}>{(VERTICALS[activeVertical]||VERTICALS.dental).icon}</span>
            <span style={{ fontSize:11, fontWeight:700, color:(VERTICALS[activeVertical]||VERTICALS.dental).color }}>{(VERTICALS[activeVertical]||VERTICALS.dental).label}</span>
          </div>
          {isAdmin && <button onClick={() => setPage('vertical_selector')}
            style={{ fontSize:10, color:'#5DCAA5', background:'transparent', border:'0.5px solid #3A9A88', padding:'2px 8px', borderRadius:5, cursor:'pointer' }}>
            Switch
          </button>}
        </div>
      )}

      {/* Practices list */}
      <div style={S.section}>
        <div style={S.label}>Practices</div>
        <div style={{ maxHeight: 180, overflowY: 'auto' }}>
          {practices.map(p => (
            <button key={p.id}
              style={{ ...S.practiceBtn, ...(p.id === activePracticeId ? S.practiceBtnActive : {}) }}
              onClick={() => { setActivePracticeId(p.id); setPage('dashboard'); }}>
              <div style={{ ...S.dot, background: p.id === activePracticeId ? '#1D9E75' : '#5DCAA5' }} />
              <div style={{ flex:1, textAlign:'left', overflow:'hidden' }}>
                <div style={{ fontSize:12, fontWeight:500, color: p.id === activePracticeId ? '#E8F5F0' : '#9FE1CB', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.name}</div>
                <div style={{ fontSize:10, color:'#5DCAA5', display:'flex', gap:5, alignItems:'center' }}>
                  <span>{p.month}</span>
                  {p.tag && (
                    <span style={{ background: p.tag === 'Demo' ? 'rgba(93,173,226,0.15)' : 'rgba(29,158,117,0.15)', color: p.tag === 'Demo' ? '#5DADE2' : '#1D9E75', padding:'0px 4px', borderRadius:3, fontSize:9, fontWeight:600 }}>{p.tag}</span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {isAdmin && showAdd ? (
          <form onSubmit={handleAdd} style={{ marginTop:6 }}>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Practice name" style={S.input} autoFocus />
            <input value={month} onChange={e => setMonth(e.target.value)} placeholder="Month (e.g. June 2026)" style={{ ...S.input, marginTop:5 }} />
            <div style={{ display:'flex', gap:5, marginTop:6 }}>
              <button type="submit" disabled={saving} style={S.addOk}>{saving ? '…' : 'Add'}</button>
              <button type="button" onClick={() => setShowAdd(false)} style={S.addCancel}>Cancel</button>
            </div>
          </form>
        ) : (
          isAdmin ? <button onClick={() => setShowAdd(true)} style={S.addBtn}>+ Add practice</button> : null
        )}
      </div>

      {/* Admin nav — only visible to admins */}
      <div style={{ flex:1, overflowY:'auto', padding:'0.5rem 0' }}>
        {isAdmin && <div style={S.section}>
          <div style={S.label}>Admin</div>
          {ADMIN_NAV.map(item => (
            <button key={item.id}
              style={{ ...S.navBtn, ...(page === item.id ? S.navActive : {}) }}
              onClick={() => setPage(item.id)}>
              <span style={{ fontSize:15 }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>}
      </div>

      {/* User row */}
      <div style={S.userRow}>
        <div style={S.userAvatar}>{initials}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:11, fontWeight:600, color:'#9FE1CB', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{email}</div>
          <div style={{ fontSize:10, color:'#5DCAA5' }}>Admin</div>
        </div>
        <button onClick={handleLogout} style={S.signOut} title="Sign out">↩</button>
      </div>
    </div>
  );
}

const S = {
  sidebar:          { width:'var(--sidebar)', background:'#0A1F1A', borderRight:'1px solid #1D4A3E', position:'fixed', top:0, left:0, height:'100vh', display:'flex', flexDirection:'column', overflow:'hidden', zIndex:100, boxShadow:'4px 0 20px rgba(0,0,0,0.3)' },
  logo:             { display:'flex', alignItems:'center', gap:10, padding:'1.25rem 1rem', borderBottom:'1px solid #1D4A3E', flexShrink:0 },
  mark:             { width:34, height:34, borderRadius:9, background:'#22C78A', color:'#0A1F1A', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, fontFamily:'var(--mono)', flexShrink:0, boxShadow:'0 2px 8px rgba(34,199,138,0.45)' },
  title:            { fontSize:14, fontWeight:700, color:'#E8F5F0', letterSpacing:'-0.3px' },
  sub:              { fontSize:10, color:'#6AB89E', marginTop:1 },
  section:          { padding:'0.875rem', borderBottom:'1px solid #1D4A3E', flexShrink:0 },
  label:            { fontSize:10, fontWeight:700, color:'#6AB89E', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'0.5rem', padding:'0 4px' },
  practiceBtn:      { display:'flex', alignItems:'center', gap:8, width:'100%', padding:'7px 8px', borderRadius:8, border:'1px solid transparent', background:'transparent', cursor:'pointer', marginBottom:2, textAlign:'left' },
  practiceBtnActive:{ background:'rgba(34,199,138,0.15)', border:'1px solid rgba(34,199,138,0.30)' },
  dot:              { width:7, height:7, borderRadius:'50%', flexShrink:0 },
  input:            { width:'100%', padding:'7px 10px', borderRadius:7, border:'1px solid #2D6B5C', background:'#112A24', color:'#E8F5F0', fontSize:12, outline:'none' },
  addBtn:           { width:'100%', padding:'7px 10px', borderRadius:8, border:'1px dashed #2D6B5C', background:'transparent', color:'#6AB89E', cursor:'pointer', fontSize:12, marginTop:4, textAlign:'left' },
  addOk:            { flex:1, padding:'6px', borderRadius:7, border:'none', background:'#22C78A', color:'#0A1F1A', fontSize:12, fontWeight:700, cursor:'pointer' },
  addCancel:        { flex:1, padding:'6px', borderRadius:7, border:'1px solid #2D6B5C', background:'transparent', color:'#A8D8C8', fontSize:12, cursor:'pointer' },
  navBtn:           { display:'flex', alignItems:'center', gap:9, width:'100%', padding:'8px 12px', borderRadius:8, border:'none', background:'transparent', color:'#A8D8C8', cursor:'pointer', fontSize:13, marginBottom:1, textAlign:'left', fontWeight:500 },
  navActive:        { background:'rgba(34,199,138,0.15)', color:'#22C78A', fontWeight:700 },
  userRow:          { padding:'0.875rem', borderTop:'1px solid #1D4A3E', display:'flex', alignItems:'center', gap:8, flexShrink:0 },
  userAvatar:       { width:30, height:30, borderRadius:'50%', background:'rgba(34,199,138,0.15)', color:'#22C78A', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, flexShrink:0, border:'1.5px solid rgba(34,199,138,0.30)' },
  signOut:          { padding:'5px 8px', borderRadius:7, border:'1px solid #2D6B5C', background:'transparent', color:'#6AB89E', fontSize:13, cursor:'pointer' },
};
