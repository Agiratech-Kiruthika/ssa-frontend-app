import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLoginComponent } from './features/unrestricted-features/user-login/user-login.component';
import { ResetPasswordComponent } from './features/unrestricted-features/reset-password/reset-password.component';
import { UserSignupComponent } from './features/unrestricted-features/user-signup/user-signup.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login', 
  },
  {
    path: 'login',
    component: UserLoginComponent, 
  },
  {
    path: 'forgot-password',
    component: ResetPasswordComponent 
  },
  {
    path: 'sign-up',
    component:  UserSignupComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
