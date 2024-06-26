import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user: any; // Adjust the type of user object as per your application
  private id : any

  constructor() {}

  setUser(user: any) {
    this.user = user;
    console.log(this.user);
  }

  getUser() {
    return this.user;
  }


  setID(id: any){
    this.id=id
  }

  getID(){
    return this.id
  }
}
