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
    // Execute on load
    this.connStatus = this.connectionService.getStatus();
    // Repeat every 5 minutes
    setInterval(() => {
      this.connStatus = this.connectionService.getStatus();
    }, 300000); // 300000 ms = 5 minutes
    //     if (!this.printing) {}
  }

    //   exportPdf() {
    //     // Prefer route-based export so components that aren't currently rendered get captured.
    //     this.printing = true;
    //     console.log('Exporting components to PDF via routes');
    //     const routes = ['/home', '/event', '/logging'];
    //     this.printService.exportRoutesToPdf(routes);
    //     this.printing = false;
    //   }

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

  // Add this method to fix the missing stopEvent error
  stopEvent(): void {
    // TODO: Implement stop logic here
    this.apiService.eventHandler(false).subscribe({
      next: (data: any) => {
        console.log('Event stopped successfully:', data);
        this.eventStatusService.setEventStatus(false);
        this.testStarted = false; // Reset testStarted to false after stopping the event
        this.trimerEvent = false; // Reset the timer event flag to false
        this.loggingService.addLog('Test Event stopped successfully');
        //TODO: this.exportPdf();
      },
      error: (error) => {
        console.error('Error stopping event:', error);
        this.ifError = true;
        this.errorMessage = 'Failed to stop the event. Please try again later.';
      }
    })
  }
}
