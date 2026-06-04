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
import AdminHome from './components/AdminHome';
import AdminSettings from './components/AdminSettings';
import OnboardingPage from './components/OnboardingPage';
import VerticalSelector from './components/VerticalSelector';
import { VERTICALS, DEFAULT_VERTICAL } from './verticals';
import DemoTour from './components/DemoTour';
import TopNav from './components/TopNav';

const DEMO1_TREND = [
  {month:'Jan',amount:9400},{month:'Feb',amount:10200},{month:'Mar',amount:11800},{month:'Apr',amount:10900},{month:'May',amount:12100},
];
const DEMO1 = {
  id:'demo1', name:'Sunrise Dental Studio', month:'May 2026', tag:'Demo',
  settings:DEMO_SETTINGS, calls:DEMO_CALLS, appts:DEMO_APPOINTMENTS, leads:DEMO_LEADS, trend:DEMO1_TREND,
};

const DEMO2_S = {...DEMO_SETTINGS,avg_patient_value:300};
const DEMO2_C = [
  {date:'2026-05-01',time:'9:12 AM',name:'Unknown',phone:'',status:'Missed',duration:'0',booked:'No',notes:''},
  {date:'2026-05-01',time:'10:05 AM',name:'Unknown',phone:'',status:'Answered',duration:'4.2',booked:'Yes',notes:'Cleaning'},
  {date:'2026-05-02',time:'12:44 PM',name:'Unknown',phone:'',status:'Missed',duration:'0',booked:'No',notes:''},
  {date:'2026-05-02',time:'4:51 PM',name:'Unknown',phone:'',status:'After Hours',duration:'0',booked:'No',notes:''},
  {date:'2026-05-03',time:'8:33 AM',name:'Unknown',phone:'',status:'Answered',duration:'3.0',booked:'Yes',notes:''},
  {date:'2026-05-05',time:'1:21 PM',name:'Unknown',phone:'',status:'Missed',duration:'0',booked:'No',notes:''},
  {date:'2026-05-06',time:'11:18 AM',name:'Unknown',phone:'',status:'Answered',duration:'5.1',booked:'Yes',notes:'Crown'},
  {date:'2026-05-07',time:'3:49 PM',name:'Unknown',phone:'',status:'Missed',duration:'0',booked:'No',notes:''},
  {date:'2026-05-07',time:'5:22 PM',name:'Unknown',phone:'',status:'After Hours',duration:'0',booked:'No',notes:''},
  {date:'2026-05-08',time:'9:00 AM',name:'Unknown',phone:'',status:'Answered',duration:'4.0',booked:'Yes',notes:''},
  {date:'2026-05-08',time:'11:30 AM',name:'Unknown',phone:'',status:'Missed',duration:'0',booked:'No',notes:''},
  {date:'2026-05-08',time:'12:15 PM',name:'Unknown',phone:'',status:'After Hours',duration:'0',booked:'No',notes:'Lunch'},
  {date:'2026-05-08',time:'2:44 PM',name:'Unknown',phone:'',status:'Missed',duration:'0',booked:'No',notes:''},
  {date:'2026-05-08',time:'4:10 PM',name:'Unknown',phone:'',status:'Answered',duration:'2.1',booked:'Yes',notes:''},
];
const DEMO2_A = [
  {date:'2026-05-01',time:'9:00 AM',patient:'Unknown',type:'Cleaning',provider:'Dr. Patel',status:'Completed',value:285,notes:''},
  {date:'2026-05-01',time:'11:00 AM',patient:'Unknown',type:'Filling',provider:'Dr. Patel',status:'No-Show',value:380,notes:''},
  {date:'2026-05-02',time:'10:30 AM',patient:'Unknown',type:'Whitening',provider:'Dr. Kim',status:'Completed',value:450,notes:''},
  {date:'2026-05-02',time:'2:00 PM',patient:'Unknown',type:'Implant Consult',provider:'Dr. Kim',status:'Canceled',value:200,notes:'Same-day'},
  {date:'2026-05-03',time:'1:00 PM',patient:'Unknown',type:'Crown Consult',provider:'Dr. Patel',status:'Completed',value:200,notes:''},
  {date:'2026-05-05',time:'3:00 PM',patient:'Unknown',type:'Cleaning',provider:'Dr. Kim',status:'No-Show',value:285,notes:''},
  {date:'2026-05-06',time:'9:30 AM',patient:'Unknown',type:'Implant Consult',provider:'Dr. Patel',status:'Canceled',value:200,notes:''},
  {date:'2026-05-06',time:'4:00 PM',patient:'Unknown',type:'Filling',provider:'Dr. Kim',status:'Completed',value:320,notes:''},
  {date:'2026-05-07',time:'10:00 AM',patient:'Unknown',type:'Cleaning',provider:'Dr. Patel',status:'Open Slot',value:285,notes:''},
  {date:'2026-05-08',time:'9:00 AM',patient:'Unknown',type:'Crown Preparation',provider:'Dr. Kim',status:'Completed',value:1250,notes:''},
  {date:'2026-05-08',time:'11:00 AM',patient:'Unknown',type:'New Patient Exam',provider:'Dr. Patel',status:'No-Show',value:320,notes:''},
  {date:'2026-05-08',time:'2:30 PM',patient:'Unknown',type:'Root Canal',provider:'Dr. Kim',status:'Completed',value:1100,notes:''},
];
const DEMO2_L = [
  {date:'2026-05-01',name:'Unknown',phone:'',source:'Missed Call',service:'New Patient',status:'No Response',booked:'No',value:320,notes:''},
  {date:'2026-05-02',name:'Unknown',phone:'',source:'Phone Inquiry',service:'Implant Consult',status:'Booked',booked:'Yes',value:2800,notes:''},
  {date:'2026-05-02',name:'Unknown',phone:'',source:'Missed Call',service:'New Patient',status:'Lost',booked:'No',value:320,notes:'Competitor'},
  {date:'2026-05-03',name:'Unknown',phone:'',source:'Website Form',service:'Whitening',status:'No Response',booked:'No',value:450,notes:'Slow response'},
  {date:'2026-05-05',name:'Unknown',phone:'',source:'Missed Call',service:'New Patient',status:'No Response',booked:'No',value:320,notes:''},
  {date:'2026-05-06',name:'Unknown',phone:'',source:'Referral',service:'Crown Consult',status:'Booked',booked:'Yes',value:1250,notes:''},
  {date:'2026-05-07',name:'Unknown',phone:'',source:'Missed Call',service:'Existing Patient',status:'No Response',booked:'No',value:285,notes:''},
  {date:'2026-05-07',name:'Unknown',phone:'',source:'Missed Call',service:'New Patient',status:'No Response',booked:'No',value:320,notes:''},
  {date:'2026-05-08',name:'Unknown',phone:'',source:'Google Ad',service:'Teeth Whitening',status:'Booked',booked:'Yes',value:450,notes:''},
  {date:'2026-05-08',name:'Unknown',phone:'',source:'Missed Call',service:'New Patient',status:'No Response',booked:'No',value:320,notes:''},
];
const DEMO2_TREND = [{month:'Feb',amount:6800},{month:'Mar',amount:7400},{month:'Apr',amount:7100},{month:'May',amount:8250}];
const DEMO2 = {
  id:'demo2', name:'Tele Dental', month:'May 2026', tag:'Demo',
  settings:DEMO2_S, calls:DEMO2_C, appts:DEMO2_A, leads:DEMO2_L, trend:DEMO2_TREND,
};

