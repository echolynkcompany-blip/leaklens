import Papa from 'papaparse';

export const DEMO_SETTINGS = {
  avg_patient_value: 300,
  missed_call_booking_rate: 0.30,
  lead_conversion_rate: 0.40,
  no_show_threshold: 0.08,
  missed_call_threshold: 0.10,
  cancellation_threshold: 0.10,
  unbooked_lead_threshold: 0.20,
};

export const DEMO_CALLS = [
  { date:'2026-05-01', time:'9:12 AM', name:'Sarah Mitchell', phone:'813-555-1010', status:'Missed', duration:'0:00', booked:'No', notes:'New patient inquiry' },
  { date:'2026-05-01', time:'10:05 AM', name:'James Reed', phone:'727-555-8891', status:'Answered', duration:'4:12', booked:'Yes', notes:'Cleaning booked' },
  { date:'2026-05-02', time:'12:44 PM', name:'Amanda Torres', phone:'813-555-2323', status:'Missed', duration:'0:00', booked:'No', notes:'Implant inquiry' },
  { date:'2026-05-02', time:'2:15 PM', name:'Marcus Bell', phone:'813-555-9090', status:'Voicemail', duration:'0:34', booked:'Pending', notes:'Left voicemail' },
  { date:'2026-05-03', time:'4:51 PM', name:'Nina Brooks', phone:'727-555-1188', status:'After Hours', duration:'0:00', booked:'No', notes:'Tooth pain' },
  { date:'2026-05-04', time:'8:33 AM', name:'Olivia Hart', phone:'813-555-4444', status:'Answered', duration:'3:02', booked:'Yes', notes:'Whitening booked' },
  { date:'2026-05-05', time:'1:21 PM', name:'Derek Lane', phone:'813-555-7821', status:'Missed', duration:'0:00', booked:'No', notes:'New patient' },
  { date:'2026-05-06', time:'11:18 AM', name:'Tasha Green', phone:'727-555-3390', status:'Answered', duration:'5:18', booked:'Yes', notes:'Crown consult' },
  { date:'2026-05-07', time:'3:49 PM', name:'Carlos Rivera', phone:'813-555-2201', status:'Missed', duration:'0:00', booked:'No', notes:'Insurance question' },
  { date:'2026-05-08', time:'5:22 PM', name:'Meghan Price', phone:'727-555-8820', status:'After Hours', duration:'0:00', booked:'No', notes:'Appointment request' },
];

export const DEMO_APPOINTMENTS = [
  { date:'2026-05-01', time:'9:00 AM', patient:'James Reed', type:'Cleaning', provider:'Dr. Patel', status:'Completed', value:300, notes:'' },
  { date:'2026-05-01', time:'11:00 AM', patient:'Emily Stone', type:'Filling', provider:'Dr. Patel', status:'No-Show', value:300, notes:'Did not arrive' },
  { date:'2026-05-02', time:'10:30 AM', patient:'Olivia Hart', type:'Whitening', provider:'Dr. Kim', status:'Completed', value:300, notes:'' },
  { date:'2026-05-02', time:'2:00 PM', patient:'Brandon Cole', type:'Consult', provider:'Dr. Kim', status:'Canceled', value:300, notes:'Same-day cancellation' },
  { date:'2026-05-03', time:'1:00 PM', patient:'Tasha Green', type:'Crown Consult', provider:'Dr. Patel', status:'Completed', value:300, notes:'' },
  { date:'2026-05-04', time:'3:00 PM', patient:'Hannah Lee', type:'Cleaning', provider:'Dr. Kim', status:'No-Show', value:300, notes:'No confirmation response' },
  { date:'2026-05-05', time:'9:30 AM', patient:'Robert King', type:'Implant Consult', provider:'Dr. Patel', status:'Canceled', value:300, notes:'No reschedule' },
  { date:'2026-05-06', time:'4:00 PM', patient:'Denise Moore', type:'Filling', provider:'Dr. Kim', status:'Completed', value:300, notes:'' },
  { date:'2026-05-07', time:'10:00 AM', patient:'Kevin Young', type:'Cleaning', provider:'Dr. Patel', status:'Open Slot', value:300, notes:'Cancellation not filled' },
  { date:'2026-05-08', time:'2:30 PM', patient:'Lisa White', type:'Consult', provider:'Dr. Kim', status:'Rescheduled', value:300, notes:'' },
];

