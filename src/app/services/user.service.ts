import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user: any; // Adjust the type of user object as per your application

  constructor() {}

  setUser(user: any) {
    this.user = user;
  }

  getUser() {
    return this.user;
  }
}
