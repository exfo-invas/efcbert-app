export class EventDisruptions {
  service: ServiceDisruptions[];
  traffic: TrafficResponse[];
}

export class EventThroughput {
  throughput: ThroughputResponse[];
  frameLoss: FrameLossResponse[];
}

export class EventDetails {
  EventDisruptions: EventDisruptions;
  EventThroughput: EventThroughput;
}

export class ServiceDisruptions {
  type: string;
  speed: string;
  frameSize: string;
  lineDataRate: string;
  txUtilization: string;
  throughput: string;
}

export class TrafficResponse {
  type: string;
  fcRate: string;
  protocol: string;
  encoding: string;
  actualThroughput: string;
  actualTransferSpeed: string;
  lineSpeed: string;
  currentUtilization: string;
  measuredThroughput: string;
  transferSpeed: string;
  measuredLineSpeed: string;
}

export class ThroughputResponse {
  type: string;
  fcRate: string;
  frameSize: string;
  fullLineRate: string;
  measureRate: string;
  framesLossRate: string;
}

export class FrameLossResponse {
  type: string;
  frameRate: string;
  totalTransmittedBytes: string;
  framesTransmitted: string;
}
