import { Injectable } from '@angular/core';
import { EventStatusService } from './eventStatus.service';
import { LoggingService } from '../logging/logging.service';
import { EventDisruptions } from '../event/event.component.model';
import html2pdf from 'html2pdf.js';

/**
 * A lightweight printable-report service. The original code used direct import of
 * `html2pdf.js` which is not present in package.json and caused TypeScript build
 * errors. The built Electron packages do ship html2pdf globally, so we use the
 * global attached to `window` to avoid requiring an NPM dependency.
 */
@Injectable({ providedIn: 'root' })
export class PrintService {
  // These properties are defined so the service compiles and can be used by
  // components. The real app likely sets them dynamically or passes them into
  // the method; you can adapt as needed.
  logoBase64 = '';
  eventStatusBol = false;
  timeToNextHour = '';
  fullStatusData: any = {};
  eventDisruptions: EventDisruptions;
  hourlyEvent: any[] = [];

  constructor(private eventStatus: EventStatusService, private loggingService: LoggingService) { }

  private generateFilename(): string {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();

    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');

    return `ecfcbert-report-${dd}${mm}${yyyy}-${hh}${min}.pdf`;
  }

  /**
   * Generate a PDF report in a popup based on current state. Uses the global
   * html2pdf attached to window to avoid a missing-module type error.
   */
  async generateReportWithPopup() {
    // const w = window.open('', '_blank', 'width=900,height=1000');

    this.fullStatusData = this.eventStatus.getFullStatusData();

    // Align to actual data provided from EventStatusService
    const physicalData = this.fullStatusData?.physicalStatus || {};
    const wwnData = this.fullStatusData?.portStatus || {};
    const deviceConfigData = this.fullStatusData?.toolStatus || {};
    const pspLink = this.fullStatusData?.pspLinkStatus || '';

    this.eventDisruptions = this.eventStatus.getEventDisruptions();

    this.hourlyEvent = this.eventStatus.getHourlyEvent();

    // Build extra HTML snippets for event disruptions
    const trafficRows = (this.eventDisruptions?.traffic || []).map(t => `
      <tr>
        <td style="text-align:center">${t.type ?? ''}</td>
        <td style="text-align:center">${t.currentUtilization ?? ''}</td>
        <td style="text-align:center">${t.measuredThroughput ?? ''}</td>
        <td style="text-align:center">${t.transferSpeed ?? ''}</td>
        <td style="text-align:center">${t.measuredLineSpeed ?? ''}</td>
      </tr>
    `).join('');

    const frameLossRows = (this.eventDisruptions?.frameLoss || []).map(f => `
      <tr>
        <td style="text-align:center">${f.type ?? ''}</td>
        <td style="text-align:center">${f.byteCount ?? ''}</td>
        <td style="text-align:center">${f.frameRate ?? ''}</td>
        <td style="text-align:center">${f.frameCount ?? ''}</td>
        <td style="text-align:center">${f.frameLossRate ?? ''}</td>
      </tr>
    `).join('');

    const latencyRow = this.eventDisruptions?.latency ? `
      <tr>
        <td style="text-align:center">${this.eventDisruptions.latency.last ?? ''}</td>
        <td style="text-align:center">${this.eventDisruptions.latency.min ?? ''}</td>
        <td style="text-align:center">${this.eventDisruptions.latency.max ?? ''}</td>
      </tr>
    ` : '';

    const hourlyRows = (this.hourlyEvent || []).map(h => `
      <tr>
        <td style="text-align:center">${h.no ?? ''}</td>
        <td style="text-align:center">${h.utilization ?? ''}</td>
        <td style="text-align:center">${h.throughput ?? ''}</td>
        <td style="text-align:center">${h.latency ?? ''}</td>
        <td style="text-align:center">${h.framesLoss ?? ''}</td>
      </tr>
    `).join('');

    const standardFcRate = this.eventDisruptions?.standard?.fcRate ?? '';
    const standardFrameSize = this.eventDisruptions?.standard?.frameSize ?? '';

    const logRows = (this.loggingService.getLogsData() || []).map(l => `
      <tr>
        <td style="text-align:center">${l.id ?? ''}</td>
        <td style="text-align:center">${l.startTime ?? ''}</td>
        <td style="text-align:left">${l.event ?? ''}</td>
        <td style="text-align:center">${l.duration ?? ''}</td>
      </tr>
    `).join('');

    // Build the HTML for the report
    const html = `
      <html>
        <head>
          <title>BERT Report</title>
          <style>
            /* Page margins and typography */
            body {
              font-family: Arial;
              margin: 40px;
              padding: 20px 40px;
            }

            /* Print-friendly margins */
            @page {
              margin: 5in;
            }

            @media print {
              body {
                margin: 1in !important;
              }

              /* Slightly shrink the logo for print to avoid overflow */
              .logo img {
                max-width: 100px;
              }
            }

            h1 {
              text-align: center;
            }

            .logo {
              text-align: center;
              margin-bottom: 20px;
            }

            table {
              border-collapse: collapse;
              width: 100%;
              margin: 20px 0;
            }

            table th,
            td {
              border: 1px solid #999;
              padding: 6px;
              font-size: 12px;
            }

            th {
              background: #222;
              color: #fff;
            }

            .section-title {
              font-size: 16px;
              margin-top: 25px;
              font-weight: bold;
            }

            .line {
              width: 100%;
              height: 1px;
              background: #222;
              margin: 10px 0;
            }

            .cards-p {
              min-width: 200px;
            }
          </style>
        </head>

        <body>
          <div class="logo">
            <img src="assets/logo/Title-removebg.png" alt="Logo" height="50" width="100" />
          </div>
          <h1>Enhanced FC BERT Test Report</h1>
          <div class="line"></div>

          <div class="section-title">Test Summary</div>
          <div class="print-section">
            <table border="1" cellspacing="0" cellpadding="6">
              <thead>
                <tr>
                  <th>FC Rate</th>
                  <th>SFP & Port</th>
                  <th>TX Power</th>
                  <th>RX Power</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${physicalData.fcRate ?? ''}</td>
                  <td>${physicalData.sfpPort ?? ''}</td>
                  <td>${physicalData.txPower ?? ''}</td>
                  <td>${physicalData.rxPower ?? ''}</td>
                </tr>
              </tbody>
            </table>
            <table border="1" cellspacing="0" cellpadding="6">
              <thead>
                <tr>
                  <th>Buffer Flow Control</th>
                  <th>Available BB Credit</th>
                  <th>Logging</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${wwnData.flowControl ?? ''}</td>
                  <td>${wwnData.bufferCredit ?? ''}</td>
                  <td>${wwnData.loging ?? ''}</td>
                </tr>
              </tbody>
            </table>
            <table border="1" cellspacing="0" cellpadding="6">
              <thead>
                <tr>
                  <th>Coupled</th>
                  <th>TX Pattern</th>
                  <th>RX Pattern</th>
                  <th>FC Frame Size</th>
                  <th>Traffic Shaping</th>
                  <th>PSP Link</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${deviceConfigData.coupled ?? ''}</td>
                  <td>${deviceConfigData.txPattern ?? ''}</td>
                  <td>${deviceConfigData.rxPattern ?? ''}</td>
                  <td>${deviceConfigData.fcFrameSize ?? ''}</td>
                  <td>${deviceConfigData.trafficShaping ?? ''}</td>
                  <td>${pspLink}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="line"></div>
          <div class="section-title">Event Disruptions</div>
          <div class="print-section">
            <h4>Standard Event</h4>
            <table border="1" cellspacing="0" cellpadding="6">
              <thead>
                <tr>
                  <th>FC Rate</th>
                  <th>Frame Size</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="text-align:center">${standardFcRate}</td>
                  <td style="text-align:center">${standardFrameSize}</td>
                </tr>
              </tbody>
            </table>

            <h4>Traffic Analysis</h4>
            <table border="1" cellspacing="0" cellpadding="6">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Current Utilization (%)</th>
                  <th>Measured Throughput (Mbps)</th>
                  <th>Transfer Speed (MB/s)</th>
                  <th>Measured Line Speed (Gbps)</th>
                </tr>
              </thead>
              <tbody>
                ${trafficRows}
              </tbody>
            </table>

            <h4>Frame Loss</h4>
            <table border="1" cellspacing="0" cellpadding="6">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Byte Count</th>
                  <th>Frame Rate</th>
                  <th>Frame Count</th>
                  <th>Frame Loss Rate (%)</th>
                </tr>
              </thead>
              <tbody>
                ${frameLossRows}
              </tbody>
            </table>

            <h4>Latency</h4>
            <table border="1" cellspacing="0" cellpadding="6">
              <thead>
                <tr>
                  <th>Current</th>
                  <th>Min</th>
                  <th>Max</th>
                </tr>
              </thead>
              <tbody>
                ${latencyRow}
              </tbody>
            </table>

            <h4>Hourly Events</h4>
            <table border="1" cellspacing="0" cellpadding="6">
              <thead>
                <tr>
                  <th>Hour No.</th>
                  <th>Utilization</th>
                  <th>Throughput</th>
                  <th>Latency</th>
                  <th>Frames loss rate(%)</th>
                </tr>
              </thead>
              <tbody>
                ${hourlyRows}
              </tbody>
            </table>
            <h4 class="section-title">Logging History</h4>
            <table border="1" cellspacing="0" cellpadding="6">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Timestamp</th>
                  <th>Event</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                ${logRows}
              </tbody>
            </table>
          </div>
          
        </body>
      </html>
    `;
    const electronAPI = (window as any).electronAPI || null;

    const filename = this.generateFilename();   // <-- ALWAYS USE THIS FILENAME

    const pdfBase64 = await html2pdf()
      .from(html)
      .set({
        margin: 10,
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      })
      .outputPdf('datauristring');

    const base64Clean = pdfBase64.replace(/^data:application\/pdf;base64,/, '');

    // // Write content to popup and close
    // if (!w) {
    //   // Popup blocked or failed to open
    //   console.warn('Could not open report window');
    //   return;
    // }
    // w.document.write(html);
    // w.document.close(); MOVED TO previewInPopup

    // Browser fallback (not electron)
    if (!electronAPI || !electronAPI.savePdf) {
      const link = document.createElement('a');
      link.href = pdfBase64;
      link.download = filename;
      link.click();
      return;
    }

    // Save using Electron IPC
    const result = await electronAPI.savePdf({
      filename,
      dataBase64: base64Clean
    });
    this.previewInPopup(html);
    return result;
  }

