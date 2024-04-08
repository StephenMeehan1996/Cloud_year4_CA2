import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private user: UserService, private router: Router) {}

  canActivate(): boolean {
    if (this.user.getUser() != null) {
      return true; // User is authenticated, allow access to the route
    } else {
      this.router.navigate(['/login']); // User is not authenticated, redirect to login page
      return false;
    }
  }
}