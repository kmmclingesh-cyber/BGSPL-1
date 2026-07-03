import { Routes, Route, NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Users, FolderKanban, FileText, Clock3, Activity, Settings } from 'lucide-react';
import SystemConnections from './components/SystemConnections';

const modules = [
  ['/', 'Dashboard', LayoutDashboard], ['/tasks', 'Tasks', CheckSquare], ['/clients', 'Clients', Users],
  ['/projects', 'Projects', FolderKanban], ['/documents', 'Files', FileText], ['/worklogs', 'Time', Clock3],
  ['/activities', 'Activity', Activity], ['/settings', 'Settings', Settings]
];

function Dashboard() {
  const cards = [['Tasks','0'],['Clients','0'],['Projects','0'],['Today','0h']];
  return <><div className="hero"><div><span className="eyebrow">BGSP#1</span><h2>Dashboard</h2><p>Company overview.</p></div><button>+ Task</button></div><div className="stats">{cards.map(([label,value])=><article key={label}><span>{label}</span><strong>{value}</strong></article>)}</div></>;
}

function Placeholder({ title }) { return <section className="panel"><h2>{title}</h2></section>; }
function SettingsPage() { return <><section className="panel"><h2>Settings</h2></section><SystemConnections/></>; }

export default function App() {
  return <div className="app"><aside><div className="brand"><div className="mark">B</div><div><b>BGSP#1</b><span>Company OS</span></div></div><nav>{modules.map(([path,label,Icon])=><NavLink key={path} to={path} end={path==='/' }><Icon size={19}/><span>{label}</span></NavLink>)}</nav><div className="company"><span>Workspace</span><b>Brainbanque Global Solutions</b></div></aside><main><header><div><span className="eyebrow">BGSP#1</span><h1>Workspace</h1></div><div className="avatar">L</div></header><div className="content"><Routes><Route path="/" element={<Dashboard/>}/><Route path="/settings" element={<SettingsPage/>}/>{modules.slice(1,-1).map(([path,label])=><Route key={path} path={path} element={<Placeholder title={label}/>}/>)}</Routes></div></main></div>;
}
