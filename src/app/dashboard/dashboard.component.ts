import { ChangeDetectorRef, Component, OnInit, NgZone } from '@angular/core';
import { ApiService } from '../service/api.service';
import { LoggingService } from '../logging/logging.service';
import { EventStatusService } from '../service/eventStatus.service';

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

  constructor(private apiService: ApiService, private loggingService: LoggingService, private eventStatusService: EventStatusService, private cdr: ChangeDetectorRef, private zone: NgZone) {
    this.saveData(this.eventStatusService.getFullStatusData());
  }

  showPreview = false;

  ngOnInit() {
    this.eventStatusService.connectionStatus.subscribe((status: boolean) => {
      // Ensure any UI updates happen inside Angular zone so Electron/IPC events trigger change detection
      this.zone.run(() => {
        if (status) {
          // If we already have full status data, use it; otherwise fetch from API
          const data = this.eventStatusService.getFullStatusData();
          if (data) {
            this.saveData(data);
          } else {
            this.getFullStatusData();
          }
        } else {
          // mark as new / disconnected
          this.isNew = true;
        }
        this.cdr.detectChanges();
      });
    });
    this.saveData(this.eventStatusService.getFullStatusData());
    if (!this.eventStatusService.getIsPrinting()) {
      this.getFullStatusData();
    }
  }

  public openPreview(): void {
    this.showPreview = !this.showPreview;
  }

  getFullStatusData() {
    this.apiService.getStatus().subscribe((data: any) => {
      if (!(data.pspLinkStatus === "Connection is not established")) {
        // this.physicalData = data.physicalStatus;
        // this.wwnData = data.portStatus;
        // this.deviceConfigData = data.toolStatus;
        // this.pspLink = data.pspLinkStatus || '';
        this.eventStatusService.setFullStatusData(data);
        this.saveData(data);
        this.loggingService.addLog('Full status data fetched successfully');
      } else {
        this.isNew = true;
      }
    }, error => {
      console.error('Error fetching full status data:', error);
      this.isNew = true;
    });
  }

  saveData(data: any) {
    if (data) {
      this.zone.run(() => {
        this.isNew = false;
        this.physicalData = data.physicalStatus;
        this.wwnData = data.portStatus;
        this.deviceConfigData = data.toolStatus;
        this.pspLink = data.pspLinkStatus || '';
      });
    } else {
      this.isNew = true;
    }
  }
}