const DEMO3_S = {...DEMO_SETTINGS,avg_patient_value:350};
const DEMO3_C = [
  {date:'2026-05-01',time:'7:58 AM',name:'Unknown',phone:'',status:'Missed',duration:'0',booked:'No',notes:'Before hours'},
  {date:'2026-05-01',time:'8:04 AM',name:'Unknown',phone:'',status:'Answered',duration:'3.1',booked:'Yes',notes:''},
  {date:'2026-05-01',time:'8:22 AM',name:'Unknown',phone:'',status:'Missed',duration:'0',booked:'No',notes:''},
  {date:'2026-05-01',time:'9:14 AM',name:'Unknown',phone:'',status:'Missed',duration:'0',booked:'No',notes:''},
  {date:'2026-05-01',time:'9:33 AM',name:'Unknown',phone:'',status:'Missed',duration:'0',booked:'No',notes:''},
  {date:'2026-05-01',time:'10:02 AM',name:'Unknown',phone:'',status:'Answered',duration:'2.4',booked:'Yes',notes:''},
  {date:'2026-05-01',time:'10:28 AM',name:'Unknown',phone:'',status:'Missed',duration:'0',booked:'No',notes:''},
  {date:'2026-05-01',time:'11:44 AM',name:'Unknown',phone:'',status:'Missed',duration:'0',booked:'No',notes:''},
  {date:'2026-05-01',time:'12:03 PM',name:'Unknown',phone:'',status:'After Hours',duration:'0',booked:'No',notes:'Lunch'},
  {date:'2026-05-01',time:'12:19 PM',name:'Unknown',phone:'',status:'After Hours',duration:'0',booked:'No',notes:'Lunch'},
  {date:'2026-05-01',time:'12:41 PM',name:'Unknown',phone:'',status:'After Hours',duration:'0',booked:'No',notes:'Lunch'},
  {date:'2026-05-01',time:'1:33 PM',name:'Unknown',phone:'',status:'Missed',duration:'0',booked:'No',notes:''},
  {date:'2026-05-01',time:'2:14 PM',name:'Unknown',phone:'',status:'Answered',duration:'5.4',booked:'Yes',notes:''},
  {date:'2026-05-01',time:'2:48 PM',name:'Unknown',phone:'',status:'Missed',duration:'0',booked:'No',notes:''},
  {date:'2026-05-01',time:'3:22 PM',name:'Unknown',phone:'',status:'Missed',duration:'0',booked:'No',notes:''},
  {date:'2026-05-01',time:'4:01 PM',name:'Unknown',phone:'',status:'Answered',duration:'2.1',booked:'Yes',notes:''},
  {date:'2026-05-01',time:'4:44 PM',name:'Unknown',phone:'',status:'After Hours',duration:'0',booked:'No',notes:''},
  {date:'2026-05-01',time:'5:02 PM',name:'Unknown',phone:'',status:'After Hours',duration:'0',booked:'No',notes:''},
  {date:'2026-05-02',time:'8:07 AM',name:'Unknown',phone:'',status:'Answered',duration:'7.1',booked:'Yes',notes:''},
  {date:'2026-05-02',time:'8:31 AM',name:'Unknown',phone:'',status:'Missed',duration:'0',booked:'No',notes:''},
  {date:'2026-05-02',time:'8:59 AM',name:'Unknown',phone:'',status:'Missed',duration:'0',booked:'No',notes:''},
  {date:'2026-05-02',time:'9:18 AM',name:'Unknown',phone:'',status:'Answered',duration:'4.3',booked:'Yes',notes:''},
  {date:'2026-05-02',time:'10:11 AM',name:'Unknown',phone:'',status:'Missed',duration:'0',booked:'No',notes:''},
  {date:'2026-05-02',time:'10:38 AM',name:'Unknown',phone:'',status:'Answered',duration:'3.2',booked:'Yes',notes:''},
  {date:'2026-05-02',time:'11:02 AM',name:'Unknown',phone:'',status:'Missed',duration:'0',booked:'No',notes:''},
  {date:'2026-05-02',time:'11:29 AM',name:'Unknown',phone:'',status:'Missed',duration:'0',booked:'No',notes:''},
  {date:'2026-05-02',time:'12:14 PM',name:'Unknown',phone:'',status:'After Hours',duration:'0',booked:'No',notes:'Lunch'},
  {date:'2026-05-02',time:'12:47 PM',name:'Unknown',phone:'',status:'After Hours',duration:'0',booked:'No',notes:'Lunch'},
  {date:'2026-05-02',time:'1:55 PM',name:'Unknown',phone:'',status:'Missed',duration:'0',booked:'No',notes:''},
  {date:'2026-05-02',time:'3:04 PM',name:'Unknown',phone:'',status:'Missed',duration:'0',booked:'No',notes:''},
  {date:'2026-05-02',time:'3:41 PM',name:'Unknown',phone:'',status:'Missed',duration:'0',booked:'No',notes:''},
  {date:'2026-05-02',time:'4:52 PM',name:'Unknown',phone:'',status:'After Hours',duration:'0',booked:'No',notes:''},
  {date:'2026-05-05',time:'8:11 AM',name:'Unknown',phone:'',status:'Answered',duration:'6.6',booked:'Yes',notes:''},
  {date:'2026-05-05',time:'8:38 AM',name:'Unknown',phone:'',status:'Missed',duration:'0',booked:'No',notes:''},
  {date:'2026-05-05',time:'9:02 AM',name:'Unknown',phone:'',status:'Missed',duration:'0',booked:'No',notes:''},
  {date:'2026-05-05',time:'9:29 AM',name:'Unknown',phone:'',status:'Missed',duration:'0',booked:'No',notes:''},
  {date:'2026-05-05',time:'9:54 AM',name:'Unknown',phone:'',status:'Answered',duration:'3.7',booked:'Yes',notes:''},
  {date:'2026-05-05',time:'10:22 AM',name:'Unknown',phone:'',status:'Missed',duration:'0',booked:'No',notes:''},
  {date:'2026-05-05',time:'11:18 AM',name:'Unknown',phone:'',status:'Missed',duration:'0',booked:'No',notes:''},
  {date:'2026-05-05',time:'12:02 PM',name:'Unknown',phone:'',status:'After Hours',duration:'0',booked:'No',notes:'Lunch'},
  {date:'2026-05-05',time:'12:31 PM',name:'Unknown',phone:'',status:'After Hours',duration:'0',booked:'No',notes:'Lunch'},
  {date:'2026-05-05',time:'1:14 PM',name:'Unknown',phone:'',status:'Answered',duration:'4.9',booked:'Yes',notes:''},
  {date:'2026-05-05',time:'1:48 PM',name:'Unknown',phone:'',status:'Missed',duration:'0',booked:'No',notes:''},
  {date:'2026-05-05',time:'2:22 PM',name:'Unknown',phone:'',status:'Missed',duration:'0',booked:'No',notes:''},
  {date:'2026-05-05',time:'2:57 PM',name:'Unknown',phone:'',status:'Answered',duration:'2.2',booked:'Yes',notes:''},
  {date:'2026-05-05',time:'3:33 PM',name:'Unknown',phone:'',status:'Missed',duration:'0',booked:'No',notes:''},
  {date:'2026-05-05',time:'4:11 PM',name:'Unknown',phone:'',status:'After Hours',duration:'0',booked:'No',notes:''},
  {date:'2026-05-05',time:'4:48 PM',name:'Unknown',phone:'',status:'After Hours',duration:'0',booked:'No',notes:''},
];
const DEMO3_A = [
  {date:'2026-05-01',time:'8:00 AM',patient:'Unknown',type:'New Patient Exam',provider:'Dr. Adams',status:'Completed',value:350,notes:''},
  {date:'2026-05-01',time:'8:00 AM',patient:'Unknown',type:'Cleaning',provider:'Dr. Nguyen',status:'No-Show',value:300,notes:'No call no show'},
  {date:'2026-05-01',time:'9:00 AM',patient:'Unknown',type:'Filling - 2 Surface',provider:'Dr. Patel',status:'No-Show',value:420,notes:'Confirmed'},
  {date:'2026-05-01',time:'9:00 AM',patient:'Unknown',type:'Crown Preparation',provider:'Dr. Nguyen',status:'Canceled',value:1350,notes:'Morning cancel'},
  {date:'2026-05-01',time:'10:00 AM',patient:'Unknown',type:'Whitening',provider:'Dr. Adams',status:'No-Show',value:480,notes:'Third no-show'},
  {date:'2026-05-01',time:'10:00 AM',patient:'Unknown',type:'Root Canal',provider:'Dr. Patel',status:'Completed',value:1200,notes:''},
  {date:'2026-05-01',time:'11:00 AM',patient:'Unknown',type:'New Patient Exam',provider:'Dr. Nguyen',status:'Canceled',value:350,notes:''},
  {date:'2026-05-01',time:'11:00 AM',patient:'Unknown',type:'Implant Placement',provider:'Dr. Adams',status:'Completed',value:3200,notes:''},
  {date:'2026-05-01',time:'1:00 PM',patient:'Unknown',type:'Crown Seat',provider:'Dr. Patel',status:'No-Show',value:750,notes:'No confirmation'},
  {date:'2026-05-01',time:'2:00 PM',patient:'Unknown',type:'Cosmetic Consult',provider:'Dr. Adams',status:'Canceled',value:200,notes:'No reschedule'},
  {date:'2026-05-01',time:'2:00 PM',patient:'Unknown',type:'Cleaning',provider:'Dr. Kim',status:'No-Show',value:300,notes:''},
  {date:'2026-05-01',time:'3:00 PM',patient:'Unknown',type:'Implant Consult',provider:'Dr. Nguyen',status:'Canceled',value:250,notes:'Same day'},
  {date:'2026-05-01',time:'4:00 PM',patient:'Unknown',type:'Cleaning',provider:'Dr. Kim',status:'Open Slot',value:300,notes:'Not filled'},
  {date:'2026-05-02',time:'8:00 AM',patient:'Unknown',type:'Cleaning',provider:'Dr. Nguyen',status:'No-Show',value:300,notes:''},
  {date:'2026-05-02',time:'9:00 AM',patient:'Unknown',type:'Implant Consult',provider:'Dr. Kim',status:'Canceled',value:250,notes:''},
  {date:'2026-05-02',time:'9:00 AM',patient:'Unknown',type:'Filling - 3 Surface',provider:'Dr. Adams',status:'No-Show',value:510,notes:''},
  {date:'2026-05-02',time:'10:00 AM',patient:'Unknown',type:'Root Canal',provider:'Dr. Patel',status:'No-Show',value:1200,notes:'No call no show'},
  {date:'2026-05-02',time:'11:00 AM',patient:'Unknown',type:'New Patient Exam',provider:'Dr. Adams',status:'Canceled',value:350,notes:''},
  {date:'2026-05-02',time:'1:00 PM',patient:'Unknown',type:'Cleaning',provider:'Dr. Kim',status:'No-Show',value:300,notes:''},
  {date:'2026-05-02',time:'2:00 PM',patient:'Unknown',type:'Emergency Exam',provider:'Dr. Nguyen',status:'Canceled',value:200,notes:''},
  {date:'2026-05-02',time:'3:00 PM',patient:'Unknown',type:'Cleaning',provider:'Dr. Kim',status:'Open Slot',value:300,notes:'Late cancel'},
  {date:'2026-05-02',time:'4:00 PM',patient:'Unknown',type:'Root Canal',provider:'Dr. Nguyen',status:'No-Show',value:1200,notes:''},
  {date:'2026-05-05',time:'8:00 AM',patient:'Unknown',type:'Implant Consult',provider:'Dr. Adams',status:'No-Show',value:250,notes:''},
  {date:'2026-05-05',time:'9:00 AM',patient:'Unknown',type:'New Patient Exam',provider:'Dr. Nguyen',status:'Canceled',value:350,notes:'Same day'},
  {date:'2026-05-05',time:'9:00 AM',patient:'Unknown',type:'Filling - 1 Surface',provider:'Dr. Kim',status:'No-Show',value:320,notes:''},
  {date:'2026-05-05',time:'10:00 AM',patient:'Unknown',type:'Root Canal',provider:'Dr. Adams',status:'Completed',value:1200,notes:''},
  {date:'2026-05-05',time:'10:00 AM',patient:'Unknown',type:'Cleaning',provider:'Dr. Patel',status:'No-Show',value:300,notes:'Confirmed'},
  {date:'2026-05-05',time:'10:00 AM',patient:'Unknown',type:'Whitening',provider:'Dr. Nguyen',status:'Canceled',value:480,notes:'Cost concern'},
  {date:'2026-05-05',time:'11:00 AM',patient:'Unknown',type:'Implant Placement',provider:'Dr. Kim',status:'Completed',value:3200,notes:''},
  {date:'2026-05-05',time:'11:00 AM',patient:'Unknown',type:'Crown Seat',provider:'Dr. Adams',status:'No-Show',value:750,notes:''},
  {date:'2026-05-05',time:'1:00 PM',patient:'Unknown',type:'Emergency Exam',provider:'Dr. Nguyen',status:'Canceled',value:200,notes:''},
  {date:'2026-05-05',time:'2:00 PM',patient:'Unknown',type:'Cosmetic Consult',provider:'Dr. Adams',status:'Open Slot',value:200,notes:'Not filled'},
  {date:'2026-05-05',time:'3:00 PM',patient:'Unknown',type:'Cleaning',provider:'Dr. Nguyen',status:'No-Show',value:300,notes:''},
  {date:'2026-05-05',time:'4:00 PM',patient:'Unknown',type:'Root Canal',provider:'Dr. Kim',status:'Canceled',value:1200,notes:'Rescheduled'},
];
const DEMO3_L = [
  {date:'2026-05-01',name:'Unknown',phone:'',source:'Missed Call',service:'Implant Consult',status:'No Response',booked:'No',value:3200,notes:'High value missed'},
  {date:'2026-05-01',name:'Unknown',phone:'',source:'Missed Call',service:'New Patient',status:'No Response',booked:'No',value:350,notes:''},
  {date:'2026-05-01',name:'Unknown',phone:'',source:'Missed Call',service:'New Patient',status:'No Response',booked:'No',value:350,notes:''},
  {date:'2026-05-01',name:'Unknown',phone:'',source:'Missed Call',service:'New Patient',status:'Lost',booked:'No',value:350,notes:'Lunch'},
  {date:'2026-05-01',name:'Unknown',phone:'',source:'Missed Call',service:'Existing Patient',status:'No Response',booked:'No',value:300,notes:'Lunch'},
  {date:'2026-05-01',name:'Unknown',phone:'',source:'Missed Call',service:'New Patient',status:'Lost',booked:'No',value:350,notes:'Lunch'},
  {date:'2026-05-01',name:'Unknown',phone:'',source:'Missed Call',service:'Implant Consult',status:'No Response',booked:'No',value:3200,notes:'High value'},
  {date:'2026-05-01',name:'Unknown',phone:'',source:'Missed Call',service:'New Patient',status:'No Response',booked:'No',value:350,notes:''},
  {date:'2026-05-01',name:'Unknown',phone:'',source:'Missed Call',service:'New Patient',status:'Lost',booked:'No',value:350,notes:'After hours'},
  {date:'2026-05-01',name:'Unknown',phone:'',source:'Missed Call',service:'New Patient',status:'Lost',booked:'No',value:350,notes:'After hours'},
  {date:'2026-05-01',name:'Unknown',phone:'',source:'Website Form',service:'Cosmetic Consult',status:'No Response',booked:'No',value:480,notes:'Slow response'},
  {date:'2026-05-01',name:'Unknown',phone:'',source:'Website Form',service:'Implant Consult',status:'Contacted',booked:'No',value:3200,notes:'Late response'},
  {date:'2026-05-02',name:'Unknown',phone:'',source:'Missed Call',service:'New Patient',status:'No Response',booked:'No',value:350,notes:''},
  {date:'2026-05-02',name:'Unknown',phone:'',source:'Missed Call',service:'Implant Consult',status:'No Response',booked:'No',value:3200,notes:''},
  {date:'2026-05-02',name:'Unknown',phone:'',source:'Missed Call',service:'New Patient',status:'No Response',booked:'No',value:350,notes:''},
  {date:'2026-05-02',name:'Unknown',phone:'',source:'Missed Call',service:'New Patient',status:'No Response',booked:'No',value:350,notes:''},
  {date:'2026-05-02',name:'Unknown',phone:'',source:'Missed Call',service:'Existing Patient',status:'No Response',booked:'No',value:300,notes:''},
  {date:'2026-05-02',name:'Unknown',phone:'',source:'Missed Call',service:'New Patient',status:'Lost',booked:'No',value:350,notes:'Lunch'},
  {date:'2026-05-02',name:'Unknown',phone:'',source:'Missed Call',service:'New Patient',status:'Lost',booked:'No',value:350,notes:'Lunch'},
  {date:'2026-05-02',name:'Unknown',phone:'',source:'Missed Call',service:'New Patient',status:'No Response',booked:'No',value:350,notes:''},
  {date:'2026-05-02',name:'Unknown',phone:'',source:'Website Form',service:'Whitening',status:'No Response',booked:'No',value:480,notes:'Slow response'},
  {date:'2026-05-02',name:'Unknown',phone:'',source:'Google Ad',service:'New Patient Exam',status:'Booked',booked:'Yes',value:350,notes:'Quick response'},
  {date:'2026-05-02',name:'Unknown',phone:'',source:'Phone Inquiry',service:'Crown Consult',status:'Booked',booked:'Yes',value:1350,notes:''},
  {date:'2026-05-05',name:'Unknown',phone:'',source:'Missed Call',service:'New Patient',status:'No Response',booked:'No',value:350,notes:''},
  {date:'2026-05-05',name:'Unknown',phone:'',source:'Missed Call',service:'Implant Consult',status:'No Response',booked:'No',value:3200,notes:'High value'},
  {date:'2026-05-05',name:'Unknown',phone:'',source:'Missed Call',service:'New Patient',status:'No Response',booked:'No',value:350,notes:''},
  {date:'2026-05-05',name:'Unknown',phone:'',source:'Missed Call',service:'New Patient',status:'No Response',booked:'No',value:350,notes:''},
  {date:'2026-05-05',name:'Unknown',phone:'',source:'Missed Call',service:'New Patient',status:'No Response',booked:'No',value:350,notes:''},
  {date:'2026-05-05',name:'Unknown',phone:'',source:'Missed Call',service:'New Patient',status:'Lost',booked:'No',value:350,notes:'Lunch'},
  {date:'2026-05-05',name:'Unknown',phone:'',source:'Missed Call',service:'Existing Patient',status:'No Response',booked:'No',value:300,notes:'Lunch'},
  {date:'2026-05-05',name:'Unknown',phone:'',source:'Missed Call',service:'New Patient',status:'No Response',booked:'No',value:350,notes:''},
  {date:'2026-05-05',name:'Unknown',phone:'',source:'Website Form',service:'Cosmetic Consult',status:'No Response',booked:'No',value:480,notes:'Slow response'},
  {date:'2026-05-05',name:'Unknown',phone:'',source:'Phone Inquiry',service:'Whitening',status:'Booked',booked:'Yes',value:480,notes:''},
  {date:'2026-05-05',name:'Unknown',phone:'',source:'Referral',service:'Cleaning',status:'Booked',booked:'Yes',value:300,notes:''},
];
const DEMO3_TREND = [{month:'Feb',amount:24200},{month:'Mar',amount:27800},{month:'Apr',amount:29100},{month:'May',amount:31500}];
const DEMO3 = {
  id:'demo3', name:'Bright Smile Family Dentistry', month:'May 2026', tag:'Demo',
  settings:DEMO3_S, calls:DEMO3_C, appts:DEMO3_A, leads:DEMO3_L, trend:DEMO3_TREND,
};

