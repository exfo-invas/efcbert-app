import { Component, OnInit } from '@angular/core';
import { EventDisruptions, FrameLossResponse, HourlyEvent, LatencyEvent, StandardEvent, TrafficResponse } from './event.component.model';
import {EventStatusService} from "../service/eventStatus.service";

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss',
  standalone: false
})
export class EventComponent implements OnInit {

  latencyEvent: LatencyEvent = {
    last: '-',
    min: '-',
    max: '-'
  }
  
  standardEvent: StandardEvent = {
    fcRate: '-',
    frameSize: '-' 
  }

  trafficDisruptions: TrafficResponse[] = [
    {
      type: 'Tx',
      currentUtilization: 0,
      measuredThroughput: 0,
      transferSpeed: 0,
      measuredLineSpeed: 0
    },
    {
      type: 'Rx',
      currentUtilization: 0,
      measuredThroughput: 0,
      transferSpeed: 0,
      measuredLineSpeed: 0
    }
  ];

  frameLosses: FrameLossResponse[] = [
    {
      type: 'Tx',
      byteCount: 0,
      frameRate: 0,
      frameCount: 0,
      frameLossRate: 0
    },
    {
      type: 'Rx',
      byteCount: 0,
      frameRate: 0,
      frameCount: 0,
      frameLossRate: 0
    }
  ]
  
  hourlyEvents: HourlyEvent[] = [
    { no: 1, utilization: '-', throughput: '-', latency: '-', framesLoss: '-' }
  ];

  constructor(private eventStatus: EventStatusService) {
  }

  //Every Second, fetch the latest data for throughput, frame loss, service disruption, and traffic disruption
  ngOnInit(): void {
    this.eventStatus.getEventDetails();
    this.eventStatus.getHourlyEventDetails();
    this.assignHourlyEvent();

    if (this.eventStatus.getEventStatus()) {
      setInterval(async () => {
        console.log('Fetching event details...');
        const eventDisruptions = await this.eventStatus.getEventDetails();
        this.getEventDisruptions(eventDisruptions);
        console.log('Event details skipped as event is not started.');
      }, 10000); // 10000 ms = 10 seconds
    }

    if (this.eventStatus.getEventStatus()) {
      setInterval(async () => {
        console.log('Fetching hourly event details...');
        const hourlyEventDetails = await this.eventStatus.getHourlyEventDetails();
        this.assignHourlyEventData(hourlyEventDetails);
        console.log('Hourly event details skipped as event is not started.');
      }, 60000); // 60000 ms = 1 minute
    }
  }

  private getEventDisruptions(disruption: EventDisruptions): void {
    this.assignFrameLoss(disruption?.frameLoss);
    this.assignTrafficDisruption(disruption?.traffic);
    this.assignStandardResponse(disruption?.standardEvent);
  }

  private assignTrafficDisruption(response: TrafficResponse[]): void {
    if (response && response.length > 0) {
      response.forEach((disruption) => {
        const index = disruption.type && disruption.type.toLowerCase() === 'tx' ? 0 : 1;
        if (this.trafficDisruptions && this.trafficDisruptions[index]) {
          Object.assign(this.trafficDisruptions[index], disruption);
        }
      });
    }
  }

  private assignFrameLoss(response: FrameLossResponse[]): void {
    if (response && response.length > 0) {
      response.forEach((frameLoss) => {
        const index = frameLoss.type && frameLoss.type.toLowerCase() === 'tx' ? 0 : 1;
        if (this.frameLosses && this.frameLosses[index]) {
          Object.assign(this.frameLosses[index], frameLoss);
        }
      });
    }
  }

  private assignStandardResponse(response: StandardEvent): void {
    if (!this.standardEvent) {
      this.standardEvent = { fcRate: '', frameSize: '' } as StandardEvent;
    }
    if (response) {
      Object.assign(this.standardEvent, response);
    }
  }

  //if HourlyEvent data is less than 10 entries, add dummy data
  private assignHourlyEventData(response: HourlyEvent[]): void {
    Object.assign(this.hourlyEvents, response);
  }

  private assignHourlyEvent(): HourlyEvent[] {
    const currentLength = this.hourlyEvents.length;
    for (let i = currentLength + 1; i <= 20; i++) {
      this.hourlyEvents.push({ no: i, utilization: '-', throughput: '-', latency: '-', framesLoss: '-' });
    }
    return this.hourlyEvents;
  }
}