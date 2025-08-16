import {Injectable} from "@angular/core";
import {EventDisruptions} from "../event/event.component.model";
import {LoggingService} from "../logging/logging.service";
import {ApiService} from "./api.service";

@Injectable({providedIn: 'root'})
export class EventStatusService {
  private eventStatus: boolean = false;

  constructor(private apiService: ApiService, private loggingService: LoggingService) {
  }

  setEventStatus(status: boolean): void {
    this.eventStatus = status;
  }

  getEventStatus(): boolean {
    return this.eventStatus;
  }

  getEventDetails(): Promise<EventDisruptions> {
    return new Promise((resolve, reject) => {
      this.apiService.getEventDetails().subscribe({
        next: (response: EventDisruptions) => {
          if (response === null || response === undefined) {
            console.log("eventService.ts: No event details found.");
            resolve(null); // Return null if no data is found
          } else {
            console.log(`Event disruptions data for :`, response);
            this.loggingService.addLog(`Event disruptions data fetched successfully`);
            resolve(response); // Return the response
          }
        },
        error: (error) => {
          console.error(`Error fetching event disruptions data for:`, error);
          reject(error); // Reject the promise on error
        }
      });
    });
  }
}
