const SHEETS = {
  tasks: ['id','createdAt','title','owner','dueDate','priority','status'],
  development: ['id','createdAt','module','owner','stage','targetDate','notes'],
  clients: ['id','createdAt','clientName','contactPerson','phone','email','status','nextFollowUp'],
  documents: ['id','createdAt','clientName','documentName','documentType','driveUrl','receivedDate'],
  users: ['id','createdAt','name','email','password','role','status']
};

const DEFAULT_SPREADSHEET_ID = '1l9TuPj5p0s0LM-8tkF5pytBEsQscoF7mQQiOijgrhVU';
const DEFAULT_DRIVE_FOLDER_ID = '1QaJy5Zz9yDimQ1MfiRPD-Rp_HG9WNFx0';
const DATA_FILE_NAME = 'BGSP-1-DATA.json';

function doGet() { return jsonResponse({ ok:true, data:getSystemStatus() }); }
function doPost(e) {
  try {
    const req = JSON.parse(e.postData.contents || '{}');
    const action = req.action;
    const payload = req.payload || {};
    const actions = {
      systemStatus: () => getSystemStatus(),
      loadAll: () => loadAll(),
      saveAll: () => saveAll(payload),
      readDataFile: () => readDataFile(),
      writeDataFile: () => writeDataFile(payload.data || payload),
      syncSheetsToDataFile: () => writeDataFile(loadAll()),
      syncDataFileToSheets: () => saveAll(readDataFile()),
      uploadDocument: () => uploadDocument(payload)
    };
    if (!actions[action]) throw new Error('Unknown action: ' + action);
    return jsonResponse({ ok:true, data:actions[action]() });
  } catch (err) { return jsonResponse({ ok:false, error:err.message, stack:err.stack }); }
}

function getSystemStatus() {
  const ss = getSpreadsheet();
  const folder = getRootFolder();
  const dataFile = getOrCreateDataFile();
  return { connected:true, spreadsheet:{ id:ss.getId(), name:ss.getName(), url:ss.getUrl() }, drive:{ id:folder.getId(), name:folder.getName(), url:folder.getUrl() }, dataFile:{ id:dataFile.getId(), name:dataFile.getName(), url:dataFile.getUrl() }, checkedAt:new Date().toISOString() };
}

function saveAll(payload) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    Object.keys(SHEETS).forEach(key => writeSheet(key, payload[key] || []));
    const snapshot = loadAll();
    writeDataFile(snapshot);
    return { savedAt:new Date().toISOString(), snapshotFile:DATA_FILE_NAME };
  } finally { lock.releaseLock(); }
}

function loadAll() {
  const data = {};
  Object.keys(SHEETS).forEach(key => data[key] = readSheet(key));
  return data;
}

function writeSheet(key, rows) {
  const sheet = getSheet(key); const headers = SHEETS[key];
  sheet.clearContents();
  sheet.getRange(1,1,1,headers.length).setValues([headers]);
  if (!rows.length) return;
  const values = rows.map(row => headers.map(h => row[h] ?? ''));
  sheet.getRange(2,1,values.length,headers.length).setValues(values);
}

function readSheet(key) {
  const sheet = getSheet(key); const headers = SHEETS[key]; ensureHeaders(sheet, headers);
  if (sheet.getLastRow() < 2) return [];
  return sheet.getRange(2,1,sheet.getLastRow()-1,headers.length).getValues().map(row => {
    const item = {}; headers.forEach((h,i) => item[h] = row[i] instanceof Date ? row[i].toISOString() : row[i]); return item;
  });
}

function readDataFile() {
  const text = getOrCreateDataFile().getBlob().getDataAsString();
  return text ? JSON.parse(text) : emptyData();
}

function writeDataFile(data) {
  const file = getOrCreateDataFile();
  const body = JSON.stringify({ meta:{ project:'BGSP#1', updatedAt:new Date().toISOString(), version:1 }, data:data.data || data }, null, 2);
  file.setContent(body);
  return { fileId:file.getId(), name:file.getName(), url:file.getUrl(), updatedAt:new Date().toISOString() };
}

function getOrCreateDataFile() {
  const folder = getRootFolder(); const files = folder.getFilesByName(DATA_FILE_NAME);
  if (files.hasNext()) return files.next();
  return folder.createFile(DATA_FILE_NAME, JSON.stringify({ meta:{ project:'BGSP#1', createdAt:new Date().toISOString(), version:1 }, data:emptyData() }, null, 2), MimeType.PLAIN_TEXT);
}

function uploadDocument(payload) {
  if (!payload.base64 || !payload.fileName) throw new Error('base64 and fileName are required');
  const bytes = Utilities.base64Decode(payload.base64);
  const blob = Utilities.newBlob(bytes, payload.mimeType || 'application/octet-stream', payload.fileName);
  const file = getRootFolder().createFile(blob);
  return { fileId:file.getId(), name:file.getName(), url:file.getUrl() };
}

function emptyData() { const data={}; Object.keys(SHEETS).forEach(k => data[k]=[]); return data; }
function getSpreadsheet() { return SpreadsheetApp.openById(getConfigValue('SPREADSHEET_ID', DEFAULT_SPREADSHEET_ID)); }
function getRootFolder() { return DriveApp.getFolderById(getConfigValue('DRIVE_FOLDER_ID', DEFAULT_DRIVE_FOLDER_ID)); }
function getSheet(key) { const ss=getSpreadsheet(); const name=key.charAt(0).toUpperCase()+key.slice(1); const sheet=ss.getSheetByName(name)||ss.insertSheet(name); ensureHeaders(sheet,SHEETS[key]); return sheet; }
function ensureHeaders(sheet,headers) { const range=sheet.getRange(1,1,1,headers.length); const existing=range.getValues()[0]; if (!headers.every((h,i)=>existing[i]===h)) range.setValues([headers]); }
function getConfigValue(name,fallback) { return PropertiesService.getScriptProperties().getProperty(name)||fallback; }
function jsonResponse(body) { return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON); }
