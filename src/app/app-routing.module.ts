import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './pages/signin/signin.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ChatPageComponent } from './pages/chat-page/chat-page.component';
import { AuthService } from 'src/app/services/auth.service';
import { AddUserComponent } from './components/add-user/add-user.component';

const routes: Routes = [
  { path: 'chat-page', component: ChatPageComponent, canActivate: [AuthService]},
  { path: 'signin', component: SigninComponent},
  { path: 'signup', component: SignupComponent},
  { path: 'add', component: AddUserComponent},
  { path: "", redirectTo: "chat-page", pathMatch: "full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
