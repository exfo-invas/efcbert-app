import { Injectable } from "@angular/core";
import { EventDisruptions, FileDetails, FrameLossResponse, HourlyEvent, HourlyStatus, LatencyEvent, StandardEvent, TrafficResponse } from "../event/event.component.model";
import { LoggingService } from "../logging/logging.service";
import { ApiService } from "./api.service";
import { BehaviorSubject, firstValueFrom } from "rxjs";

@Injectable({ providedIn: 'root' })
export class EventStatusService {
  
  connectionStatus = new BehaviorSubject<boolean>(false);


  private eventStatus: boolean = false;
  private isPrinting: boolean = false;
  eventDisruptions: EventDisruptions;
  hourlyEvent: HourlyEvent[] = [];
  private FullStatusData: any;
  private fileRecords: FileDetails;

  constructor(private apiService: ApiService, private loggingService: LoggingService) {
  }

  getFileRecordsData(): FileDetails {
    return this.fileRecords;
  }

  setFullStatusData(data: any): void {
    this.FullStatusData = data;
  }

  getFullStatusData(): any {
    return this.FullStatusData;
  }

  setIsPrinting(isPrinting: boolean): void {
    this.isPrinting = isPrinting;
  }

  getIsPrinting(): boolean {
    return this.isPrinting;
  }

  setEventStatus(status: boolean): void {
    this.eventStatus = status;
  }

  getEventStatus(): boolean {
    return this.eventStatus;
  }

  getEventDisruptions(): EventDisruptions {
    return this.eventDisruptions;
  }

  getHourlyEvent(): HourlyEvent[] {
    return this.hourlyEvent;
  }

  //Reset event data
  resetEventData(): void {
    this.eventDisruptions = null;
    this.hourlyEvent = [];
  }

  getFileRecords(): void {
    this.apiService.getFileRecords().subscribe({
      next: (data: FileDetails) => {
        console.log('Record retrieved successfully:', data);
        this.fileRecords = data;
      },
      error: (error) => {
        console.error('Error retrieving record:', error);
      }
    });
  }

  async getEventDetails(): Promise<EventDisruptions> {
    try {
      const response = await firstValueFrom(this.apiService.getEventDetails()) as EventDisruptions;
      console.log(`Event disruptions data for :`, response);
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
      this.hourlyEvent = response;
      return response;
    } catch (error) {
      console.error(`Error fetching hourly event data for:`, error);
      // rethrow so callers can handle the rejection
      throw error;
    }
  }
}
