import {Component, OnInit} from '@angular/core';
import { ApiService } from '../service/api.service';
import { LoggingService } from '../logging/logging.service';

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
    { field: 'fcRate', header: 'FC Rate' },
    { field: 'sfpPort', header: 'SFP & Port' },
    { field: 'txPower', header: 'TX Power' },
    { field: 'rxPower', header: 'RX Power' }
  ];

  physicalData = {
    laserStatus: '',
    fcRate: '',
    sfpPort: '',
    txPower: '',
    rxPower: ''
  };

  wwnColumns = [
    { field: 'flowControl', header: 'Buffer Flow Control' },
    { field: 'bufferCredit', header: 'Available BB Credit' },
    { field: 'loging', header: 'logging' }
  ];

  wwnData = {
    flowControl: '',
    bufferCredit: '',
    loging: ''
  };

  deviceConfigColumns = [
    { field: 'coupled', header: 'Coupled' },
    { field: 'txPattern', header: 'TX Pattern' },
    { field: 'rxPattern', header: 'RX Pattern' },
    { field: 'fcFrameSize', header: 'FC Frame Size' },
    { field: 'trafficShaping', header: 'Traffic Shaping' }
  ];

  deviceConfigData = {
    coupled: '',
    txPattern: '',
    rxPattern: '',
    fcFrameSize: '',
    trafficShaping: ''
  };

  constructor(private apiService: ApiService, private loggingService: LoggingService) {
    this.getFullStatusData();
  }

  ngOnInit() {
    this.getFullStatusData();
  }

  getFullStatusData() {
    this.apiService.getStatus().subscribe((data: any) => {
      if (data) {
        this.isNew = false;
        this.physicalData = data.physicalStatus;
        this.wwnData = data.portStatus;
        this.deviceConfigData = data.toolStatus;
        this.pspLink = data.pspLinkStatus || '';
        this.loggingService.addLog('Full status data fetched successfully');
      } else {
        this.isNew = true;
      }
    }, error => {
      console.error('Error fetching full status data:', error);
      this.isNew = true;
    });
  }
}
