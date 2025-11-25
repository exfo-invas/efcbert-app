import { Injectable, ApplicationRef } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Router, NavigationEnd } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';
import { EventStatusService } from '../service/eventStatus.service';

@Injectable({ providedIn: 'root' })
export class PrintService {
  constructor(private router: Router, private appRef: ApplicationRef, private eventStatusService: EventStatusService) { }

  /**
   * Capture a list of selectors from the DOM and save them into a single PDF.
   * selectors: array of CSS selectors (e.g. ['app-dashboard', 'app-event']).
   */
  async exportComponentsToPdf(
    selectors: string[] = [
      'app-dashboard',
      'app-event',
      'app-logging',
      'app-timer',
      'app-server-status',
      'app-login-page'
    ],
    fileName = 'components.pdf',
    excludeSelectors: string[] = ['.no-print'],
    fullWidth: boolean = true
  ) {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10; // mm
    let yOffset = margin;

    for (const sel of selectors) {
      try {
        const el = document.querySelector(sel) as HTMLElement;
        if (!el) continue;

        // wait for table rows inside the component to stabilize (helps with lazy-loaded rows)
        try {
          await this.waitForStableCount(`${sel} table tbody tr`, 8000, 800);
        } catch (e) { }

        // Ensure the element is visible when rendered — caller should ensure components are present in DOM
        const ignoreElements = (node: HTMLElement) => {
          if (!node) return false;
          try {
            for (const ex of excludeSelectors) {
              if (node.matches && node.matches(ex)) return true;
              if (node.closest && node.closest(ex)) return true;
            }
          } catch (e) {
            // ignore invalid selector errors
          }
          return false;
        };

        let canvas;
        if (fullWidth) {
          // Clone element into an offscreen wrapper and force a larger width so the captured image fills the PDF width
          const clone = el.cloneNode(true) as HTMLElement;
          const wrapper = document.createElement('div');
          wrapper.style.position = 'absolute';
          wrapper.style.left = '-9999px';
          wrapper.style.top = '0';
          wrapper.style.width = '1200px'; // wide enough to cover page; adjust if needed
          wrapper.style.background = 'white';
          // ensure the cloned tree fills the wrapper
          clone.style.width = '100%';
          clone.style.maxWidth = 'none';
          clone.style.boxSizing = 'border-box';
          wrapper.appendChild(clone);
          document.body.appendChild(wrapper);
          try {
            // make sure any tab panels inside the clone are visible so we capture all tabs
            this.expandScrollableTables(clone);
            canvas = await html2canvas(clone, { scale: 2, useCORS: true, ignoreElements });
            this.restoreScrollableTables(clone)
          } finally {
            document.body.removeChild(wrapper);
          }
        } else {
          canvas = await html2canvas(el, { scale: 2, useCORS: true, ignoreElements });
        }
        // Add the canvas to the PDF; if it's taller than a page, slice it into page-sized images
        yOffset = this.addCanvasAsPagedImages(pdf, canvas, margin, pageWidth, pageHeight, yOffset);
      } catch (err) {
        // continue on individual failures
        // console.warn(`Failed to capture ${sel}:`, err);
        continue;
      }
    }

    // Try to save to Desktop path when running inside Electron (node APIs available)
    await this.trySavePdfToDesktop(pdf, fileName);
  }

  // Wait until the number of elements matching selector stabilizes (no change for stableMs) or timeout
  private async waitForStableCount(selector: string, timeoutMs: number = 8000, stableMs: number = 800, intervalMs: number = 200) {
    if (!selector) return 0;
    const start = Date.now();
    let lastCount = -1;
    let lastChange = Date.now();

    while (Date.now() - start < timeoutMs) {
      const nodes = document.querySelectorAll(selector);
      const count = nodes ? nodes.length : 0;
      if (count !== lastCount) {
        lastCount = count;
        lastChange = Date.now();
      }
      // stabilized
      if (Date.now() - lastChange >= stableMs) {
        return lastCount;
      }
      await new Promise(r => setTimeout(r, intervalMs));
    }
    return lastCount;
  }

