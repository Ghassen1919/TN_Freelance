import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { HttpClient } from '@angular/common/http';

interface TopCard {
  id: number;
  img: string;
  color: string;
  title: string;
  subtitle: string | undefined;
}
@Component({
  selector: 'app-app-top-cards',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './app-top-cards.component.html',
  styleUrl: './app-top-cards.component.scss'
})
export class AppTopCardsComponent implements OnInit {
  nbPlayers: number | undefined;
  nbCoachs: number | undefined;
  nbUsers: number | undefined;
  nbTeams: number | undefined;
  topcards: TopCard[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<number>('http://localhost:8085/nbplayersbyclub').subscribe(
      data => {
        this.nbPlayers = data;
        this.initializeTopCards();
      },
      error => {
        console.log('Error occurred while fetching nbManagers: ', error);
      }
    );

    this.http.get<number>('http://localhost:8085/nbcoachsbyclub').subscribe(
      data => {
        this.nbCoachs = data;
        this.initializeTopCards();
      },
      error => {
        console.log('Error occurred while fetching nbadmins: ', error);
      }
    );

    this.http.get<number>('http://localhost:8085/nbusersbyclub').subscribe(
      data => {
        this.nbUsers = data;
        this.initializeTopCards();
      },
      error => {
        console.log('Error occurred while fetching nbclubs: ', error);
      }
    );
    this.http.get<number>('http://localhost:8085/nbteamsbyclub').subscribe(
      data => {
        this.nbTeams = data;
        this.initializeTopCards();
      },
      error => {
        console.log('Error occurred while fetching nbclubs: ', error);
      }
    );
  }

  initializeTopCards(): void {
    if (this.nbPlayers !== undefined && this.nbCoachs !== undefined && this.nbTeams !== undefined  && this.nbUsers !== undefined) {
      this.topcards = [
        {
          id: 1,
          color: 'primary',
          img: '/assets/images/svgs/icon-user-male.svg',
          title: 'Players',
          subtitle: this.nbPlayers.toString(),
        },
        {
          id: 2,
          color: 'warning',
          img: '/assets/images/svgs/icon-briefcase.svg',
          title: 'Teams',
          subtitle: this.nbTeams.toString(),
        },
        {
          id: 3,
          color: 'accent',
          img: '/assets/images/svgs/icon-user-male.svg',
          title: 'Coachs',
          subtitle: this.nbCoachs.toString(),
        },
        {
          id: 3,
          color: 'error',
          img: '/assets/images/svgs/icon-user-male.svg',
          title: 'All members',
          subtitle: this.nbUsers.toString(),
        },
      ];
    }
  }
}