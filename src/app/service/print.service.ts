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
    console.log('Event Disruptions Data in Print Service:', this.eventDisruptions);

    this.hourlyEvent = this.eventStatus.getHourlyEvent();
    console.log('Hourly Event Data in Print Service:', this.hourlyEvent);

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

    const fileRecords = this.eventStatus.getFileRecordsData();

    const fileRows = `
      <tr>
        <td style="text-align:center">Full Event Record</td>
        <td style="text-align:left">${fileRecords.eventFileName ?? '-'}</td>
      </tr>
      <tr>
        <td style="text-align:center">Hourly Event Record</td>
        <td style="text-align:left">${fileRecords.hourlyFileName ?? '-'}</td>
      </tr>
    `;

    const filename = this.generateFilename();   // <-- ALWAYS USE THIS FILENAME

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
          <!-- Start time and filename generated -->
          <div class="print-section">
            <table border="1" cellspacing="0" cellpadding="6">
              <thead>
                <tr>
                  <th>Start Time</th>
                  <th>File Name</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="text-align:center">${fileRecords.startTime ?? ''}</td>
                  <td style="text-align:center">${filename}</td>
                </tr>
              </tbody>
            </table>
          </div>

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
            <div>Note: In the above tables, '1' indicates 'ON' and '0' indicates 'OFF' for relevant settings.</div>
          </div>
          <div class="line"></div>
          <div class="section-title">Test Summary</div>
          <div class="print-section">
            <h4>EFCBert Results</h4>
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
          <div class="line"></div>
          <div class="section-title">File Records</div>
          <div class="print-section">
            <table border="1" cellspacing="0" cellpadding="6">
              <thead>
                <tr>
                  <th>File Type</th>
                  <th>File Name</th>
                </tr>
              </thead>
              <tbody>
                ${fileRows}
              </tbody>
            </table>
          </div>
        </body>
      </html>
    `;
    const electronAPI = (window as any).electronAPI || null;

    const pdfBase64 = await html2pdf()
      .from(html)
      .set({
        margin: 10,
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      })
      .outputPdf('datauristring');

    const base64Clean = pdfBase64.replace(/^data:application\/pdf;base64,/, '');

    //this.previewInPopup(html);

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
    return result;
  }

  previewInPopup(html: string) {
    const popup = window.open('', '_blank', 'width=900,height=1000');
    popup!.document.write(html);
    popup!.document.close();
  }
}