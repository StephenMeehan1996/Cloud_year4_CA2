import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  
    constructor(private afAuth: AngularFireAuth) { }




    

    signUp(email: string, password: string) {
      this.afAuth.createUserWithEmailAndPassword(email, password)
        .then(() => {
          // Sign up successful
        })
        .catch((error) => {
          // An error occurred
        });
    }

   async  login(email: string, password: string): Promise<any> {
      try {
        const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
        return userCredential.user; // Return the user object from UserCredential
      } catch (error) {
        throw error; // Propagate the error if login fails
      }
    }


    logout() {
      this.afAuth.signOut()
        .then(() => {
          // Logout successful
        })
        .catch((error) => {
          // An error occurred
        });

      
    }
    
    isAuthenticated(): boolean {
      return this.afAuth.currentUser !== null;
    }
}
