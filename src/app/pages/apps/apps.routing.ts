import { Routes } from '@angular/router';

import { AppChatComponent } from './chat/chat.component';

import { AppPermissionComponent } from './permission/permission.component';



import { AuthGuard } from '../authentication/_auth/auth.guard';
export const AppsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'chat',
        component: AppChatComponent,
        data: {
          title: 'Chat',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Chat' },
          ],
        },
      },
      
      
      {
        path: 'permission',
        component: AppPermissionComponent,
        data: {
          title: 'Roll Base Access',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Roll Base Access' },
          ],
        },
      },
     
     
      
    ],
  },
];
