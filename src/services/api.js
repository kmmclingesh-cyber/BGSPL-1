const API_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

export async function apiRequest(action, payload = {}) {
  if (!API_URL) throw new Error('VITE_APPS_SCRIPT_URL is not configured.');
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action, payload })
  });
  if (!response.ok) throw new Error(`API request failed: ${response.status}`);
  const result = await response.json();
  if (!result.ok) throw new Error(result.error || 'Unknown API error');
  return result.data;
}

export const loadAll = () => apiRequest('loadAll');
export const saveAll = (data) => apiRequest('saveAll', data);
export const uploadDocument = (document) => apiRequest('uploadDocument', document);