export const DEMO_LEADS = [
  { date:'2026-05-01', name:'Sarah Mitchell', phone:'813-555-1010', source:'Phone', service:'New Patient', status:'No Response', booked:'No', value:300, notes:'Missed call' },
  { date:'2026-05-02', name:'Amanda Torres', phone:'813-555-2323', source:'Phone', service:'Implant Consult', status:'New', booked:'No', value:300, notes:'No follow-up' },
  { date:'2026-05-03', name:'Nina Brooks', phone:'727-555-1188', source:'After Hours', service:'Emergency Visit', status:'Lost', booked:'No', value:300, notes:'Called competitor' },
  { date:'2026-05-04', name:'Olivia Hart', phone:'813-555-4444', source:'Phone', service:'Whitening', status:'Booked', booked:'Yes', value:300, notes:'Booked' },
  { date:'2026-05-05', name:'Derek Lane', phone:'813-555-7821', source:'Phone', service:'New Patient', status:'New', booked:'No', value:300, notes:'Needs callback' },
  { date:'2026-05-06', name:'Tasha Green', phone:'727-555-3390', source:'Phone', service:'Crown Consult', status:'Booked', booked:'Yes', value:300, notes:'Booked' },
  { date:'2026-05-07', name:'Carlos Rivera', phone:'813-555-2201', source:'Phone', service:'Insurance Question', status:'No Response', booked:'No', value:300, notes:'No response' },
  { date:'2026-05-08', name:'Meghan Price', phone:'727-555-8820', source:'After Hours', service:'Appointment Request', status:'New', booked:'No', value:300, notes:'Needs text-back' },
  { date:'2026-05-09', name:'Janelle Scott', phone:'813-555-6622', source:'Website Form', service:'Consult', status:'Contacted', booked:'No', value:300, notes:'Asked about pricing' },
];

export function parseCSV(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (r) => resolve(r.data),
      error: (e) => reject(e),
    });
  });
}

export function detectCSVType(headers) {
  const h = headers.map(x => x.toLowerCase());
  if (h.some(x => x.includes('caller') || x.includes('duration') || (x.includes('call') && x.includes('status')))) return 'calls';
  if (h.some(x => x.includes('patient') || x.includes('provider') || x.includes('appointment'))) return 'appointments';
  if (h.some(x => x.includes('lead') || x.includes('source') || x.includes('service'))) return 'leads';
  if (h.some(x => x.includes('call'))) return 'calls';
  return 'unknown';
}

function getField(row, terms) {
  const keys = Object.keys(row);
  for (const t of terms) {
    const k = keys.find(k => k.toLowerCase().includes(t));
    if (k) return (row[k] || '').toString().trim();
  }
  return '';
}

export function normalizeCallRow(row) {
  return {
    date: getField(row, ['date']),
    time: getField(row, ['time']),
    name: getField(row, ['caller name', 'caller', 'name', 'patient']),
    phone: getField(row, ['phone', 'number', 'tel']),
    status: getField(row, ['call status', 'status', 'type']),
    duration: getField(row, ['duration']),
    booked: getField(row, ['booked', 'booking', 'scheduled']),
    notes: getField(row, ['note', 'comment']),
  };
}

export function normalizeApptRow(row) {
  return {
    date: getField(row, ['date']),
    time: getField(row, ['time']),
    patient: getField(row, ['patient name', 'patient', 'name']),
    type: getField(row, ['appointment type', 'appt type', 'type', 'service']),
    provider: getField(row, ['provider', 'doctor', 'dr ', 'dentist']),
    status: getField(row, ['status', 'appt status']),
    value: parseFloat(getField(row, ['value', 'amount', 'fee', 'revenue'])) || 300,
    notes: getField(row, ['note', 'comment']),
  };
}

export function normalizeLeadRow(row) {
  return {
    date: getField(row, ['date']),
    name: getField(row, ['lead name', 'name', 'patient', 'contact']),
    phone: getField(row, ['phone', 'number', 'tel']),
    source: getField(row, ['source', 'channel', 'medium']),
    service: getField(row, ['requested service', 'service', 'interest', 'type']),
    status: getField(row, ['status', 'lead status']),
    booked: getField(row, ['booked', 'booking', 'scheduled', 'converted']),
    value: parseFloat(getField(row, ['value', 'amount', 'fee'])) || 300,
    notes: getField(row, ['note', 'comment']),
  };
}

