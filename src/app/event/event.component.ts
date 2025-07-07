import { Component } from '@angular/core';

interface DataRow {
  type: string;
  speed: string;
  frameSize: string;
  lineDataRate: string;
  txUtilization: string;
  throughput: string;
}

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

  tableData: DataRow[] = [
    {
      type: 'Tx',
      speed: '1X (850Mbps)',
      frameSize: 'LINS1:SOUR:DATA:TEL:FIB:STR:SIZE?',
      lineDataRate: 'Cal Table',
      txUtilization: 'Command TX',
      throughput: 'Cal Table',
    },
    {
      type: 'Rx',
      speed: '1X (850Mbps)',
      frameSize: 'LINS1:SOUR:DATA:TEL:FIB:STR:SIZE?',
      lineDataRate: 'Cal Table',
      txUtilization: 'Command RX',
      throughput: 'Cal Table',
    },
  ];

  constructor() { }

}
