import { Component, inject, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { addDoc, collection, doc, Firestore, setDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup = new FormGroup({});
  private auth: Auth = inject(Auth);
  submitted: boolean = false;
  
  constructor(
    private router: Router, 
    private fb: FormBuilder, 
    private db: Firestore) { }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    })
  }

  onSubmit() {
    const data = {
      userId: doc(collection(this.db, "users")).id,
      username: this.signupForm.value.username,
      email: this.signupForm.value.email
    }
    ;
    createUserWithEmailAndPassword(this.auth, this.signupForm.value.email, this.signupForm.value.password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        setDoc(doc(this.db, "users", data.userId), { ...data, authId: user.uid })
        console.log("signed in");
        alert('Registration Successful!')
      })
      .catch((error) => {
        console.log(error)
        const errorCode = error.code;
        const errorMessage = error.message;
      });
      // this.router.navigate(['/signin']);
  }
}
