import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Button} from "primeng/button";
import {NgIf} from "@angular/common";
import {Tooltip} from "primeng/tooltip";
import { LoginPageComponent } from "../login-page/login-page.component";

@Component({
  selector: 'app-server-status',
  imports: [
    Button,
    NgIf,
    Tooltip,
    LoginPageComponent
],
  templateUrl: './server-status.component.html',
  styleUrl: './server-status.component.scss'
})
export class ServerStatusComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

  @Input() connStatus: boolean;
  @Output() loginSuccess = new EventEmitter<{ ip: string }>();
  @Output() loginFailed = new EventEmitter<boolean>();

  visible: boolean = false;
  ipaddress: string;
  port: string;

  showDialog() {
    this.visible = true;
  }

  closeDialog(event: boolean) {
    this.visible = false;
    this.loginFailed.emit(event);
  }
}