  previewInPopup(html: string) {
    const popup = window.open('', '_blank', 'width=900,height=1000');
    popup!.document.write(html);
    popup!.document.close();
  }

}

// // Ensure html2pdf is available from global scope (shipped with Electron)
// let html2pdfLib: any = (window as any).html2pdf || null;.

// // Wait so that the new window fully renders then invoke the html2pdf.
// setTimeout(() => {
//   const content = w.document.body;

//   const opt: any = {
//     margin: 10,
//     filename: 'EFC_BERT_Report.pdf',
//     image: { type: 'jpeg', quality: 1 },
//     html2canvas: { scale: 2 },
//     jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
//   };

//   // Helper to convert ArrayBuffer to base64 string
//   const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
//     let binary = '';
//     const bytes = new Uint8Array(buffer);
//     const len = bytes.byteLength;
//     for (let i = 0; i < len; i++) {
//       binary += String.fromCharCode(bytes[i]);
//     }
//     return btoa(binary);
//   };

//   const globalHtml2pdf = html2pdfLib || (window as any).html2pdf;

//   const saveViaIPC = async (base64Data: string) => {
//     try {
//       const today = new Date();
//       const dd = String(today.getDate()).padStart(2, '0');
//       const mm = String(today.getMonth() + 1).padStart(2, '0');
//       const yyyy = today.getFullYear();
//       const dateFolder = `${dd}-${mm}-${yyyy}`;
//       const hh = String(today.getHours()).padStart(2, '0');
//       const min = String(today.getMinutes()).padStart(2, '0');
//       const ss = String(today.getSeconds()).padStart(2, '0');
//       const fileName = `EFC_BERT_Report_${dd}_${mm}_${yyyy}_${hh}${min}${ss}.pdf`;

