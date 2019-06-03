import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cart } from 'src/app/shared/models/Cart';
import { CartService } from 'src/app/user/services/cart.service';
import { Command } from 'src/app/shared/models/Command';
import { Product } from 'src/app/shared/models/Product';
import { NzMessageService } from 'ng-zorro-antd';
import { CommandService } from 'src/app/user/services/command.service';
import { calCommandTotPrice, calTotPrice } from 'src/app/shared/functions/price-calculators';
import { fade } from 'src/app/shared/animations/fade';

@Component({
	selector: 'app-command-form',
	templateUrl: './command-form.component.html',
	styleUrls: ['./command-form.component.css'],
	animations: [ fade ]
})
export class CommandFormComponent implements OnInit {

	/*
	-------------------------------------------------
	General
	-------------------------------------------------
	*/
	constructor(
		private router: Router,
		private message: NzMessageService,
		private _cartService: CartService,
		private _commandService: CommandService
	) { }

	ngOnInit() {
		this.getCartSelected();

		// Verify if there is cartSelected
		if(this.cartSelected.length === 0){
			this.router.navigateByUrl("/dashboard/cart");
		}
		else {
			this.setCommand();
		}

	}


	/*
	-------------------------------------------------
	Cart
	-------------------------------------------------
	*/
	cartSelected: Cart[] = []; // list of carts that are selected be commanded

	getCartSelected(): void {
		this.cartSelected = this._cartService.getCartSelected();

		if(this.cartSelected.length == 0){
			this.router.navigateByUrl('/dashboard/cart')
		}
	}


	/*
	-------------------------------------------------
	Command
	-------------------------------------------------
	*/
	command: Command = new Command(); // this could be modified
	commandRollback: Command = new Command(); // this holds command to rollback when canceled
	commandTotal_price: number = 0;
	
	// Set Command
	setCommand() {
		// client Id
		this.command.client_id = this.cartSelected[0].client_id;

		// status
		this.command.status = 0;

		// ProductsQuantities
		var products_quantities: Array<{product: Product, quantity: number, price: number}> = [];
		this.cartSelected.forEach((cart) => {
			products_quantities.push( {product: cart.product, quantity: cart.quantity, price: cart.total_price} );
		});
		this.command.products_quantities = products_quantities;

		// total Price
		this.command.total_price = calCommandTotPrice(this.command);
	}


	/*
	-------------------------------------------------
	Actions
	-------------------------------------------------
	*/

	// in case changed quantity (=$event)
	refreshPrices($event, commandProductQuantity): void {
		var productQuantity = this.command.products_quantities.find((productQuantity) => {
			return productQuantity.product.id === commandProductQuantity.product.id;
		});

		productQuantity.quantity = $event

		productQuantity.price = calTotPrice(
			productQuantity.product.price,
			productQuantity.product.sold,
			productQuantity.quantity
		);

		this.command.total_price = calCommandTotPrice(this.command);
	}

	// Delete commandProduct
	deleteClicked(id: number): void {
		if(this.command.products_quantities.length === 1){
			this.message.create('error', `Une commande doit au moins avoir un produit!`);
		}
		else{
			// refresh the command
			this.command.products_quantities = this.command.products_quantities
				.filter((product_quantity) => {
					return product_quantity.product.id !== id;
				});

			this.command.total_price = calCommandTotPrice(this.command);


			// refresh the cartSelected
			this.cartSelected = this.cartSelected
				.filter((cart) => {
					return cart.product.id !== id;
				});
			console.log(this.cartSelected);
		}
	}

	// command loader
	isCommandLoading: boolean = false;

	// Command clicked
	toCommand(){
		/**
		 * 0 - validation
		 * 1 - Post to the server the new command
		 * 2 - Delete carts
		 * 3 - Navigate to commands
		 */
		// command loader
		this.isCommandLoading = true;
		
		// 0 - validation
		var isCommandValid: boolean = true;

		// invalidCommand if there is no product_quantity
		if(this.command.products_quantities.length == 0) {
			isCommandValid = false;
		}
		else {
			this.command.products_quantities.forEach((product_quantity) => {
				// invalidCommand if there is no quantity in just one product_quantity
				if(!product_quantity.quantity){
					isCommandValid = false;
				}
				else if(product_quantity.quantity <= 0) {
					isCommandValid = false;
				}
			});
		}

		// if invalid
		if(!isCommandValid){
			this.message.create('error', `Informations érronées! réessayez s'il vous plaît!`);
		}
		else {
			// 1 - Post to the server the new command
			this._commandService.createCommandServer(this.command)
				.subscribe(
					(command) => {
						if(command != null) {
							// 2 - Delete carts
							this.cartSelected.forEach((cartElement) => {
								this._cartService.deleteCartServer(cartElement.id)
									.subscribe(
										(cart) => {
											if(cart != null) {
												this.message.create('success', `Votre commande a été faite.`);
												
												// 3 - Navigate to commands
												this.router.navigateByUrl("/dashboard/commands");
											}
											else {
												this.message.create('error', `Informations érronées! réessayez s'il vous plaît!`);
											}
										},
										(error) => {
											this.message.create('error', `Aïe! une erreur c'est produite!`);
											console.error(error);
										}
									);
							});
						}
						else {
							this.message.create('error', `Informations érronées! réessayez s'il vous plaît!`);
						}
					},
					(error) => {
						this.message.create('error', `Aïe! une erreur c'est produite!`);
						console.error(error);
					}
				);
		}
		// command loader
		this.isCommandLoading = false;
	}

	// cancel clicked
	cancelCommand(){
		this.router.navigateByUrl("/dashboard/cart");
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


	backward(): void{
		this.router.navigateByUrl('/dashboard/commands');
	}

}
