import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CommandsComponent } from './components/commands/commands.component';
import { CommandDetailsComponent } from './components/command-details/command-details.component';
import { CommandReportComponent } from './components/command-report/command-report.component';
import { CommandFormComponent } from './components/command-form/command-form.component';
import { CartComponent } from './components/cart/cart.component';
import { CreditsComponent } from './components/credits/credits.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { SupportComponent } from './components/support/support.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { ProfileFormComponent } from './components/profile-form/profile-form.component';
import { BeforeLoginGuard } from './guards/before-login.guard';
import { HomeComponent } from './components/home/home.component';
import { ProductsComponent } from './components/products/products.component';
import { ContactComponent } from './components/contact/contact.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AfterLoginGuard } from './guards/after-login.guard';
import { UserComponent } from './user.component';

const routes: Routes = [
	{
		path: '',
		component: UserComponent,
		children: [
			{
				path: '',
				redirectTo: '/home',
				pathMatch: 'full',
				canActivate: [BeforeLoginGuard]
			},
			{
				path: 'home',
				component: HomeComponent,
				canActivate: [BeforeLoginGuard]
			},
			{
				path: 'page-not-found',
				component: PageNotFoundComponent
			},
			{
				path: 'products',
				component: ProductsComponent
			},
			{
				path: 'contact',
				component: ContactComponent,
				canActivate: [BeforeLoginGuard]
			},
			{
				path: 'dashboard',
				component: DashboardComponent,
				canActivate: [AfterLoginGuard]
			},
			{
				path: 'dashboard/commands',
				component: CommandsComponent,
				canActivate: [AfterLoginGuard]
			},
			{
				path: 'dashboard/command-details/:id',
				component: CommandDetailsComponent,
				canActivate: [AfterLoginGuard]
			},
			{
				path: 'dashboard/command-report/:id',
				component: CommandReportComponent,
				canActivate: [AfterLoginGuard]
			},
			{
				path: 'dashboard/command-form',
				component: CommandFormComponent,
				canActivate: [AfterLoginGuard]
			},
			{
				path: 'dashboard/cart',
				component: CartComponent,
				// canActivate: [AfterLoginGuard]
				canActivate: [BeforeLoginGuard]
			},
			{
				path: 'dashboard/credits',
				component: CreditsComponent,
				canActivate: [AfterLoginGuard]
			},
			{
				path: 'products/product-details/:id',
				component: ProductDetailsComponent,
				canActivate: [AfterLoginGuard]
			},
			{
				path: 'support',
				component: SupportComponent,
				canActivate: [AfterLoginGuard]
			},
			{
				path: 'register-form',
				component: RegisterFormComponent
			},
			{
				path: 'profile-form',
				component: ProfileFormComponent,
				canActivate: [AfterLoginGuard]
			},
			{
				path: '**',
				redirectTo: '/home',
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class UserRoutingModule { }
