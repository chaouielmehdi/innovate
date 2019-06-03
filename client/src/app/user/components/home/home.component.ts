import { Component, OnInit } from '@angular/core';
import { appName } from 'src/app/shared/app-config/consts';
import { Product } from 'src/app/shared/models/Product';
import { Router } from '@angular/router';
import { DrawerService } from 'src/app/user/services/drawer.service';
import { ProductService } from 'src/app/user/services/product.service';
import { fade } from 'src/app/shared/animations/fade';

declare var Typed: any;

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css'],
	animations: [ fade ]
})
export class HomeComponent implements OnInit {

	// -------------------------------------------------
	// general
	// -------------------------------------------------
	
	appName: string = appName;

	constructor(
		private router: Router,
		private _drawerService: DrawerService,
		private _productService: ProductService
	) {}

	ngOnInit() {
		// Automatic text typed by JQuery
		var typed = new Typed("#text-animation-typing", {
			strings: ["vous assure un bon rapport qualité-prix."],
			typeSpeed: 60,
			loop: true,
			backSpeed: 25,
			backDelay: 1500
		});

		// Get Products list
		this.getBestProducts();
	}

	scrollTo(id) {
		console.log(`scrolling to ${id}`);
		let el = document.getElementById(id);
		el.scrollIntoView( {behavior:"smooth"} );
	}

	// -------------------------------------------------
	// Products
	// -------------------------------------------------

	// Products list
	products: Product[] = [];

	// Products Filtered
	productsFiltered: Product[] = [];

	getBestProducts(){
		this._productService.getBestProductsServer()
			.subscribe(
				(products) => {
					if(products != null){
						this.products = products.map((product) => {
							return new Product(
								product.id,
								product.img,
								product.name,
								product.desc,
								product.in_store,
								product.price,
								product.sold,
								product.canal,
								product.isViewed,
								product.created_at,
								product.updated_at
							);
						});
					}
					else {
						this.products = [];
					}
				},
				(error) => {
					this.products = [];
					console.log("error : ", error);
				},
				() => {
					// Set the productsFiltered
					this.filterProducts();
				});
	}

	// -------------------------------------------------
	// Menu
	// -------------------------------------------------

	activeProductsMenuItem: string = 'all';

	productsMenuChanged(value){
		this.activeProductsMenuItem = value;
		
		// refilter
		this.filterProducts();
	}



	// -------------------------------------------------
	// Search Filter
	// -------------------------------------------------

	// No Data
	noData: boolean = false;

	// Filter method
	filterProducts(): void {

		this.productsFiltered = [];
		
		this.products.forEach((product) => {
			if (
				// filter by menuItems
				(
					this.activeProductsMenuItem == 'all'
					||
					this.activeProductsMenuItem == product.canal
				)
			)
			{
				this.productsFiltered.push(product);
			}
		});

		// Set noData
		this.noData = this.productsFiltered.length == 0;
	}


	// Modal
	modalVisible = false;

	addToCartClicked(id: number): void {
		// set the id in product service to show the details after connection
		this._productService.setId(id);
		
		// show the modal
		this.modalVisible = true;
	}

	okModal(): void {
		this.modalVisible = false;
		this.openLogin();
	}

	cancelModal(): void {
		this.modalVisible = false;
	}

	navigateToProducts() {
		this.router.navigateByUrl('products');
	}

	ToConnectClicked(){
		this._drawerService.openLogin();

		// to not redirect user to product details if he already clicked on add to cart
		this._productService.setId(-1);
	}

	openLogin(){
		this._drawerService.openLogin();
	}

}
