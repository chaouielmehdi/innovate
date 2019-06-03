import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BeforeLoginGuard } from './guards/before-login.guard';
import { AfterLoginGuard } from './guards/after-login.guard';
import { AdminComponent } from './admin.component';
import { LoginComponent } from './components/login/login.component';
import { ClientsComponent } from './components/clients/clients.component';
import { CommercialsComponent } from './components/commercials/commercials.component';
import { ProductsComponent } from './components/products/products.component';
import { SettingsComponent } from './components/settings/settings.component';

const routes: Routes = [
	{
		path: 'admin',
		component: AdminComponent,
		children: [
			{
				path: '',
				redirectTo: '/admin/login',
				pathMatch: 'full',
				canActivate: [BeforeLoginGuard]
			},
			{
				path: 'login',
				component: LoginComponent,
				canActivate: [BeforeLoginGuard]
			},
			{
				path: 'dashboard',
				component: DashboardComponent,
				canActivate: [AfterLoginGuard]
			},
			{
				path: 'settings',
				component: SettingsComponent,
				canActivate: [AfterLoginGuard]
			},
			{
				path: 'commercials',
				component: CommercialsComponent,
				canActivate: [AfterLoginGuard]
			},
			{
				path: 'clients',
				component: ClientsComponent,
				canActivate: [AfterLoginGuard]
			},
			{
				path: 'products',
				component: ProductsComponent,
				canActivate: [AfterLoginGuard]
			},
			{
				path: '**',
				redirectTo: '/admin/login',
			}
		]
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
