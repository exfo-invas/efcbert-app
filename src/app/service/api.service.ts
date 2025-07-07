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

  contextService = 'telnet';

  //method to send http request to the server
  public get(url: string, port: any) {
    const path = '/telnet/connect/{ip}/{port}';
    url = this.baseUrl + path.replace('{ip}', url).replace('{port}', port);
    console.log(url);

    return this.http.get(url, {responseType: 'json'});
  }


  public getIPs() {
    const url = this.baseUrl + '/' + this.contextService + '/ip';
    console.log(url);
    return this.http.get(url, {responseType: 'json'});
  }


  executeCommand(command: string) {

    const url = this.baseUrl + '/' + this.contextService + '/send';

    console.log(url);

    return this.http.post(url, {command: command}, {responseType: 'text'});

  }

  close() {
    const url = this.baseUrl + '/' + this.contextService + '/disconnect';

    console.log(url);

    return this.http.get(url, {responseType: 'text'});
  }

  status() {
    const url = this.baseUrl + '/' + this.contextService + '/status';
    console.log(url);
    return this.http.get(url, {responseType: 'text'});
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
  getServiceDisruption() {
    const path = '/telnet/send/service/disruption';
    const url = this.baseUrl + path;
    console.log(url);
    return this.http.get(url, {responseType: 'json'});
  }

  getTrafficDisruption() {
    const path = '/telnet/traffic/disruption';
    const url = this.baseUrl + path;
    console.log(url);
    return this.http.get(url, {responseType: 'json'});
  }

  getThroughput(){
    const path = '/telnet/throughput';
    const url = this.baseUrl + path;
    console.log(url);
    return this.http.get(url, {responseType: 'json'});
  }

  getFrameLoss(){
    const path = '/telnet/frame/loss';
    const url = this.baseUrl + path;
    console.log(url);
    return this.http.get(url, {responseType: 'json'});
  }


}
