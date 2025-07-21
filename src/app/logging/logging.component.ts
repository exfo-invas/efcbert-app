import { Component } from '@angular/core';
import { TableModule } from "primeng/table";
import { CommonModule } from '@angular/common';
import { LoggingService } from './logging.service';

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

  constructor(private loggingService: LoggingService) { }

  logColumns: any[] = [
    { field: 'id', header: 'ID' },
    { field: 'startTime', header: 'Start Time' },
    { field: 'event', header: 'Event' },
    { field: 'duration', header: 'Duration' },
    { field: 'details', header: 'Details' }
  ];

  logsData: any[] = this.loggingService.getLogsData();

  get paddedLogsData() {
    const rows = this.logsData ? [...this.logsData] : [];
    while (rows.length < 16) {
      rows.push({ id: '', startTime: '', event: '', duration: '' });
    }
    return rows;
  }
}
