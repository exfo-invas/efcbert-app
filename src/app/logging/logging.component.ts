import { Component } from '@angular/core';
import { TableModule } from "primeng/table";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logging',
  imports: [
    TableModule,
    CommonModule
  ],
  templateUrl: './logging.component.html',
  styleUrl: './logging.component.scss',
})
export class LoggingComponent {

  logColumns: any[] = [
    { field: 'id', header: 'ID' },
    { field: 'startTime', header: 'Start Time' },
    { field: 'event', header: 'Event' },
    { field: 'duration', header: 'Duration' },
    { field: 'details', header: 'Details' },
    { field: 'remark', header: 'remark' }
  ];

  logsData: any[] = [
    { id: 1, startTime: '2023-10-01 10:00', event: 'Login', duration: '5s', details: 'User logged in successfully', remark: 'N/A' }
  ];

  get paddedLogsData() {
    const rows = this.logsData ? [...this.logsData] : [];
    while (rows.length < 20) {
      rows.push({ id: '', startTime: '', event: '', duration: '' });
    }
    return rows;
  }
}
