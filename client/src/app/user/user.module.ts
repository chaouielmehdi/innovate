import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SupportComponent } from './components/support/support.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CommandsComponent } from './components/commands/commands.component';
import { CommandDetailsComponent } from './components/command-details/command-details.component';
import { CartComponent } from './components/cart/cart.component';
import { CommandFormComponent } from './components/command-form/command-form.component';
import { CreditsComponent } from './components/credits/credits.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { ProfileFormComponent } from './components/profile-form/profile-form.component';
import { UserComponent } from './user.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { ProductsComponent } from './components/products/products.component';
import { ContactComponent } from './components/contact/contact.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { InterceptorService } from './services/interceptor.service';
import { ModalsComponent } from './components/modals/modals.component';
import { MenuComponent } from './components/drawers/menu/menu.component';
import { LoginComponent } from './components/drawers/login/login.component';
import { RecoverComponent } from './components/drawers/recover/recover.component';
import { RegisterComponent } from './components/drawers/register/register.component';

@NgModule({
	declarations: [
		UserComponent,
		HeaderComponent,
		FooterComponent,
		HomeComponent,
		ProductsComponent,
		ContactComponent,
		DashboardComponent,
		SupportComponent,
		RegisterFormComponent,
		ProductDetailsComponent,
		CommandsComponent,
		CommandDetailsComponent,
		CommandFormComponent,
		CartComponent,
		CreditsComponent,
		ProfileFormComponent,
		PageNotFoundComponent,
		ModalsComponent,
		MenuComponent,
		LoginComponent,
		RecoverComponent,
		RegisterComponent
	],
	imports: [
		CommonModule,
		UserRoutingModule,
		NgZorroAntdModule,
		FormsModule,
		HttpClientModule,
		BrowserAnimationsModule,
		ReactiveFormsModule
	],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: InterceptorService,
			multi: true
		}
	]
})
export class UserModule { }
