import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { DEMO_CALLS, DEMO_APPOINTMENTS, DEMO_LEADS, DEMO_SETTINGS, calculateMetrics } from './engine';
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import LeakPage from './components/LeakPage';
import RecoveryPage from './components/RecoveryPage';
import ProvidersPage from './components/ProvidersPage';
import UploadPage from './components/UploadPage';
import ReportPage from './components/ReportPage';
import SettingsPage from './components/SettingsPage';

// Demo practice always available (no DB needed)
const DEMO_PRACTICE = {
  id: 'demo',
  name: 'Sunrise Dental Studio',
  month: 'May 2026',
  settings: DEMO_SETTINGS,
  calls: DEMO_CALLS,
  appts: DEMO_APPOINTMENTS,
  leads: DEMO_LEADS,
  metrics: calculateMetrics(DEMO_CALLS, DEMO_APPOINTMENTS, DEMO_LEADS, DEMO_SETTINGS),
};

export default function App() {
  const [user,             setUser]             = useState(null);
  const [authChecked,      setAuthChecked]      = useState(false);
  const [page,             setPage]             = useState('dashboard');
  const [practices,        setPractices]        = useState([DEMO_PRACTICE]);
  const [activePracticeId, setActivePracticeId] = useState('demo');

  // Check auth on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
      setAuthChecked(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // Load practices from DB when user logs in
  useEffect(() => {
    if (user) loadPractices();
  }, [user]);

  async function loadPractices() {
    const { data: pracData } = await supabase.from('practices').select('*').order('created_at');
    if (!pracData?.length) { setPractices([DEMO_PRACTICE]); return; }

    const loaded = await Promise.all(pracData.map(async (p) => {
      const [{ data: calls }, { data: appts }, { data: leads }] = await Promise.all([
        supabase.from('calls').select('*').eq('practice_id', p.id),
        supabase.from('appointments').select('*').eq('practice_id', p.id),
        supabase.from('leads').select('*').eq('practice_id', p.id),
      ]);
      const settings = {
        avg_patient_value:        p.avg_patient_value,
        missed_call_booking_rate: p.missed_call_booking_rate,
        lead_conversion_rate:     p.lead_conversion_rate,
        no_show_threshold:        p.no_show_threshold,
        missed_call_threshold:    p.missed_call_threshold,
        cancellation_threshold:   p.cancellation_threshold,
        unbooked_lead_threshold:  p.unbooked_lead_threshold,
      };
      const c = calls || []; const a = appts || []; const l = leads || [];
      return { id: p.id, name: p.name, month: p.month, settings, calls: c, appts: a, leads: l, metrics: calculateMetrics(c, a, l, settings) };
    }));

    setPractices([DEMO_PRACTICE, ...loaded]);
    if (loaded.length) setActivePracticeId(loaded[0].id);
  }

  async function addPractice(name, month) {
    const { data, error } = await supabase.from('practices').insert({ name, month }).select().single();
    if (error || !data) { alert('Error saving practice: ' + (error?.message || 'Unknown error')); return; }
    const newPrac = { id: data.id, name: data.name, month: data.month, settings: DEMO_SETTINGS, calls: [], appts: [], leads: [], metrics: calculateMetrics([], [], [], DEMO_SETTINGS) };
    setPractices(prev => [...prev, newPrac]);
    setActivePracticeId(data.id);
    setPage('upload');
  }

  function updatePractice(updates) {
    setPractices(prev => prev.map(p => {
      if (p.id !== activePracticeId) return p;
      const merged = { ...p, ...updates };
      if (updates.settings) merged.settings = { ...p.settings, ...updates.settings };
      merged.metrics = calculateMetrics(merged.calls, merged.appts, merged.leads, merged.settings);
      return merged;
    }));
  }

  const practice = practices.find(p => p.id === activePracticeId) || practices[0];
  const pageProps = { practice, metrics: practice?.metrics, updatePractice, setPage, user };

  const pages = {
    dashboard: Dashboard,
    leaks:     LeakPage,
    recovery:  RecoveryPage,
    providers: ProvidersPage,
    upload:    UploadPage,
    report:    ReportPage,
    settings:  SettingsPage,
  };
  const PageComponent = pages[page] || Dashboard;

  if (!authChecked) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg)',color:'var(--text3)',fontSize:14}}>Loading…</div>;
  if (!user)        return <LoginPage onLogin={setUser} />;

  return (
    <div style={{ display:'flex', minHeight:'100vh' }}>
      <Sidebar
        page={page}
        setPage={setPage}
        practices={practices}
        activePracticeId={activePracticeId}
        setActivePracticeId={setActivePracticeId}
        onAddPractice={addPractice}
        user={user}
      />
      <main style={{ marginLeft:'var(--sidebar)', flex:1, padding:'2rem', maxWidth:'calc(100vw - var(--sidebar))', overflowX:'hidden' }}>
        <PageComponent {...pageProps} />
      </main>
    </div>
  );
}
