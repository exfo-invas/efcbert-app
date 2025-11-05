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
  last: string;
  min: string;
  max: string;
}

export class HourlyStatus {
  isReady: boolean;
  hoursElapsed: number;
}

export class HourlyEvent {
  no: number;
  utilization: string;
  throughput: string;
  latency: string;
  framesLoss: string;
}