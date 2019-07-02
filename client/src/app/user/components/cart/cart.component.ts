import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/shared/models/Product';
import { Router } from '@angular/router';
import { CartService } from 'src/app/user/services/cart.service';
import { Cart } from 'src/app/shared/models/Cart';
import { User } from 'src/app/shared/models/User';
import { UserService } from 'src/app/user/services/user.service';
import { NzMessageService } from 'ng-zorro-antd';
import { fade } from 'src/app/shared/animations/fade';

@Component({
	selector: 'app-cart',
	templateUrl: './cart.component.html',
	styleUrls: ['./cart.component.css'],
	animations: [ fade ]
})
export class CartComponent implements OnInit {

	/*
	-------------------------------------------------
	General
	-------------------------------------------------
	*/
	constructor(
		private router: Router,
		private message: NzMessageService,
		private _cartService: CartService,
		private _userService: UserService
	) { }

	ngOnInit() {
		// Get the Cart
		this.getCartElements();

		// get the User
		this.getUser();
	}







	

	/*
	-------------------------------------------------
	Cart
	-------------------------------------------------
	*/
	// CartElements list
	cartElements: Cart[] = [];

	// Get CartElements list
	getCartElements() {
		this._cartService.getCartsServer().subscribe(
			(carts) => {
				if(carts != null){
					this.cartElements = carts.map((cart) => {
						return new Cart(
							cart.id,
							cart.client_id,
							cart.product,
							cart.quantity,
							cart.total_price,
							cart.created_at
						);
					});
				}
				else {
					this.cartElements = [];
				}
			},
			(error) => {
				this.cartElements = [];
				console.log("error : ", error);
			},
			() => {
				this.initTableData();
				this.initCheckedData();
			});
	}









	/*
	-------------------------------------------------
	Table
	-------------------------------------------------
	*/

	// Data
	listOfData: Cart[] = [];
	listOfDisplayData: Cart[] = [];

	sortName: string | null = null;
	sortValue: string | null = null;
	
	initTableData(){
		// init list of table data
		this.listOfData = this.cartElements;
		this.listOfDisplayData = [
			...this.listOfData
		];
	}

	sort(sort: { key: string; value: string }): void {
		this.sortName = sort.key;
		this.sortValue = sort.value;
		this.search();
	}
	
	// search for product
	searchForProduct = '';

	resetSearchForProduct(): void {
		this.searchForProduct = '';
		this.search();
	}
	
	search(): void {
		/*
			filter data
		*/
		const filterFunc = (item: Cart) => {
			// searchForProduct
			var isCartContainsProduct: boolean = false;
			
			if(item.product.name.toLowerCase().indexOf(this.searchForProduct.toLowerCase()) !== -1){
				isCartContainsProduct = true;
			}

			return 	isCartContainsProduct;
		};
		
		const data = this.listOfData.filter((item) => filterFunc(item));
		
		/*
			sort data
		*/

		if (this.sortName && this.sortValue) {
			// special case when we sort data with data's grandson (data.sub1.sub2)
			if(this.sortName === 'product.name'){
				this.listOfDisplayData = data.sort((a, b) =>
					this.sortValue === 'ascend'
						? a.product['name'!] > b.product['name'!]
							? 1
							: -1
						: b.product['name'!] > a.product['name'!]
						? 1
						: -1
				);
			}
			// special case when we sort data with data's grandson (data.sub1.sub2)
			else if(this.sortName === 'product.price'){
				this.listOfDisplayData = data.sort((a, b) => {
					
					// if there is sold
					var aProductPrice = a.product['price'!] - a.product['price'!]*a.product['sold'!]/100;
					var bProductPrice = b.product['price'!] - b.product['price'!]*b.product['sold'!]/100;

					return this.sortValue === 'ascend'
						? aProductPrice > bProductPrice
							? 1
							: -1
						: bProductPrice > aProductPrice
						? 1
						: -1
				});
			}
			// normal case when we sort data with data's son (data.sub1)
			else{
				this.listOfDisplayData = data.sort((a, b) =>
					this.sortValue === 'ascend'
						? a[this.sortName!] > b[this.sortName!]
							? 1
							: -1
						: b[this.sortName!] > a[this.sortName!]
						? 1
						: -1
				);
			}
			
		} else {
			this.listOfDisplayData = data;
		}
	}






	