// ── Medical demos ──
const MED1_S = {avg_patient_value:220,missed_call_booking_rate:0.30,lead_conversion_rate:0.35,missed_call_threshold:0.12,no_show_threshold:0.10,cancellation_threshold:0.12,unbooked_lead_threshold:0.25};
const MED1_C = [...Array(8).fill(0).map((_,i)=>({id:`m1mc${i}`,date:'2026-05-15',time:`${9+i}:00 AM`,status:'Missed',duration:0,booked:'No',notes:'New patient inquiry'})),...Array(38).fill(0).map((_,i)=>({id:`m1ac${i}`,date:'2026-05-15',time:`${9+i%8}:30 AM`,status:'Answered',duration:180+i*10,booked:i%3===0?'Yes':'No',notes:''}))];
const MED1_A = [...Array(12).fill(0).map((_,i)=>({id:`m1ns${i}`,date:`2026-05-${10+i}`,time:'10:00 AM',type:'Annual Physical',provider:'Dr. Johnson',status:'No-Show',value:220,notes:''})),...Array(8).fill(0).map((_,i)=>({id:`m1cn${i}`,date:`2026-05-${10+i}`,time:'2:00 PM',type:'Sick Visit',provider:'Dr. Patel',status:'Canceled',value:185,notes:''})),...Array(45).fill(0).map((_,i)=>({id:`m1cp${i}`,date:`2026-05-${5+i%20}`,time:'11:00 AM',type:'Follow-up',provider:i%2===0?'Dr. Johnson':'Dr. Patel',status:'Completed',value:220,notes:''}))];
const MED1_L = [...Array(18).fill(0).map((_,i)=>({id:`m1ul${i}`,date:`2026-05-${5+i}`,name:'',phone:'',source:'Website',service:'New Patient Visit',status:'Unbooked',booked:'No',value:220,notes:''})),...Array(8).fill(0).map((_,i)=>({id:`m1bl${i}`,date:`2026-05-${5+i}`,name:'',phone:'',source:'Referral',service:'Annual Physical',status:'Booked',booked:'Yes',value:220,notes:''}))];
const MED1 = {id:'med_demo1',name:'Lakeside Family Medicine',month:'May 2026',tag:'Demo',isDemo:true,vertical:'medical',settings:MED1_S,calls:MED1_C,appts:MED1_A,leads:MED1_L,trend:[{month:'Jan 2026',amount:6800},{month:'Feb 2026',amount:7200},{month:'Mar 2026',amount:7600},{month:'Apr 2026',amount:8100},{month:'May 2026',amount:8800}]};

