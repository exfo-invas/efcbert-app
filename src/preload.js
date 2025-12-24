const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  savePdf: (args) => ipcRenderer.invoke('save-pdf', args),
  openPdf: (args) => ipcRenderer.invoke('open-pdf', args),
  revealPdf: (args) => ipcRenderer.invoke('reveal-pdf', args),
  startServer: (args) => ipcRenderer.invoke('start-server', args)
});
