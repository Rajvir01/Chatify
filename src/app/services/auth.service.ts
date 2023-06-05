import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth, User, } from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { Firestore, collection, getDocs, query, where } from '@angular/fire/firestore';
// import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {

  user: BehaviorSubject<any> = new BehaviorSubject<any>(null)

  constructor(
    private router: Router, 
    private auth: Auth,
    private db: Firestore
  ) { 
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        console.log(user);
        this.getCurrentUserDocument(user);
        
      } else {
        this.router.navigate(['/signin'])
        
      }
    })
  }

  canActivate(): Observable<boolean> | Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.auth.onAuthStateChanged((user) => {
        if (user) {
          console.log(user);
          this.getCurrentUserDocument(user);
            resolve(true)
        } else {
            this.router.navigate(['/signin'])
          resolve(false);
        }
      })
    })
  }

  async getCurrentUserDocument(user: User) {
    let resp = await getDocs(query(collection(this.db, "users"), where("authId", "==", user.uid)));
    if(resp.size === 0) {
      this.auth.signOut();
      alert("No User Record Found");
    } else {
      this.user.next(resp.docs.map(e => ({ ...e.data() }))[0]);
    }
    console.log(">>> User Docs ", resp.docs.map(e => e.data()));
  }
}
