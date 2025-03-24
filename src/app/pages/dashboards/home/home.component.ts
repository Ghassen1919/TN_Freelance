import { Component, OnInit } from '@angular/core';

import { AppWelcomeCardComponent } from '../../../components/dashboard2/welcome-card/welcome-card.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AppWelcomeCardComponent ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
 
  
}
