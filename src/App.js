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
import DemoTour from './components/DemoTour';

const DEMO1_TREND = [
  {month:'Jan',amount:9400},{month:'Feb',amount:10200},{month:'Mar',amount:11800},{month:'Apr',amount:10900},{month:'May',amount:12100},
];
const DEMO1 = {
  id:'demo1', name:'Sunrise Dental Studio', month:'May 2026', tag:'Demo',
  settings:DEMO_SETTINGS, calls:DEMO_CALLS, appts:DEMO_APPOINTMENTS, leads:DEMO_LEADS, trend:DEMO1_TREND,
  metrics:calculateMetrics(DEMO_CALLS,DEMO_APPOINTMENTS,DEMO_LEADS,DEMO_SETTINGS),
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
  metrics:calculateMetrics(DEMO2_C,DEMO2_A,DEMO2_L,DEMO2_S),
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
  metrics:calculateMetrics(DEMO3_C,DEMO3_A,DEMO3_L,DEMO3_S),
};

export default function App() {
  const [user,             setUser]             = useState(null);
  const [authChecked,      setAuthChecked]      = useState(false);
  const [page,             setPage]             = useState('home');
  const [practices,        setPractices]        = useState([DEMO1, DEMO2, DEMO3]);
  const [activePracticeId, setActivePracticeId] = useState('demo1');
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    if (window.location.search.includes('demo=true')) setShowTour(true);
  }, []);

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

  useEffect(() => { if (user) loadPractices(); }, [user]);

  async function loadPractices() {
    const { data: pracData } = await supabase.from('practices').select('*').order('created_at');
    if (!pracData?.length) { setPractices([DEMO1, DEMO2, DEMO3]); return; }

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

    setPractices([DEMO1, DEMO2, DEMO3, ...loaded]);
    if (loaded.length) setActivePracticeId(loaded[0].id);
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

  const practice = practices.find(p => p.id === activePracticeId) || practices[0];
  const liveMetrics = practice ? calculateMetrics(practice.calls || [], practice.appts || [], practice.leads || [], practice.settings || {}) : null;
  const pageProps = { practice, metrics: liveMetrics, updatePractice, setPage, user, practices, setActivePracticeId, activePracticeId };
  const pages = { home:AdminHome, admin_settings:AdminSettings, onboarding:OnboardingPage, dashboard:Dashboard, leaks:LeakPage, recovery:RecoveryPage, providers:ProvidersPage, upload:UploadPage, report:ReportPage, settings:SettingsPage };
  const PageComponent = pages[page] || AdminHome;

  if (!authChecked) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg)',color:'var(--text3)',fontSize:14}}>Loading…</div>;
  if (!user) return <LoginPage onLogin={setUser} />;

  return (
    <div style={{display:'flex',minHeight:'100vh'}}>
      <Sidebar page={page} setPage={setPage} practices={practices} activePracticeId={activePracticeId} setActivePracticeId={setActivePracticeId} onAddPractice={addPractice} user={user} />
      <main style={{marginLeft:'var(--sidebar)',flex:1,padding:'2rem',maxWidth:'calc(100vw - var(--sidebar))',overflowX:'hidden'}}>
        <PageComponent {...pageProps} />
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
