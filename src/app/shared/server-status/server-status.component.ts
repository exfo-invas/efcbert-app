import {Component, Input, OnInit} from '@angular/core';
import {Button} from "primeng/button";
import {NgIf} from "@angular/common";
import {Tooltip} from "primeng/tooltip";
import {Dialog} from "primeng/dialog";

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

  constructor() {
  }

  ngOnInit() {
  }

  @Input() connStatus: boolean;

  visible: boolean = false;
  ipaddress: string;
  port: string;

  showDialog() {
    this.visible = true;
  }
}
