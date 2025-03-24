import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserAuthService } from './user-auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class UserService {
  PATH_OF_API = 'http://localhost:8082/api';
  private baseUrl = 'http://localhost:8082/api'; 
  requestHeader = new HttpHeaders({ 'No-Auth': 'True' });
  constructor(
    private httpclient: HttpClient,
    private userAuthService: UserAuthService
  ) {}

  currentUser: any;

  setUserData(data: any) {
    this.currentUser = data;
  }

  getUserData() {
    return this.currentUser;
  }


  public login(loginData: any) {
    return this.httpclient.post(this.PATH_OF_API + '/user/login', loginData, {
      headers: this.requestHeader,
    });
  }
  public register(user: any): Observable<any> {
    return this.httpclient.post(this.PATH_OF_API + '/user/register', user);
  }
  public roleMatch(allowedRoles: string | string[]): boolean {
    const userRole: string | null = this.userAuthService.getRole(); // Get the role
  
    if (!userRole) {
      return false; // Return false if role is null or empty
    }
  
    // If allowedRoles is an array, check if it includes the user's role
    if (Array.isArray(allowedRoles)) {
      return allowedRoles.includes(userRole);
    }
  
    // If allowedRoles is a single string, compare directly
    return allowedRoles === userRole;
  }
  
  
  
  getUsers () : Observable<any[]>{
    return this.httpclient.get<any[]>("http://localhost:8082/api/user").pipe(
      map((list: any[]) => list.reverse())
    );
  }
  getReviews(clientId: number): Observable<any[]> {
    
  
    return this.httpclient.get<any[]>(`http://localhost:8085/api/reviews/${clientId}`).pipe(
      map((tasks: any[]) => tasks.reverse()) // Reverse list if needed
    );
  }
  getUserById(clientId: number): Observable<any> {
    
  
    return this.httpclient.get<any>(`http://localhost:8082/api/user/${clientId}`);
  }
  getallfreelancer () : Observable<any[]>{
    return this.httpclient.get<any[]>("http://localhost:8082/api/user/allfreelancer").pipe(
      map((list: any[]) => list.reverse())
    );
  }
  getUsersByClub () : Observable<string[]>{
    return this.httpclient.get<string[]>("http://localhost:8085/afficherusersbyclub").pipe(
      map((list: string[]) => list.reverse())
    );
  }
  getUsersByTeam (idTeam:number) : Observable<string[]>{
    return this.httpclient.get<string[]>(`http://localhost:8085/afficherusersbyTeam?id=${idTeam}`).pipe(
      map((list: string[]) => list.reverse())
    );
  }
  getUsersByTeamAndRole (idTeam:number,idRole:number) : Observable<string[]>{
    return this.httpclient.get<string[]>(`http://localhost:8085/afficherusersbyTeamAndRole?idTeam=${idTeam}&idRole=${idRole}`).pipe(

      map((list: string[]) => list.reverse())
    );
  }
  getUsersByRole (idRole:number) : Observable<string[]>{
    return this.httpclient.get<string[]>(`http://localhost:8085/afficherusersbyRole?id=${idRole}`).pipe(
      map((list: string[]) => list.reverse())
    );
  }
  getUsersByRoleAndClub (idRole:number) : Observable<string[]>{
    return this.httpclient.get<string[]>(`http://localhost:8085/afficherusersbyRoleandClub?id=${idRole}`).pipe(
      map((list: string[]) => list.reverse())
    );
  }
  
  getManagersNotAffected () : Observable<string[]>{
    return this.httpclient.get<string[]>("http://localhost:8085/afficherManagersnotaffected").pipe(
      map((list: string[]) => list.reverse())
    );
  }
  getSuperAdmins () : Observable<string[]>{
    return this.httpclient.get<string[]>("http://localhost:8085/afficherSuperAdmins").pipe(
      map((list: string[]) => list.reverse())
    );
  }
  
  reloadOnce() {
    if (!localStorage.getItem('hasReloaded')) {
      localStorage.setItem('hasReloaded', 'true');
      window.location.reload();
    }
  }
}
