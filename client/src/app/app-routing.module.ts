import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BeforeLoginGuard } from './user/guards/before-login.guard';

const routes: Routes = [
	{
		path: '',
		redirectTo: '/home',
		pathMatch: 'full',
		canActivate: [BeforeLoginGuard]
	},
	{
		path: '**',
		redirectTo: '/page-not-found',
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})

export class AppRoutingModule { }
