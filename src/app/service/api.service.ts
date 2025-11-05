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

  telnetContext = 'telnet';

  //method to send http request to the server
  public get(url: string) {
    const path = '/telnet/connect/{ip}';
    url = this.baseUrl + path.replace('{ip}', url);
    console.log(url);

    return this.http.get(url, {responseType: 'json'});
  }


  public getIPs() {
    const url = this.baseUrl + '/' + this.telnetContext + '/ip';
    console.log("ApiService: API call to request IPLIST to URL:-",url);
    return this.http.get(url, {responseType: 'json'});
  }


  executeCommand(command: string) {

    const url = this.baseUrl + '/' + this.telnetContext + '/send';

    console.log(url);

    return this.http.post(url, {command: command}, {responseType: 'text'});

  }

  close() {
    const url = this.baseUrl + '/' + this.telnetContext + '/disconnect';

    console.log(url);

    return this.http.get(url, {responseType: 'text'});
  }

  status() {
    const url = this.baseUrl + '/' + this.telnetContext + '/status';
    console.log(url);
    return this.http.get(url, {responseType: 'text'});
  }

  getStatus() {
    const url = this.baseUrl + '/' + 'config/status/full';
    console.log(url);
    return this.http.get(url, {responseType: 'json'});
  }


  eventHandler(toggle:boolean) {
    const path = '/config/test/{toggle}';
    const url = this.baseUrl + path.replace('{toggle}', toggle.valueOf().toString());
    console.log(url);
    return this.http.get(url, {responseType: 'text'});
  }

  getConfigStatus() {
    const path = '/config/status/full';
    const url = this.baseUrl + path;
    console.log(url);
    return this.http.get(url, {responseType: 'json'});
  }

  // Methods to get service disruption, traffic disruption, throughput, and frame loss data
  // Executions Tab
  getEventDetails() {
    const path = '/event/details';
    const url = this.baseUrl + path;
    console.log(url);
    return this.http.get(url, {responseType: 'json'});
  }

  getHourlyEventDetails() {
    const path = '/event/details/hourly';
    const url = this.baseUrl + path;
    console.log(url);
    return this.http.get(url, {responseType: 'json'});
  }

}