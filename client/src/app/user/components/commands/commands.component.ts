import { Component, OnInit } from '@angular/core';
import { Command } from '../../../shared/models/Command';
import { CommandService } from 'src/app/user/services/command.service';
import { Product } from 'src/app/shared/models/Product';
import { Router } from '@angular/router';
import { fade } from 'src/app/shared/animations/fade';
import { ModalService } from '../../services/modal.service';

@Component({
	selector: 'app-commands',
	templateUrl: './commands.component.html',
	styleUrls: ['./commands.component.css'],
	animations: [ fade ]
})
export class CommandsComponent implements OnInit {

	/*
	-------------------------------------------------
	General
	-------------------------------------------------
	*/
	constructor(
		private router: Router,
		private _commandService: CommandService,
		private _modalService: ModalService
	) { }

	ngOnInit() {
		// Get Commands list
		this.getCommands();
	}








	/*
	-------------------------------------------------
	Commands
	-------------------------------------------------
	*/
	// Commands list
	commands: Command[] = [];

	// Get Commands list
	getCommands() {
		this._commandService.getCommandsServer().subscribe(
			(commands) => {
				if(commands != null) {
					this.commands = commands.map((command) => {
						return new Command(
							command.id,
							command.client_id,
							command.code,
							command.status,
							command.total_price,
							command.products_quantities,
							command.reportingReason,
							command.isViewed,
							command.created_at,
							command.updated_at
						);
					});
				}
				else {
					this.commands = [];
				}
			},
			(error) => {
				this.commands = [];
				console.log("error : ", error);
			},
			() => {
				// init the table of data
				this.initTableData();

				// set the notViewedNumber to show it like notification
				this.setNotViewedNumber();

				// send http request to say that this commands were already viewed
				this.setCommandViewed();
			});
	}









	/*
	-------------------------------------------------
	Table
	-------------------------------------------------
	*/
	initTableData(){
		// init list of table data
		this.listOfData = this.commands;
		this.listOfDisplayData = [
			...this.listOfData
		];

		this.listOfStatus = [
			{text: "Annulée par l'admin", value: -2},
			{text: "Annulée par vous", value: -1},
			{text: "Commandée", value: 0},
			{text: "Confirmée", value: 1},
			{text: "Livrée", value: 2}
		];
		
		// default sort (by updated_at)
		this.sort({key: null, value: null});
	}

	// Data
	listOfData: Command[] = [];
	listOfDisplayData: Command[] = [];

	sortName: string | null = null;
	sortValue: string | null = null;
	
	// list of status filter
	listOfStatus = []; // to be displayed
	searchStatus: number; // selected

	sort(sort: { key: string, value: string }): void {
		this.sortName = sort.key;
		this.sortValue = sort.value;
		this.search();
	}
	
	filter(searchStatus: number): void {
		this.searchStatus = searchStatus;
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
		 * filter data
		 */
		const filterFunc = (item: Command) => {
			// searchForProduct
			var isCommandContainsProduct: boolean = false;
			
			item.products_quantities.forEach((product_quantity) => {
				if(product_quantity.product.name.toLowerCase().indexOf(this.searchForProduct.toLowerCase()) !== -1){
					isCommandContainsProduct = true;
				}
			});

			return 	((this.searchStatus || this.searchStatus === 0) ? item.status === this.searchStatus: true) &&
					(isCommandContainsProduct);
		};
		
		const data = this.listOfData.filter((item) => filterFunc(item));
		
		/*
		 * sort data
		 */
		if (this.sortName && this.sortValue) {
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
		// sort by updated_at (default sort)
		else {
			this.listOfDisplayData = data.sort((commandA, commandB) => {
				return (commandA.updated_at > commandB.updated_at) ? -1 : 1
			});
		}
	}









	/*
	-------------------------------------------------
	statistics
	-------------------------------------------------
	*/
	notViewedNumber: number = 0;

	setNotViewedNumber(): void{
		var notViewedNumber = 0;

		this.commands.forEach((command) => {
			if(!command.isViewed){
				notViewedNumber++;
			}
		});

		this.notViewedNumber = notViewedNumber;
	}

	/**
	 * Send http request to say that this commands were already viewed
	 */
	setCommandViewed(): void{
		this.commands.forEach((command) => {
			if(!command.isViewed){
				this._commandService.setCommandViewedServer(command.id).subscribe(
					(command) => {
						if(command != null) {
							console.log('commandsComponent => setCommandViewedServe done')
						}
						else {
							console.log('commandsComponent => setCommandViewedServe failed')
						}
					},
					(error) => {
						console.log("error : ", error);
					});
			}
		});
		
	}


	


	





	/*
	-------------------------------------------------
	ProductModal
	-------------------------------------------------
	*/
	isProductModalVisible: boolean = false;

	showProductModal(productModal: Product): void {
		// user the modalService to open product modal
		this._modalService.openProductModal(productModal);
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
