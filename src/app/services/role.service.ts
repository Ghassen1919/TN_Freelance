import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  PATH_OF_API = 'http://localhost:8085';
  constructor(private httpclient: HttpClient,) { }
  getRoles() : Observable<string[]>{
    return this.httpclient.get<string[]>(`http://localhost:8085/afficherroles`).pipe(
      map((list: string[]) => list.reverse())
    );
  }
  getPermissions () : Observable<string[]>{
    return this.httpclient.get<string[]>("http://localhost:8085/afficherpermissionsnotsuperadmin");
  }
  createNewRole(role: any, permissions: Set<any>): Observable<any> {
    return this.httpclient.post<any>(`http://localhost:8085/createNewRole?permissions=${permissions}`,role);
  }
  getRolesByclub () : Observable<string[]>{
    return this.httpclient.get<string[]>("http://localhost:8085/afficherrolesbyclub");
  }
}
