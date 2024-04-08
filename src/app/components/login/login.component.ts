import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private authService: AuthService,private router: Router, private userService: UserService) { }

  username: string = '';
  password: string = '';


  async login(email: string, password: string) {
    this.authService.login(email, password)
    .then((user: any) => {
      console.log(user);
      this.userService.setUser(user._delegate);
      // Redirect to '/home'
      this.router.navigate(['/home']);
    })
    .catch((error: any) => {
      console.error('Login failed:', error);
      
    });
  }

}
