import { Injectable, Output, EventEmitter } from '@angular/core';
import { UserService } from './user.service';
import { Product } from 'src/app/shared/models/Product';

@Injectable({
  	providedIn: 'root'
})
export class ModalService {
	loggedIn: boolean = false;

	/**
	 * Creates an instance of drawer service.
	 * @param _userService 
	 */
	constructor(
		private _userService: UserService
	)
	{
		this._userService.authStatus$.subscribe(
			(status) => this.loggedIn = status
		);
	}










	/**
	 * ConnectFirstModal
	 */
	isConnectFirstModalVisible: boolean = false;

	@Output() connectFirstModalEventEmitter: EventEmitter<boolean> = new EventEmitter();
	
	openConnectFirstModal() {
		if(!this.loggedIn) {
			this.isConnectFirstModalVisible = true;
			this.connectFirstModalEventEmitter.emit(this.isConnectFirstModalVisible);
		}
	}

	closeConnectFirstModal() {
		this.isConnectFirstModalVisible = false;
		this.connectFirstModalEventEmitter.emit(this.isConnectFirstModalVisible);
	}









	/**
	 * ProductModal
	 */
	isProductModalVisible: boolean = false;
	productModal: Product;

	@Output() productModalEventEmitter: EventEmitter<{visible: boolean, product: Product}> = new EventEmitter();
	
	openProductModal(productModal: Product) {

		this.isProductModalVisible = true;
		this.productModal = productModal;
		
		this.productModalEventEmitter.emit({visible: this.isProductModalVisible, product: productModal});
	}

	closeProductModal() {
		this.isProductModalVisible = false;
		this.productModalEventEmitter.emit({visible: this.isProductModalVisible, product: this.productModal});
	}

}
