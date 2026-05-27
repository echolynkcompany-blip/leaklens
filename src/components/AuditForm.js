import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuditForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', practice: '', role: '', phone: '', email: '',
    software: '', providers: '', message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    // Build mailto link as fallback — opens their email client with form data pre-filled
    const body = `Free Audit Request\n\nName: ${form.name}\nPractice: ${form.practice}\nRole: ${form.role}\nPhone: ${form.phone}\nEmail: ${form.email}\nSoftware: ${form.software}\nProviders: ${form.providers}\nMessage: ${form.message}`;
    const mailto = `mailto:hello@leaklens.cloud?subject=Free Audit Request — ${encodeURIComponent(form.practice)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setTimeout(() => { setSending(false); setSubmitted(true); }, 800);
  }

  if (submitted) return (
    <div style={P.wrap}>
      <nav style={P.nav}>
        <div style={P.logo} onClick={() => navigate('/')} >
          <div style={P.mark}>LL</div>
          <div style={{ fontSize:15, fontWeight:700, color:'var(--text,#1A2112)' }}>LeakLens</div>
        </div>
      </nav>
      <div style={{ maxWidth:520, margin:'80px auto', textAlign:'center', padding:'0 24px' }}>
        <div style={{ width:64, height:64, borderRadius:'50%', background:'var(--teal-dim,#ECF3E7)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px', fontSize:28 }}>✓</div>
        <h1 style={{ fontSize:26, fontWeight:700, color:'var(--text,#1A2112)', marginBottom:12 }}>Request received</h1>
        <p style={{ fontSize:15, color:'var(--text2,#4A5C3A)', lineHeight:1.7, marginBottom:8 }}>
          Your email client should have opened with your request details. If it did not, email us directly at <a href="mailto:hello@leaklens.cloud" style={{ color:'var(--teal,#5A7A4A)' }}>hello@leaklens.cloud</a>.
        </p>
        <p style={{ fontSize:14, color:'var(--text3,#8A9A78)', lineHeight:1.7, marginBottom:32 }}>
          We will be in touch within 24 hours to confirm your free audit and send the data request checklist.
        </p>
        <button onClick={() => navigate('/')} style={P.btnPrimary}>← Back to home</button>
      </div>
    </div>
  );

  return (
    <div style={P.wrap}>
      <nav style={P.nav}>
        <div style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }} onClick={() => navigate('/')}>
          <div style={P.mark}>LL</div>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:'var(--text,#1A2112)' }}>LeakLens</div>
            <div style={{ fontSize:10, color:'var(--text3,#8A9A78)' }}>An Echolynk Product</div>
          </div>
        </div>
        <button onClick={() => navigate('/')} style={P.backBtn}>← Back to home</button>
      </nav>

      <div style={{ maxWidth:680, margin:'0 auto', padding:'56px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom:40 }}>
          <div style={P.tag}>Free revenue audit</div>
          <h1 style={{ fontSize:30, fontWeight:700, color:'var(--text,#1A2112)', margin:'12px 0 12px', lineHeight:1.25 }}>
            Request your free audit
          </h1>
          <p style={{ fontSize:15, color:'var(--text2,#4A5C3A)', lineHeight:1.7, maxWidth:520 }}>
            Fill out the form below and we will send you the data request checklist within 24 hours. No patient data required. No commitment.
          </p>
        </div>

        {/* What to expect */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:40 }}>
          {[
            { n:'1', label:'You send 3 exports', sub:'Call log, appointments, leads — from your existing software' },
            { n:'2', label:'We process in 48 hrs', sub:'Full analysis benchmarked against industry standards' },
            { n:'3', label:'20-min results call', sub:'We walk you through your numbers and recovery plan' },
          ].map(s => (
            <div key={s.n} style={{ background:'var(--bg2,#fff)', border:'0.5px solid var(--border,#E2E6DA)', borderRadius:10, padding:'16px', borderTop:'3px solid var(--teal,#5A7A4A)' }}>
              <div style={{ fontSize:11, fontWeight:700, color:'var(--teal,#5A7A4A)', marginBottom:6 }}>Step {s.n}</div>
              <div style={{ fontSize:13, fontWeight:600, color:'var(--text,#1A2112)', marginBottom:4 }}>{s.label}</div>
              <div style={{ fontSize:12, color:'var(--text3,#8A9A78)', lineHeight:1.5 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ background:'var(--bg2,#fff)', border:'0.5px solid var(--border,#E2E6DA)', borderRadius:14, padding:'32px' }}>
          <div style={P.formTitle}>Your information</div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
            <div style={P.field}>
              <label style={P.label}>Your name <span style={P.req}>*</span></label>
              <input required value={form.name} onChange={e=>set('name',e.target.value)} placeholder="First and last name" style={P.input} />
            </div>
            <div style={P.field}>
              <label style={P.label}>Practice name <span style={P.req}>*</span></label>
              <input required value={form.practice} onChange={e=>set('practice',e.target.value)} placeholder="e.g. Sunrise Dental Studio" style={P.input} />
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
            <div style={P.field}>
              <label style={P.label}>Your role <span style={P.req}>*</span></label>
              <select required value={form.role} onChange={e=>set('role',e.target.value)} style={P.input}>
                <option value="">Select role</option>
                <option>Practice Owner / Dentist</option>
                <option>Office Manager</option>
                <option>Operations Director</option>
                <option>Front Desk Lead</option>
                <option>Other</option>
              </select>
            </div>
            <div style={P.field}>
              <label style={P.label}>Number of providers</label>
              <select value={form.providers} onChange={e=>set('providers',e.target.value)} style={P.input}>
                <option value="">Select</option>
                <option>1 provider (solo)</option>
                <option>2–3 providers</option>
                <option>4–6 providers</option>
                <option>7+ providers</option>
              </select>
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
            <div style={P.field}>
              <label style={P.label}>Email address <span style={P.req}>*</span></label>
              <input required type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="you@yourpractice.com" style={P.input} />
            </div>
            <div style={P.field}>
              <label style={P.label}>Phone number</label>
              <input type="tel" value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="(813) 000-0000" style={P.input} />
            </div>
          </div>

          <div style={{ ...P.field, marginBottom:16 }}>
            <label style={P.label}>Practice management software</label>
            <select value={form.software} onChange={e=>set('software',e.target.value)} style={P.input}>
              <option value="">Select your software</option>
              <option>Dentrix</option>
              <option>Eaglesoft</option>
              <option>Curve Dental</option>
              <option>Open Dental</option>
              <option>Weave (phone system)</option>
              <option>Other / Not sure</option>
            </select>
            <div style={{ fontSize:11, color:'var(--text3,#8A9A78)', marginTop:4 }}>Helps us send you the right export instructions</div>
          </div>

          <div style={{ ...P.field, marginBottom:28 }}>
            <label style={P.label}>Anything you want us to know? <span style={{ color:'var(--text3,#8A9A78)', fontWeight:400 }}>(optional)</span></label>
            <textarea value={form.message} onChange={e=>set('message',e.target.value)} placeholder="e.g. We have been struggling with no-shows lately, or we recently switched phone systems..." rows={3} style={{ ...P.input, resize:'vertical', lineHeight:1.6 }} />
          </div>

          {/* Privacy note */}
          <div style={{ background:'var(--teal-dim,#ECF3E7)', border:'0.5px solid rgba(90,122,74,0.25)', borderRadius:8, padding:'12px 14px', marginBottom:24, fontSize:12, color:'var(--text2,#4A5C3A)', lineHeight:1.6 }}>
            <strong style={{ color:'var(--teal,#5A7A4A)' }}>Your data is safe.</strong> We never request or store patient information. The three CSV exports we will ask for contain only operational data — call statuses, appointment types, and lead sources. No patient names, no records, no HIPAA concern.
          </div>

          <button type="submit" disabled={sending} style={{ ...P.btnPrimary, width:'100%', padding:'14px', fontSize:15 }}>
            {sending ? 'Submitting…' : 'Request my free audit →'}
          </button>

          <p style={{ textAlign:'center', fontSize:12, color:'var(--text3,#8A9A78)', marginTop:12 }}>
            We will respond within 24 hours · hello@leaklens.cloud · 813-904-2995
          </p>
        </form>
      </div>
    </div>
  );
}

const P = {
  wrap: { fontFamily:'var(--font,Inter,Arial,sans-serif)', background:'var(--bg,#F7F8F5)', minHeight:'100vh' },
  nav: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 48px', borderBottom:'0.5px solid var(--border,#E2E6DA)', background:'var(--bg2,#fff)', position:'sticky', top:0, zIndex:100 },
  mark: { width:34, height:34, borderRadius:9, background:'var(--teal,#5A7A4A)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700 },
  logo: { display:'flex', alignItems:'center', gap:10, cursor:'pointer' },
  backBtn: { background:'transparent', border:'0.5px solid var(--border2,#C8CEBC)', color:'var(--text2,#4A5C3A)', padding:'7px 14px', borderRadius:7, fontSize:13, cursor:'pointer' },
  tag: { display:'inline-block', background:'var(--teal-dim,#ECF3E7)', color:'var(--teal,#5A7A4A)', fontSize:11, fontWeight:600, padding:'5px 12px', borderRadius:20, letterSpacing:'0.06em', textTransform:'uppercase' },
  formTitle: { fontSize:13, fontWeight:700, color:'var(--text,#1A2112)', letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:20, paddingBottom:12, borderBottom:'0.5px solid var(--border,#E2E6DA)' },
  field: { display:'flex', flexDirection:'column', gap:5 },
  label: { fontSize:12, fontWeight:600, color:'var(--text2,#4A5C3A)' },
  req: { color:'var(--teal,#5A7A4A)' },
  input: { padding:'10px 12px', borderRadius:8, border:'1px solid var(--border2,#C8CEBC)', background:'var(--bg3,#F0F2EC)', color:'var(--text,#1A2112)', fontSize:13, outline:'none', fontFamily:'inherit' },
  btnPrimary: { background:'var(--teal,#5A7A4A)', color:'#fff', border:'none', padding:'13px 28px', borderRadius:9, fontSize:15, fontWeight:700, cursor:'pointer' },
};
