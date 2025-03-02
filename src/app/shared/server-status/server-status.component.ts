import {Component, Input, OnInit} from '@angular/core';
import {Button} from "primeng/button";
import {NgIf} from "@angular/common";
import {Tooltip} from "primeng/tooltip";
import {Dialog} from "primeng/dialog";
import {InputText} from "primeng/inputtext";
import {ConnectionService} from "../../service/connection.service";

@Component({
  selector: 'app-server-status',
  imports: [
    Button,
    NgIf,
    Tooltip,
    Dialog,
    InputText
  ],
  templateUrl: './server-status.component.html',
  styleUrl: './server-status.component.scss'
})
export class ServerStatusComponent implements OnInit {

  constructor(private connectionService: ConnectionService) {
  }

  ngOnInit() {
    setInterval(() => {
      this.connStatus = this.connectionService.getStatus();
    }, 300000); // 300000 ms = 5 minutes
  }

  @Input() connStatus: boolean;

  visible: boolean = false;
  ipaddress: string;
  port: string;

  showDialog() {
    this.visible = true;
  }



}
