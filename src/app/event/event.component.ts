import {Component} from '@angular/core';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss',
  standalone: false,
})
export class EventComponent {

  columns = [
    { field: 'fcRate' , header: 'FC Rate' },
    { field: 'frameSize', header: 'Frame Size' },
    { field: 'throughputRate' , header: 'Throughput rate' },
    { field: 'lineRate' , header: 'Measure line rate' },
    { field: 'measuredRate' , header: 'Measure rate' }
  ];

  throughPuts: any[] = [{
    fcRate: 0,
    frameSize: 0,
    throughputRate: 10,
    lineRate: 0,
    measuredRate: 0
  }];

  columnsFramesLoss = [
    { field: 'fcRate' , header: 'FC Rate' },
    { field: 'frameSize', header: 'Frame Size' },
    { field: 'fullLineRate' , header: 'Full Line rate' },
    { field: 'framesSecs' , header: 'Frames/sec' },
    { field: 'framesLost' , header: 'Frames Lost' },
    { field: 'frameLossRate' , header: 'Frame loss rate in %'}
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
    { field: 'fcRate' , header: 'FC Rate' },
    { field: 'frameSize', header: 'Frame Size' },
    { field: 'measuredLineRate' , header: 'Measure Line Rate -Gbps' },
    { field: 'measuredPerCent' , header: 'Measured % Line Rate -Gbps' },
    { field: 'latencyRtd' , header: 'Latency RTD (us)' },
    { field: 'MeasuredFrameSec' , header: 'Measured rate Frames/sec' }
  ];

  latencies: any[] = [{
    fcRate: 0,
    frameSize: 0,
    measuredLineRate: 10,
    measuredPerCent: 0,
    latencyRtd: 0,
    MeasuredFrameSec: 0
  }];

  constructor() {}

}
