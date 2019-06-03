import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router/src/utils/preactivation';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from '../services/token.service';

@Injectable({
  	providedIn: 'root'
})

export class AfterLoginGuard implements CanActivate {

	path: ActivatedRouteSnapshot[];
	route: ActivatedRouteSnapshot;
	
	/**
	 * Creates an instance of after login guard 
	 * @param _tokenService 
	 * @param router 
	 */
	constructor(
		private router: Router,
		private _tokenService: TokenService
	) { }
	
	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
		boolean | Observable<boolean> | Promise<boolean>  {

		// if the user's token is valid
		if(this._tokenService.isTokenValid()) {
			return true;
		}

		this.router.navigateByUrl('/home');
		return false;
	}

}
