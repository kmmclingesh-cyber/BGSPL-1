const DEFAULT_API_URL='https://script.google.com/macros/s/AKfycbxZJfeNPllCCfM-S5DXz8QCKIlv8YbJpWY7Xcy4pU8NmNQeMCT8W-8kZouzPNTxoAj0/exec';
const API_URL=import.meta.env.VITE_APPS_SCRIPT_URL||DEFAULT_API_URL;
const getToken=()=>sessionStorage.getItem('bgspToken')||'';
export async function apiRequest(action,payload={},auth=true){const body={...payload};if(auth)body.token=getToken();const response=await fetch(API_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action,payload:body})});if(!response.ok)throw new Error(`API request failed: ${response.status}`);const result=await response.json();if(!result.ok)throw new Error(result.error||'Unknown API error');return result.data}
export const login=(email,password)=>apiRequest('login',{email,password},false);
export const validateSession=()=>apiRequest('session');
export const logout=()=>apiRequest('logout');
export const systemStatus=()=>apiRequest('systemStatus');
export const loadAll=()=>apiRequest('loadAll');
export const listRecords=module=>apiRequest('listRecords',{module});
export const createRecord=(module,record)=>apiRequest('createRecord',{module,record});
export const updateRecord=(module,id,record)=>apiRequest('updateRecord',{module,id,record});
export const deleteRecord=(module,id)=>apiRequest('deleteRecord',{module,id});
export const createUser=user=>apiRequest('createUser',user);
export const resetPassword=(id,password)=>apiRequest('resetPassword',{id,password});
export const readDataFile=()=>apiRequest('readDataFile');
export const writeDataFile=data=>apiRequest('writeDataFile',{data});
export const syncSheetsToDataFile=()=>apiRequest('syncSheetsToDataFile');
export const uploadDocument=document=>apiRequest('uploadDocument',document);
