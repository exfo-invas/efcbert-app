import { Injectable } from '@angular/core';

declare global {
  interface Window { require: any; }
}

@Injectable({ providedIn: 'root' })
export class ElectronService {
  ipcRenderer = window.require ? window.require('electron').ipcRenderer : null;

  callElectronMethod(data: any) {
    if (this.ipcRenderer) {
      this.ipcRenderer.send('call-method', data);
    }
  }
}
