import {Component, OnInit} from '@angular/core';
import {ApiService} from '../service/api.service';
import {LoggingService} from '../logging/logging.service';
import {ConnectionService} from "../service/connection.service";


interface PyhsicalStatus {
  laserStatus: string;
  fcRate: string;
  sfpPort: string;
  txPower: string;
  rxPower: string;
}

interface ToolStatus {
  coupled: string;
  txPattern: string;
  rxPattern: string;
  fcFrameSize: string;
  trafficShaping: string;
}

interface PortStatus {
  flowControl: string;
  bufferCredit: string;
  loging: string;
}

interface FullStatusData {
  physicalStatus: PyhsicalStatus;
  portStatus: PortStatus;
  toolStatus: ToolStatus;
  pspLinkStatus?: string;
}



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false,
})

export class DashboardComponent implements OnInit {
  isNew: boolean = true;
  command: string;

  pspLink: string = "";

  physicalColumns = [
    {field: 'fcRate', header: 'FC Rate'},
    {field: 'sfpPort', header: 'SFP & Port'},
    {field: 'txPower', header: 'TX Power'},
    {field: 'rxPower', header: 'RX Power'}
  ];

  physicalData : PyhsicalStatus = {
    laserStatus: '',
    fcRate: '',
    sfpPort: '',
    txPower: '',
    rxPower: ''
  };

  wwnColumns = [
    {field: 'flowControl', header: 'Buffer Flow Control'},
    {field: 'bufferCredit', header: 'Available BB Credit'},
    {field: 'loging', header: 'logging'}
  ];

  wwnData: PortStatus = {
    flowControl: '',
    bufferCredit: '',
    loging: ''
  };

  deviceConfigColumns = [
    {field: 'coupled', header: 'Coupled'},
    {field: 'txPattern', header: 'TX Pattern'},
    {field: 'rxPattern', header: 'RX Pattern'},
    {field: 'fcFrameSize', header: 'FC Frame Size'},
    {field: 'trafficShaping', header: 'Traffic Shaping'}
  ];

  deviceConfigData: ToolStatus = {
    coupled: '',
    txPattern: '',
    rxPattern: '',
    fcFrameSize: '',
    trafficShaping: ''
  };

  constructor(private apiService: ApiService, private loggingService: LoggingService, private connectionService: ConnectionService) {

  }

  ngOnInit() {
    if (this.connectionService.getStatus())
      console.log('Dashboard: Connection is established');
    this.getFullStatusData();
  }


  // this.getFullStatusData();
  // console.log('ngOnInit: ',this.physicalData)

  getFullStatusData() {
    this.apiService.getStatus().subscribe((data: FullStatusData) => {
      console.log('Full status data:', data);
      console.log('pspLink: ', data.pspLinkStatus);
      if (data.pspLinkStatus === 'Connection is not established' || data.pspLinkStatus === 'Undefined') {
        this.isNew = true;
      } else {
        this.isNew = false;
        console.log('fullStatusData :',data.physicalStatus);
        this.physicalData = data.physicalStatus;
        this.wwnData = data.portStatus;
        this.deviceConfigData = data.toolStatus;
        this.pspLink = data.pspLinkStatus || '';
        this.loggingService.addLog('Full status data fetched successfully');
      }
    }, error => {
      console.error('Error fetching full status data:', error);
      this.isNew = true;
    });
  }
}
