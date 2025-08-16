export class EventDisruptions {
  frameLoss: FrameLossResponse;
  traffic: TrafficResponse[];
}

export class FrameLossResponse {
  type: string;
  byteCount: number;
  measuredRate: number;
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

export class standardTestResponse {
  fcRate: number;
  frameSize: number;
}