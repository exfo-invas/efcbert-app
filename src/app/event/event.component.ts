import {Component, OnInit} from '@angular/core';
import {ApiService} from "../service/api.service";

interface ServiceDisruption {
  type: string;
  speed: string;
  frameSize: string;
  lineDataRate: string;
  txUtilization: string;
  throughput: string;
}

interface TrafficDisruption {
  type: string;
  fcRate: string;
  protocol: string;
  encoding: string;
  actualThroughput: string;
  actualTransferSpeed: string;
  lineSpeed: string;
  currentUtilization: string;
  measuredThroughput: string;
  transferSpeed: string;
  measuredLineSpeed: string;
}

interface ThroughPut {
  type: string;
  fcRate: string;
  frameSize: string;
  fullLineRate: string;
  measureRate: string;
  framesLossRate: string;
}

interface FrameLoss {
  type: string;
  frameRate: string;
  totalTransmittedBytes: string;
  framesTransmitted: string;
}

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss',
  standalone: false
})
export class EventComponent implements OnInit {

  throughPuts: ThroughPut[] = [
    {
      type: 'Tx',
      fcRate: '-',
      frameSize: '-',
      fullLineRate: '-',
      measureRate: '-',
      framesLossRate: '-'
    },
    {
      type: 'Rx',
      fcRate: '-',
      frameSize: '-',
      fullLineRate: '-',
      measureRate: '-',
      framesLossRate: '-'
    }];

  frameLosses: FrameLoss[] = [
    {
      type: 'Tx',
      frameRate: '-',
      totalTransmittedBytes: '-',
      framesTransmitted: '-'
    },
    {
      type: 'Rx',
      frameRate: '-',
      totalTransmittedBytes: '-',
      framesTransmitted: '-'
    }];

  serviceDisruptions: ServiceDisruption[] = [
    {
      type: 'Tx',
      speed: '-',
      frameSize: '-',
      lineDataRate: '-',
      txUtilization: '-',
      throughput: '-'
    },
    {
      type: 'Rx',
      speed: '-',
      frameSize: '-',
      lineDataRate: '-',
      txUtilization: '-',
      throughput: '-',
    },
  ];

  trafficDisruptions: TrafficDisruption[] = [
    {
      type: 'Tx',
      fcRate: '-',
      protocol: '-',
      encoding: '-',
      actualThroughput: '-',
      actualTransferSpeed: '-',
      lineSpeed: '-',
      currentUtilization: '-',
      measuredThroughput: '-',
      transferSpeed: '-',
      measuredLineSpeed: '-'
    },
    {
      type: 'Rx',
      fcRate: '-',
      protocol: '-',
      encoding: '-',
      actualThroughput: '-',
      actualTransferSpeed: '-',
      lineSpeed: '-',
      currentUtilization: '-',
      measuredThroughput: '-',
      transferSpeed: '-',
      measuredLineSpeed: '-'
    }
  ];

  constructor(private apiService: ApiService) {
  }

  //Every Second, fetch the latest data for throughput, frame loss, service disruption, and traffic disruption
  ngOnInit(): void {
    setInterval(() => {
      this.getThroughput();
      this.getFrameLoss();
      this.getServiceDisruptionCommand();
      this.getTrafficDisruption();
    }, 1000);
  }

  getServiceDisruptionCommand(): void {
    this.apiService.getServiceDisruption().subscribe({
      next: (response: ServiceDisruption[]) => {
        console.log(`Service disruption command sent successfully for :`, response);
        if (response && response.length > 0) {
          response.forEach((service) => {
            const index = service.type === 'Tx' ? 0 : 1;
            if (this.serviceDisruptions[index]) {
              Object.assign(this.serviceDisruptions[index], service);
            }
          });
        }
      },
      error: (error) => {
        console.error(`Error sending service disruption command for:`, error);
      }
    });
  }

  getTrafficDisruption(): void {
    this.apiService.getTrafficDisruption().subscribe({
      next: (response: TrafficDisruption[]) => {
        console.log(`Traffic disruption data for :`, response);
        if (response && response.length > 0) {
          response.forEach((disruption) => {
            const index = disruption.type === 'Tx' ? 0 : 1;
            if (this.trafficDisruptions[index]) {
              Object.assign(this.trafficDisruptions[index], disruption);
            }
          });
        }
      },
      error: (error) => {
        console.error(`Error fetching traffic disruption data for:`, error);
      }
    });
  }

  getThroughput(): void {
    this.apiService.getThroughput().subscribe({
      next: (response:ThroughPut[] ) => {
        console.log(`Throughput data for :`, response);
        if (response && response.length > 0) {
          response.forEach((throughput) => {
            const index = throughput.type === 'Tx' ? 0 : 1;
            if (this.throughPuts[index]) {
              Object.assign(this.throughPuts[index], throughput);
            }
          });
        }
      },
      error: (error) => {
        console.error(`Error fetching throughput data for:`, error);
      }
    });
  }

  getFrameLoss(): void {
    this.apiService.getFrameLoss().subscribe({
      next: (response: FrameLoss[]) => {
        console.log(`Frame loss data for :`, response);
        if (response && response.length > 0) {
          response.forEach((frameLoss) => {
            const index = frameLoss.type === 'Tx' ? 0 : 1;
            if (this.frameLosses[index]) {
              Object.assign(this.frameLosses[index], frameLoss);
            }
          });
        }
      },
      error: (error) => {
        console.error(`Error fetching frame loss data for:`, error);
      }
    });
  }
}
