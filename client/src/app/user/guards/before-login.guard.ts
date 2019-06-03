import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router/src/utils/preactivation';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from '../services/token.service';

@Injectable({
  	providedIn: 'root'
})
export class BeforeLoginGuard implements CanActivate {
	path: ActivatedRouteSnapshot[];
	route: ActivatedRouteSnapshot;

	/**
	 * Creates an instance of before login guard.
	 * @param _tokenService 
	 * @param router 
	 */
	constructor(
		private router: Router,
		private _tokenService: TokenService
	) { }


	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
		boolean | Observable<boolean> | Promise<boolean>  {
	
		if(!this._tokenService.isTokenValid()) {
			return true;
		}

		this.router.navigateByUrl('/dashboard');
		return false;
	}

}
