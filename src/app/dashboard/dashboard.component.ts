import {Component, OnInit} from '@angular/core';
import {ApiService} from "../service/api.service";
import {ConnectionTCP} from "../service/api.service.model";
import {DashboardModel} from "./dashboard.model";
import {ConnectionService} from "../service/connection.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false,
})
export class DashboardComponent implements OnInit {
  title = 'efcbert-app';
  ipAddress: string = '';
  portNum: string = '';
  reponseData: ConnectionTCP = new ConnectionTCP();
  connStatus: boolean;
  isNew: boolean = false;
  command: string;
  commandResponse: string = "";
  dashboardData: DashboardModel[];

  portB1Columns = [
    { field: 'fcRateSet', header: 'FC Rate Set' },
    { field: 'sfpPort', header: 'SFP & Port' },
    { field: 'linkStatus', header: 'Throughput rate' }
  ];

  portB1Data = {
    fcRateSet: '',
    sfpPort: '',
    linkStatus: false
  };

  wwnColumns = [
    { field: 'source', header: 'Source' },
    { field: 'destination', header: 'Destination' },
    { field: 'bufferFlow', header: 'Buffer Flow Control' },
    { field: 'bbCredit', header: 'Available BB Credit' },
    { field: 'logging', header: 'logging' },
    { field: 'topology', header: 'Discovered Topology' },
    { field: 'fbStatus', header: 'Fabric Status' },
    { field: 'portStatus', header: 'Port Status' }
  ];

  wwnData = {
    source: '',
    destination: '',
    bufferFlow: '',
    bbCredit: '',
    logging: '',
    topology: '',
    fbStatus: '',
    portStatus: ''
  };

  deviceConfigColumns = [
    { field: 'pattern', header: 'Device Name' },
    { field: 'txPattern', header: 'Device Type' },
    { field: 'rxPattern', header: 'Firmware Version' },
    { field: 'fcFrameSize', header: 'Serial Number' },
    { field: 'trafficShaping', header: 'trafficShaping' }
  ];

  deviceConfigData = {
    pattern: '',
    txPattern: '',
    rxPattern: '',
    fcFrameSize: '',
    trafficShaping: ''
  };

  constructor(private apiService: ApiService, private connectionService :ConnectionService) {
    this.default();
  }

  ngOnInit() {
    this.isNew = !this.connectionService.getStatus();
  }

  getConnection() {
    this.apiService.get(this.ipAddress, this.portNum).subscribe((data: ConnectionTCP) => {
      console.log(data);
      this.isNew = true;
      this.connStatus = data.status;
      this.reponseData = data;
    });
  }

  executeCommand() {
    this.apiService.executeCommand(this.command).subscribe((data: string) => {
      console.log(data);
      this.commandResponse = data;
    });
  }

  closeConnect() {
    this.apiService.close().subscribe((data: string) => {
      console.log(data);
      if (data === 'true') {
        this.default();
      } else {
        console.log('error closing connection');
      }
      return data;
    });
  }

  default() {
    this.isNew = false;
    this.connStatus = false;
  }
}
