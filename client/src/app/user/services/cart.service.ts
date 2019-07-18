import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Cart } from '../../shared/models/Cart';
import { cartCreateURL, cartUpdateURL, cartDeleteURL, cartsGetURL } from '../../shared/app-config/URLs';
import { handleError } from '../../shared/functions/handle-http-error';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  	providedIn: 'root'
})
export class CartService {

	cartCreateURL: 	string = cartCreateURL;
	cartUpdateURL: 	string = cartUpdateURL;
	cartsGetURL: 	string = cartsGetURL;
	cartDeleteURL: 	string = cartDeleteURL;

	/**
	 * Creates an instance of cart service.
	 * @param http 
	 */
	constructor(
	  	private http: HttpClient
	) { }
	









	/**
	 * Creates cart server side
	 * @param cart 
	 * @returns cart$ 
	 */
	createCartServer(cart: Cart): Observable<Cart> {
		console.log(`cartService => trying to getCartsServer : `, cart);

		return this.http.post<Cart>(this.cartCreateURL, cart, httpOptions).pipe(
			tap((cart: Cart) => console.log(`cartService => created cart = `, cart)),
			catchError(handleError(`cartService => cart not created`, null))
		);
	}











	/**
	 * Gets carts server side
	 * @returns carts$ 
	 */
	getCartsServer(): Observable<Cart[]> {
		console.log(`cartService => trying to getCartsServer`);

		return this.http.get<Cart[]>(this.cartsGetURL).pipe(
			tap((carts: Cart[]) => console.log(`cartService => fetched carts = `, carts)),
			catchError(handleError(`cartService => error in fetching carts`, null))
		);
	}












	/**
	 * Updates cart server side
	 * @param cart 
	 * @returns cart$
	 */
	updateCartServer(cart: Cart): Observable<Cart> {
		console.log(`cartService => trying to updateCartServer : `, cart);

		return this.http.put<Cart>(this.cartUpdateURL, cart, httpOptions).pipe(
			tap((cart: Cart) => console.log(`cartService => updated cart = `, cart)),
			catchError(handleError(`cartService => cart not updated`, null))
		);
	}










	/**
	 * Deletes cart server side
	 * @param cart 
	 * @returns cart$
	 */
	deleteCartServer(cart: Cart | number): Observable<Cart> {
		console.log(`cartService => trying to deleteCartServer : `, cart);

		// append the id to the url
		const id = typeof cart === 'number' ? cart : cart.id;
		const url = `${this.cartDeleteURL}/${id}`;

		return this.http.delete<Cart>(url, httpOptions).pipe(
			tap((cart: Cart) => console.log(`cartService => deleted cart = `, cart)),
			catchError(handleError(`cartService => cart not deleted`, null))
		);
	}

	
	









	

	/**
	 * CartComponent <=> CartFormComponent
	 */
	cartSelected: Cart[] = []; // list of carts that are selected be carted
	
	setCartSelected(cartSelected: Cart[]): void {
		this.cartSelected = cartSelected;
	}

	getCartSelected(): Cart[]{
		return this.cartSelected;
	}

}