const MED2_S = {avg_patient_value:185,missed_call_booking_rate:0.30,lead_conversion_rate:0.35,missed_call_threshold:0.12,no_show_threshold:0.10,cancellation_threshold:0.12,unbooked_lead_threshold:0.25};
const MED2_C = [...Array(22).fill(0).map((_,i)=>({id:`m2mc${i}`,date:'2026-05-15',time:`${8+i%10}:${i%2===0?'00':'30'} AM`,status:'Missed',duration:0,booked:'No',notes:'Patient inquiry'})),...Array(60).fill(0).map((_,i)=>({id:`m2ac${i}`,date:'2026-05-15',time:`${8+i%10}:00 AM`,status:'Answered',duration:120+i*5,booked:i%4===0?'Yes':'No',notes:''}))];
const MED2_A = [...Array(18).fill(0).map((_,i)=>({id:`m2ns${i}`,date:`2026-05-${10+i%15}`,time:'9:00 AM',type:'Walk-in Visit',provider:'Dr. Williams',status:'No-Show',value:185,notes:''})),...Array(12).fill(0).map((_,i)=>({id:`m2cn${i}`,date:`2026-05-${10+i}`,time:'3:00 PM',type:'Follow-up',provider:'Dr. Chen',status:'Canceled',value:185,notes:''})),...Array(80).fill(0).map((_,i)=>({id:`m2cp${i}`,date:`2026-05-${5+i%20}`,time:'10:00 AM',type:'Walk-in Visit',provider:i%2===0?'Dr. Williams':'Dr. Chen',status:'Completed',value:185,notes:''}))];
const MED2_L = [...Array(28).fill(0).map((_,i)=>({id:`m2ul${i}`,date:`2026-05-${3+i%22}`,name:'',phone:'',source:'Google',service:'Urgent Care Visit',status:'Unbooked',booked:'No',value:185,notes:''})),...Array(12).fill(0).map((_,i)=>({id:`m2bl${i}`,date:`2026-05-${3+i}`,name:'',phone:'',source:'Website',service:'Visit',status:'Booked',booked:'Yes',value:185,notes:''}))];
const MED2 = {id:'med_demo2',name:'Riverside Urgent Care',month:'May 2026',tag:'Demo',isDemo:true,vertical:'medical',settings:MED2_S,calls:MED2_C,appts:MED2_A,leads:MED2_L,trend:[{month:'Jan 2026',amount:9200},{month:'Feb 2026',amount:10100},{month:'Mar 2026',amount:11400},{month:'Apr 2026',amount:12200},{month:'May 2026',amount:13600}]};

