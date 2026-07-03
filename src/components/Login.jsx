import { useState } from 'react';
import { login } from '../services/api';

export default function Login({ onLogin }) {
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [error,setError]=useState('');
  const [busy,setBusy]=useState(false);
  async function submit(e){e.preventDefault();setBusy(true);setError('');try{const result=await login(email,password);sessionStorage.setItem('bgspToken',result.token);onLogin(result.user)}catch(e){setError(e.message)}finally{setBusy(false)}}
  return <div className="login-shell"><div className="login-card">
    <div className="login-brand"><div className="mark">B</div><div><b>BGSP#1</b><span>Company OS</span></div></div>
    <h1>Login</h1><p>Use your company account.</p>
    {error&&<div className="error-box">{error}</div>}
    <form onSubmit={submit}>
      <label><span>Email</span><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@company.com" /></label>
      <label><span>Password</span><input type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" /></label>
      <button className="login-btn" disabled={busy}>{busy?'Checking...':'Login'}</button>
    </form>
  </div></div>;
}
