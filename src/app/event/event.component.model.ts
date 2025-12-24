export class EventDisruptions {
  frameLoss: FrameLossResponse[];
  traffic: TrafficResponse[];
  standard: StandardEvent;
  latency: LatencyEvent;
  hourlyStatus: HourlyStatus;
}

export class FrameLossResponse {
  type: string;
  byteCount: number;
  frameRate: number;
  frameCount: number;
  frameLossRate: number;
}

export class TrafficResponse {
  type: string;
  currentUtilization: number;
  measuredThroughput: number;
  transferSpeed: number;
  measuredLineSpeed: number;
}

export class StandardEvent {
  fcRate: string;
  frameSize: string;
}

export class LatencyEvent {
  last: number;
  min: number;
  max: number;
}

export class HourlyStatus {
  isReady: boolean;
  hoursElapsed: string;
}

export class HourlyEvent {
  no: number;
  timestamp: string;
  utilization: string;
  throughput: string;
  latency: string;
  frameLoss: string;
}

export class FileDetails {
  startTime: string;
  endTime: string;
  eventFileName: string;
  hourlyFileName: string;
}