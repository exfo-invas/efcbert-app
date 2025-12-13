import {Injectable} from "@angular/core";
import {ApiService} from "./api.service";

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  constructor(private apiService: ApiService) {
  }

  ipaddress: string;
  port: string;
  status: boolean;
  serverHealth: boolean;
  count: number = 0;

  setConnection(ipaddress: string, status: boolean) {
    this.ipaddress = ipaddress;
    this.status = status;
  }

  getAddress() {
    return this.ipaddress + ':' + this.port;
  }

  getStatus() {
    this.getLatestStatus()
    return this.status;
  }

  clearConnection() {
    this.ipaddress = '';
    this.port = '';
  }

  setHealth(health: boolean) {
    this.serverHealth = health;
  }

  getHealth() {
    this.getAppHealth();
    return this.serverHealth;
  }

  incrementCount() {
    this.count++;
  }

  getCount() {
    return this.count;
  }

  resetCount() {
    this.count = 0;
  }

  private getLatestStatus() {
    this.apiService.status().subscribe((data: string) => {
        console.log("connection.service:getAppHealth: Connection service getLatestStatus() to fetch status", data);
        if (data === 'true') {
          this.status = true;

        } else {
          this.status = false;
          console.log('connection.service:getAppHealth: error closing connection');
        }
      },
      (error) => {
        this.status = false;
        console.log('connection.service:getAppHealth: error closing connection');
        console.log('Error message:', error.message, 'Status:', error.status);
      });
  }

  getAppHealth() {
    this.apiService.healthCheck().subscribe({
      next: (data: any) => {
        console.log('connection.service:getAppHealth: Health check data:', data);
        this.setHealth(data.status === 'UP');
      },
      error: (error) => {
        console.error('connection.service:getAppHealth: Error during health check:', error);
        this.setHealth(false);
      }
    });
  }
}
