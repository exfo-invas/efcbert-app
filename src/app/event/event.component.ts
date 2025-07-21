import { Component, OnInit } from '@angular/core';
import { ApiService } from "../service/api.service";
import { EventDisruptions, FrameLossResponse, TrafficResponse } from './event.component.model';
import { LoggingService } from '../logging/logging.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss',
  standalone: false
})
export class EventComponent implements OnInit {

  trafficDisruptions: TrafficResponse[] = [
    {
      type: 'Tx',
      fcRate: '-',
      actualThroughput: 0,
      actualTransferSpeed: 0,
      lineSpeed: 0,
      currentUtilization: 0,
      measuredThroughput: 0,
      transferSpeed: 0,
      measuredLineSpeed: 0
    },
    {
      type: 'Rx',
      fcRate: '-',
      actualThroughput: 0,
      actualTransferSpeed: 0,
      lineSpeed: 0,
      currentUtilization: 0,
      measuredThroughput: 0,
      transferSpeed: 0,
      measuredLineSpeed: 0
    }
  ];

  frameLosses: FrameLossResponse[] = [
    {
      fcRate: '1x',
      txCount: 0,
      rxCount: 0,
      lostFrames: 0,
      frameLossRate: 0
    }
  ]

  constructor(private apiService: ApiService, private loggingService: LoggingService) {
  }

  //Every Second, fetch the latest data for throughput, frame loss, service disruption, and traffic disruption
  ngOnInit(): void {
    this.getEventDetails();
    setInterval(() => {
      if (sessionStorage.getItem('eventStarted') === 'true') {
        console.log('Fetching event details...');
        this.getEventDetails();
      }
      console.log('Event details skipped as event is not started.');
    }, 10000); // 10000 ms = 10 seconds
  }

  getEventDetails(): void {
    this.apiService.getEventDetails().subscribe({
      next: (response: EventDisruptions) => {
        console.log(`Event disruptions data for :`, response);
        this.getEventDisruptions(response);
        this.loggingService.addLog(`Event disruptions data fetched successfully`);
      },
      error: (error) => {
        console.error(`Error fetching event disruptions data for:`, error);
      }
    });
  }

  getEventDisruptions(disruption: EventDisruptions): void {
    this.getFrameLoss(disruption.frameLoss);
    this.getTrafficDisruption(disruption.traffic);
  }

  getTrafficDisruption(response: TrafficResponse[]): void {
    if (response && response.length > 0) {
      response.forEach((disruption) => {
        const index = disruption.type.toLowerCase() === 'tx' ? 0 : 1;
        if (this.trafficDisruptions[index]) {
          Object.assign(this.trafficDisruptions[index], disruption);
        }
      });
    }
  }

  getFrameLoss(response: FrameLossResponse[]): void {
    Object.assign(this.frameLosses[0], response);
  }
}

// throughPuts: ThroughputResponse[] = [
//   {
//     type: 'Tx',
//     fcRate: '-',
//     frameSize: '-',
//     fullLineRate: '-',
//     measureRate: '-',
//     framesLossRate: '-'
//   },
//   {
//     type: 'Rx',
//     fcRate: '-',
//     frameSize: '-',
//     fullLineRate: '-',
//     measureRate: '-',
//     framesLossRate: '-'
//   }];

// serviceDisruptions: ServiceDisruptions[] = [
//   {
//     type: 'Tx',
//     speed: '-',
//     frameSize: '-',
//     lineDataRate: '-',
//     txUtilization: '-',
//     throughput: '-'
//   },
//   {
//     type: 'Rx',
//     speed: '-',
//     frameSize: '-',
//     lineDataRate: '-',
//     txUtilization: '-',
//     throughput: '-',
//   },
// ];


// EventThroughput(eventThroughput: EventThroughput): void {
//   this.getThroughput(eventThroughput.throughput);
//   this.getServiceDisruptionCommand(eventThroughput.service);
// }

// getServiceDisruptionCommand(response: ServiceDisruptions[]): void {
//   if (response && response.length > 0) {
//     response.forEach((disruption) => {
//       const index = disruption.type === 'Tx' ? 0 : 1;
//       if (this.serviceDisruptions[index]) {
//         Object.assign(this.serviceDisruptions[index], disruption);
//       }
//     });
//   }
// }

// getThroughput(response: ThroughputResponse[]): void {
//   if (response && response.length > 0) {
//     response.forEach((throughput) => {
//       const index = throughput.type === 'Tx' ? 0 : 1;
//       if (this.throughPuts[index]) {
//         Object.assign(this.throughPuts[index], throughput);
//       }
//     });
//   }
// }