// ── Chiro demo ──
const CHIRO1_S = {avg_patient_value:85,missed_call_booking_rate:0.28,lead_conversion_rate:0.30,missed_call_threshold:0.15,no_show_threshold:0.12,cancellation_threshold:0.14,unbooked_lead_threshold:0.30};
const CHIRO1_C = [...Array(14).fill(0).map((_,i)=>({id:`c1mc${i}`,date:'2026-05-15',time:`${9+i%8}:00 AM`,status:'Missed',duration:0,booked:'No',notes:'New patient inquiry'})),...Array(40).fill(0).map((_,i)=>({id:`c1ac${i}`,date:'2026-05-15',time:`${9+i%8}:30 AM`,status:'Answered',duration:150+i*8,booked:i%3===0?'Yes':'No',notes:''}))];
const CHIRO1_A = [...Array(20).fill(0).map((_,i)=>({id:`c1ns${i}`,date:`2026-05-${8+i%18}`,time:'10:00 AM',type:'Adjustment',provider:'Dr. Martinez',status:'No-Show',value:85,notes:''})),...Array(14).fill(0).map((_,i)=>({id:`c1cn${i}`,date:`2026-05-${8+i}`,time:'2:30 PM',type:'Treatment Session',provider:'Dr. Martinez',status:'Canceled',value:85,notes:''})),...Array(65).fill(0).map((_,i)=>({id:`c1cp${i}`,date:`2026-05-${3+i%22}`,time:'11:00 AM',type:'Adjustment',provider:'Dr. Martinez',status:'Completed',value:85,notes:''}))];
const CHIRO1_L = [...Array(22).fill(0).map((_,i)=>({id:`c1ul${i}`,date:`2026-05-${4+i%20}`,name:'',phone:'',source:'Website',service:'New Patient Consult',status:'Unbooked',booked:'No',value:85,notes:''})),...Array(10).fill(0).map((_,i)=>({id:`c1bl${i}`,date:`2026-05-${4+i}`,name:'',phone:'',source:'Referral',service:'Adjustment',status:'Booked',booked:'Yes',value:85,notes:''}))];
const CHIRO1 = {id:'chiro_demo1',name:'Active Life Chiropractic',month:'May 2026',tag:'Demo',isDemo:true,vertical:'chiro',settings:CHIRO1_S,calls:CHIRO1_C,appts:CHIRO1_A,leads:CHIRO1_L,trend:[{month:'Jan 2026',amount:3200},{month:'Feb 2026',amount:3600},{month:'Mar 2026',amount:4100},{month:'Apr 2026',amount:4400},{month:'May 2026',amount:4900}]};

