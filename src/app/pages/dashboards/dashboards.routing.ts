import { Routes } from '@angular/router';

// dashboards
import { AppDashboard1Component } from './dashboard1/dashboard1.component';
import { AppDashboard2Component } from './dashboard2/dashboard2.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from '../authentication/_auth/auth.guard';

export const DashboardsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dashboard1',
        canActivate: [AuthGuard],
        component: AppDashboard1Component,
        data: {
          title: 'Dashboard',
          urls: [
            { title: 'Dashboard', url: 'dashboards/dashboard1' },
            { title: 'Dashboard' },
          ],
          permissions: ['voir managers,creer,upadate,block']  
        }
      },
      {
        path: 'home',
        component: HomeComponent,
        data: {
          title: 'Home',
        }
      },
      {
        path: 'dashboard2',
        canActivate: [AuthGuard],
        component: AppDashboard2Component,
        data: {
          title: 'Dashboard',
          urls: [
            { title: 'Dashboard', url: 'dashboards/dashboard2' },
            { title: 'Dashboard' },
          ],
          permissions: ['voir manager']  
        }
      }
    ],
  },
];