	/*
	-------------------------------------------------
	Managing checkbox
	-------------------------------------------------
	*/
	isCommandDisabled: boolean = true;
	isDeleteDisabled: boolean = true;
	checkedData: Array<{id: number, isChecked: boolean}> = [];
	countCheckedData: number = 0;
	isAllDisplayDataChecked: boolean = false;
	isIndeterminate: boolean = false;

	initCheckedData(){
		this.checkedData = [];
		this.cartElements.forEach((cartElement) => {
			this.checkedData.push( {id: cartElement.id, isChecked: false} );
		});
	}

	check(id: number) {
		var isCommandDisabled: boolean = true;
		var isDeleteDisabled: boolean = true;
		
		this.checkedData.forEach((c) => {
			// check or uncheck box
			if (c.id === id) {
				c.isChecked = !c.isChecked;

				// update countCheckedData
				if(c.isChecked) this.countCheckedData++;
				else this.countCheckedData--;
			}

			// disable command button
			if(c.isChecked){
				// update isCommandDisabled and isDeleteDisabled
				isCommandDisabled = false;
				isDeleteDisabled = false;
			}
		});
		
		this.isCommandDisabled = isCommandDisabled;
		this.isDeleteDisabled = isDeleteDisabled;
	}







	/*
	-------------------------------------------------
	Command and Delete
	-------------------------------------------------
	*/
	// the carts element selected to be commanded or deleted
	cartSelected: Cart[] = [];

	setCartSelected(): void{
		// Empty the cartSelected
		this.cartSelected = [];
		
		// Fill the cartSelected
		this.checkedData.forEach((checkedData) => {
			if(checkedData.isChecked){
				this.cartSelected.push(
					this.cartElements.find((cartElement) => {
						return (cartElement.id === checkedData.id && cartElement.product.in_store);
					})
				);
			}
		});


	}

	commandClicked(): void {
		// Verify if the User account is validated or not
		if(!this.user.is_verified_account) {
			// message the user (you can't)
			this.message.create('error', `Votre compte n'a pas été encore validé!`);
		}
		else {
			// Ok you can command
			this.setCartSelected();
	
			this._cartService.setCartSelected(this.cartSelected);
	
			this.router.navigateByUrl('/dashboard/command-form');
		}
	}


	deleteClicked(): void {
		// Verify if the User account is validated or not
		if(!this.user.is_verified_account) {
			// message the user (you can't)
			this.message.create('error', `Votre compte n'a pas été encore validé!`);
		}
		else {
			// Ok you can delete
			this.checkedData.forEach((data) => {
				if(data.isChecked) {
					this._cartService.deleteCartServer(data.id).subscribe(
						(cart) => {
							if(cart != null){
								this.cartElements.filter((cartElement) => {
									return cartElement.id !== cart.id;
								});
								
								// reinitialize data
								this.initTableData();
								this.initCheckedData();
							}
							else {
								this.message.create('error', `Impossible de supprimer!`);
							}
						},
						(error) => {
							console.log("error : ", error);
						});
				}
			});
		}
	}





	

	/*
	-------------------------------------------------
	User
	-------------------------------------------------
	*/

	// User attr
	user: User = new User();

	// Get User
	getUser() {
		this._userService.getUserServer().subscribe(
			(user) => {
				if(user != null) {
					this.user = new User(
						user.id,
						user.name,
						user.canal,
						user.address,
						user.email,
						user.password,
						user.phone_number,
						user.email_verified_at,
						user.is_verified_account,
						user.is_verified_update,
						user.website,
						user.logoUrl,
						user.access_token,
						user.created_at,
						user.updated_at
					)
				}
				else {
					this.user = new User();
				}
			},
			(error) => {
				this.user = new User();
				console.log("error : ", error);
			});
	}







	

	/*
	-------------------------------------------------
	ProductModal
	-------------------------------------------------
	*/

	isProductModalVisible: boolean = false;
	productModal: Product;

	showProductModal(productModal: Product): void {
		this.isProductModalVisible = true;
		this.productModal = productModal;
	}
  
	handleProductModalOk(): void {
	  	this.isProductModalVisible = false;
	}
  
	handleProductModalCancel(): void {
	 	this.isProductModalVisible = false;
	}







	

	/*
	-------------------------------------------------
	Backward
	-------------------------------------------------
	*/

	toDashboard(): void{
		this.router.navigateByUrl('/dashboard');
	}


}
