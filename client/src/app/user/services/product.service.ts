import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../shared/models/Product';
import { tap, catchError } from 'rxjs/operators';
import { getProductsUrl, createProductUrl, updateProductUrl, getProductUrl, deleteProductUrl, getBestProductsUrl } from '../../shared/app-config/URLs';
import { handleError } from '../../shared/functions/handle-http-error';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  	providedIn: 'root'
})
export class ProductService {
	
	createProductUrl: 	string = createProductUrl;
	updateProductUrl: 	string = updateProductUrl;
	getBestProductsUrl: string = getBestProductsUrl;
	getProductsUrl: 	string = getProductsUrl;
	getProductUrl: 		string = getProductUrl;
	deleteProductUrl: 	string = deleteProductUrl;

	/**
	 * 
	 * @param http 
	 */
	constructor(
	  	private http: HttpClient
	) { }
	









	

	/**
	 * Creates product server side
	 * @param product 
	 * @returns product$ 
	 */
	createProductServer(product: Product): Observable<Product> {
		console.log(`productService => trying to createProductServer : `, product);

		return this.http.post<Product>(this.createProductUrl, product, httpOptions).pipe(
			tap((product: Product) => console.log(`productService => created product = `, product)),
			catchError(handleError(`productService => product not created`, null))
		);
	}








	



	/**
	 * Gets best products server side
	 * @returns bestProducts$ 
	 */
	getBestProductsServer(): Observable<Product[]> {
		console.log(`productService => trying to getBestProductsServer`);

		return this.http.get<Product[]>(this.getBestProductsUrl).pipe(
			tap((products: Product[]) => console.log(`productService => fetched products = `, products)),
			catchError(handleError(`productService => error in fetching products`, null))
		);
	}


	/**
	 * Gets products server side
	 * @returns products$ 
	 */
	getProductsServer(): Observable<Product[]> {
		console.log(`productService => trying to getProductsServer`);

		return this.http.get<Product[]>(this.getProductsUrl).pipe(
			tap((products: Product[]) => console.log(`productService => fetched products = `, products)),
			catchError(handleError(`productService => error in fetching products`, null))
		);
	}

	/**
	 * Gets product server side
	 * @param id 
	 * @returns product$
	 */
	getProductServer(id: number): Observable<Product> {
		console.log(`productService => trying to getProductServer`);

		// append the id to the url
		// const url = `${this.getProductUrl}/${id}`;

		// tmp line
		const url = `${this.getProductUrl}`;
		
		return this.http.get<Product>(url).pipe(
			tap((product: Product) => console.log(`productService => fetched product = `, product)),
			catchError(handleError(`productService => error in fetching product`, null))
		);
	}









	

	/**
	 * Updates product server side
	 * @param product 
	 * @returns product$ 
	 */
	updateProductServer(product: Product): Observable<Product> {
		console.log(`productService => trying to updateProductServer : `, product);

		return this.http.put<Product>(this.updateProductUrl, product, httpOptions).pipe(
			tap((product: Product) => console.log(`productService => updated product = `, product)),
			catchError(handleError(`productService => product not updated`, null))
		);
	}







	

	/**
	 * Deletes product server side
	 * @param product 
	 * @returns product$ 
	 */
	deleteProductServer(product: Product | number): Observable<Product> {
		console.log(`productService => trying to deleteProductServer : `, product);

		// append the id to the url
		const id = typeof product === 'number' ? product : product.id;
		const url = `${this.deleteProductUrl}/${id}`;

		return this.http.delete<Product>(url, httpOptions).pipe(
			tap((product: Product) => console.log(`productService => deleted product = `, product)),
			catchError(handleError(`productService => product not deleted`, null))
		);
	}
	







	

	/**
	 * Hold product id
	 * If the user is not connected and he clicked to add in cart
	 * The dashboardComponent will deal with this id
	 */
	id: number = -1;

	setId(id: number): void {
		this.id = id;
	}

	getId(): number {
		var id = this.id;
		this.id = -1;

		return id;
	}
}
