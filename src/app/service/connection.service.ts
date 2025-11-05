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

  private getLatestStatus() {
    this.apiService.status().subscribe((data: string) => {
        console.log(data);
        if (data === 'true') {
          this.status = true;

        } else {
          this.status = false;
          console.log('error closing connection');
        }
      },
      (error) => {
        this.status = false;
        console.log('error closing connection');
        console.log('Error message:', error.message, 'Status:', error.status);
      });
  }
}
