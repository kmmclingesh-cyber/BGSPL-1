const DEFAULT_API_URL = 'https://script.google.com/macros/s/AKfycbzF-_xufTDvZ-3dLz5rurF-YtabE7XGb5pRAbMi8xQspX0vV-TNQtyBmCBF_wXebipL/exec';
const API_URL = import.meta.env.VITE_APPS_SCRIPT_URL || DEFAULT_API_URL;

export async function apiRequest(action, payload = {}) {
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

export const getApiUrl = () => API_URL;
export const systemStatus = () => apiRequest('systemStatus');
export const loadAll = () => apiRequest('loadAll');
export const saveAll = (data) => apiRequest('saveAll', data);
export const readDataFile = () => apiRequest('readDataFile');
export const writeDataFile = (data) => apiRequest('writeDataFile', { data });
export const syncSheetsToDataFile = () => apiRequest('syncSheetsToDataFile');
export const syncDataFileToSheets = () => apiRequest('syncDataFileToSheets');
export const uploadDocument = (document) => apiRequest('uploadDocument', document);
