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

  connection = 'telnet';

  //method to send http request to the server
  public get(url: string, port: any) {
    url = this.baseUrl + '/' + this.connection + '/connect/' + url + '/' + port;
    console.log(url);

    return this.http.get(url, {responseType: 'json'});


  }

  executeCommand(command: string) {

    const url = this.baseUrl + '/' + this.connection + '/send';

    console.log(url);

    return this.http.post(url, {command: command}, {responseType: 'text'});

  }

  close() {
    const url = this.baseUrl + '/' + this.connection + '/disconnect';

    console.log(url);

    return this.http.get(url, {responseType: 'text'});
  }

  status() {
    const url = this.baseUrl + '/' + this.connection + '/status';
    console.log(url);
    return this.http.get(url, {responseType: 'text'});
  }
}