// ── Med Spa demo ──
const SPA1_S = {avg_patient_value:480,missed_call_booking_rate:0.35,lead_conversion_rate:0.38,missed_call_threshold:0.18,no_show_threshold:0.10,cancellation_threshold:0.15,unbooked_lead_threshold:0.35};
const SPA1_C = [...Array(16).fill(0).map((_,i)=>({id:`s1mc${i}`,date:'2026-05-15',time:`${10+i%8}:00 AM`,status:'Missed',duration:0,booked:'No',notes:'Treatment inquiry'})),...Array(45).fill(0).map((_,i)=>({id:`s1ac${i}`,date:'2026-05-15',time:`${10+i%8}:30 AM`,status:'Answered',duration:200+i*10,booked:i%3===0?'Yes':'No',notes:''}))];
const SPA1_A = [...Array(10).fill(0).map((_,i)=>({id:`s1ns${i}`,date:`2026-05-${10+i%15}`,time:'11:00 AM',type:'Botox Treatment',provider:'Dr. Lee',status:'No-Show',value:650,notes:''})),...Array(8).fill(0).map((_,i)=>({id:`s1cn${i}`,date:`2026-05-${10+i}`,time:'1:00 PM',type:'Filler Appointment',provider:'Nurse Kim',status:'Canceled',value:800,notes:''})),...Array(50).fill(0).map((_,i)=>({id:`s1cp${i}`,date:`2026-05-${4+i%22}`,time:'10:00 AM',type:i%3===0?'Botox Treatment':'Laser Treatment',provider:i%2===0?'Dr. Lee':'Nurse Kim',status:'Completed',value:i%3===0?650:400,notes:''}))];
const SPA1_L = [...Array(32).fill(0).map((_,i)=>({id:`s1ul${i}`,date:`2026-05-${2+i%22}`,name:'',phone:'',source:'Instagram',service:'Botox Consult',status:'Unbooked',booked:'No',value:480,notes:''})),...Array(14).fill(0).map((_,i)=>({id:`s1bl${i}`,date:`2026-05-${2+i}`,name:'',phone:'',source:'Website',service:'Treatment',status:'Booked',booked:'Yes',value:480,notes:''}))];
const SPA1 = {id:'spa_demo1',name:'Glow Aesthetics & Med Spa',month:'May 2026',tag:'Demo',isDemo:true,vertical:'medspa',settings:SPA1_S,calls:SPA1_C,appts:SPA1_A,leads:SPA1_L,trend:[{month:'Jan 2026',amount:14200},{month:'Feb 2026',amount:15800},{month:'Mar 2026',amount:17400},{month:'Apr 2026',amount:18900},{month:'May 2026',amount:21200}]};

