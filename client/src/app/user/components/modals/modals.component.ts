import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { ModalService } from '../../services/modal.service';
import { DrawerService } from '../../services/drawer.service';
import { Product } from 'src/app/shared/models/Product';

@Component({
	selector: 'app-modals',
	templateUrl: './modals.component.html',
	styleUrls: ['./modals.component.css']
})
export class ModalsComponent implements OnInit {

	constructor(
		private _productService: ProductService,
		private _modalService: ModalService,
		private _drawerService: DrawerService
	) { }

	ngOnInit() {
		// Subscription to the ModalService
		// connectFirstModal
		this._modalService.connectFirstModalEventEmitter.subscribe(isConnectFirstModalVisible => {
			this.isConnectFirstModalVisible = isConnectFirstModalVisible;
		});
		

		// productModal
		this._modalService.productModalEventEmitter.subscribe((obj: {visible: boolean, product: Product}) => {
			this.isProductModalVisible = obj.visible;
			this.productModal = obj.product;
		});

	}





	
	// -------------------------------------------------
	// connectFirstModal
	// -------------------------------------------------
	isConnectFirstModalVisible = false;

	handleConnectFirstModalOk(): void {
		// user modal service to close the connectFirstModal
		this._modalService.closeConnectFirstModal();
		
		this._drawerService.openLogin();
	}

	handleConnectFirstModalCancel(): void {
		// user modal service to close the connectFirstModal
		this._modalService.closeConnectFirstModal();

		// to not redirect user to product details if he already clicked on add to cart
		this._productService.setId(-1);

		this._drawerService.closeLogin();
	}







	// -------------------------------------------------
	// ProductModal
	// -------------------------------------------------
	isProductModalVisible: boolean = false;
	productModal: Product;

	handleProductModalOk(): void {
		// user modal service to close the connectFirstModal
		this._modalService.closeProductModal();
	}
	handleProductModalCancel(){
		// user modal service to close the connectFirstModal
		this._modalService.closeProductModal();
	}

}
