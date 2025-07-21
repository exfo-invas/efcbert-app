import { Component, OnInit } from '@angular/core';
import { MegaMenuItem } from "primeng/api";
import { ApiService } from './service/api.service';
import { ConnectionService } from './service/connection.service';
import { Router } from '@angular/router';
import { LoggingService } from './logging/logging.service';

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
      label: 'Execution',
      root: true,
      routerLink: '/event',
    },
    {
      label: 'Logging',
      root: true,
      routerLink: '/logging',
    }
  ];
  ifError: boolean;
  errorMessage: string;
  ipv4: string;
  ipv6: string[];

  constructor(private apiService: ApiService, private connectionService: ConnectionService, private router: Router, private loggingService: LoggingService) {
    this.getIPs();
  }

  ngOnInit() {
    // Execute on load
    this.connStatus = this.connectionService.getStatus();
    // Repeat every 5 minutes
    setInterval(() => {
      this.connStatus = this.connectionService.getStatus();
    }, 300000); // 300000 ms = 5 minutes
  }

  openLoginDialog(dialog: boolean) {
    this.openLogin = dialog;
  }

  getIPs() {
    this.apiService.getIPs().subscribe({
      next: (data: any) => {
        console.log('Fetched IPs:', data);
        // Assuming you want to store ipv4 and ipv6 in component properties
        // Add these properties to your class if not already present:
        // ipv4: string;
        // ipv6: string[];
        this.ipv4 = data.ipv4;
        this.ipv6 = data.ipv6;
        sessionStorage.setItem('ipv4', this.ipv4);
        sessionStorage.setItem('ipv6', JSON.stringify(this.ipv6));
      },
      error: (error) => {
        console.error('Error fetching IPs:', error);
        this.ifError = true;
        this.errorMessage = 'Failed to load IP addresses. Please try again later.';
      }
    });
  }

  logingResponse(event: { ip: string, port: string }) {
    console.log('Login successful with IP:', event.ip, 'and Port:', event.port);
    this.loggingService.addLog(`Login successful with IP: ${event.ip} and Port: ${event.port}`);
    this.connStatus = true; // Update connection status to true
    this.openLogin = false;
    this.suiteConn = true; // Enable the button after a successful login
    // You can add additional logic here if needed after a successful login
  }

  startEvent() {
    this.isLoading = true; // Set loading state to true when starting the event
    this.apiService.eventHandler(true).subscribe({
      next: (data: any) => {
        console.log('Event started successfully:', data);
        // You can add additional logic here if needed after starting the event
        if (data === 'Connection established') {
          sessionStorage.setItem('eventStarted', 'true'); // Store event started status
          this.loggingService.addLog('Test Event started successfully');
          this.connStatus = true; // Update connection status to true
          this.suiteConn = true; // Enable the button after starting the event
          this.testStarted = true; // Set testStarted to true after starting the event
          this.isLoading = false; // Set loading state to false after the event is started
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
        sessionStorage.removeItem('eventStarted'); // Remove event started status
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
  }
}
