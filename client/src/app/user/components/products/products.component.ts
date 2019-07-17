import { Component, OnInit, EventEmitter, Output, HostListener } from '@angular/core';
import { UserService } from 'src/app/user/services/user.service';
import { DrawerService } from 'src/app/user/services/drawer.service';
import { Product } from 'src/app/shared/models/Product';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/user/services/product.service';
import { User } from 'src/app/shared/models/User';
import { fade } from 'src/app/shared/animations/fade';
import { ModalService } from '../../services/modal.service';
import { userLogoBaseURL } from 'src/app/shared/app-config/URLs';

@Component({
	selector: 'app-products',
	templateUrl: './products.component.html',
	styleUrls: ['./products.component.css'],
	animations: [ fade ]
})
export class ProductsComponent implements OnInit {

	loggedIn: boolean = false;

	constructor(
		private _userService: UserService,
		private _modalService: ModalService,
		private _productService: ProductService
	) { }

	ngOnInit() {
		// Fill in the loggedIn variable
		this._userService.authStatus$.subscribe(
			(status) => {
				this.loggedIn = status;
			});

		// Get Products list
		this.getProducts();
		
		// Get User if loggedIn
		if(this.loggedIn){
			this.getUser();
		}
	}

	// Products list
	products: Product[] = [];

	// Products Filtered
	productsFiltered: Product[] = [];

	// Get Products list
	getProducts() {
		this._productService.getProductsServer()
			.subscribe(
				(products) => {
					if(products != null){
						this.products = products.map((product) => {
							return new Product(
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
				// executed after getting products list
				() => {
					// Set the maxPrice and minPrice
					if(this.products.length > 0){
						this.minPrice = 0;
						this.maxPrice = Math.max.apply(Math, this.products.map(function(product) { return product.price; }));
						this.PriceRangeValue = [this.minPrice, this.maxPrice];
					}

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

		// change the search options
		this.searchOnInput();
	}



	// -------------------------------------------------
	// Search Filter
	// -------------------------------------------------
	searchInputValue: string = '';
	searchOptions: string[] = [];

	searchOnInput(): void {
		let productsSearched = this.products.filter((product) =>{
			return 	(
						product.description.toLowerCase().indexOf(this.searchInputValue.toLowerCase()) >= 0
						||
				   		product.name.toLowerCase().indexOf(this.searchInputValue.toLowerCase()) >= 0
					)
					&&
					(
						this.activeProductsMenuItem === product.canal // if the productsSearched is of the activeProductsMenuItem
						||
						this.activeProductsMenuItem === 'all' // if activeProductsMenuItem = 'all'
					);
		});
		let productsNameSearched = productsSearched.map((product) =>{
			return product.name;
		});

		this.searchOptions = this.searchInputValue ? productsNameSearched : [];
	}
	
	// -------------------------------------------------
	// Other Filters
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
				&&
				// filter by Search Input
				(
					this.searchInputValue == ''
					||
					product.description.toLowerCase().indexOf(this.searchInputValue.toLowerCase()) >= 0
					||
					product.name.toLowerCase().indexOf(this.searchInputValue.toLowerCase()) >= 0
				)
				&&
				// filter by Price Slider
				(
					this.PriceRangeValue[0] <= (product.sold==0 ? product.price : product.price - (product.price * product.sold / 100)) // if there is a sold ?
					&&
					this.PriceRangeValue[1] >= (product.sold==0 ? product.price : product.price - (product.price * product.sold / 100)) // if there is a sold ?
				)
			)
			{
				this.productsFiltered.push(product);
			}
		});

		// Sort data
		this.sortBy();

		// Set noData
		this.noData = this.productsFiltered.length == 0;
	}

	// Price Slider (setted when getting data)
	minPrice: number = 0;
	maxPrice: number = 0;
	pricesArray: number[] = [];
	PriceRangeValue: number[] = [this.minPrice, this.maxPrice];

	// Sort Select
	selectedFilter = 'Pertinence';
	filtersData = ['Pertinence', 'Nom', 'Date', 'Prix: Croissant', 'Prix: Décroissant'];

	sortBy(){
		// Sort Select
		switch (this.selectedFilter) {

			// Pertinence (the last updated product)
			case (this.filtersData[0]):
				console.log('Pertinence', this.productsFiltered.length);
				this.productsFiltered.sort((productA, productB) => (productA.updated_at > productB.updated_at) ? -1 : 1);
				break;

			// Nom
			case this.filtersData[1]:
				console.log('Nom', this.productsFiltered.length);
				this.productsFiltered.sort((productA, productB) => productA.name.localeCompare(productB.name));
				break;

			// Date (the last updated product)
			case this.filtersData[2]:
				console.log('Date', this.productsFiltered.length);
				this.productsFiltered.sort((productA, productB) => (productA.updated_at > productB.updated_at) ? -1 : 1);
				break;

			// Prix: Croissant
			case this.filtersData[3]:
				console.log('Croissant', this.productsFiltered.length);
				this.productsFiltered.sort((productA, productB) => productA.price - productB.price);
				break;
			
			// Prix: Décroissant
			case this.filtersData[4]:
				console.log('Décroissant', this.productsFiltered.length);
				this.productsFiltered.sort((productA, productB) => productB.price - productA.price);
				break;
			
			// Pertinence (the last updated product)
			default:
				this.productsFiltered.sort((productA, productB) => (productA.updated_at > productB.updated_at) ? -1 : 1);
				break;
		}

	}
	





	/*
	-------------------------------------------------
	User
	-------------------------------------------------
	*/

	// User attr
	user: User = new User();
	userLogoBaseURL: string = userLogoBaseURL;

	// Get User
	getUser() {
		this._userService.getUserServer().subscribe(
			(user) => {
				if(user != null){
					this.user = new User(
						user.id,
						user.email,
						user.password,
						user.code,
						user.username,
						userLogoBaseURL+user.logo,
						user.canal,
						user.address,
						user.phone,
						user.website,
						user.status,
						user.email_verified_at,
						user.access_token,
						user.created_at,
						user.updated_at,
					);

					// show product of the user canal
					this.productsMenuChanged(user.canal);
				}
				else {
					// show products of default canal
					// reset user 
					this.user = new User();
				}
			},
			(error) => {
				this.user = new User();
				console.log("error : ", error);
			});
	}



	// -------------------------------------------------
	// ConnectFirstModal
	// -------------------------------------------------
	/**
	 * To connect btn clicked
	 * It uses the drawerService to open loginDrawer
	 */

	addToCartClicked(id: number): void {
		// show the modal
		this._modalService.openConnectFirstModal();

		// set the id in product service to show the details after connection
		this._productService.setId(id);
	}


}
