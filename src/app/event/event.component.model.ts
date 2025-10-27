export class EventDisruptions {
  frameLoss: FrameLossResponse[];
  traffic: TrafficResponse[];
  standardEvent: StandardEvent;
  latencyEvent: LatencyEvent;
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

export class HourlyEvent {
  no: number;
  utilization: string;
  throughput: string;
  latency: string;
  framesLoss: string;
}