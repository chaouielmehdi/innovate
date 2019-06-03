import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgZorroAntdModule, NZ_I18N, en_US, NZ_MESSAGE_CONFIG } from 'ng-zorro-antd';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { InterceptorService } from './user/services/interceptor.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
registerLocaleData(en);

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		
		// sub-modules :
		AdminModule,
		UserModule,

		// needed modules :
		AppRoutingModule,
		NgZorroAntdModule,
		FormsModule,
		HttpClientModule,
		BrowserAnimationsModule,
		ReactiveFormsModule
	],
	providers: [
		{
			provide: NZ_I18N, useValue: en_US
		},
		{
			provide: NZ_MESSAGE_CONFIG, useValue: { nzTop: 60 }
		}
	],
	bootstrap: [ AppComponent ]
})
export class AppModule { }
