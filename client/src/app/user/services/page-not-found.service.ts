import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Injectable({
  	providedIn: 'root'
})
export class PageNotFoundService {

	// the page that will redirect us to page-not-found
	page: string = 'Page';

	// url of the page that redirect us to page-not-found
	private previousUrl: string = undefined;
	private currentUrl: string = undefined;
	

	/**
	 * Creates an instance of page not found service.
	 * @param router 
	 */
	constructor(private router : Router) {
		this.currentUrl = this.router.url;
		router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {        
				this.previousUrl = this.currentUrl;
				this.currentUrl = event.url;
			};
		});
	}







	

	/**
	 * Gets previous url
	 * @returns previous url 
	 */
	public getPreviousUrl(): string{
	  	return this.previousUrl;
	}    
	
	/**
	 * Sets page
	 * @param page 
	 */
	setPage(page: string): void{
		this.page = page;
	}

	/**
	 * Gets page
	 * @returns page 
	 */
	getPage(): string{
		return this.page;
	}

	
	/**
	 * Shows page not found
	 * @param page 
	 */
	showPageNotFound(page: string): void{
		this.setPage(page);

		this.router.navigateByUrl('/page-not-found');
	}


}