export function calculateMetrics(calls, appts, leads, settings) {
  const s = { ...DEMO_SETTINGS, ...settings };

  const totalCalls = calls.length;
  const missedCalls = calls.filter(c => /missed/i.test(c.status)).length;
  const answeredCalls = calls.filter(c => /answered/i.test(c.status)).length;
  const afterHoursCalls = calls.filter(c => /after.?hours/i.test(c.status)).length;
  const missedCallRate = totalCalls > 0 ? missedCalls / totalCalls : 0;
  const missedCallLeak = missedCalls * s.missed_call_booking_rate * s.avg_patient_value;

  const totalAppts = appts.length;
  const noShows = appts.filter(a => /no.?show/i.test(a.status)).length;
  const canceled = appts.filter(a => /cancel/i.test(a.status)).length;
  const completed = appts.filter(a => /complet/i.test(a.status)).length;
  const openSlots = appts.filter(a => /open/i.test(a.status)).length;
  const noShowRate = totalAppts > 0 ? noShows / totalAppts : 0;
  const cancellationRate = totalAppts > 0 ? canceled / totalAppts : 0;
  const noShowLeak = noShows * s.avg_patient_value;
  const cancellationLeak = canceled * s.avg_patient_value;

  const totalLeads = leads.length;
  const unbookedLeads = leads.filter(l => /^no$/i.test((l.booked || '').trim())).length;
  const bookedLeads = leads.filter(l => /^yes$/i.test((l.booked || '').trim())).length;
  const unbookedLeadRate = totalLeads > 0 ? unbookedLeads / totalLeads : 0;
  const unbookedLeadLeak = unbookedLeads * s.lead_conversion_rate * s.avg_patient_value;

  const totalLeak = missedCallLeak + noShowLeak + cancellationLeak + unbookedLeadLeak;

  let deductions = 0;
  if (missedCallRate > s.missed_call_threshold) deductions += 15;
  if (noShowRate > s.no_show_threshold) deductions += 15;
  if (cancellationRate > s.cancellation_threshold) deductions += 10;
  if (unbookedLeadRate > s.unbooked_lead_threshold) deductions += 20;
  const leakScore = Math.max(0, 100 - deductions);

  const recoveryQueue = [];
  calls.filter(c => /missed|after.?hours/i.test(c.status)).forEach(c => {
    recoveryQueue.push({ name: c.name || 'Unknown', phone: c.phone, reason: /after.?hours/i.test(c.status) ? 'After-hours call' : 'Missed call', priority: 'High', action: 'Text + call back today', type: 'call' });
  });
  appts.filter(a => /no.?show/i.test(a.status)).forEach(a => {
    recoveryQueue.push({ name: a.patient, phone: '', reason: 'No-show', priority: 'Medium', action: 'Send rebooking message', type: 'noshow' });
  });
  appts.filter(a => /cancel/i.test(a.status)).forEach(a => {
    recoveryQueue.push({ name: a.patient, phone: '', reason: 'Canceled — ' + (a.type || 'appointment'), priority: /implant|consult/i.test(a.type) ? 'High' : 'Medium', action: 'Offer next available slot', type: 'cancel' });
  });
  leads.filter(l => /^no$/i.test((l.booked || '').trim()) && !/lost/i.test(l.status)).forEach(l => {
    recoveryQueue.push({ name: l.name, phone: l.phone, reason: 'Unbooked lead — ' + (l.service || 'inquiry'), priority: /implant|cosmetic/i.test(l.service) ? 'High' : 'Medium', action: 'Send booking link', type: 'lead' });
  });

  const providerMap = {};
  appts.forEach(a => {
    if (!a.provider) return;
    if (!providerMap[a.provider]) providerMap[a.provider] = { total: 0, noShows: 0, canceled: 0, completed: 0 };
    providerMap[a.provider].total++;
    if (/no.?show/i.test(a.status)) providerMap[a.provider].noShows++;
    if (/cancel/i.test(a.status)) providerMap[a.provider].canceled++;
    if (/complet/i.test(a.status)) providerMap[a.provider].completed++;
  });
  const providers = Object.entries(providerMap).map(([name, d]) => ({
    name, ...d,
    utilization: d.total > 0 ? Math.round((d.completed / d.total) * 100) : 0,
    noShowRate: d.total > 0 ? Math.round((d.noShows / d.total) * 100) : 0,
  }));

  return {
    totalCalls, missedCalls, answeredCalls, afterHoursCalls,
    missedCallRate, missedCallLeak,
    totalAppts, noShows, canceled, completed, openSlots,
    noShowRate, cancellationRate, noShowLeak, cancellationLeak,
    totalLeads, unbookedLeads, bookedLeads,
    unbookedLeadRate, unbookedLeadLeak,
    totalLeak, leakScore, recoveryQueue, providers,
  };
}

export const fmt = (n) => '$' + Math.round(n || 0).toLocaleString();
export const pct = (n) => ((n || 0) * 100).toFixed(1) + '%';
