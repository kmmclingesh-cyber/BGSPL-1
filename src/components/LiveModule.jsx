import { useEffect, useState } from 'react';
import { listRecords, createRecord, updateRecord, deleteRecord } from '../services/api';

const configs = {
  tasks: { title: 'Tasks', fields: [['title','Task'],['owner','Owner'],['dueDate','Due','date'],['priority','Priority','select',['Low','Medium','High']],['status','Status','select',['To Do','Progress','Done']]] },
  clients: { title: 'Clients', fields: [['clientName','Client'],['contactPerson','Contact'],['phone','Phone'],['email','Email'],['status','Status','select',['Lead','Active','Inactive']],['nextFollowUp','Follow Up','date']] },
  development: { title: 'Projects', fields: [['module','Project'],['owner','Owner'],['stage','Stage','select',['Plan','Build','Test','Live']],['targetDate','Target','date'],['notes','Notes']] },
  documents: { title: 'Files', fields: [['clientName','Client'],['documentName','File'],['documentType','Type'],['driveUrl','Link'],['receivedDate','Date','date']] },
  worklogs: { title: 'Time', fields: [['date','Date','date'],['employee','Employee'],['task','Task'],['hours','Hours','number'],['notes','Notes']] }
};

export default function LiveModule({ type }) {
  const cfg = configs[type];
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({});
  const [editId, setEditId] = useState('');
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');

  async function refresh() {
    setBusy(true); setError('');
    try { setRows(await listRecords(type)); }
    catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }

  useEffect(() => { refresh(); }, [type]);

  async function submit(e) {
    e.preventDefault(); setBusy(true); setError('');
    try {
      if (editId) {
        const item = await updateRecord(type, editId, form);
        setRows(rows.map(r => r.id === editId ? item : r));
      } else {
        const item = await createRecord(type, form);
        setRows([...rows, item]);
      }
      setForm({}); setEditId('');
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }

  function edit(row) {
    const next = {};
    cfg.fields.forEach(([key]) => { next[key] = row[key] || ''; });
    setForm(next); setEditId(row.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function remove(id) {
    if (!confirm('Delete?')) return;
    setBusy(true); setError('');
    try {
      await deleteRecord(type, id);
      setRows(rows.filter(r => r.id !== id));
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }

  return <>
    <div className="module-head"><h2>{cfg.title}</h2><span>{rows.length}</span></div>
    {error && <div className="error-box">{error}</div>}
    <form className="live-form" onSubmit={submit}>
      {cfg.fields.map(([key, label, input = 'text', options]) => <label key={key}>
        <span>{label}</span>
        {input === 'select'
          ? <select required value={form[key] || ''} onChange={e => setForm({ ...form, [key]: e.target.value })}><option value="">Select</option>{options.map(o => <option key={o}>{o}</option>)}</select>
          : <input required={key === cfg.fields[0][0]} type={input} step={input === 'number' ? '0.25' : undefined} value={form[key] || ''} onChange={e => setForm({ ...form, [key]: e.target.value })} />}
      </label>)}
      <button disabled={busy}>{busy ? 'Wait' : editId ? 'Save' : 'Add'}</button>
    </form>
    <div className="table-wrap"><table><thead><tr>{cfg.fields.map(f => <th key={f[0]}>{f[1]}</th>)}<th></th></tr></thead><tbody>
      {rows.length ? rows.map(r => <tr key={r.id}>{cfg.fields.map(([key]) => <td key={key}>{key === 'driveUrl' && r[key] ? <a href={r[key]} target="_blank" rel="noreferrer">Open</a> : r[key] || '—'}</td>)}<td><button className="delete-btn" onClick={() => edit(r)}>Edit</button> <button className="delete-btn" onClick={() => remove(r.id)}>Delete</button></td></tr>) : <tr><td colSpan={cfg.fields.length + 1} className="empty">{busy ? 'Loading...' : 'No records'}</td></tr>}
    </tbody></table></div>
  </>;
}
