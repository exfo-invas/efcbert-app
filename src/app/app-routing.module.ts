import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {EventComponent} from "./event/event.component";
import {LoggingComponent} from "./logging/logging.component";

const routes: Routes = [
  {
    path: '', redirectTo: '/home', pathMatch: 'full'
  },
  {
    path: 'home', component: DashboardComponent
  },
  {
    path: 'event', component: EventComponent
  },
  {
    path: 'logging', component: LoggingComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    canceledNavigationResolution: 'computed',
    paramsInheritanceStrategy: 'always',
   /* titleStrategy: 'default',*/
    urlUpdateStrategy: 'deferred',
    /*urlHandlingStrategy: 'default',*/
    /*malformedUriErrorHandler: (error: URIError, urlSerializer: any, url: string) => {
      console.error('Malformed URI:', url);
      return urlSerializer.parse('/');
    }*/
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
