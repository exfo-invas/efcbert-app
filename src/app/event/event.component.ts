import { Component, OnInit } from '@angular/core';
import {EventDisruptions, FrameLossResponse, standardTestResponse, TrafficResponse} from './event.component.model';
import {EventStatusService} from "../service/eventStatus.service";

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
      measuredRate: 0,
      frameRate: 0,
      frameCount: 0,
      frameLossRate: 0
    },
    {
      type: 'Rx',
      byteCount: 0,
      measuredRate: 0,
      frameRate: 0,
      frameCount: 0,
      frameLossRate: 0
    }
  ]

  standardResponse: standardTestResponse = {
    fcRate: 0,
    frameSize: 0
  }

  constructor(private eventStatus: EventStatusService) {
  }

  //Every Second, fetch the latest data for throughput, frame loss, service disruption, and traffic disruption
  ngOnInit(): void {
    if (this.eventStatus.getEventStatus()) {
      setInterval(() => {
        console.log('Fetching event details...');
        this.eventStatus.getEventDetails().then((response) => {
          console.log('EventComponent: Event details:', response);
          if (response !== null && response !== undefined) {
            console.log('Event Component: Event details fetched successfully:', response);
            this.getEventDisruptions(response);
          } else {
            console.log('No event details found.');
            console.log('Event details skipped as event is not started.');
          }
        }).catch((error) => {
          console.error('Error fetching event details:', error);
        });
      }, 10000); // 10000 ms = 10 seconds
    }
  }


  private getEventDisruptions(disruption: EventDisruptions): void {
    this.getFrameLoss(disruption.frameLoss);
    this.getTrafficDisruption(disruption.traffic);
  }

  private getTrafficDisruption(response: TrafficResponse[]): void {
    if (response && response.length > 0) {
      response.forEach((disruption) => {
        console.log("eventService.ts: Updating traffic disruption data", disruption);
        const index = disruption.type.toLowerCase() === 'tx' ? 0 : 1;
        console.log("eventService.ts: Traffic disruption index", index, "for type", disruption.type);
        if (this.trafficDisruptions[index]) {
          console.log("eventService.ts: Found existing traffic disruption at index", index);
          this.trafficDisruptions[index] = {...disruption};
          //Object.assign(this.trafficDisruptions[index], disruption);
        }
      });
    }
  }

  private getFrameLoss(response: FrameLossResponse): void {
    console.log("eventService.ts: Updating frame loss data", response);
    this.frameLosses[0] = {...response};
  }
}
