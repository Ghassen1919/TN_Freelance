import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';

import { NgxPaginationModule } from 'ngx-pagination';
import { NgScrollbarModule } from 'ngx-scrollbar';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

import { AddManagerDialogContentComponent, ManagerComponent } from './manager/manager.component';

import { AppAddManagerComponent } from './manager/add/add.component';

import { DatatablesRoutes } from './datatable.routing';
import { MatNativeDateModule } from '@angular/material/core';
import { SuperAdminComponent } from './super-admin/super-admin.component';
import {  SuperAdminDialogContentComponent } from './super-admin/super-admin.component';
import { AddComponent } from './super-admin/add/add.component';
import { AddClubComponent } from './club/add-club/add-club.component';
import { AddClubDialogContentComponent, ClubComponent, GetCandidatureDialogContentComponent, UpdateClubDialogContentComponent } from './club/club.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { UpdatepassComponent } from './updatepass/updatepass.component';
import { RoleComponent } from './role/role.component';
import { AdroleComponent } from './role/adrole/adrole.component';


import { UpdateclubComponent } from './club/updateclub/updateclub.component';

import { ALLusersbyclubComponent, CoachsDialogContentComponent, PlayersDialogContentComponent, ShowUserDetailsDialogContentComponent, UsersInClubDialogContentComponent } from './allusersbyclub/allusersbyclub.component';
import { AddPlayerComponent } from './allusersbyclub/add-player/add-player.component';



import {  AddRessourceDialogContentComponent, GetAverageDialogContentComponent, RessourcesComponent } from './ressources/ressources.component';

import { AddCandidatureDialogContentComponent, DesciplineComponent } from './descipline/descipline.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(DatatablesRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule.pick(TablerIcons),
    NgxPaginationModule,
    MatNativeDateModule,
    NgScrollbarModule,
    MatDatepickerModule,
  MatNativeDateModule,
  FormsModule
  ],
  exports: [TablerIconsModule],
  declarations: [
    ManagerComponent,
    AddManagerDialogContentComponent,
    AppAddManagerComponent,
    SuperAdminComponent,
    AddComponent,
    SuperAdminDialogContentComponent,
    AddClubComponent,
    ClubComponent,
    AddClubDialogContentComponent,
    UpdateClubDialogContentComponent,
    UpdatepassComponent,
    RoleComponent,
    GetCandidatureDialogContentComponent,
    AdroleComponent,
   DesciplineComponent,
   AddCandidatureDialogContentComponent ,
   UpdateclubComponent,
   DesciplineComponent,
   ALLusersbyclubComponent,
   PlayersDialogContentComponent,
   AddPlayerComponent,
   CoachsDialogContentComponent,
   UsersInClubDialogContentComponent,
  
   
   
   
  
   
   RessourcesComponent,
   AddRessourceDialogContentComponent,
   GetAverageDialogContentComponent

  ],
  providers: [DatePipe],
})
export class DatatableModule {}
