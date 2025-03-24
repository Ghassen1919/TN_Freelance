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
  selector: 'app-top-cards',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './top-cards.component.html',
})
export class AppTopCardsComponent implements OnInit {
  nbManagers: number | undefined;
  nbadmins: number | undefined;
  nbclubs: number | undefined;
  topcards: TopCard[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<number>('http://localhost:8085/nbmanagers').subscribe(
      data => {
        this.nbManagers = data;
        this.initializeTopCards();
      },
      error => {
        console.log('Error occurred while fetching nbManagers: ', error);
      }
    );

    this.http.get<number>('http://localhost:8085/nbsuperadmins').subscribe(
      data => {
        this.nbadmins = data;
        this.initializeTopCards();
      },
      error => {
        console.log('Error occurred while fetching nbadmins: ', error);
      }
    );

    this.http.get<number>('http://localhost:8085/nbclubs').subscribe(
      data => {
        this.nbclubs = data;
        this.initializeTopCards();
      },
      error => {
        console.log('Error occurred while fetching nbclubs: ', error);
      }
    );
  }

  initializeTopCards(): void {
    if (this.nbManagers !== undefined && this.nbadmins !== undefined && this.nbclubs !== undefined) {
      this.topcards = [
        {
          id: 1,
          color: 'primary',
          img: '/assets/images/svgs/icon-user-male.svg',
          title: 'Managers',
          subtitle: this.nbManagers.toString(),
        },
        {
          id: 2,
          color: 'warning',
          img: '/assets/images/svgs/icon-briefcase.svg',
          title: 'Clubs',
          subtitle: this.nbclubs.toString(),
        },
        {
          id: 3,
          color: 'accent',
          img: '/assets/images/svgs/icon-user-male.svg',
          title: 'SuperAdmins',
          subtitle: this.nbadmins.toString(),
        },
      ];
    }
  }
}
