import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ConnectionTCP} from "./service/api.service.model";
import {ApiService} from "./service/api.service";
import {MessageService} from "primeng/api";
import {LoginModel} from "./shared/login-page/login.model";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements OnInit{
  reponseData: ConnectionTCP = new ConnectionTCP();
  connStatus: boolean;

  constructor(private route: Router, private apiService: ApiService) {
  }

  ngOnInit() {
    this.getStatus();
  }

  getConnection($event: LoginModel) {
    this.apiService.get($event.ipaddress, $event.port).subscribe((data: ConnectionTCP) => {
      console.log(data);
      /*this.isNew = true;*/
      this.connStatus = data.status;
      this.reponseData = data;
    });
  }

  getStatus() {
    this.apiService.status().subscribe((data: string) => {
      console.log(data);
      /*this.isNew = true;*/
      if (data === 'true') {
        this.connStatus = true;

      } else {
        this.connStatus = false;
        console.log('error closing connection');
      }
    });
  }

  routeToHome() {

  }
}