// ── Optometry demo ──
const OPT1_S = {avg_patient_value:220,missed_call_booking_rate:0.32,lead_conversion_rate:0.40,missed_call_threshold:0.10,no_show_threshold:0.08,cancellation_threshold:0.10,unbooked_lead_threshold:0.22};
const OPT1_C = [...Array(10).fill(0).map((_,i)=>({id:`o1mc${i}`,date:'2026-05-15',time:`${9+i%8}:00 AM`,status:'Missed',duration:0,booked:'No',notes:'Exam inquiry'})),...Array(42).fill(0).map((_,i)=>({id:`o1ac${i}`,date:'2026-05-15',time:`${9+i%8}:30 AM`,status:'Answered',duration:160+i*8,booked:i%4===0?'Yes':'No',notes:''}))];
const OPT1_A = [...Array(9).fill(0).map((_,i)=>({id:`o1ns${i}`,date:`2026-05-${10+i%15}`,time:'10:30 AM',type:'Comprehensive Exam',provider:'Dr. Thompson',status:'No-Show',value:220,notes:''})),...Array(7).fill(0).map((_,i)=>({id:`o1cn${i}`,date:`2026-05-${10+i}`,time:'2:00 PM',type:'Contact Lens Fitting',provider:'Dr. Thompson',status:'Canceled',value:280,notes:''})),...Array(55).fill(0).map((_,i)=>({id:`o1cp${i}`,date:`2026-05-${4+i%22}`,time:'11:00 AM',type:i%3===0?'Contact Lens Exam':'Comprehensive Exam',provider:'Dr. Thompson',status:'Completed',value:i%3===0?280:220,notes:''}))];
const OPT1_L = [...Array(16).fill(0).map((_,i)=>({id:`o1ul${i}`,date:`2026-05-${4+i%20}`,name:'',phone:'',source:'Website',service:'Annual Exam',status:'Unbooked',booked:'No',value:220,notes:''})),...Array(10).fill(0).map((_,i)=>({id:`o1bl${i}`,date:`2026-05-${4+i}`,name:'',phone:'',source:'Referral',service:'Exam',status:'Booked',booked:'Yes',value:220,notes:''}))];
const OPT1 = {id:'opt_demo1',name:'ClearView Eye Care',month:'May 2026',tag:'Demo',isDemo:true,vertical:'optometry',settings:OPT1_S,calls:OPT1_C,appts:OPT1_A,leads:OPT1_L,trend:[{month:'Jan 2026',amount:4800},{month:'Feb 2026',amount:5200},{month:'Mar 2026',amount:5600},{month:'Apr 2026',amount:6000},{month:'May 2026',amount:6500}]};

const ALL_DEMOS = [DEMO1, DEMO2, DEMO3, MED1, MED2, CHIRO1, SPA1, OPT1];


