import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { UserAuthService } from '../../../services/user-auth.service';

@Component({
  selector: 'app-welcome-card',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './welcome-card.component.html',
})
export class AppWelcomeCardComponent implements OnInit {
  data:any =[];
  currentUser: any;
  greeting: string = '';
  constructor(public userService: UserAuthService) {}
  ngOnInit(): void { 
    this.currentUser =this.userService.getUser();
   

 
  
    const now = new Date();
    const currentHour = now.getHours();

    // Set the greeting based on the time
    if (currentHour >= 5 && currentHour < 12) {
      this.greeting = 'Good Morning';
    } else if (currentHour >= 12 && currentHour < 17) {
      this.greeting = 'Good Afternoon';
    } else {
      this.greeting = 'Good Night';
    }
   

  }
  
}
