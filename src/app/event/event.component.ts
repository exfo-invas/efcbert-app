import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { EventDisruptions, FrameLossResponse, HourlyEvent, HourlyStatus, LatencyEvent, StandardEvent, TrafficResponse } from './event.component.model';
import { EventStatusService } from "../service/eventStatus.service";
import { ConnectionService } from '../service/connection.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss',
  standalone: false
})
export class EventComponent implements OnInit, OnDestroy {
  private pollingIntervalId?: any;
  private readonly POLL_INTERVAL_MS = 3000; // 3 seconds
  private hourlyCounterIntervalId?: any;

  latencyEvent: LatencyEvent = {
    last: 0,
    min: 0,
    max: 0
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
    { no: 1, timestamp: '', utilization: '-', throughput: '-', latency: '-', frameLoss: '-' }
  ];

  hourlyStatus: HourlyStatus = {
    isReady: false,
    hoursElapsed: ""
  };

  eventStatusBol: boolean = false;

  apiStatus: boolean = false;

  timeToNextHour: number = 0;

  apiHourlyStatus: boolean = false;
  router: any;

  constructor(private eventStatus: EventStatusService, private connectionService: ConnectionService, private cdr: ChangeDetectorRef, private zone: NgZone) {
  }

  //Every Second, fetch the latest data for throughput, frame loss, service disruption, and traffic disruption
  ngOnInit(): void {
    // Only enable polling if the backend is healthy
    if (!this.connectionService.getHealth()) {
      return;
    }

    this.eventStatus.connectionStatus.subscribe(() => {
      // Trigger change detection when connection status changes

      this.eventStatusBol = this.connectionService.getStatus();
      if (this.eventStatusBol) {
        this.startPolling();
      } else {
        this.stopPolling();
      }
      this.cdr.detectChanges();
    });


    this.zone.run(() => {
      // Load initial data from the service and apply it to the view
      this.eventStatus.getEventDetails().then((initialDisruptions) => {
        if (initialDisruptions) {
          this.cdr.detectChanges();
          this.getEventDisruptions(initialDisruptions);
          this.hourlyStatus = initialDisruptions.hourlyStatus;
        }
      }).catch((err) => console.error('Initial event details fetch failed:', err));

      this.eventStatus.getHourlyEventDetails().then((initialHourly) => {
        if (initialHourly?.length) {
          this.assignHourlyEventData(initialHourly);
          this.cdr.detectChanges();
          this.refreshComponent();
        }
      }).catch((err) => console.error('Initial hourly event fetch failed:', err));
    });

    // ensure hourlyEvents has default entries
    this.assignHourlyEvent();
  }

  refreshComponent() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  ngOnDestroy(): void {
    this.stopPolling();
    if (this.hourlyCounterIntervalId) {
      clearInterval(this.hourlyCounterIntervalId);
      this.hourlyCounterIntervalId = undefined;
    }
  }

  private getEventDisruptions(disruption: EventDisruptions): void {
    this.assignFrameLoss(disruption?.frameLoss);
    this.assignTrafficDisruption(disruption?.traffic);
    this.assignStandardResponse(disruption?.standard);
    this.assignLatencyResponse(disruption?.latency);
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

  private assignLatencyResponse(response: LatencyEvent): void {
    if (!this.latencyEvent) {
      this.latencyEvent = { last: 0, min: 0, max: 0 } as LatencyEvent;
    }
    if (response) {
      Object.assign(this.latencyEvent, response);
    }
  }

  //if HourlyEvent data is less than 10 entries, add dummy data
  private assignHourlyEventData(response: HourlyEvent[]): void {
    Object.assign(this.hourlyEvents, response);
    this.cdr.detectChanges();
  }

  private assignHourlyEvent(): HourlyEvent[] {
    const currentLength = this.hourlyEvents.length;
    for (let i = currentLength + 1; i <= 20; i++) {
      this.hourlyEvents.push({ no: i, timestamp: '-', utilization: '-', throughput: '-', latency: '-', frameLoss: '-' });
    }
    return this.hourlyEvents;
  }

  private startPolling(): void {
    // Prevent multiple timers
    if (this.pollingIntervalId) {
      return;
    }
    this.pollingIntervalId = setInterval(() => {
      void this.pollIteration();
    }, this.POLL_INTERVAL_MS);
  }

  private stopPolling(): void {

    if (this.pollingIntervalId) {
      clearInterval(this.pollingIntervalId);
      this.pollingIntervalId = undefined;
    }
    void this.executeHourlyEventRequest();
  }

  private async pollIteration(): Promise<void> {
    try {
      if (!this.eventStatus.getEventStatus()) {
        // If event is not active, no need to poll
        return;
      }

      this.zone.run(async () => {
        // fetch latest event disruptions
        this.apiStatus = true;
        const eventDisruptions = await this.eventStatus.getEventDetails();
        this.getEventDisruptions(eventDisruptions);
        this.apiStatus = false;

        // update hourly status and fetch hourly events if ready
        this.hourlyStatus = eventDisruptions.hourlyStatus;
        if (this.hourlyStatus && this.hourlyStatus.isReady) {
          this.apiHourlyStatus = true;
          await this.executeHourlyEventRequest();
          this.apiHourlyStatus = false;
        }
        this.cdr.detectChanges();   // Will work **only inside zone**
      });

    } catch (error) {
      console.error('Error during polling iteration:', error);
      this.apiStatus = false;
      this.apiHourlyStatus = false;
    }
  }

  private async executeHourlyEventRequest(): Promise<void> {
    const hourlyEventDetails = await this.eventStatus.getHourlyEventDetails();
    this.assignHourlyEventData(hourlyEventDetails);
  }
}