  /**
   * Add a canvas to the pdf, splitting vertically across pages if needed. Returns the new yOffset.
   */
  private addCanvasAsPagedImages(pdf: any, canvas: HTMLCanvasElement, margin: number, pageWidth: number, pageHeight: number, yOffset: number) {
    const usableWidth = pageWidth - margin * 2; // mm
    const usableHeight = pageHeight - margin * 2; // mm

    const imgWidthPx = canvas.width;
    const imgHeightPx = canvas.height;

    // px per mm ratio for width
    const pxPerMm = imgWidthPx / usableWidth;

    // how many source px correspond to one PDF page height
    const sliceHeightPx = Math.max(1, Math.floor(usableHeight * pxPerMm));

    let sy = 0;
    let currentYOffset = yOffset;

    while (sy < imgHeightPx) {
      const thisSlicePx = Math.min(sliceHeightPx, imgHeightPx - sy);
      const sliceCanvas = document.createElement('canvas');
      sliceCanvas.width = imgWidthPx;
      sliceCanvas.height = thisSlicePx;
      const ctx = sliceCanvas.getContext('2d');
      if (!ctx) break;
      ctx.drawImage(canvas, 0, sy, imgWidthPx, thisSlicePx, 0, 0, imgWidthPx, thisSlicePx);

      const imgData = sliceCanvas.toDataURL('image/png');
      const sliceMmHeight = (thisSlicePx * usableWidth) / imgWidthPx; // mm

      if (currentYOffset + sliceMmHeight > pageHeight - margin) {
        pdf.addPage();
        currentYOffset = margin;
      }

      pdf.addImage(imgData, 'PNG', margin, currentYOffset, usableWidth, sliceMmHeight);
      currentYOffset += sliceMmHeight + 8; // spacing
      sy += thisSlicePx;
    }

    return currentYOffset;
  }

  // Make tab panels visible inside a cloned DOM tree so html2canvas captures all tab contents.
  private unhideTabPanels(root: HTMLElement) {
    if (!root) return;
    try {
      // common PrimeNG tab panel selectors
      const panels = root.querySelectorAll('.p-tabview-panel, .p-tabpanel');
      console.log('Unhiding tab panels:', panels.length);
      panels.forEach((n: Element) => {
        console.log('Unhiding tab panel element:', n);
        const el = n as HTMLElement;
        // el.style.display = 'flex';
        // el.style.visibility = 'visible';
        // el.style.flexDirection = 'column';
        // el.style.flexGrow = '1';
        el.removeAttribute('aria-hidden');
        el.classList.remove('p-hidden');
        el.classList.remove('p-tabview-hidden');
      });

      // also un-hide any elements with the hidden attribute
      root.querySelectorAll('[hidden]').forEach((n: Element) => {
        console.log('Unhiding element with hidden attribute:', n);
        const e = n as HTMLElement;
        console.log('Unhiding element:', e);
        e.hidden = false;
        // e.style.display = 'flex';
        // e.style.flexDirection = 'column';
        // e.style.flexGrow = '1';
      });
    } catch (e) {
      console.warn('Error unhiding tab panels:', e);
      // ignore errors
    }
  }

  // Expand scrollable tables in the cloned DOM so html2canvas captures all rows
  private expandScrollableTables(root: HTMLElement) {
    if (!root) return;
    const tables = root.querySelectorAll('.p-table-scrollable-body') as NodeListOf<HTMLElement>;
    tables.forEach(t => {
      // remember original height for restoration later
      t.setAttribute('data-original-height', t.style.maxHeight || t.style.height || '');
      // expand table so all rows are visible
      t.style.maxHeight = 'none';
      t.style.height = 'auto';
      t.style.overflow = 'visible';
    });
  }

  // Restore scrollable tables to their original styles after capture
  private restoreScrollableTables(root: HTMLElement) {
    if (!root) return;
    const tables = root.querySelectorAll('.p-table-scrollable-body') as NodeListOf<HTMLElement>;
    tables.forEach(t => {
      const orig = t.getAttribute('data-original-height');
      if (orig) {
        t.style.height = orig;
        t.style.maxHeight = orig;
      } else {
        t.style.removeProperty('height');
        t.style.removeProperty('max-height');
      }
      t.style.overflow = 'auto';
    });
  }


