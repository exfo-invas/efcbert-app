export class EventDisruptions {
  frameLoss: FrameLossResponse[];
  traffic: TrafficResponse[];
}

export class FrameLossResponse {
  fcRate: string;
  txCount: number;
  rxCount: number;
  lostFrames: number;
  frameLossRate: number;
}

export class TrafficResponse {
  type: string;
  fcRate: string;
  actualThroughput: number;
  actualTransferSpeed: number;
  lineSpeed: number;
  currentUtilization: number;
  measuredThroughput: number;
  transferSpeed: number;
  measuredLineSpeed: number;
}

// export class EventThroughput {
//   throughput: ThroughputResponse[];
//   service: ServiceDisruptions[];
// }

// export class EventDetails {
//   EventDisruptions: EventDisruptions;
//   EventThroughput: EventThroughput;
// }

// export class ServiceDisruptions {
//   type: string;
//   speed: string;
//   frameSize: string;
//   lineDataRate: string;
//   txUtilization: string;
//   throughput: string;
// }

// export class ThroughputResponse {
//   type: string;
//   fcRate: string;
//   frameSize: string;
//   fullLineRate: string;
//   measureRate: string;
//   framesLossRate: string;
// }
