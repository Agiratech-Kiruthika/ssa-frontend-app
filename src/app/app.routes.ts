import { Routes } from '@angular/router';
import { UserLoginComponent } from './features/unrestricted-features/user-login/user-login.component';

export const routes: Routes = [
    {
		path: "",
		pathMatch: "full",
		redirectTo: "login"
	},

    {
		path: 'login',
		component: UserLoginComponent,
	},
];
