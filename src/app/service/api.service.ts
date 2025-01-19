//method to send http request to the server

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})

export class ApiService {
  constructor(private http: HttpClient) {
  }

  baseUrl = 'http://localhost:8080';

  connection = 'telnet/connect';

  //method to send http request to the server
  public get(url: string, port: any) {
    url = this.baseUrl + '/' + this.connection + '/' + url + '/' + port;
    console.log(url);

    return this.http.get(url, {responseType: 'json'});


  }
}
