import {Component, OnInit} from '@angular/core';
import {MegaMenuItem} from "primeng/api";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
})
export class AppComponent implements OnInit {

  connStatus: boolean;
  currentTimer: string = '00:00:00';
  openLogin: boolean = false;

  items: MegaMenuItem[] = [
    {
      label: 'Configuration',
      root: true,
      routerLink: '/home',

    },
    {
      label: 'Execution',
      root: true,
      routerLink: '/event',
    },
    {
      label: 'Logging',
      root: true,
      routerLink: '/logging',
    }
  ];

  constructor() {
  }

  ngOnInit() {
  }

  openLoginDialog() {
    this.openLogin = true;
  }

}
