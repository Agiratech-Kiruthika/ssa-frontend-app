import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLoginComponent } from './features/unrestricted-features/user-login/user-login.component';
import { ResetPasswordComponent } from './features/unrestricted-features/reset-password/reset-password.component';
import { CreateAccountComponent } from './features/unrestricted-features/user-signup/user-signup.component';
import { CreatePostComponent } from './features/restricted-features/create-post/create-post.component';
import { AuthGuard } from './service/guards/auth.guard';
import { DashboardComponent } from './features/restricted-features/dashboard/dashboard.component';
import { HomeComponent } from './features/restricted-features/home/home.component';
import { FeedComponent } from './features/restricted-features/feed/feed.component';

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
    component: ResetPasswordComponent,
  },
  {
    path: 'sign-up',
    component: CreateAccountComponent,
  },
  {
    path: 'create-post',
    component: CreatePostComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '',
    component: DashboardComponent, 
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'feed', component: FeedComponent },
      { path: 'create', component: CreatePostComponent },
      { path: '', redirectTo: '/home', pathMatch: 'full' }, 
    ],
  },
  { path: '**', redirectTo: '/home' }, 

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
