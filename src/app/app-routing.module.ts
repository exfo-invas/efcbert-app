import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";

const routes: Routes = [
  {
    path: 'home', component: DashboardComponent
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
