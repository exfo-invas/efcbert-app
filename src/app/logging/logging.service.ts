import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoggingService {
    private logsData: any[] = [];
    private startTime: Date | null = null;

    getLogs() {
        return this.logsData;
    }

    addLog(event: string) {
        const date = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
        const logId = this.logsData.length + 1;
        let duration = '0s';
        if (this.startTime === null) {
            this.startTime = new Date();
        } else {
            duration = Math.floor((new Date().getTime() - this.startTime.getTime()) / 1000) + 's';
        }
        let log = { id: logId, startTime: date, event: event, duration: duration }
        this.logsData.push(log);
    }

    clearLogs() {
        this.logsData = [];
    }

    getLogsData() {
        return this.logsData;
    }
}