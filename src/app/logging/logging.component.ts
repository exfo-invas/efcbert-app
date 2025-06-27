import { Component } from '@angular/core';
import {NgForOf} from "@angular/common";
import {PrimeTemplate} from "primeng/api";
import {TableModule} from "primeng/table";

@Component({
  selector: 'app-logging',
    imports: [
        NgForOf,
        PrimeTemplate,
        TableModule
    ],
  templateUrl: './logging.component.html',
  styleUrl: './logging.component.scss'
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

}
