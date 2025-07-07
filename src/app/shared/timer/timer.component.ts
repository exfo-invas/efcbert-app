import {Component, Input, OnInit} from '@angular/core';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss',
  imports: [CardModule, DividerModule]
})
export class TimerComponent implements OnInit {


  currentTimer: string = '00:00:00';
  timerInterval: any = null;
  timerSeconds: number = 0;

  @Input() eventStart: boolean = false;

  ngOnChanges() {
    if (this.eventStart) {
      this.startTimer();
    } else {
      this.stopTimer();
      this.currentTimer = '00:00:00';
      this.timerSeconds = 0;
    }
  }

  ngOnInit() {
    // Initialize the timer if needed

    if (this.eventStart) {
      this.startTimer();
    } else if (this.currentTimer !== '00:00:00' && !this.eventStart) {
      this.stopTimer();
      this.currentTimer = '00:00:00'; // Reset timer display
    }
  }

  startTimer() {
    if (this.timerInterval) return; // Prevent multiple intervals
    this.timerInterval = setInterval(() => {
      this.timerSeconds++;
      this.currentTimer = this.formatTime(this.timerSeconds);
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  formatTime(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].join(':');
  }


}

// // This component handles the timer functionality, including starting and stopping the timer based on the input event status.
// // ...existing code...
// timerInterval: any = null;
// timerSeconds: number = 0;
// currentTimer: string = '00:00:00';

// startEvent() {
//   // ...existing code...
//   this.startTimer();
//   // ...existing code...
// }

// stopEvent() {
//   // ...existing code...
//   this.stopTimer();
//   // ...existing code...
// }

// startTimer() {
//   if (this.timerInterval) return; // Prevent multiple intervals
//   this.timerInterval = setInterval(() => {
//     this.timerSeconds++;
//     this.currentTimer = this.formatTime(this.timerSeconds);
//   }, 1000);
// }

// stopTimer() {
//   if (this.timerInterval) {
//     clearInterval(this.timerInterval);
//     this.timerInterval = null;
//   }
// }

// formatTime(totalSeconds: number): string {
//   const hours = Math.floor(totalSeconds / 3600);
//   const minutes = Math.floor((totalSeconds % 3600) / 60);
//   const seconds = totalSeconds % 60;
//   return [
//     hours.toString().padStart(2, '0'),
//     minutes.toString().padStart(2, '0'),
//     seconds.toString().padStart(2, '0')
//   ].join(':');
// }
// // ...existing code...


