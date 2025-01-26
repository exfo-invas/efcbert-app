import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Button} from "primeng/button";
import {Card} from "primeng/card";
import {FormsModule} from "@angular/forms";
import {InputText} from "primeng/inputtext";
import {NgIf} from "@angular/common";
import {LoginModel} from "./login.model";

@Component({
  selector: 'app-login-page',
    imports: [
        Button,
        Card,
        FormsModule,
        InputText,
        NgIf
    ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {

  @Input() connStatus: boolean;
  @Output() connStatusChange: EventEmitter<LoginModel> = new EventEmitter<LoginModel>();

  ipaddress: string;
  port: string;

  getConnection() {
    this.connStatusChange.emit({ipaddress: this.ipaddress, port: this.port});
  }
}
