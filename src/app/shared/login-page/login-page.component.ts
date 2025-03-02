import {Component, OnInit} from '@angular/core';
import {Button} from "primeng/button";
import {Card} from "primeng/card";
import {FormsModule} from "@angular/forms";
import {InputText} from "primeng/inputtext";
import {ConnectionTCP} from "../../service/api.service.model";
import {ApiService} from "../../service/api.service";
import {ConnectionService} from "../../service/connection.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-login-page',
    imports: [
        Button,
        Card,
        FormsModule,
        InputText
    ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent implements OnInit {

  ipaddress: string;
  port: string;

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
    this.connectionService.setConnection(this.ipaddress, this.port, false);
    this.apiService.get(this.ipaddress, this.port).subscribe((data: ConnectionTCP) => {
      console.log(data);
      this.connectionService.setConnection(this.ipaddress, this.port, data.status);
      this.route.navigate(['/home']);
    });
  }
}
