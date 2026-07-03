import { useEffect, useState } from 'react';
import { Database, HardDrive, FileJson, RefreshCw } from 'lucide-react';
import { systemStatus, syncSheetsToDataFile } from '../services/api';

export default function SystemConnections() {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  async function check() {
    setLoading(true); setError('');
    try { setStatus(await systemStatus()); } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  async function sync() {
    setSyncing(true); setError('');
    try { await syncSheetsToDataFile(); await check(); } catch (e) { setError(e.message); }
    finally { setSyncing(false); }
  }

  useEffect(() => { check(); }, []);

  const items = [
    ['Google Sheets', Database, status?.spreadsheet],
    ['Google Drive', HardDrive, status?.drive],
    ['JSON Data File', FileJson, status?.dataFile]
  ];

  return <section className="connection-section">
    <div className="section-head"><div><span className="eyebrow">LIVE INFRASTRUCTURE</span><h3>System Connections</h3></div><div className="actions"><button className="outline-btn" onClick={sync} disabled={syncing || loading}>{syncing ? 'Syncing...' : 'Sync Sheets to Data File'}</button><button className="icon-btn" onClick={check} disabled={loading}><RefreshCw size={17}/></button></div></div>
    {error && <div className="error-box"><b>Connection failed</b><span>{error}</span></div>}
    <div className="connections">{items.map(([name, Icon, item]) => <article className="connection-card" key={name}><div className="connection-icon"><Icon size={22}/></div><div className="connection-info"><span>{name}</span><strong>{loading ? 'Checking connection...' : item?.name || 'Not connected'}</strong><small>{loading ? 'Please wait' : item ? 'Live and reachable' : 'Connection unavailable'}</small></div><div className={`status-dot ${item ? 'online' : ''}`}></div></article>)}</div>
    <div className="connection-footer"><span className={`live-pill ${status?.connected ? 'online' : ''}`}>{status?.connected ? 'ALL SYSTEMS LIVE' : 'CONNECTION CHECK'}</span><small>{status?.checkedAt ? `Last checked ${new Date(status.checkedAt).toLocaleString()}` : 'Waiting for live status'}</small></div>
  </section>;
}