export default function App() {
  const [user,             setUser]             = useState(null);
  const [authChecked,      setAuthChecked]      = useState(false);
  const [profile,          setProfile]          = useState(null);
  const [page,             setPage]             = useState('home');
  const [practices,        setPractices]        = useState(ALL_DEMOS);
  const [activePracticeId, setActivePracticeId] = useState('demo1');
  const [showTour, setShowTour] = useState(false);
  const [activeVertical, setActiveVertical] = useState(DEFAULT_VERTICAL);

  useEffect(() => {
    if (window.location.search.includes('demo=true')) setShowTour(true);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user || null;
      setUser(u);
      setAuthChecked(true);
      if (u) {
        supabase.from('profiles')
          .select('role, practice_id, is_leaklens_admin')
          .eq('id', u.id)
          .single()
          .then(({ data: prof }) => {
            setProfile(prof);
            if (prof && !prof.is_leaklens_admin) {
              setPage('dashboard');
              if (prof.practice_id) setActivePracticeId(prof.practice_id);
            }
          });
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user || null;
      setUser(u);
      if (u) {
        supabase.from('profiles')
          .select('role, practice_id, is_leaklens_admin')
          .eq('id', u.id)
          .single()
          .then(({ data: prof }) => {
            setProfile(prof);
            // Non-admin users go straight to their practice dashboard
            if (prof && !prof.is_leaklens_admin) {
              setPage('dashboard');
              if (prof.practice_id) setActivePracticeId(prof.practice_id);
            }
          });
      } else {
        setProfile(null);
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => { if (user) loadPractices(); }, [user]);

  async function loadPractices() {
    const { data: pracData } = await supabase.from('practices').select('*').order('created_at');
    if (!pracData?.length) { setPractices(ALL_DEMOS); return; }

    const loaded = await Promise.all(pracData.map(async (p) => {
      const [{ data: calls }, { data: appts }, { data: leads }] = await Promise.all([
        supabase.from('calls').select('*').eq('practice_id', p.id),
        supabase.from('appointments').select('*').eq('practice_id', p.id),
        supabase.from('leads').select('*').eq('practice_id', p.id),
      ]);
      const settings = {
        avg_patient_value: p.avg_patient_value,
        missed_call_booking_rate: p.missed_call_booking_rate,
        lead_conversion_rate: p.lead_conversion_rate,
        no_show_threshold: p.no_show_threshold,
        missed_call_threshold: p.missed_call_threshold,
        cancellation_threshold: p.cancellation_threshold,
        unbooked_lead_threshold: p.unbooked_lead_threshold,
      };
      const c = calls||[]; const a = appts||[]; const l = leads||[];
      const m = calculateMetrics(c, a, l, settings);
      // Load monthly snapshots for trend chart
      const { data: snapshots } = await supabase
        .from('month_snapshots')
        .select('month, total_leak')
        .eq('practice_id', p.id)
        .order('created_at', { ascending: true });
      const trend = snapshots && snapshots.length > 0
        ? snapshots.map(s => ({ month: s.month, amount: s.total_leak }))
        : [{ month: p.month || 'Current', amount: m.totalLeak }];
      return { id:p.id, name:p.name, month:p.month, tag:'Client', settings, calls:c, appts:a, leads:l, trend, metrics:m };
    }));

    setPractices([...ALL_DEMOS, ...loaded]);
    if (loaded.length) setActivePracticeId(loaded[0].id);
  }

  async function deletePractice(id) {
    // Remove from Supabase
    await supabase.from('calls').delete().eq('practice_id', id);
    await supabase.from('appointments').delete().eq('practice_id', id);
    await supabase.from('leads').delete().eq('practice_id', id);
    await supabase.from('recovery_status').delete().eq('practice_id', id);
    await supabase.from('month_snapshots').delete().eq('practice_id', id);
    await supabase.from('practices').delete().eq('id', id);
    // Remove from state
    setPractices(prev => prev.filter(p => p.id !== id));
    setActivePracticeId(prev => prev === id ? (practices.find(p => p.id !== id)?.id || 'demo1') : prev);
    setPage('home');
  }

  async function archivePractice(id) {
    await supabase.from('practices').update({ archived: true }).eq('id', id);
    setPractices(prev => prev.map(p => p.id === id ? { ...p, archived: true } : p));
  }

  async function unarchivePractice(id) {
    await supabase.from('practices').update({ archived: false }).eq('id', id);
    setPractices(prev => prev.map(p => p.id === id ? { ...p, archived: false } : p));
  }

  async function addPractice(name, month) {
    const { data, error } = await supabase.from('practices').insert({ name, month }).select().single();
    if (error || !data) { alert('Error: ' + (error?.message || 'Unknown')); return; }
    const m = calculateMetrics([], [], [], DEMO_SETTINGS);
    const newPrac = { id:data.id, name:data.name, month:data.month, tag:'Client', settings:DEMO_SETTINGS, calls:[], appts:[], leads:[], trend:[{month:data.month,amount:0}], metrics:m };
    setPractices(prev => [...prev, newPrac]);
    setActivePracticeId(data.id);
    setPage('onboarding');
  }

  function updatePractice(updates) {
    setPractices(prev => prev.map(p => {
      if (p.id !== activePracticeId) return p;
      const merged = { ...p, ...updates };
      if (updates.settings) merged.settings = { ...p.settings, ...updates.settings };
      merged.metrics = calculateMetrics(merged.calls, merged.appts, merged.leads, merged.settings);
      if (!updates.trend) {
        const existing = p.trend || [];
        const last = existing[existing.length - 1];
        if (last && last.month === merged.month) {
          merged.trend = [...existing.slice(0, -1), { month: merged.month, amount: merged.metrics.totalLeak }];
        } else {
          merged.trend = [...existing, { month: merged.month, amount: merged.metrics.totalLeak }];
        }
      }
      return merged;
    }));
  }

  const verticalPractices = practices.filter(p => !p.vertical || p.vertical === activeVertical);
  const practice = verticalPractices.find(p => p.id === activePracticeId) || verticalPractices[0];
  const liveMetrics = practice ? calculateMetrics(practice.calls || [], practice.appts || [], practice.leads || [], practice.settings || {}) : null;
  const practiceCounts = practices.reduce((acc,p) => { if(p.vertical){ acc[p.vertical]=(acc[p.vertical]||0)+1; } return acc; }, {});
  const isAdmin = profile?.is_leaklens_admin === true || !profile; // fallback true if no profiles table yet
  const pageProps = { practice, metrics: liveMetrics, updatePractice, deletePractice, archivePractice, unarchivePractice, setPage, user, profile, isAdmin, practices: verticalPractices, allPractices: practices, setActivePracticeId, activePracticeId, activeVertical, setActiveVertical, practiceCounts };
  const pages = { vertical_selector:VerticalSelector, home:AdminHome, admin_settings:AdminSettings, onboarding:OnboardingPage, dashboard:Dashboard, leaks:LeakPage, recovery:RecoveryPage, providers:ProvidersPage, upload:UploadPage, report:ReportPage, settings:SettingsPage };
  const PageComponent = pages[page] || AdminHome;

  if (!authChecked) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg)',color:'var(--text3)',fontSize:14}}>Loading…</div>;
  if (!user) return <LoginPage onLogin={setUser} />;

  return (
    <div style={{display:'flex',minHeight:'100vh'}}>
      <Sidebar page={page} setPage={setPage} practices={verticalPractices} activePracticeId={activePracticeId} setActivePracticeId={setActivePracticeId} onAddPractice={addPractice} user={user} activeVertical={activeVertical} setActiveVertical={setActiveVertical} isAdmin={isAdmin} />
      <TopNav page={page} setPage={setPage} practice={practice} />
      <main style={{marginLeft:'var(--sidebar)',flex:1,padding:'2rem',paddingTop:'calc(52px + 2rem)',maxWidth:'calc(100vw - var(--sidebar))',overflowX:'hidden'}}>
        {page === 'vertical_selector' ? (
        <VerticalSelector
          activeVertical={activeVertical}
          practiceCounts={practiceCounts}
          onSelect={(v) => {
            setActiveVertical(v);
            // Switch to first practice in that vertical
            const firstInVertical = practices.find(p => p.vertical === v) ||
              [...medDemos,...chiroDemos,...spaDemos,...optoDemos].find(p => p.vertical === v) ||
              demoPractices[0];
            if (firstInVertical) setActivePracticeId(firstInVertical.id);
            setPage('home');
          }}
        />
      ) : (
        <PageComponent {...pageProps} />
      )}
      </main>
      {showTour && (
        <DemoTour
          onNavigate={setPage}
          onSelectPractice={setActivePracticeId}
          onClose={() => setShowTour(false)}
        />
      )}
    </div>
  );
}
