import { useState } from 'react';

const roles = [
  ['employee', 'Employee', 'Tasks and time'],
  ['management', 'Management', 'Operations and reports'],
  ['admin', 'Office Admin', 'Clients, files and users'],
  ['developer', 'Developer', 'Full system access']
];

export default function Login({ onLogin }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('employee');

  function submit(e) {
    e.preventDefault();
    onLogin({ name: name.trim() || roles.find(r => r[0] === role)[1], role });
  }

  return <div className="login-shell"><div className="login-card">
    <div className="login-brand"><div className="mark">B</div><div><b>BGSP#1</b><span>Company OS</span></div></div>
    <h1>Login</h1><p>Select your workspace access.</p>
    <form onSubmit={submit}>
      <label><span>Name</span><input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" /></label>
      <div className="role-grid">{roles.map(([value, label, note]) => <button type="button" key={value} className={role === value ? 'role-card selected' : 'role-card'} onClick={() => setRole(value)}><strong>{label}</strong><small>{note}</small></button>)}</div>
      <button className="login-btn">Continue</button>
    </form>
  </div></div>;
}
