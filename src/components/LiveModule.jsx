import { useEffect, useState } from 'react';
import { loadAll, saveAll } from '../services/api';

const configs={
 tasks:{title:'Tasks',fields:[['title','Task'],['owner','Owner'],['dueDate','Due','date'],['priority','Priority','select',['Low','Medium','High']],['status','Status','select',['To Do','Progress','Done']]]},
 clients:{title:'Clients',fields:[['clientName','Client'],['contactPerson','Contact'],['phone','Phone'],['email','Email'],['status','Status','select',['Lead','Active','Inactive']],['nextFollowUp','Follow Up','date']]},
 development:{title:'Projects',fields:[['module','Project'],['owner','Owner'],['stage','Stage','select',['Plan','Build','Test','Live']],['targetDate','Target','date'],['notes','Notes']]},
 documents:{title:'Files',fields:[['clientName','Client'],['documentName','File'],['documentType','Type'],['driveUrl','Link'],['receivedDate','Date','date']]}
};

export default function LiveModule({type}){
 const cfg=configs[type]; const [all,setAll]=useState(null); const [form,setForm]=useState({}); const [busy,setBusy]=useState(true); const [error,setError]=useState('');
 const rows=all?.[type]||[];
 async function refresh(){setBusy(true);setError('');try{setAll(await loadAll())}catch(e){setError(e.message)}finally{setBusy(false)}}
 useEffect(()=>{refresh()},[type]);
 async function add(e){e.preventDefault();setBusy(true);try{const next={...all,[type]:[...rows,{id:`${type.slice(0,3).toUpperCase()}-${Date.now()}`,createdAt:new Date().toISOString(),...form}]};await saveAll(next);setAll(next);setForm({})}catch(e){setError(e.message)}finally{setBusy(false)}}
 async function remove(id){if(!confirm('Delete this record?'))return;setBusy(true);try{const next={...all,[type]:rows.filter(r=>r.id!==id)};await saveAll(next);setAll(next)}catch(e){setError(e.message)}finally{setBusy(false)}}
 return <><div className="module-head"><h2>{cfg.title}</h2><span>{rows.length}</span></div>{error&&<div className="error-box">{error}</div>}<form className="live-form" onSubmit={add}>{cfg.fields.map(([key,label,input='text',options])=><label key={key}><span>{label}</span>{input==='select'?<select required value={form[key]||''} onChange={e=>setForm({...form,[key]:e.target.value})}><option value="">Select</option>{options.map(o=><option key={o}>{o}</option>)}</select>:<input required={key===cfg.fields[0][0]} type={input} value={form[key]||''} onChange={e=>setForm({...form,[key]:e.target.value})}/>}</label>)}<button disabled={busy}>{busy?'Wait':'Add'}</button></form><div className="table-wrap"><table><thead><tr>{cfg.fields.map(f=><th key={f[0]}>{f[1]}</th>)}<th></th></tr></thead><tbody>{rows.length?rows.map(r=><tr key={r.id}>{cfg.fields.map(([key])=><td key={key}>{key==='driveUrl'&&r[key]?<a href={r[key]} target="_blank" rel="noreferrer">Open</a>:r[key]||'—'}</td>)}<td><button className="delete-btn" onClick={()=>remove(r.id)}>Delete</button></td></tr>):<tr><td colSpan={cfg.fields.length+1} className="empty">{busy?'Loading...':'No records'}</td></tr>}</tbody></table></div></>;
}
