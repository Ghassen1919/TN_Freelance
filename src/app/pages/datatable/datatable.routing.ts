import { Routes } from '@angular/router';

import { ManagerComponent } from './manager/manager.component';
import { SuperAdminComponent } from './super-admin/super-admin.component';
import { ClubComponent } from './club/club.component';
import { UpdatepassComponent } from './updatepass/updatepass.component';
import { RoleComponent } from './role/role.component';
import { DesciplineComponent } from './descipline/descipline.component';
import { AuthGuard } from '../authentication/_auth/auth.guard';
import { ALLusersbyclubComponent } from './allusersbyclub/allusersbyclub.component';

import { RessourcesComponent } from './ressources/ressources.component';

export const DatatablesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'users',
       
        component: ManagerComponent,
        data: {
          title: 'Users',
          urls: [
            { title: 'Home', url: 'dashboards/dashboard1' },
            { title: 'Users' },
          ],
          
        },
      },
      {
        path: 'reviews',
        canActivate: [AuthGuard],
        component: SuperAdminComponent,
        data: {
          title: 'reviews',
          urls: [
            { title: 'Home', url: 'dashboards/dashboard1' },
            { title: 'reviews' },
          ],
          roles: 'ROLE_FREELANCER'  
        },
      },
      {
        path: 'alltasksbyclient',
        canActivate: [AuthGuard],
        component: ClubComponent,
        data: {
          title: 'Alltasksbyclient',
          urls: [
            { title: 'Home', url: 'dashboards/dashboard1' },
            { title: 'Alltasksbyclient' },
          ],
          roles: 'ROLE_CLIENT'  
        },
      },
      {
        path: 'updatepassword',
        component: UpdatepassComponent,
        data: {
          title: 'Account Settings',
          
        },
        
      },
      
      {
        path: 'freelancertasks',
        canActivate: [AuthGuard],
        component: RoleComponent,
        data: {
          title: 'freelancertasks',
          urls: [
            { title: 'Home', url: 'dashboards/dashboard2' },
            { title: 'freelancertasks' },
          ],
          roles: 'ROLE_FREELANCER'  
        },
      },
      {
        path: 'alltasks',
        canActivate: [AuthGuard],
        component: DesciplineComponent,
        data: {
          title: 'alltasks',
          urls: [
            { title: 'Home', url: 'dashboards/dashboard1' },
            { title: 'alltasks' },
          ],
          roles: 'ROLE_FREELANCER'  
        },
      },
      
      
      
      {
        path: 'usersByClub',
        canActivate: [AuthGuard],
        component: ALLusersbyclubComponent,
        data: {
          title: 'Users by club',
          urls: [
            { title: 'Home', url: 'dashboards/dashboard2' },
            { title: 'Users' },
          ],
          permissions: ['view event']  
        },
      },
      
      {
        path: 'review',
        canActivate: [AuthGuard],
        component: RessourcesComponent,
        data: {
          title: 'review',
          urls: [
            { title: 'Home', url: 'dashboards/dashboard2' },
            { title: 'review' },
          ],
          roles: 'ROLE_CLIENT'  
        },
      },
    ],
  },
];