//       const electronAPI = (window as any).electronAPI || null;
//       const electron = (window as any).require ? (window as any).require('electron') : null;
//       if (!electronAPI && (!electron || !electron.ipcRenderer)) {
//         // If no electron IPC available, let the user know why the desktop save path won't work
//         console.warn('ipcRenderer not available. Falling back to download save behavior');
//         w.alert('Desktop saving is only supported in the packaged Electron app. In dev, the PDF will be downloaded through the browser.\nConsider building/packaging the app to enable Desktop saving.');
//         globalHtml2pdf().from(content).set(opt).save();
//         return;
//       }

//       console.log('Invoking save-pdf for file', fileName, 'size(base64):', base64Data.length);
//       let resp: any = null;
//       if (electronAPI && typeof electronAPI.savePdf === 'function') {
//         resp = await electronAPI.savePdf({ filename: fileName, dateFolder, dataBase64: base64Data });
//       } else if (electron && electron.ipcRenderer) {
//         resp = await electron.ipcRenderer.invoke('save-pdf', { filename: fileName, dateFolder, dataBase64: base64Data });
//       }
//       if (resp && resp.success) {
//         w.alert(`Report saved to:\n${resp.path}`);
//         try {
//           const electron = (window as any).require ? (window as any).require('electron') : null;
//           if (electronAPI && typeof electronAPI.openPdf === 'function') {
//             await electronAPI.openPdf({ path: resp.path });
//             await electronAPI.revealPdf({ path: resp.path });
//           } else if (electron && electron.ipcRenderer) {
//             // Ask main process to open the saved PDF in default PDF viewer
//             await electron.ipcRenderer.invoke('open-pdf', { path: resp.path });
//             // Also reveal the file in the file manager
//             await electron.ipcRenderer.invoke('reveal-pdf', { path: resp.path });
//           } else {
//             // fallback: load blob/pdf into popup window
//             const blob = new Blob([Uint8Array.from(atob(base64Data), c => c.charCodeAt(0))], { type: 'application/pdf' });
//             const url = URL.createObjectURL(blob);
//             w.location.href = url;
//           }
//         } catch (err) {
//           console.warn('Unable to open preview via electron IPC, falling back to blob preview', err);
//         }
//       } else {
//         w.alert(`Failed to save report: ${resp && resp.error ? resp.error : 'Unknown error'}`);
//       }
//     } catch (err) {
//       console.error('Error saving PDF via IPC:', err);
//       w.alert(`Error saving PDF: ${err && err.message ? err.message : String(err)}`);
//     }
//   };

