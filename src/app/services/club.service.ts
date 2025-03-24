import { HttpClient, HttpParams ,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { Observable, map } from 'rxjs';
import { EventColor } from 'calendar-utils';
import { UserAuthService } from './user-auth.service';
export interface Event {
  eventId: number;
  eventName: string;
  description: string;
  dateEvent: string;
  type: string;
  users: any[];
  team: any;
  club: any;
}
@Injectable({
  providedIn: 'root'
})
export class ClubService {
  
  PATH_OF_API = 'http://localhost:8085';
  constructor(private httpclient: HttpClient, public userAuthService:UserAuthService) { }
  
  getAllTasks () : Observable<any[]>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.userAuthService.getToken()}` // Add token if required
    });
  

    return this.httpclient.get<any[]>("http://localhost:8084/api/tasks", { headers }).pipe(
      map((list: any[]) => list.reverse())
    );
  }
  getAllTasksByClient(clientId: number): Observable<any[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.userAuthService.getToken()}` // Ensure this method returns a valid token
    });
  
    return this.httpclient.get<any[]>(`http://localhost:8084/api/tasks/client/${clientId}`, { headers }).pipe(
      map((tasks: any[]) => tasks.reverse()) // Reverse list if needed
    );
  }
  getAllTasksByFreealancer(clientId: number): Observable<any[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.userAuthService.getToken()}` // Ensure this method returns a valid token
    });
  
    return this.httpclient.get<any[]>(`http://localhost:8084/api/tasks/freelancer/${clientId}`, { headers }).pipe(
      map((tasks: any[]) => tasks.reverse()) // Reverse list if needed
    );
  }
  public addTask(task: any): Observable<any> {
      return this.httpclient.post("http://localhost:8084/api/tasks", task);
    }
  getTeamsInClub () : Observable<string[]>{
    return this.httpclient.get<string[]>("http://localhost:8085/afficherTeamsByClub").pipe(
      map((list: string[]) => list.reverse())
    );
  }
  getEventsInClub () : Observable<string[]>{
    return this.httpclient.get<string[]>("http://localhost:8085/afficherEventsByClub").pipe(
      map((list: string[]) => list.reverse())
    );
  }
  getRessourcessInClub () : Observable<string[]>{
    return this.httpclient.get<string[]>("http://localhost:8085/afficherRessourceByClub").pipe(
      map((list: string[]) => list.reverse())
    );
  }
  getEvents(): Observable<CalendarEvent[]> {
    return this.httpclient.get<Event[]>("http://localhost:8085/afficherEventsByClub").pipe(
      map(events => events.map(event => this.transformEvent(event)))
    );
  }
  getEventsbyteam(idTeam:number): Observable<CalendarEvent[]> {
    return this.httpclient.get<Event[]>(`http://localhost:8085/affichereventsbyTeam?id=${idTeam}`).pipe(
      map(events => events.map(event => this.transformEvent(event)))
    );
  }
  getEventsbytype(idTeam:string): Observable<CalendarEvent[]> {
    return this.httpclient.get<Event[]>(`http://localhost:8085/affichereventsbyType?id=${idTeam}`).pipe(
      map(events => events.map(event => this.transformEvent(event)))
    );
  }
  getEventsbyteamandtype(idTeam:number,type:string): Observable<CalendarEvent[]> {
    return this.httpclient.get<Event[]>(`http://localhost:8085/affichereventsbyTypeandteam?id=${idTeam}&type=${type}`).pipe(
      map(events => events.map(event => this.transformEvent(event)))
    );
  }

  private transformEvent(event: Event): CalendarEvent {
    return {
      id: event.eventId,
      start: new Date(event.dateEvent),  // Assuming dateEvent is a string in ISO format
      end: new Date(event.dateEvent),  // Adjust if your event has a separate end date
      title: event.eventName,
      type: event.type,
      users: event.users,
      team: event.team,
      color: this.getEventColor(event.type),
      actions: [],  // Add actions if needed
      allDay: false,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true
    };
  }

  private getEventColor(type: string): EventColor {
    switch (type) {
      case 'RED':
        return { primary: '#fa896b', secondary: '#fdede8' };
      case 'BLUE':
        return { primary: '#5d87ff', secondary: '#ecf2ff' };
      case 'YELLOW':
        return { primary: '#ffae1f', secondary: '#fef5e5' };
      default:
        return { primary: '#1e90ff', secondary: '#d1e8ff' };  // Default color
    }
  }
  getDisciplines(): Observable<string[]> {
    return this.httpclient.get<string[]>(`http://localhost:8085/afficherDescipline`).pipe(
      map((list: string[]) => list.reverse())
    );
  }
  getClubByManager(): Observable<String[]> {
    return this.httpclient.get<any>(`http://localhost:8085/clubbymanager`);
  }
  addClub(clubData: any, username: string): Observable<any> {
    const url = `http://localhost:8085/createClub`;
    return this.httpclient.post(url, clubData, { params: { username } });
  }
  addDescipline(clubData: any,id : number): Observable<any> {
    const url = `http://localhost:8085/createDescipline`;
    return this.httpclient.post(url, clubData, { params: { id } });
  }
  getTeamById(id: number): Observable<any> {
    return this.httpclient.get<any>(`http://localhost:8085/afficherTeamsByid?id=${id}`);
  }
  modifierTeam(id: number, teamName: string, dateCreation: Date, description: string): Observable<void> {
    const params = new HttpParams()
      .set('teamName', teamName)
      .set('dateCreation', dateCreation.toISOString().split('T')[0])  // Convert Date to 'yyyy-MM-dd' format
      .set('description', description);

    return this.httpclient.put<void>(`http://localhost:8085/modifierTeam/${id}`, null, { params });
  }
  getTeamsbyDesciplineAndClub (idDes:number) : Observable<string[]>{
    return this.httpclient.get<string[]>(`http://localhost:8085/afficherteamsbyDesciplineAndClub?id=${idDes}`).pipe(
      map((list: string[]) => list.reverse())
    );
  }
  getEventsByTeam (idTeam:number) : Observable<string[]>{
    return this.httpclient.get<string[]>(`http://localhost:8085/affichereventsbyTeam?id=${idTeam}`).pipe(
      map((list: string[]) => list.reverse())
    );
  }
  getEventsByType (idTeam:string) : Observable<string[]>{
    return this.httpclient.get<string[]>(`http://localhost:8085/affichereventsbyType?id=${idTeam}`).pipe(
      map((list: string[]) => list.reverse())
    );
  }
  getEventsByTeamAndType (idTeam:number,type:string)  : Observable<string[]>{
    return this.httpclient.get<string[]>(`http://localhost:8085/affichereventsbyTypeandteam?id=${idTeam}&type=${type}`).pipe(

      map((list: string[]) => list.reverse())
    );
  }
}
