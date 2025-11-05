import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Button } from "primeng/button";
import { FormsModule } from "@angular/forms";
import { ConnectionTCP } from "../../service/api.service.model";
import { ApiService } from "../../service/api.service";
import { ConnectionService } from "../../service/connection.service";
import { Dialog } from "primeng/dialog";
import { ProgressBar } from "primeng/progressbar";
import { NgIf } from "@angular/common";
import { Message } from "primeng/message";
import { InputGroup } from "primeng/inputgroup";
import { Select } from "primeng/select";
import {IpService} from "../../service/ip.service";

@Component({
  selector: 'app-login-page',
  imports: [
    Button,
    FormsModule,
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
  @Output() loginSuccess = new EventEmitter<{ ip: string }>();
  @Output() loginFailed = new EventEmitter<boolean>();
  ifError: boolean = false;
  port: string;
  isLoading: boolean = false;
  errorMessage: string;
  selectedIp: string;
  ipLists: string[] = [];

  constructor(private apiService: ApiService, private connectionService: ConnectionService, private ipService: IpService) {
  }

  ngOnInit() {
    console.log("Login Page")
    this.ipService.getIPs();
    this.getIpList();
  }

  getIpList(){
    const ipv4 = this.ipService.getIPv4();
    const ipv6List = this.ipService.getIPv6();
    if (ipv4) {
      this.ipLists = [ipv4];
    }
    if (ipv6List && ipv6List.length > 0) {
      this.ipLists = this.ipLists.concat(ipv6List);
    }
    console.log("LoginPage: IP Values recevied from IPService ")
  }

  getConnection() {
    this.isLoading = true;
    this.connectionService.setConnection(this.selectedIp, false);
    console.log('Connecting to', this.selectedIp);
    this.apiService.get(this.selectedIp).subscribe((data: ConnectionTCP) => {
      console.log(data);
      this.isLoading = false;
      this.ifError = false;
      this.loginSuccess.emit({ ip: this.selectedIp });
      this.visible = false;
      this.connectionService.setConnection(this.selectedIp, data.status);
      this.connectionService.setConnection(this.selectedIp, data.status);
    }, error => {
      console.error('Connection error:', error);
      this.ifError = true;
      this.isLoading = false;
      this.errorMessage = 'An error occurred while trying to connect. Please try again later.';
    });
  }

  onDialogHide() {
    this.loginFailed.emit(false);
  }
}
