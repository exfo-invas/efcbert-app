import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Button } from "primeng/button";
import { FormsModule } from "@angular/forms";
import { InputText } from "primeng/inputtext";
import { ConnectionTCP } from "../../service/api.service.model";
import { ApiService } from "../../service/api.service";
import { ConnectionService } from "../../service/connection.service";
import { ActivatedRoute } from "@angular/router";
import { Dialog } from "primeng/dialog";
import { ProgressBar } from "primeng/progressbar";
import { NgIf } from "@angular/common";
import { Message } from "primeng/message";
import { InputGroup } from "primeng/inputgroup";
import { Select } from "primeng/select";

@Component({
  selector: 'app-login-page',
  imports: [
    Button,
    FormsModule,
    InputText,
    Dialog,
    ProgressBar,
    NgIf,
    Message,
    InputGroup,
    Select
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent implements OnInit {

  @Input() visible: boolean = false;
  @Output() loginSuccess = new EventEmitter<{ ip: string, port: string }>();
  @Output() loginFailed = new EventEmitter<boolean>();
  ifError: boolean = false;
  port: string;
  isLoading: boolean = false;
  errorMessage: string;
  selectedIp: string;
  ipLists: string[] = [];

  constructor(private apiService: ApiService, private connectionService: ConnectionService) {
  }

  ngOnInit() {
    const ipv6List = sessionStorage.getItem('ipv6') ? JSON.parse(sessionStorage.getItem('ipv6')) : [];
    const ipv4 = sessionStorage.getItem('ipv4');
    if (ipv4) {
      this.ipLists = [ipv4];
    }
    if (ipv6List && ipv6List.length > 0) {
      this.ipLists = this.ipLists.concat(ipv6List);
    }
  }

  getConnection() {
    this.isLoading = true;
    this.connectionService.setConnection(this.selectedIp, this.port, false);
    console.log('Connecting to', this.selectedIp, 'on port', this.port);
    this.apiService.get(this.selectedIp, this.port).subscribe((data: ConnectionTCP) => {
      console.log(data);
      this.isLoading = false;
      this.ifError = false;
      this.loginSuccess.emit({ ip: this.selectedIp, port: this.port });
      this.visible = false;
      this.connectionService.setConnection(this.selectedIp, this.port, data.status);
      this.connectionService.setConnection(this.selectedIp, this.port, data.status);
    }, error => {
      console.error('Connection error:', error);
      this.ifError = true;
      this.isLoading = false;
      this.errorMessage = 'An error occurred while trying to connect. Please try again later.';
    });
  }

  getIpList() {
    this.getConnection();
  }

  onDialogHide() {
    this.loginFailed.emit(false);
  }
}
