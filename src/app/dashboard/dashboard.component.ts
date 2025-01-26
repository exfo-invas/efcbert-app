import {Component, OnInit} from '@angular/core';
import {ApiService} from "../service/api.service";
import {Router} from "@angular/router";
import {ConnectionTCP} from "../service/api.service.model";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false,
})
export class DashboardComponent implements OnInit {
  title = 'efcbert-app';
  ipAddress: string = '';
  portNum: string = '';
  reponseData: ConnectionTCP = new ConnectionTCP();
  connStatus: boolean;
  isNew: boolean = false;
  command: string;
  commandResponse: string = "";

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    if (this.ipAddress === '' && this.portNum === '') {
      this.isNew = false;
    }
  }

  getConnection() {
    this.apiService.get(this.ipAddress, this.portNum).subscribe((data: ConnectionTCP) => {
      console.log(data);
      this.isNew = true;
      this.connStatus = data.status;
      this.reponseData = data;
    });
  }

  executeCommand() {
    this.apiService.executeCommand(this.command).subscribe((data: string) => {
      console.log(data);
      this.commandResponse = data;
    });
  }

  closeConnect() {
    this.apiService.close().subscribe((data: string) => {
      console.log(data);
      if (data === 'true') {
        this.default();
      } else {
        console.log('error closing connection');
      }
      return data;
    });
  }

  default() {
    this.ipAddress = '';
    this.portNum = '';
    this.isNew = false;
    this.connStatus = false;
    this.command = '';
    this.commandResponse = '';
  }
}
