import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username: string = '';
  password: string = '';

  async signIn(username: string, password: string) {
    try {
      console.log(username);
    } catch (error) {
      console.log('Error signing in:', error);
      // Optionally, handle error scenario
    }
  }

  onSignInButtonClicked(username: string, password: string) {
    this.signIn(username, password);
  }

}
