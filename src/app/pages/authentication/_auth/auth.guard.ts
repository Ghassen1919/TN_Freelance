import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UserAuthService } from '../../../services/user-auth.service';
import { UserService } from '../../../services/user.service';


@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private userAuthService: UserAuthService,
    private router: Router,
    private userService: UserService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const token = this.userAuthService.getToken();
  
    if (token !== null) {
      const allowedRoles = route.data['roles'] as Array<string>; // Updated to 'roles'
      const userRole = this.userAuthService.getRole(); // Get the user's role as a string
  
      if (userRole && allowedRoles && allowedRoles.includes(userRole)) {
        return true;
      } else {
        this.router.navigate(['/forbidden']);
        return false;
      }
    }
  
    this.router.navigate(['/login']);
    return false;
  }
  
}
