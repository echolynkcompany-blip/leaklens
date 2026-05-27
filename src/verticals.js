// ─────────────────────────────────────────────────────────
// LEAKLENS VERTICALS — industry configuration
// Each vertical has its own benchmarks, terminology,
// demo practices, and practice type presets.
// ─────────────────────────────────────────────────────────

export const VERTICALS = {

  dental: {
    id:          'dental',
    label:       'Dental',
    icon:        '🦷',
    color:       '#5A7A4A',
    colorDim:    '#ECF3E7',
    tagline:     'Revenue intelligence for dental practices',
    description: 'Missed calls, no-shows, cancellations, and unbooked leads across general, cosmetic, implant, ortho, and pediatric practices.',
    terminology: { patient:'Patient', patients:'Patients', appointment:'Appointment', appointments:'Appointments', provider:'Provider' },
    benchmarks: {
      missedCallRate:    0.10,
      noShowRate:        0.08,
      cancellationRate:  0.10,
      unbookedLeadRate:  0.20,
    },
    presets: [
      { label:'Family / General',  avg:300,  note:'Cleanings, fillings, exams' },
      { label:'Cosmetic Focus',    avg:550,  note:'Whitening, veneers, bonding' },
      { label:'Implant Focus',     avg:900,  note:'Implants, bone grafts, surgical' },
      { label:'Orthodontics',      avg:450,  note:'Braces, Invisalign, retainers' },
      { label:'Pediatric',         avg:220,  note:'Children focused, high recall volume' },
      { label:'Multi-Specialty',   avg:480,  note:'Blended average across services' },
    ],
    demoPractices: ['demo1','demo2','demo3'],
  },

  medical: {
    id:          'medical',
    label:       'Medical',
    icon:        '🩺',
    color:       '#2E6EA6',
    colorDim:    '#EBF3FB',
    tagline:     'Revenue intelligence for medical practices',
    description: 'No-show patterns, cancellation gaps, and referral leakage across primary care, urgent care, and specialty practices.',
    terminology: { patient:'Patient', patients:'Patients', appointment:'Visit', appointments:'Visits', provider:'Physician' },
    benchmarks: {
      missedCallRate:    0.12,
      noShowRate:        0.10,
      cancellationRate:  0.12,
      unbookedLeadRate:  0.25,
    },
    presets: [
      { label:'Primary Care',      avg:220,  note:'Annual visits, preventive care, sick visits' },
      { label:'Urgent Care',       avg:185,  note:'Walk-in model, high volume, shorter visits' },
      { label:'Specialty Practice',avg:380,  note:'Cardiology, dermatology, ENT, etc.' },
      { label:'Pediatrics',        avg:190,  note:'Well visits, sick visits, vaccines' },
      { label:'OB-GYN',            avg:280,  note:'Prenatal, annual exams, procedures' },
      { label:'Multi-Physician',   avg:260,  note:'Group practice, blended average' },
    ],
    demoPractices: ['med_demo1','med_demo2'],
  },

  chiro: {
    id:          'chiro',
    label:       'Chiropractic',
    icon:        '🦴',
    color:       '#7B5EA7',
    colorDim:    '#F3EFFB',
    tagline:     'Revenue intelligence for chiropractic and PT practices',
    description: 'Session no-shows, care plan drop-offs, and new patient call leakage across chiropractic and physical therapy practices.',
    terminology: { patient:'Patient', patients:'Patients', appointment:'Session', appointments:'Sessions', provider:'Practitioner' },
    benchmarks: {
      missedCallRate:    0.15,
      noShowRate:        0.12,
      cancellationRate:  0.14,
      unbookedLeadRate:  0.30,
    },
    presets: [
      { label:'Chiropractic',        avg:85,   note:'Adjustments, decompression, maintenance care' },
      { label:'Physical Therapy',    avg:145,  note:'Initial eval, treatment sessions, home programs' },
      { label:'Sports Medicine',     avg:175,  note:'Athletes, injury recovery, performance' },
      { label:'Chiro + PT Combined', avg:110,  note:'Integrated practice, blended average' },
    ],
    demoPractices: ['chiro_demo1'],
  },

  medspa: {
    id:          'medspa',
    label:       'Med Spa',
    icon:        '✨',
    color:       '#B07D2A',
    colorDim:    '#FFF8E7',
    tagline:     'Revenue intelligence for med spas and aesthetics practices',
    description: 'Unbooked consultations, treatment cancellations, and lead conversion gaps across medical aesthetics and wellness practices.',
    terminology: { patient:'Client', patients:'Clients', appointment:'Treatment', appointments:'Treatments', provider:'Specialist' },
    benchmarks: {
      missedCallRate:    0.18,
      noShowRate:        0.10,
      cancellationRate:  0.15,
      unbookedLeadRate:  0.35,
    },
    presets: [
      { label:'Injectables Focus',   avg:650,  note:'Botox, fillers, neurotoxins' },
      { label:'Laser & Skin',        avg:400,  note:'Laser resurfacing, IPL, chemical peels' },
      { label:'Body Contouring',     avg:850,  note:'CoolSculpting, Emsculpt, body treatments' },
      { label:'Full Service Spa',    avg:480,  note:'Mix of injectables, laser, and wellness' },
      { label:'Wellness / IV',       avg:280,  note:'IV therapy, peptides, hormone optimization' },
    ],
    demoPractices: ['spa_demo1'],
  },

  optometry: {
    id:          'optometry',
    label:       'Optometry',
    icon:        '👁️',
    color:       '#2D8A6E',
    colorDim:    '#E8F7F3',
    tagline:     'Revenue intelligence for optometry practices',
    description: 'Missed exam opportunities, recall drop-off, and unbooked contact lens and eyewear revenue across independent optometry practices.',
    terminology: { patient:'Patient', patients:'Patients', appointment:'Exam', appointments:'Exams', provider:'Optometrist' },
    benchmarks: {
      missedCallRate:    0.10,
      noShowRate:        0.08,
      cancellationRate:  0.10,
      unbookedLeadRate:  0.22,
    },
    presets: [
      { label:'General Optometry',   avg:220,  note:'Comprehensive exams, glasses, contacts' },
      { label:'Medical Optometry',   avg:320,  note:'Dry eye, glaucoma, diabetic eye care' },
      { label:'Pediatric Vision',    avg:180,  note:"Children's vision, myopia management" },
      { label:'Optical Retail Focus',avg:380,  note:'High lens and frame revenue mix' },
    ],
    demoPractices: ['opt_demo1'],
  },
};

export const VERTICAL_LIST = Object.values(VERTICALS);
export const DEFAULT_VERTICAL = 'dental';
