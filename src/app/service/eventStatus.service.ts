import { Injectable } from "@angular/core";
import {EventDisruptions, FrameLossResponse, TrafficResponse} from "../event/event.component.model";
import {LoggingService} from "../logging/logging.service";
import {ApiService} from "./api.service";

@Injectable({ providedIn: 'root' })
export class EventStatusService {
  private eventStatus: boolean = false;
  private trafficDisruptions: TrafficResponse[];
  private frameLosses: FrameLossResponse[];

  constructor(private apiService: ApiService, private loggingService: LoggingService) {
  }

  setEventStatus(status: boolean): void {
    this.eventStatus = status;
  }

  getEventStatus(): boolean {
    return this.eventStatus;
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

  private getEventDisruptions(disruption: EventDisruptions): void {
    this.getFrameLoss(disruption.frameLoss);
    this.getTrafficDisruption(disruption.traffic);
  }

  private getTrafficDisruption(response: TrafficResponse[]): void {
    if (response && response.length > 0) {
      response.forEach((disruption) => {
        const index = disruption.type.toLowerCase() === 'tx' ? 0 : 1;
        if (this.trafficDisruptions[index]) {
          Object.assign(this.trafficDisruptions[index], disruption);
        }
      });
    }
  }

  private getFrameLoss(response: FrameLossResponse[]): void {
    Object.assign(this.frameLosses[0], response);
  }
}
