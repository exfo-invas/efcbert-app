import { Injectable } from "@angular/core";
import { EventDisruptions, FrameLossResponse, HourlyEvent, HourlyStatus, LatencyEvent, StandardEvent, TrafficResponse } from "../event/event.component.model";
import { LoggingService } from "../logging/logging.service";
import { ApiService } from "./api.service";
import { firstValueFrom } from "rxjs";

@Injectable({ providedIn: 'root' })
export class EventStatusService {
  private eventStatus: boolean = false;
  eventDisruptions: EventDisruptions;
  hourlyEvent: HourlyEvent[] = [];

  constructor(private apiService: ApiService, private loggingService: LoggingService) {
  }

  setEventStatus(status: boolean): void {
    this.eventStatus = status;
  }

  getEventStatus(): boolean {
    return this.eventStatus;
  }

  async getEventDetails(): Promise<EventDisruptions> {
    try {
      const response = await firstValueFrom(this.apiService.getEventDetails()) as EventDisruptions;
      console.log(`Event disruptions data for :`, response);
      this.loggingService.addLog(`Event disruptions data fetched successfully`);
      this.eventDisruptions = response;
      return response;
    } catch (error) {
      console.error(`Error fetching event disruptions data for:`, error);
      // rethrow so callers can handle the rejection
      throw error;
    }
  }

  // hourly event data fetch can be added here in future
  async getHourlyEventDetails(): Promise<HourlyEvent[]> {
    try {
      const response = await firstValueFrom(this.apiService.getHourlyEventDetails()) as HourlyEvent[];
      console.log(`Hourly event data for :`, response);
      this.loggingService.addLog(`Hourly event data fetched successfully`);
      this.hourlyEvent = response;
      return response;
    } catch (error) {
      console.error(`Error fetching hourly event data for:`, error);
      // rethrow so callers can handle the rejection
      throw error;
    }
  }
}
