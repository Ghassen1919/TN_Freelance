import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  constructor() {}

  public setRoles(roles: string) {
    localStorage.setItem('role', roles);
  }

  public getRole(): string | null {
    const role = localStorage.getItem('role');
    return role ? (role as string) : null;
  }

  public setToken(jwtToken: string) {
    localStorage.setItem('access_token', jwtToken);
  }

  public getToken(): string | null {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        return token;
      } else {
        throw new Error('JWT token not found in localStorage.');
      }
    } catch (error) {
      // You can log the error or handle it in some other way (e.g., returning a default value)
      console.error('Error getting JWT token:', error);
      return null;
    }
  }

  public clear() {
    localStorage.clear();
  }

  public isLoggedIn() {
    return this.getRole() && this.getToken();
  }
  public setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Method to retrieve user data from local storage
  public getUser(): any | null {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  }
  
}
