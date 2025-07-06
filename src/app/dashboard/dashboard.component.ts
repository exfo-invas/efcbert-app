import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false,
})
export class DashboardComponent implements OnInit {
  isNew: boolean = true;
  command: string;

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

  constructor() {
  }

  ngOnInit() {
  }

  //TODO: Add api service to get Test Config deatils
}
