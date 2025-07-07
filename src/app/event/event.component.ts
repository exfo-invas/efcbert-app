import { Component, OnInit } from '@angular/core';
import { ApiService } from "../service/api.service";
import { EventDetails, EventDisruptions, EventThroughput, FrameLossResponse, ServiceDisruptions, ThroughputResponse, TrafficResponse } from '../event/event.component.model';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss',
  standalone: false
})
export class EventComponent implements OnInit {

  throughPuts: ThroughputResponse[] = [
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

  frameLosses: FrameLossResponse[] = [
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

  serviceDisruptions: ServiceDisruptions[] = [
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

  trafficDisruptions: TrafficResponse[] = [
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
    this.EventDetails();
    setInterval(() => {
      this.EventDetails();
    }, 1000);
  }

  EventDetails(): void {
    this.apiService.getEventDetails().subscribe({
      next: (response: EventDetails) => {
        console.log(`Event disruptions data for :`, response);
      },
      error: (error) => {
        console.error(`Error fetching event disruptions data for:`, error);
      }
    });
  }


  EventDisruptions(disruption: EventDisruptions): void {
    this.getServiceDisruptionCommand(disruption.service);
    this.getTrafficDisruption(disruption.traffic);
  }

  EventThroughput(eventThroughput: EventThroughput): void {
    this.getThroughput(eventThroughput.throughput);
    this.getFrameLoss(eventThroughput.frameLoss);
  }

  getServiceDisruptionCommand(response: ServiceDisruptions[]): void {
    if (response && response.length > 0) {
      response.forEach((disruption) => {
        const index = disruption.type === 'Tx' ? 0 : 1;
        if (this.serviceDisruptions[index]) {
          Object.assign(this.serviceDisruptions[index], disruption);
        }
      });
    }
  }

  getTrafficDisruption(response: TrafficResponse[]): void {
    if (response && response.length > 0) {
      response.forEach((disruption) => {
        const index = disruption.type === 'Tx' ? 0 : 1;
        if (this.trafficDisruptions[index]) {
          Object.assign(this.trafficDisruptions[index], disruption);
        }
      });
    }
  }

  getThroughput(response: ThroughputResponse[]): void {
    if (response && response.length > 0) {
      response.forEach((throughput) => {
        const index = throughput.type === 'Tx' ? 0 : 1;
        if (this.throughPuts[index]) {
          Object.assign(this.throughPuts[index], throughput);
        }
      });
    }
  }

  getFrameLoss(response: FrameLossResponse[]): void {
    if (response && response.length > 0) {
      response.forEach((frameLoss) => {
        const index = frameLoss.type === 'Tx' ? 0 : 1;
        if (this.frameLosses[index]) {
          Object.assign(this.frameLosses[index], frameLoss);
        }
      });
    }
  }
}
