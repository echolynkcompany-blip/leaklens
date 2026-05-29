const PRACTICE_NAV = [
  { id: 'onboarding', label: 'Onboarding',     icon: '◎' },
  { id: 'dashboard',  label: 'Dashboard',      icon: '⬡' },
  { id: 'leaks',      label: 'Revenue Leaks',  icon: '◈' },
  { id: 'recovery',   label: 'Recovery Queue', icon: '◎' },
  { id: 'providers',  label: 'Providers',      icon: '◇' },
  { id: 'upload',     label: 'Upload Data',    icon: '↑' },
  { id: 'report',     label: 'Report',         icon: '▤' },
  { id: 'settings',   label: 'Settings',       icon: '◉' },
];

export default function TopNav({ page, setPage, practice }) {
  if (!practice) return null;

  return (
    <div style={S.bar}>
      <div style={S.inner}>
        {/* Practice name */}
        <div style={S.practiceName}>
          <span style={S.dot} />
          <span style={S.name}>{practice.name}</span>
          <span style={S.month}>{practice.month}</span>
          {practice.tag && (
            <span style={{ ...S.tag, ...(practice.isDemo ? S.tagDemo : S.tagClient) }}>
              {practice.tag}
            </span>
          )}
        </div>

        {/* Tab bar */}
        <div style={S.tabs}>
          {PRACTICE_NAV.map(item => {
            const active = page === item.id;
            return (
              <button key={item.id} onClick={() => setPage(item.id)}
                style={{ ...S.tab, ...(active ? S.tabActive : {}) }}>
                <span style={S.tabIcon}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const S = {
  bar: {
    position: 'fixed',
    top: 0,
    left: 'var(--sidebar)',
    right: 0,
    background: 'var(--bg2)',
    borderBottom: '1px solid var(--border)',
    zIndex: 90,
    boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 1.5rem',
    gap: 24,
    height: 52,
  },
  practiceName: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
    paddingRight: 20,
    borderRight: '1px solid var(--border)',
  },
  dot: {
    width: 7, height: 7, borderRadius: '50%',
    background: 'var(--teal)', flexShrink: 0,
  },
  name: {
    fontSize: 13, fontWeight: 700, color: 'var(--text)',
    maxWidth: 160, overflow: 'hidden',
    textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },
  month: {
    fontSize: 11, color: 'var(--text3)',
  },
  tag: {
    fontSize: 9, fontWeight: 700, padding: '2px 6px',
    borderRadius: 4, flexShrink: 0,
  },
  tagDemo: { background: 'rgba(93,173,226,0.15)', color: '#5DADE2' },
  tagClient: { background: 'rgba(29,158,117,0.15)', color: 'var(--teal)' },
  tabs: {
    display: 'flex',
    gap: 2,
    alignItems: 'center',
    overflowX: 'auto',
    flex: 1,
  },
  tab: {
    display: 'flex', alignItems: 'center', gap: 5,
    padding: '6px 12px', borderRadius: 7, border: 'none',
    background: 'transparent', color: 'var(--text2)',
    fontSize: 12, fontWeight: 500, cursor: 'pointer',
    whiteSpace: 'nowrap', transition: 'all 0.15s',
    flexShrink: 0,
  },
  tabActive: {
    background: 'var(--teal-dim)',
    color: 'var(--teal)',
    fontWeight: 700,
  },
  tabIcon: { fontSize: 11, opacity: 0.7 },
};
