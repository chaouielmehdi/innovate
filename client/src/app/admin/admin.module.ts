import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { DrawersComponent } from './components/drawers/drawers.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { AdminComponent } from './admin.component';
import { InterceptorService } from './services/interceptor.service';
import { ClientsComponent } from './components/clients/clients.component';
import { CommercialsComponent } from './components/commercials/commercials.component';
import { ProductsComponent } from './components/products/products.component';
import { SettingsComponent } from './components/settings/settings.component';

@NgModule({
	declarations: [
		AdminComponent,
		DashboardComponent,
		LoginComponent,
		DrawersComponent,
		FooterComponent,
		HeaderComponent,
		ClientsComponent,
		CommercialsComponent,
		ProductsComponent,
		SettingsComponent
	],
	imports: [
		CommonModule,
		AdminRoutingModule,
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
export class AdminModule { }
