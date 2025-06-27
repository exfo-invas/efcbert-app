import {Component, Input, OnInit} from '@angular/core';
import {Button} from "primeng/button";
import {FormsModule} from "@angular/forms";
import {InputText} from "primeng/inputtext";
import {ConnectionTCP} from "../../service/api.service.model";
import {ApiService} from "../../service/api.service";
import {ConnectionService} from "../../service/connection.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Dialog} from "primeng/dialog";
import {ProgressBar} from "primeng/progressbar";
import {NgIf} from "@angular/common";
import {Message} from "primeng/message";

@Component({
  selector: 'app-login-page',
  imports: [
    Button,
    FormsModule,
    InputText,
    Dialog,
    ProgressBar,
    NgIf,
    Message
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent implements OnInit {

  @Input() visible: boolean = false;
  ifError: boolean = false;
  ipaddress: string;
  port: string;
  isLoading: boolean = false;
  errorMessage: string;

  constructor(private apiService: ApiService, private connectionService: ConnectionService, private route: Router, private activeRouter: ActivatedRoute) {
  }

  ngOnInit() {
    if (this.activeRouter.snapshot.queryParamMap.has('ip')) {
      this.activeRouter.queryParams.subscribe(params => {
        [this.ipaddress, this.port] = params['ip'].split(':');
      });
    } else {
      this.ipaddress = '';
      this.port = '';
    }
  }

  getConnection() {
    this.isLoading = true;
    this.connectionService.setConnection(this.ipaddress, this.port, false);
    this.apiService.get(this.ipaddress, this.port).subscribe((data: ConnectionTCP) => {
      if (data.status === true) {
        console.log(data);
        this.connectionService.setConnection(this.ipaddress, this.port, data.status);
      } else {
        this.ifError = true;
        this.errorMessage = 'Unable to connect to the server. Please check the IP address and port.';
      }
    } , error => {
      console.error('Connection error:', error);
      this.ifError = true;
      this.isLoading = false;
      this.errorMessage = 'An error occurred while trying to connect. Please try again later.';
    });
  }
}
