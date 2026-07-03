import { useEffect, useState } from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Users, FolderKanban, FileText, Clock3, Activity, Settings, LogOut } from 'lucide-react';
import { loadAll, listRecords } from './services/api';
import SystemConnections from './components/SystemConnections';
import LiveModule from './components/LiveModule';
import Login from './components/Login';

const modules = [
  ['/', 'Dashboard', LayoutDashboard, ['employee','management','admin','developer']],
  ['/tasks', 'Tasks', CheckSquare, ['employee','management','admin','developer']],
  ['/clients', 'Clients', Users, ['management','admin','developer']],
  ['/projects', 'Projects', FolderKanban, ['management','admin','developer']],
  ['/documents', 'Files', FileText, ['employee','management','admin','developer']],
  ['/worklogs', 'Time', Clock3, ['employee','management','admin','developer']],
  ['/activities', 'Activity', Activity, ['management','admin','developer']],
  ['/settings', 'Settings', Settings, ['admin','developer']]
];

function Dashboard() {
  const [data, setData] = useState(null);
  useEffect(() => { loadAll().then(setData).catch(() => {}); }, []);
  const cards = [['Tasks',data?.tasks?.length||0],['Clients',data?.clients?.length||0],['Projects',data?.development?.length||0],['Files',data?.documents?.length||0]];
  return <><div className="module-head"><h2>Dashboard</h2></div><div className="stats">{cards.map(([label,value]) => <article key={label}><span>{label}</span><strong>{value}</strong></article>)}</div></>;
}

function ActivityPage() {
  const [rows, setRows] = useState([]);
  useEffect(() => { listRecords('activities').then(setRows).catch(() => {}); }, []);
  return <><div className="module-head"><h2>Activity</h2><span>{rows.length}</span></div><div className="table-wrap"><table><thead><tr><th>Time</th><th>Type</th><th>Module</th><th>Message</th></tr></thead><tbody>{rows.slice().reverse().map(r => <tr key={r.id}><td>{new Date(r.createdAt).toLocaleString()}</td><td>{r.type}</td><td>{r.module}</td><td>{r.message}</td></tr>)}</tbody></table></div></>;
}

function SettingsPage() { return <><div className="module-head"><h2>Settings</h2></div><SystemConnections/></>; }

export default function App() {
  const [user, setUser] = useState(() => { try { return JSON.parse(sessionStorage.getItem('bgspUser')); } catch { return null; } });
  function login(next) { sessionStorage.setItem('bgspUser', JSON.stringify(next)); setUser(next); }
  function logout() { sessionStorage.removeItem('bgspUser'); setUser(null); }
  if (!user) return <Login onLogin={login} />;

  const visible = modules.filter(([, , , roles]) => roles.includes(user.role));
  const allowed = path => visible.some(([p]) => p === path);
  return <div className="app"><aside><div className="brand"><div className="mark">B</div><div><b>BGSP#1</b><span>{user.role}</span></div></div><nav>{visible.map(([path,label,Icon]) => <NavLink key={path} to={path} end={path === '/'}><Icon size={18}/><span>{label}</span></NavLink>)}</nav><button className="logout-btn" onClick={logout}><LogOut size={17}/><span>Logout</span></button></aside><main><header><div><span className="eyebrow">BGSP#1</span><h1>{user.name}</h1></div><div className="avatar">{user.name.charAt(0).toUpperCase()}</div></header><div className="content"><Routes>
    <Route path="/" element={<Dashboard/>}/>
    <Route path="/tasks" element={allowed('/tasks') ? <LiveModule type="tasks"/> : <Navigate to="/"/>}/>
    <Route path="/clients" element={allowed('/clients') ? <LiveModule type="clients"/> : <Navigate to="/"/>}/>
    <Route path="/projects" element={allowed('/projects') ? <LiveModule type="development"/> : <Navigate to="/"/>}/>
    <Route path="/documents" element={allowed('/documents') ? <LiveModule type="documents"/> : <Navigate to="/"/>}/>
    <Route path="/worklogs" element={allowed('/worklogs') ? <LiveModule type="worklogs"/> : <Navigate to="/"/>}/>
    <Route path="/activities" element={allowed('/activities') ? <ActivityPage/> : <Navigate to="/"/>}/>
    <Route path="/settings" element={allowed('/settings') ? <SettingsPage/> : <Navigate to="/"/>}/>
    <Route path="*" element={<Navigate to="/"/>}/>
  </Routes></div></main></div>;
}
