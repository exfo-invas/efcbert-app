import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from "@angular/forms";
import {provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {DashboardComponent} from './dashboard/dashboard.component';
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {EventComponent} from "./event/event.component";
import {providePrimeNG} from "primeng/config";
import Material from "@primeng/themes/material";
import {InputText} from "primeng/inputtext";
import {Card} from "primeng/card";
import {TableModule} from "primeng/table";
import {Button} from "primeng/button";
import {Message} from "primeng/message";
import {Panel} from "primeng/panel";
import {Tooltip} from "primeng/tooltip";
import {Toast} from "primeng/toast";
import {ConfirmPopup} from "primeng/confirmpopup";
import {NgOptimizedImage} from "@angular/common";
import {LoginPageComponent} from "./shared/login-page/login-page.component";
import {ServerStatusComponent} from "./shared/server-status/server-status.component";
import {Rating} from "primeng/rating";
import {Tag} from "primeng/tag";
import {Divider} from "primeng/divider";
import {Menu} from "primeng/menu";
import {MegaMenu} from "primeng/megamenu";
import {Ripple} from "primeng/ripple";
import {Skeleton} from "primeng/skeleton";
import { TimerComponent } from "./shared/timer/timer.component";
import {TabPanel, TabView} from "primeng/tabview";
import {StyleClass} from "primeng/styleclass";
import {ProgressSpinner} from "primeng/progressspinner";

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    EventComponent
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    InputText,
    Card,
    TableModule,
    Button,
    Message,
    Panel,
    Tooltip,
    Toast,
    ConfirmPopup,
    NgOptimizedImage,
    LoginPageComponent,
    ServerStatusComponent,
    Rating,
    Tag,
    Divider,
    Menu,
    MegaMenu,
    Ripple,
    Skeleton,
    TimerComponent,
    TabView,
    TabPanel,
    StyleClass,
    ProgressSpinner
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimationsAsync(),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Material,
        options: {
          darkModeSelector: false
        }
      }
    })
  ]
})
export class AppModule {
}
