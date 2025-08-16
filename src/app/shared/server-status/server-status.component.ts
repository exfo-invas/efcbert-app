import {Component, Input, OnInit} from '@angular/core';
import {Button} from "primeng/button";
import {NgIf} from "@angular/common";
import {Tooltip} from "primeng/tooltip";
import {Dialog} from "primeng/dialog";
import {ElectronService} from "../../service/electron.service";

@Component({
  selector: 'app-server-status',
  imports: [
    Button,
    NgIf,
    Tooltip,
    Dialog
  ],
  templateUrl: './server-status.component.html',
  styleUrl: './server-status.component.scss'
})
export class ServerStatusComponent implements OnInit {

  constructor( private electronService: ElectronService) {
  }

  ngOnInit() {
  }

  @Input() connStatus: boolean;

  visible: boolean = false;
  ipaddress: string;
  port: string;

  showDialog() {
    this.electronService.callElectronMethod({ action: 'reconnect' });
    this.visible = true;
  }
}