//   if (typeof globalHtml2pdf === 'function') {
//     // Try to generate PDF and get jsPDF instance so we can extract bytes to save via IPC
//     try {
//       const chain = globalHtml2pdf().from(content).set(opt);
//       if (chain && typeof chain.toPdf === 'function' && typeof chain.get === 'function') {
//         // html2pdf chain style
//         (chain as any).toPdf().get('pdf').then((pdf: any) => {
//           const arrayBuffer = pdf.output('arraybuffer');
//           const base64 = arrayBufferToBase64(arrayBuffer);
//           void saveViaIPC(base64);
//         }).catch((err: any) => {
//           console.error('Error building PDF for IPC save:', err);
//           // fallback to save
//           chain.save();
//         });
//       } else {
//         // fallback if library doesn't expose toPdf chain
//         chain.save();
//       }
//     } catch (err) {
//       console.error('Error generating PDF via html2pdf:', err);
//     }
//   } else if (typeof (globalHtml2pdf as any) === 'object' && typeof (globalHtml2pdf as any).default === 'function') {
//     const chain = (globalHtml2pdf as any).default().from(content).set(opt);
//     if ((chain as any).toPdf && typeof (chain as any).toPdf === 'function') {
//       (chain as any).toPdf().get('pdf').then((pdf: any) => {
//         const arrayBuffer = pdf.output('arraybuffer');
//         const base64 = arrayBufferToBase64(arrayBuffer);
//         void saveViaIPC(base64);
//       }).catch((err: any) => {
//         console.error('Error building PDF for IPC save (default):', err);
//         chain.save();
//       });
//     } else {
//       chain.save();
//     }
//   } else {
//     console.error('html2pdf is not available. Add html2pdf.js to your project or provide it globally.');
//   }
// }, 600);
