import { Component, OnInit } from '@angular/core';
import { MegaMenuItem } from "primeng/api";
import { ApiService } from './service/api.service';
import { ConnectionService } from './service/connection.service';
import { Router } from '@angular/router';
import { LoggingService } from './logging/logging.service';
import { IpService } from "./service/ip.service";
import { EventStatusService } from "./service/eventStatus.service";
import { PrintService } from './service/print.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
})
export class AppComponent implements OnInit {
  connStatus: boolean = false; // Initial connection status
  openLogin: boolean = false;
  suiteConn: boolean = false; // Initially disabled until connection is established
  isLoading: boolean = false; // Loading state for the button
  testStarted: boolean = false; // Flag to indicate if the test has started
  trimerEvent: boolean = false; // Flag to indicate if the timer event is active

  items: MegaMenuItem[] = [
    {
      label: 'Configuration',
      root: true,
      routerLink: '/home',

    },
    {
      label: 'Results',
      root: true,
      routerLink: '/event',
    },
    {
      label: 'Logger',
      root: true,
      routerLink: '/logging',
    }
  ];
  ifError: boolean;
  errorMessage: string;
  ipv4: string;
  ipv6: string[];
  //printing: boolean = false;

  constructor(private apiService: ApiService, private connectionService: ConnectionService, private router: Router, private loggingService: LoggingService, private ipService: IpService, private eventStatusService: EventStatusService, private printService: PrintService) {
  }

  ngOnInit() {
    // Repeat every 30 seconds
    this.getAppHealth();
    // Execute on load
    this.connStatus = this.connectionService.getStatus();
    setInterval(() => {
      this.getAppHealth();
      if (this.health) {
        this.connStatus = this.connectionService.getStatus();
        if (this.connStatus) {
          this.suiteConn = true; // Enable the button if connection is healthy
        } else {
          this.suiteConn = false; // Disable the button if connection is not healthy
        }
        this.connectionService.resetCount();
        this.serverLoading = false;
        this.maxTimeout = false;
        this.POLL_INTERVAL_MS = 30000; // 30 seconds
      } else {
        this.POLL_INTERVAL_MS = 3000; // 3 seconds
        this.connectionService.incrementCount();
        this.count = this.connectionService.getCount();
        this.serverLoading = true;
        console.log("AppComponent: Health check count:", this.count);
      }
    }, this.POLL_INTERVAL_MS); // 3000 ms = 3 seconds
  }

  counting() {
    var warn: string;
    if (!this.health && this.count > 0 && this.count <= 60) {
      warn = "Connecting to Server " + ((60 - this.connectionService.getCount()) * 3) + " seconds.";
      this.serverLoading = true;
    } else if (!this.health && this.count > 60 && this.serverLoading) {
      warn = "Warning: Server is down."
    } else {
      warn = "please wait...";
    }
    return warn;
  }

  getAppHealth() {
    this.health = this.connectionService.getHealth();
    console.log("AppComponent: Health status:", this.health);

    if (this.health) {
      this.connStatus = this.connectionService.getStatus();
      this.connectionService.resetCount();
      this.serverLoading = false;
      this.maxTimeout = false;
    }


    if (this.connectionService.getCount() > 60 && !this.health) {
      this.maxTimeout = true;
    }
  }

  // helper to expose startServer via ipc in electron main process
  startServer() {
    try {
      const electronAPI = (window as any).electronAPI || null;
      if (!electronAPI) {
        console.warn('electronAPI not available - cannot request main process to start server');
        return;
      }

      electronAPI.startServer().then((resp: any) => {
        if (resp && resp.success) {
          this.loggingService.addLog('Server started (ipc).');
          // After server starts, re-check health
          setTimeout(() => this.getAppHealth(), 3000);
        } else {
          console.error('Failed to start server via IPC', resp && resp.error);
          this.ifError = true;
          this.errorMessage = 'Failed to start server: ' + (resp && resp.error ? resp.error : 'unknown');
        }
      }).catch((err: any) => {
        console.error('Error invoking start-server IPC', err);
        this.ifError = true;
        this.errorMessage = 'Failed to start server: ' + (err && err.message ? err.message : String(err));
      });
    } catch (e) {
      console.error('Exception while invoking start server', e);
      this.ifError = true;
      this.errorMessage = 'Failed to start server: ' + (e && e.message ? e.message : String(e));
    }
  }

  openLoginDialog(dialog: boolean) {
    this.openLogin = dialog;
    this.ipService.getIPs();
    console.log("AppComponent: Initial API request to get IP List");
  }

  logingResponse(event: { ip: string }) {
    console.log('Login successful with IP:', event.ip);
    this.loggingService.addLog(`Login successful with IP: ${event.ip}`);
    this.connStatus = true; // Update connection status to true
    this.openLogin = false;
    this.suiteConn = true; // Enable the button after a successful login
    // You can add additional logic here if needed after a successful login
  }

  startEvent() {
    this.isLoading = true; // Set loading state to true when starting the event

    this.apiService.eventHandler(true).subscribe({
      next: (data: string) => {
        console.log('Event started successfully:', data);
        // You can add additional logic here if needed after starting the event
        if (data === 'true') {
          this.eventStatusService.setEventStatus(true)
          this.loggingService.addLog('Test Event started successfully');
          this.connStatus = true; // Update connection status to true
          this.suiteConn = true; // Enable the button after starting the event
          this.testStarted = true; // Set testStarted to true after starting the event
          this.isLoading = false; // Set the loading state to false after the event is started
          this.router.navigate(['/event']); // Navigate to the event page
          this.trimerEvent = true; // Set the timer event flag to true
        }
      },
      error: (error) => {
        console.error('Error starting event:', error);
        this.ifError = true;
        this.errorMessage = 'Failed to start the event. Please try again later.';
      }
    });
  }

  restart() {
    this.serverLoading = true;

    if (this.health) {
      // this.apiService.restartServer().subscribe({
      //   next: (data: any) => {
      //     console.log('Server restarted successfully:', data);
      //     if(data.message === 'Shutting down, bye...') {
      //       this.connectionService.resetCount();
      //       this.startServer();
      //       this.maxTimeout = false;
      //     }
      //   },
      //   error: (error) => {
      //     console.error('Error restarting server:', error);
      //     this.ifError = true;
      //     this.errorMessage = 'Failed to restart the server. Please try again later.';
      //   }
      // });
      this.startServer();
    }
    this.getAppHealth();
  }

  // Add this method to fix the missing stopEvent error
  stopEvent(): void {
    this.printService.generateReportWithPopup();
    // TODO: Implement stop logic here
    this.apiService.eventHandler(false).subscribe({
      next: (data: any) => {
        console.log('Event stopped successfully:', data);
        this.eventStatusService.setEventStatus(false);
        this.testStarted = false; // Reset testStarted to false after stopping the event
        this.trimerEvent = false; // Reset the timer event flag to false
        this.loggingService.addLog('Test Event stopped successfully');
      },
      error: (error) => {
        console.error('Error stopping event:', error);
        this.ifError = true;
        this.errorMessage = 'Failed to stop the event. Please try again later.';
      }
    })
    this.apiService.resetConnetion();
  }

  public print() {
    this.printService.generateReportWithPopup();
  }
}
