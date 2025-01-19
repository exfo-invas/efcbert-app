import { Component } from '@angular/core';
import {ApiService} from "../service/api.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  title = 'efcbert-app';
  ipAddress: string = '';
  portNum: string = '';
  reponseData: string = '';

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
  }

  getConnection(ipAddress: string, portNum: string) {

    this.apiService.get(ipAddress, portNum).subscribe((data: any) => {
      console.log(data);
      this.reponseData = data.status;
    });

  }

}
