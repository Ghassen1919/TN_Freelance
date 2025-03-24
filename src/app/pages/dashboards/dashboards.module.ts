import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DashboardsRoutes } from './dashboards.routing';

import { AppDashboard1Component } from './dashboard1/dashboard1.component';
import { AppDashboard2Component } from './dashboard2/dashboard2.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  imports: [
    RouterModule.forChild(DashboardsRoutes),
    AppDashboard1Component,
    AppDashboard2Component,
    HomeComponent,
  ],
})
export class DashboardsModule {}
