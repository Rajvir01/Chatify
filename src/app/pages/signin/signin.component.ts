import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, getAuth, signInWithEmailAndPassword } from "@angular/fire/auth";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  signinForm: FormGroup = new FormGroup({});


  constructor(private router: Router,
     private fb: FormBuilder,
      private auth: Auth,
      private db: Firestore,
      private renderer: Renderer2) { }

  ngOnInit(): void {
    this.renderer.setStyle(document.body, 'background-image', 'url(your-image-url.jpg)');
    this.renderer.setStyle(document.body, 'background-size', 'cover');
    this.renderer.setStyle(document.body, 'background-position', 'center');
    this.signinForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  get email() { return this.signinForm.get('email'); }
  get password() { return this.signinForm.get('password'); }

  onSubmit() {

    if (this.signinForm.valid) {
      signInWithEmailAndPassword(this.auth, this.signinForm.value.email, this.signinForm.value.password)
        .then(async (userCredential) => {
          // Signed in 
          console.log("oh yea")
          const user = userCredential.user;

          this.router.navigate(['/chat-page'])
          // ...
        })
        .catch((error) => {
          console.log("na bro")
          console.log(error.code);
          
          const errorCode = error.code;
          const errorMessage = error.message;
        });
    }
  }

}
