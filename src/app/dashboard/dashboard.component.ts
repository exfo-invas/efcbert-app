import {Component, OnInit} from '@angular/core';
import {ApiService} from "../service/api.service";
import {ConnectionTCP} from "../service/api.service.model";
import {DashboardModel} from "./dashboard.model";

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
    fcRateSet: 123,
    sfpPort: '0',
    linkStatus: 'Disconnected'
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
    source: '0x1234567890abcdef',
    destination: '0xabcdef1234567890',
    bufferFlow: 'Enabled',
    bbCredit: 255,
    logging: 'Enabled',
    topology: 'Full Mesh',
    fbStatus: 'Active',
    portStatus: 'Online'
  };

  deviceConfigColumns = [
    { field: 'pattern', header: 'Device Name' },
    { field: 'txPattern', header: 'Device Type' },
    { field: 'rxPattern', header: 'Firmware Version' },
    { field: 'fcFrameSize', header: 'Serial Number' },
    { field: 'trafficShaping', header: 'trafficShaping' }
  ];

  deviceConfigData = {
    pattern: 'EFCBERT-1234',
    txPattern: 'Type A',
    rxPattern: 'Type B',
    fcFrameSize: 2048,
    trafficShaping: 'Enabled'
  };
  isDeviceConnected: boolean = true;



  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    if (this.ipAddress === '' && this.portNum === '') {
      this.isNew = false;
    }

    this.dashboardData = [
      {
        des: "Interface/Rate",
        values: '? (1X/2x/3x/4x/8x/16x/32x/64x)'
      }
    ]
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
    this.ipAddress = '';
    this.portNum = '';
    this.isNew = false;
    this.connStatus = false;
    this.command = '';
    this.commandResponse = '';
  }
}
