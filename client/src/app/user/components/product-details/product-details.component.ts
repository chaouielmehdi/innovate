import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/shared/models/Product';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/user/services/product.service';
import { PageNotFoundService } from 'src/app/user/services/page-not-found.service';
import { fade } from 'src/app/shared/animations/fade';

@Component({
	selector: 'app-product-details',
	templateUrl: './product-details.component.html',
	styleUrls: ['./product-details.component.css'],
	animations: [ fade ]
})

export class ProductDetailsComponent implements OnInit {

	private id = +this.activatedRoute.snapshot.paramMap.get('id');
	product: Product = new Product();
	showHtml = false;

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private _productService: ProductService,
		private _pageNotFoundService: PageNotFoundService
	) { }

	/**
	 * on init
	 */
	ngOnInit() {
		// Get Product
		this.getProduct();
	}

	// Get Product
	getProduct() {
		this._productService.getProductServer(this.id)
			.subscribe(
				(product) => {
					if(product != null){
						// to test if the id is valid
						if(typeof product.id !== 'undefined'){
							this.showHtml = true;

							// set The product
							this.product = new Product(
								product.id,
								product.image,
								product.name,
								product.description,
								product.in_store,
								product.price,
								product.sold,
								product.canal,
								product.items_number,
								product.created_at,
								product.updated_at
							);
						}
						else {
							// send to productNotFoundPage
							this._pageNotFoundService.showPageNotFound('Produit');
						}
					}
					else {
						this.product = new Product();
						
						// send to productNotFoundPage
						this._pageNotFoundService.showPageNotFound('Produit');
					}
				},
				(error) => {
					this.product = new Product();
					console.log("error : ", error);

					// send to productNotFoundPage
					this._pageNotFoundService.showPageNotFound('Produit');
				});
	}


	/*
	-------------------------------------------------
	Quantity input
	-------------------------------------------------
	*/

	quantity = 1;

	addQuantity(): void {
	  this.quantity++;
	}
	
	minQuantity(): void {
		this.quantity--;
		if (this.quantity < 0) {
			this.quantity = 0;
		}
	}


	/*
	-------------------------------------------------
	Backward
	-------------------------------------------------
	*/

	backward(): void{
		this.router.navigateByUrl('/products');
	}


}
