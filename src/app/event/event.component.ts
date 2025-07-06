import { Component } from '@angular/core';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss',
  standalone: false
})
export class EventComponent {

  columns = [
    { field: 'fcRate' , header: 'FC Rate' , suffix: 'Gbps' },
    { field: 'frameSize', header: 'Frame Size' , suffix: 'Bytes' },
    { field: 'throughputRate' , header: 'Throughput rate' , suffix: 'Gbps' },
    { field: 'lineRate' , header: 'Measure line rate' , suffix: 'Gbps' },
    { field: 'measuredRate' , header: 'Measure rate' , suffix: 'Gbps' }
  ];

  throughPuts: any[] = [{
    fcRate: 0,
    frameSize: 0,
    throughputRate: 10,
    lineRate: 0,
    measuredRate: 0
  }];

  columnsFramesLoss = [
    { field: 'fcRate', header: 'FC Rate', suffix: 'Gbps' },
    { field: 'frameSize', header: 'Frame Size' , suffix: 'Bytes' },
    { field: 'fullLineRate', header: 'Full Line rate' , suffix: 'Gbps' },
    { field: 'framesSecs', header: 'Frames/sec' , suffix: 'Frames/sec' },
    { field: 'framesLost', header: 'Frames Lost' , suffix: 'Frames' },
    { field: 'frameLossRate', header: 'Frame loss percent' , suffix: '%' }
  ];

  frameLosses: any[] = [{
    fcRate: 0,
    frameSize: 0,
    fullLineRate: 10,
    framesSecs: 0,
    framesLost: 0,
    frameLossRate: 0
  }];

  columnsLatency = [
    { field: 'fcRate', header: 'FC Rate' , suffix: 'Gbps' },
    { field: 'frameSize', header: 'Frame Size' , suffix: 'Bytes' },
    { field: 'measuredLineRate', header: 'Measure Line Rate -Gbps' , suffix: 'Gbps' },
    { field: 'measuredPerCent', header: 'Measured % Line Rate -Gbps' , suffix: '%' },
    { field: 'latencyRtd', header: 'Latency RTD (us)' , suffix: 'us' },
    { field: 'MeasuredFrameSec', header: 'Measured rate Frames/sec' , suffix: 'Frames/sec' }
  ];

  latencies: any[] = [{
    fcRate: 0,
    frameSize: 0,
    measuredLineRate: 10,
    measuredPerCent: 0,
    latencyRtd: 0,
    MeasuredFrameSec: 0
  }];

  constructor() { }

}