  /**
   * Navigate to each route, capture the routed view ('.content') and assemble into a single PDF.
   * This allows capturing components that are only rendered via routes.
   */
  async exportRoutesToPdf(
    routes: string[] = ['/home', '/event', '/logging'],
    excludeSelectors: string[] = ['.no-print'],
    fullWidth: boolean = true
  ) {
    this.eventStatusService.setIsPrinting(true);
    console.log('Exporting routes to PDF:', routes);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10; // mm
    let yOffset = margin;

    const initialUrl = this.router.url;

    const NAV_TIMEOUT = 5000; // ms
    const STABLE_TIMEOUT = 5000; // ms

    for (const route of routes) {
      try {
        console.log('Navigating to', route);
        // try navigate if not already on the route
        if (this.router.url !== route) {
          await this.router.navigateByUrl(route).catch(e => {
            console.warn('router.navigateByUrl rejected for', route, e);
          });
        } else {
          console.log('Already on route', route);
        }

        // wait for navigation end with timeout
        try {
          const navPromise = firstValueFrom(this.router.events.pipe(filter(e => e instanceof NavigationEnd)));
          await Promise.race([
            navPromise,
            new Promise(resolve => setTimeout(() => resolve('nav-timeout'), NAV_TIMEOUT))
          ]);
        } catch (e) {
          console.warn('Navigation wait failed for', route, e);
        }

        // give Angular a moment to render; prefer isStable but guard with timeout
        try {
          const stablePromise = firstValueFrom(this.appRef.isStable.pipe(filter(stable => stable === true)));
          await Promise.race([
            stablePromise,
            new Promise(resolve => setTimeout(() => resolve('stable-timeout'), STABLE_TIMEOUT))
          ]);
        } catch (e) {
          console.warn('isStable wait failed for', route, e);
        }

        // extra micro-wait to allow async rendering (images, third-party components)
        await new Promise(r => setTimeout(r, 250));

        // wait for any table rows to stabilize in the routed view (helps with lazy-loaded content)
        try {
          await this.waitForStableCount('.content table tbody tr', 8000, 800);
        } catch (e) { }

        console.log('Capturing route for PDF:', route);

        const el = document.querySelector('.content') as HTMLElement;
        if (!el) continue;

        // reuse same ignoreElements logic
        const ignoreElements = (node: HTMLElement) => {
          if (!node) return false;
          try {
            for (const ex of excludeSelectors) {
              if (node.matches && node.matches(ex)) return true;
              if (node.closest && node.closest(ex)) return true;
            }
          } catch (e) { }
          return false;
        };

        let canvas;
        if (fullWidth) {
          const clone = el.cloneNode(true) as HTMLElement;
          const wrapper = document.createElement('div');
          wrapper.style.position = 'absolute';
          wrapper.style.left = '-9999px';
          wrapper.style.top = '0';
          wrapper.style.width = '1200px';
          wrapper.style.background = 'white';
          clone.style.width = '100%';
          clone.style.maxWidth = 'none';
          clone.style.boxSizing = 'border-box';
          wrapper.appendChild(clone);
          document.body.appendChild(wrapper);
          try {
            // make sure any tab panels inside the clone are visible so we capture all tabs
            this.unhideTabPanels(clone);
            canvas = await html2canvas(clone, { scale: 2, useCORS: true, ignoreElements });
          } finally {
            document.body.removeChild(wrapper);
          }
        } else {
          canvas = await html2canvas(el, { scale: 2, useCORS: true, ignoreElements });
        }

        // If the captured canvas is taller than page, slice and continue on next pages
        yOffset = this.addCanvasAsPagedImages(pdf, canvas, margin, pageWidth, pageHeight, yOffset);
      } catch (err) {
        console.warn(`Failed to capture route ${route}:`, err);
        continue;
      }
    }

    // restore initial route
    try {
      await this.router.navigateByUrl(initialUrl);
    } catch (e) {
      console.warn('Failed to restore initial route:', e);
    }

    //file name efcbert-report-dd-mm-yyyy.pdf
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = String(today.getFullYear());
    const fileName = `efcbert-report-${dd}-${mm}-${yyyy}.pdf`;

    pdf.save(fileName);
    this.eventStatusService.setIsPrinting(false);
  }

  // Try to write PDF to Desktop/efcbert/dd-mm-yyyy/<fileName> when node APIs are available.
  private async trySavePdfToDesktop(pdf: any, fileName: string) {
    try {
      // Access Node require if available in renderer (Electron)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const r = (window as any).require as any;
      if (!r) {
        // fallback to browser download
        pdf.save(fileName);
        return;
      }

      const fs = r('fs');
      const path = r('path');
      const os = r('os');

      const homedir = os.homedir();
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const yyyy = String(today.getFullYear());
      const folder = path.join(homedir, 'Desktop', 'EnhancedFCBert', `${dd}-${mm}-${yyyy}`);

      // ensure directory exists
      try {
        if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
      } catch (mkdirErr) {
        console.warn('Failed to create folder, falling back to browser save:', mkdirErr);
        pdf.save(fileName);
        return;
      }

      const outPath = path.join(folder, fileName);

      // output as arraybuffer and write as buffer
      const arrayBuf = pdf.output('arraybuffer');
      try {
        // Prefer Buffer from node's buffer module when available
        const BufferCtor = r('buffer').Buffer;
        const buffer = BufferCtor.from(arrayBuf);
        fs.writeFileSync(outPath, buffer);
      } catch (e) {
        // Fallback: write the binary string directly
        const bstr = pdf.output('binarystring');
        try {
          fs.writeFileSync(outPath, bstr, 'binary');
        } catch (e2) {
          // if even that fails, fallback to browser save
          console.warn('Failed to write PDF with binary encoding, falling back to browser save', e2);
          pdf.save(fileName);
          return;
        }
      }
      console.log('Saved PDF to', outPath);
    } catch (err) {
      console.warn('Could not save PDF to Desktop, falling back to browser save:', err);
      try { pdf.save(fileName); } catch (e) { /* ignore */ }
    }
  }
}
