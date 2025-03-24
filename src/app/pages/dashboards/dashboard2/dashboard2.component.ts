import { Component, OnInit } from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from '../../../material.module';
// components
import { ClubService } from '../../../services/club.service';

import { CommonModule } from '@angular/common';
import { AppTopCardsComponent } from '../../../components/dashboard2/app-top-cards/app-top-cards.component';
@Component({
  selector: 'app-dashboard1',
  standalone: true,
  imports: [MaterialModule,
    TablerIconsModule,
    AppTopCardsComponent,
    CommonModule,
    
  ],
  templateUrl: './dashboard2.component.html',
})
export class AppDashboard2Component implements OnInit {
  data:any =[];
  currentUser: any;
  constructor(private clubService: ClubService) {}
  ngOnInit(): void {
    
    
        this.getClubsNow();
    
    
  }
  getClubsNow(): void {
   
    this.clubService.getClubByManager().subscribe(res => {
      this.data = res;
      
    });
  }
}
