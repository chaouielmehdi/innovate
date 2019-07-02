import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { ModalService } from '../../services/modal.service';
import { DrawerService } from '../../services/drawer.service';

@Component({
	selector: 'app-modals',
	templateUrl: './modals.component.html',
	styleUrls: ['./modals.component.css']
})
export class ModalsComponent implements OnInit {

	constructor(
		private _productService: ProductService,
		private router: Router,
		private _drawerService: DrawerService
	) { }

	ngOnInit() {
	}

	// -------------------------------------------------
	// connectFirstModal
	// -------------------------------------------------
	connectFirstModal = false;

	okModal(): void {
		this.connectFirstModal = false;
		this.openLogin();
	}

	cancelModal(): void {
		this.connectFirstModal = false;
	}

	openLogin(){
		this._drawerService.openLogin();
	}
	
	addToCartClicked(id: number): void {
		// set the id in product service to show the details after connection
		this._productService.setId(id);
		
		// show the modal
		this.connectFirstModal = true;
	}

	navigateToProducts() {
		this.router.navigateByUrl('products');
	}

	ToConnectClicked(){
		this._drawerService.openLogin();

		// to not redirect user to product details if he already clicked on add to cart
		this._productService.setId(-1);
	}


}
