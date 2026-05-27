import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  const [showDemo, setShowDemo] = useState(false);
  const [demoEmail, setDemoEmail] = useState('');
  const [demoSent, setDemoSent] = useState(false);

  function handleDemoRequest(e) {
    e.preventDefault();
    const body = `Demo Request\n\nEmail: ${demoEmail}`;
    window.location.href = `mailto:hello@leaklens.cloud?subject=Demo Request — ${encodeURIComponent(demoEmail)}&body=${encodeURIComponent(body)}`;
    setDemoSent(true);
  }

  return (
    <div style={{ fontFamily: 'var(--font, Inter, Arial, sans-serif)', background: 'var(--bg, #F7F8F5)', minHeight: '100vh' }}>

      {/* ── NAV ── */}
      <nav style={N.nav}>
        <div style={N.logo}>
          <div style={N.mark}>LL</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text, #1A2112)' }}>LeakLens</div>
            <div style={{ fontSize: 10, color: 'var(--text3, #8A9A78)' }}>An Echolynk Product</div>
          </div>
        </div>
        <div style={N.links}>
          <a href="#how" style={N.link}>How it works</a>
          <a href="#product" style={N.link}>What we find</a>
          <a href="#pricing" style={N.link}>Pricing</a>
          <a href="mailto:hello@leaklens.cloud" style={N.link}>Contact</a>
          <button onClick={() => navigate('/app')} style={N.loginBtn}>Admin login</button>
          <button style={N.ctaBtn}>Get free audit</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={S.hero}>
        <div style={S.tag}>Revenue Intelligence for Dental Practices · Tampa Bay, FL</div>
        <h1 style={S.h1}>
          Your practice is losing money.<br />
          <span style={{ color: 'var(--teal, #5A7A4A)' }}>We find exactly where.</span>
        </h1>
        <p style={S.heroSub}>
          We process your operational data and deliver a complete revenue leak report — missed calls, no-shows, cancellations, unbooked leads — with a daily recovery list for your front desk. No patient data. No new software to learn.
        </p>
        <div style={S.ctaRow}>
          <button onClick={() => navigate('/audit')} style={S.btnPrimary}>
            Get your free audit →
          </button>
          <button onClick={() => setShowDemo(true)} style={S.btnSecondary}>
            ▶ See the demo
          </button>
        </div>
        <div style={S.statsRow}>
          {[
            { num: '$8–15k', label: 'avg monthly leak per practice' },
            { num: '48 hrs', label: 'from data to results' },
            { num: '6–21x', label: 'return on monitoring cost' },
            { num: '$0', label: 'cost for your first audit' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--teal, #5A7A4A)', fontFamily: 'monospace' }}>{s.num}</div>
              <div style={{ fontSize: 12, color: 'var(--text3, #8A9A78)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── THE PROBLEM ── */}
      <section id="how" style={{ ...S.section, background: 'var(--bg2, #fff)' }}>
        <div style={S.tag}>The problem</div>
        <h2 style={S.h2}>Revenue you already earned — slipping away daily</h2>
        <p style={S.sectionSub}>Your scheduling software records these events. Nobody is calculating what they cost you. Until now.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16, marginTop: 32 }}>
          {[
            { amt: '$1,440', title: 'Missed calls', body: 'The average practice misses 35–40% of incoming calls. Each one is a potential appointment that went to a competitor. Your phone system logs them. LeakLens calculates the revenue impact.' },
            { amt: '$2,400', title: 'No-shows', body: 'A confirmed appointment that becomes a no-show is a chair that sat empty. The healthy benchmark is under 8%. Most practices sit at 12–20% without knowing it.' },
            { amt: '$1,530', title: 'Unfilled cancellations', body: 'When a patient cancels, the slot often goes unfilled because there is no waitlist process. That is not a patient problem — it is a systems problem. LeakLens quantifies it.' },
            { amt: '$2,880', title: 'Unbooked leads', body: 'Research shows responding to an inquiry within 5 minutes converts at 68%. After 2 hours: 17%. Your practice has leads that never became patients. We find them.' },
          ].map(c => (
            <div key={c.title} style={S.painCard}>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--red, #C0392B)', fontFamily: 'monospace', marginBottom: 6 }}>{c.amt}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text, #1A2112)', marginBottom: 6 }}>{c.title}</div>
              <div style={{ fontSize: 13, color: 'var(--text2, #4A5C3A)', lineHeight: 1.65 }}>{c.body}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 11, color: 'var(--text3, #8A9A78)', marginTop: 16, fontStyle: 'italic' }}>
          Example figures from a Tampa Bay general dentistry practice. Results vary by practice type and volume.
        </p>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={S.section}>
        <div style={S.tag}>How it works</div>
        <h2 style={S.h2}>Three steps. 48 hours. No patient data.</h2>
        <p style={S.sectionSub}>We designed this to require as little of your time as possible.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, marginTop: 32 }}>
          {[
            { n: '1', title: 'You send three exports', body: 'Export your call log, appointment history, and lead activity from your existing software. Remove the patient name column. Email the files to hello@leaklens.cloud.', note: 'No patient names · No records · No HIPAA concern' },
            { n: '2', title: 'We process your data', body: 'We upload your data, configure it for your practice type, and run the full analysis. Every number is benchmarked against published industry data — ADA, Dental Intel, Practice by Numbers.', note: 'Completed within 48 hours of receiving your files' },
            { n: '3', title: 'We deliver your results', body: 'We schedule a 20-minute screen share call, walk you through your dashboard live, and deliver a branded PDF report. You see what your practice is losing and what to do about it starting tomorrow.', note: 'PDF report included · No commitment required' },
          ].map(step => (
            <div key={step.n} style={S.howCard}>
              <div style={S.howNum}>{step.n}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text, #1A2112)', marginBottom: 8 }}>{step.title}</div>
              <p style={{ fontSize: 13, color: 'var(--text2, #4A5C3A)', lineHeight: 1.65, marginBottom: 10 }}>{step.body}</p>
              <div style={{ fontSize: 11, color: 'var(--teal, #5A7A4A)', fontWeight: 600 }}>{step.note}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRODUCT SCREENSHOTS ── */}
      <section id="product" style={{ ...S.section, background: 'var(--bg2, #fff)' }}>
        <div style={S.tag}>The product</div>
        <h2 style={S.h2}>What your results look like</h2>
        <p style={S.sectionSub}>Here is a preview of what we show you on the results call — your actual data, your actual numbers.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginTop: 32 }}>
          {/* Dashboard mockup */}
          <div>
            <div style={S.screenLabel}>Dashboard — your practice at a glance</div>
            <div style={S.screenMock}>
              <div style={S.screenBar} />
              <div style={S.screenHeader}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text, #1A2112)' }}>Overview</span>
                <span style={{ fontSize: 10, color: 'var(--text3, #8A9A78)' }}>Tele Dental · May 2026</span>
              </div>
              <div style={{ padding: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 12 }}>
                  {[['Total leak','$8,250','#C0392B'],['Leak score','40/100','#B07D2A'],['Recoverable','$3,165','#5A7A4A']].map(([l,v,c])=>(
                    <div key={l} style={{ background:'var(--bg3,#F0F2EC)', borderRadius:7, padding:'10px 12px' }}>
                      <div style={{ fontSize:9, color:'var(--text3,#8A9A78)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:4 }}>{l}</div>
                      <div style={{ fontSize:16, fontWeight:700, color:c, fontFamily:'monospace' }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background:'var(--bg3,#F0F2EC)', borderRadius:7, padding:'10px 12px' }}>
                  <div style={{ fontSize:9, color:'var(--text3,#8A9A78)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:8 }}>Leak breakdown</div>
                  <div style={{ display:'flex', gap:6, alignItems:'flex-end', height:60 }}>
                    {[['Calls','#C0392B',28],['No-shows','#B07D2A',52],['Cancels','#7B5EA7',36],['Leads','#2E6EA6',48]].map(([l,c,h])=>(
                      <div key={l} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center' }}>
                        <div style={{ width:'100%', height:h, background:c, opacity:0.8, borderRadius:'3px 3px 0 0' }} />
                        <div style={{ fontSize:8, color:'var(--text3,#8A9A78)', marginTop:4 }}>{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recovery Queue mockup */}
          <div>
            <div style={S.screenLabel}>Recovery queue — your daily action list</div>
            <div style={S.screenMock}>
              <div style={S.screenBar} />
              <div style={S.screenHeader}>
                <span style={{ fontSize:11, fontWeight:600, color:'var(--text,#1A2112)' }}>Recovery queue</span>
                <span style={{ fontSize:10, color:'var(--text3,#8A9A78)' }}>24 open items</span>
              </div>
              <div style={{ padding:14 }}>
                {[
                  ['High','#FDECEA','#C0392B','Missed call — Implant inquiry 9:33 AM','$2,800'],
                  ['High','#FDECEA','#C0392B','No-show — Crown prep 2:00 PM','$1,250'],
                  ['Med','#FFF8E7','#B07D2A','Unbooked lead — Root canal web form','$1,100'],
                  ['Med','#FFF8E7','#B07D2A','Missed call — New patient 11:22 AM','$320'],
                  ['Low','var(--bg3,#F0F2EC)','var(--text3,#8A9A78)','Voicemail — Existing patient callback','$285'],
                ].map(([pri,bg,color,text,amt], i)=>(
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 0', borderBottom: i < 4 ? '0.5px solid var(--border,#E2E6DA)' : 'none' }}>
                    <span style={{ fontSize:9, fontWeight:700, padding:'2px 6px', borderRadius:4, background:bg, color, flexShrink:0 }}>{pri}</span>
                    <span style={{ fontSize:11, color:'var(--text,#1A2112)', flex:1 }}>{text}</span>
                    <span style={{ fontSize:11, color:'#C0392B', fontFamily:'monospace', fontWeight:700 }}>{amt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ ...S.screenLabel, marginTop:20 }}>PDF report — your monthly leave-behind</div>
            <div style={S.screenMock}>
              <div style={S.screenBar} />
              <div style={S.screenHeader}>
                <span style={{ fontSize:11, fontWeight:600, color:'var(--text,#1A2112)' }}>Monthly report</span>
                <span style={{ fontSize:10, background:'var(--teal,#5A7A4A)', color:'#fff', padding:'2px 8px', borderRadius:4, cursor:'pointer' }}>↓ Export PDF</span>
              </div>
              <div style={{ padding:14 }}>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:12 }}>
                  {[['Est. monthly leak','$8,250','#C0392B'],['Recoverable','$3,165','#5A7A4A'],['ROI at $497/mo','6.4x','#5A7A4A']].map(([l,v,c])=>(
                    <div key={l} style={{ textAlign:'center', padding:'8px 0' }}>
                      <div style={{ fontSize:9, color:'var(--text3,#8A9A78)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:4 }}>{l}</div>
                      <div style={{ fontSize:16, fontWeight:700, color:c, fontFamily:'monospace' }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background:'var(--teal-dim,#ECF3E7)', border:'1px solid rgba(90,122,74,0.25)', borderRadius:7, padding:'10px 12px', borderLeft:'3px solid var(--teal,#5A7A4A)' }}>
                  <div style={{ fontSize:11, color:'var(--text2,#4A5C3A)', lineHeight:1.6, fontStyle:'italic' }}>
                    "Based on data reviewed, Tele Dental may be losing approximately $8,250/month. The realistically recoverable amount is $3,165 — at $497/month monitoring that is a <strong>6.4x return</strong>."
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ textAlign:'center', marginTop:32 }}>
          <button onClick={() => window.open('https://y-six-zeta-18.vercel.app', '_blank')} style={S.btnSecondary}>
            ▶ Try the live demo
          </button>
          <div style={{ fontSize:12, color:'var(--text3,#8A9A78)', marginTop:8 }}>Opens the LeakLens demo with sample practice data — no login required</div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={S.section}>
        <div style={S.tag}>Pricing</div>
        <h2 style={S.h2}>Simple, transparent, ROI-positive from day one</h2>
        <p style={S.sectionSub}>Every engagement starts with a free audit. No risk. No commitment. No patient data required.</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginTop:32 }}>
          {[
            { badge:'Start here', price:'$0', period:'one-time — free audit', title:'Free Revenue Audit', sub:'See exactly what your practice is losing before you spend a dollar.', items:['One month of data analyzed','Full dashboard walkthrough','20-minute results call','PDF report included','No patient data required'], primary:false },
            { badge:'Most popular', price:'$497', period:'per month — Tier 1', title:'Monthly Monitoring', sub:'Monthly analysis, recovery queue, and a results call every month.', items:['Monthly data processing','Live recovery queue','Monthly review call','PDF report each month','Month-over-month tracking','Provider breakdown'], primary:true },
            { badge:'For larger practices', price:'$1,500+', period:'per month — Tier 2', title:'Recovery Management', sub:'Everything in Tier 1 plus automated outreach workflows.', items:['All Tier 1 features','Patient outreach automation','Recall optimization','No-show follow-up workflows','Requires HIPAA BAA'], primary:false },
          ].map(p => (
            <div key={p.title} style={{ ...S.priceCard, ...(p.primary ? S.priceCardFeatured : {}) }}>
              <div style={S.priceBadge}>{p.badge}</div>
              <div style={{ fontSize:28, fontWeight:700, color:'var(--teal,#5A7A4A)', fontFamily:'monospace', marginBottom:4 }}>{p.price}</div>
              <div style={{ fontSize:12, color:'var(--text3,#8A9A78)', marginBottom:16 }}>{p.period}</div>
              <div style={{ fontSize:15, fontWeight:700, color:'var(--text,#1A2112)', marginBottom:8 }}>{p.title}</div>
              <p style={{ fontSize:13, color:'var(--text2,#4A5C3A)', lineHeight:1.6, marginBottom:16 }}>{p.sub}</p>
              <ul style={{ listStyle:'none', marginBottom:20 }}>
                {p.items.map(item => (
                  <li key={item} style={{ fontSize:12, color:'var(--text2,#4A5C3A)', padding:'3px 0', display:'flex', gap:6 }}>
                    <span style={{ color:'var(--teal,#5A7A4A)', fontWeight:700 }}>✓</span>{item}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('/audit')} style={{ ...S.btnPrimary, width:'100%', padding:'10px', border:'none', cursor:'pointer' }}>
                {p.primary ? 'Start monitoring' : 'Get started'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ ...S.section, background:'var(--bg2,#fff)' }}>
        <div style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:40, alignItems:'start', maxWidth:680 }}>
          <div style={{ width:80, height:80, borderRadius:'50%', background:'var(--teal-dim,#ECF3E7)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:700, color:'var(--teal,#5A7A4A)', border:'2px solid var(--teal-border,rgba(90,122,74,0.25))', flexShrink:0 }}>DE</div>
          <div>
            <div style={S.tag}>About Echo</div>
            <h2 style={{ ...S.h2, marginTop:10 }}>Built by someone who understands operational leakage</h2>
            <div style={{ fontSize:13, color:'var(--teal,#5A7A4A)', fontWeight:600, marginBottom:16 }}>Destiny Barker · Founder, Echolynk Company · Creator, LeakLens</div>
            <p style={{ fontSize:14, color:'var(--text2,#4A5C3A)', lineHeight:1.75, marginBottom:12 }}>
              I built LeakLens because I run a healthcare operations company and I know exactly what it looks like when revenue slips through the cracks every day without anyone measuring it.
            </p>
            <p style={{ fontSize:14, color:'var(--text2,#4A5C3A)', lineHeight:1.75 }}>
              LeakLens was built for dental practices in the Tampa Bay area first — because this is my community and I want to see independent practices win.
            </p>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginTop:16 }}>
              {['Founder, Echolynk Company','CEO, DuraMobile MC LLC','Wesley Chapel, FL','Software Development Student'].map(c=>(
                <span key={c} style={{ background:'var(--bg3,#F0F2EC)', border:'0.5px solid var(--border,#E2E6DA)', borderRadius:6, padding:'5px 10px', fontSize:11, color:'var(--text2,#4A5C3A)' }}>{c}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section style={{ ...S.section, textAlign:'center', borderTop:'0.5px solid var(--border,#E2E6DA)' }}>
        <div style={S.tag}>Ready to find your leak?</div>
        <h2 style={{ ...S.h2, maxWidth:500, margin:'12px auto 16px' }}>Your first audit is free. No patient data. No commitment.</h2>
        <p style={{ ...S.sectionSub, margin:'0 auto 32px' }}>Send us three exports from your existing software. Results back to you within 48 hours.</p>
        <div style={S.ctaRow}>
          <button onClick={() => navigate('/audit')} style={S.btnPrimary}>Get your free audit →</button>
          <button onClick={() => setShowDemo(true)} style={S.btnSecondary}>▶ Try the live demo</button>
        </div>
        <p style={{ fontSize:12, color:'var(--text3,#8A9A78)', marginTop:20 }}>
          Serving Hillsborough, Pasco, and Pinellas counties · hello@leaklens.cloud · 813-904-2995
        </p>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding:'20px 48px', borderTop:'0.5px solid var(--border,#E2E6DA)', display:'flex', justifyContent:'space-between', alignItems:'center', background:'var(--bg2,#fff)' }}>
        <div style={{ fontSize:12, color:'var(--text3,#8A9A78)' }}>© 2026 Echolynk Company · LeakLens is an Echolynk product</div>
        <div style={{ display:'flex', gap:16, alignItems:'center' }}>
          <span style={{ fontSize:12, color:'var(--text3,#8A9A78)' }}>hello@leaklens.cloud</span>
          <span style={{ fontSize:12, color:'var(--text3,#8A9A78)' }}>leaklens.cloud</span>
          <button onClick={() => navigate('/app')} style={{ fontSize:12, color:'var(--teal,#5A7A4A)', background:'transparent', border:'none', cursor:'pointer', fontWeight:600 }}>Admin login →</button>
        </div>
      </footer>
    {/* ── DEMO MODAL ── */}
    {showDemo && (
      <div onClick={() => { setShowDemo(false); setDemoSent(false); setDemoEmail(''); }}
        style={{ position:'fixed', inset:0, background:'rgba(26,33,18,0.5)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
        <div onClick={e => e.stopPropagation()}
          style={{ background:'var(--bg2,#fff)', borderRadius:16, width:'100%', maxWidth:440, padding:'32px', border:'0.5px solid var(--border,#E2E6DA)' }}>
          {!demoSent ? (<>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
              <div>
                <div style={{ fontSize:18, fontWeight:700, color:'var(--text,#1A2112)', marginBottom:4 }}>Request a demo</div>
                <div style={{ fontSize:13, color:'var(--text2,#4A5C3A)' }}>Enter your email and we will send you access to the live demo plus a walkthrough video.</div>
              </div>
              <button onClick={() => setShowDemo(false)} style={{ background:'transparent', border:'none', fontSize:20, color:'var(--text3,#8A9A78)', cursor:'pointer', lineHeight:1, marginLeft:16 }}>✕</button>
            </div>
            <form onSubmit={handleDemoRequest} style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <input required type="email" value={demoEmail} onChange={e => setDemoEmail(e.target.value)}
                placeholder="your@practice.com" style={{ padding:'11px 14px', borderRadius:8, border:'1px solid var(--border2,#C8CEBC)', background:'var(--bg3,#F0F2EC)', color:'var(--text,#1A2112)', fontSize:14, outline:'none', fontFamily:'inherit' }} />
              <button type="submit" style={{ background:'var(--teal,#5A7A4A)', color:'#fff', border:'none', padding:'12px', borderRadius:8, fontSize:14, fontWeight:700, cursor:'pointer' }}>
                Send me demo access →
              </button>
            </form>
            <div style={{ marginTop:16, textAlign:'center' }}>
              <button onClick={() => { setShowDemo(false); window.open('https://y-six-zeta-18.vercel.app','_blank'); }}
                style={{ background:'transparent', border:'none', color:'var(--teal,#5A7A4A)', fontSize:13, fontWeight:600, cursor:'pointer', textDecoration:'underline' }}>
                Or try the live demo right now →
              </button>
            </div>
          </>) : (<>
            <div style={{ textAlign:'center', padding:'12px 0' }}>
              <div style={{ width:52, height:52, borderRadius:'50%', background:'var(--teal-dim,#ECF3E7)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:22 }}>✓</div>
              <div style={{ fontSize:17, fontWeight:700, color:'var(--text,#1A2112)', marginBottom:8 }}>Request sent!</div>
              <p style={{ fontSize:13, color:'var(--text2,#4A5C3A)', lineHeight:1.7, marginBottom:20 }}>
                Your email client should have opened. If not, email us at <a href="mailto:hello@leaklens.cloud" style={{ color:'var(--teal,#5A7A4A)' }}>hello@leaklens.cloud</a>. We will send demo access within 24 hours.
              </p>
              <button onClick={() => { setShowDemo(false); setDemoSent(false); setDemoEmail(''); window.open('https://y-six-zeta-18.vercel.app','_blank'); }}
                style={{ background:'var(--teal,#5A7A4A)', color:'#fff', border:'none', padding:'11px 24px', borderRadius:8, fontSize:13, fontWeight:700, cursor:'pointer' }}>
                Try the live demo now →
              </button>
            </div>
          </>)}
        </div>
      </div>
    )}
    </div>
  );
}

const N = {
  nav: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 48px', borderBottom:'0.5px solid var(--border,#E2E6DA)', background:'var(--bg2,#fff)', position:'sticky', top:0, zIndex:100 },
  logo: { display:'flex', alignItems:'center', gap:10 },
  mark: { width:34, height:34, borderRadius:9, background:'var(--teal,#5A7A4A)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700 },
  links: { display:'flex', gap:20, alignItems:'center' },
  link: { fontSize:13, color:'var(--text2,#4A5C3A)', textDecoration:'none', cursor:'pointer' },
  loginBtn: { fontSize:12, color:'var(--text2,#4A5C3A)', background:'transparent', border:'0.5px solid var(--border2,#C8CEBC)', padding:'7px 14px', borderRadius:7, cursor:'pointer' },
  ctaBtn: { background:'var(--teal,#5A7A4A)', color:'#fff', border:'none', padding:'8px 18px', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer' },
};

const S = {
  hero: { padding:'72px 48px 64px', textAlign:'center', background:'var(--bg2,#fff)', borderBottom:'0.5px solid var(--border,#E2E6DA)' },
  tag: { display:'inline-block', background:'var(--teal-dim,#ECF3E7)', color:'var(--teal,#5A7A4A)', fontSize:11, fontWeight:600, padding:'5px 12px', borderRadius:20, marginBottom:20, letterSpacing:'0.06em', textTransform:'uppercase' },
  h1: { fontSize:36, fontWeight:700, color:'var(--text,#1A2112)', lineHeight:1.25, maxWidth:580, margin:'0 auto 16px' },
  heroSub: { fontSize:16, color:'var(--text2,#4A5C3A)', maxWidth:480, margin:'0 auto 36px', lineHeight:1.7 },
  ctaRow: { display:'flex', gap:12, justifyContent:'center', alignItems:'center', flexWrap:'wrap' },
  statsRow: { display:'flex', justifyContent:'center', gap:40, marginTop:48, paddingTop:40, borderTop:'0.5px solid var(--border,#E2E6DA)' },
  btnPrimary: { background:'var(--teal,#5A7A4A)', color:'#fff', border:'none', padding:'13px 28px', borderRadius:9, fontSize:15, fontWeight:600, cursor:'pointer', textDecoration:'none' },
  btnSecondary: { background:'var(--bg2,#fff)', color:'var(--teal,#5A7A4A)', border:'1.5px solid var(--teal,#5A7A4A)', padding:'12px 28px', borderRadius:9, fontSize:15, fontWeight:600, cursor:'pointer' },
  section: { padding:'64px 48px', background:'var(--bg,#F7F8F5)' },
  h2: { fontSize:26, fontWeight:700, color:'var(--text,#1A2112)', marginBottom:10 },
  sectionSub: { fontSize:15, color:'var(--text2,#4A5C3A)', maxWidth:520, lineHeight:1.7 },
  painCard: { background:'var(--bg2,#fff)', border:'0.5px solid var(--border,#E2E6DA)', borderRadius:12, padding:'20px 22px', borderLeft:'3px solid var(--teal,#5A7A4A)' },
  howCard: { background:'var(--bg2,#fff)', border:'0.5px solid var(--border,#E2E6DA)', borderRadius:12, padding:24 },
  howNum: { width:32, height:32, borderRadius:'50%', background:'var(--teal-dim,#ECF3E7)', color:'var(--teal,#5A7A4A)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:600, marginBottom:14 },
  screenLabel: { fontSize:11, fontWeight:600, color:'var(--teal,#5A7A4A)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:10 },
  screenMock: { background:'var(--bg2,#fff)', border:'0.5px solid var(--border,#E2E6DA)', borderRadius:10, overflow:'hidden' },
  screenBar: { background:'var(--teal,#5A7A4A)', height:4 },
  screenHeader: { padding:'10px 14px', borderBottom:'0.5px solid var(--border,#E2E6DA)', display:'flex', alignItems:'center', justifyContent:'space-between' },
  priceCard: { background:'var(--bg2,#fff)', border:'0.5px solid var(--border,#E2E6DA)', borderRadius:12, padding:24 },
  priceCardFeatured: { border:'2px solid var(--teal,#5A7A4A)' },
  priceBadge: { display:'inline-block', background:'var(--teal-dim,#ECF3E7)', color:'var(--teal,#5A7A4A)', fontSize:10, fontWeight:600, padding:'3px 10px', borderRadius:20, marginBottom:12 },
};
