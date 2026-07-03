import { Routes, Route, NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Users, FolderKanban, FileText, Clock3, Activity, Settings } from 'lucide-react';

const modules = [
  ['/', 'Dashboard', LayoutDashboard], ['/tasks', 'Tasks', CheckSquare], ['/clients', 'Clients', Users],
  ['/projects', 'Projects', FolderKanban], ['/documents', 'Documents', FileText], ['/worklogs', 'Work Tracking', Clock3],
  ['/activities', 'Activities', Activity], ['/settings', 'Settings', Settings]
];

function Dashboard() {
  const cards = [['Active Tasks','0'],['Active Clients','0'],['Projects','0'],['Hours Today','0h']];
  return <><div className="hero"><div><span className="eyebrow">BRAINBANQUE GLOBAL SOLUTIONS</span><h2>Company Command Centre</h2><p>Manage work, clients, files, people and the complete operating history of the company.</p></div><button>+ Create Task</button></div><div className="stats">{cards.map(([label,value])=><article key={label}><span>{label}</span><strong>{value}</strong><small>Ready for live Google Sheets data</small></article>)}</div><section className="panel"><h3>BGSP#1 Foundation</h3><p>The application shell is running. Next we connect the Apps Script API and replace these placeholders with live company data.</p></section></>;
}

function Placeholder({ title }) { return <section className="panel"><span className="eyebrow">MODULE</span><h2>{title}</h2><p>This module is ready for development.</p></section>; }

export default function App() {
  return <div className="app"><aside><div className="brand"><div className="mark">B</div><div><b>BGSP#1</b><span>Company OS</span></div></div><nav>{modules.map(([path,label,Icon])=><NavLink key={path} to={path} end={path==='/' }><Icon size={19}/><span>{label}</span></NavLink>)}</nav><div className="company"><span>Workspace</span><b>Brainbanque Global Solutions</b></div></aside><main><header><div><span className="eyebrow">INTERNAL OPERATING SYSTEM</span><h1>BGSP#1</h1></div><div className="avatar">L</div></header><div className="content"><Routes><Route path="/" element={<Dashboard/>}/>{modules.slice(1).map(([path,label])=><Route key={path} path={path} element={<Placeholder title={label}/>}/>)}</Routes></div></main></div>;
}
