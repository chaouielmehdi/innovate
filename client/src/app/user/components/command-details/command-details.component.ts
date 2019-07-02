import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Command } from '../../../shared/models/Command';
import { CommandService } from 'src/app/user/services/command.service';
import { Product } from 'src/app/shared/models/Product';
import { calTotPrice, calCommandTotPrice } from 'src/app/shared/functions/price-calculators';
import { NzMessageService } from 'ng-zorro-antd';
import { PageNotFoundService } from 'src/app/user/services/page-not-found.service';
import { ReportService } from 'src/app/user/services/report.service';
import { fade } from 'src/app/shared/animations/fade';

@Component({
	selector: 'app-command-details',
	templateUrl: './command-details.component.html',
	styleUrls: ['./command-details.component.css'],
	animations: [ fade ]
})

export class CommandDetailsComponent implements OnInit {

	private id = +this.activatedRoute.snapshot.paramMap.get('id');
	command: Command = new Command(); // this could be modified
	commandStatus: number = 0;
	commandCanceledByAdmin: boolean = false;
	commandCanceledByClient: boolean = false;
	products_quantitiesTotPrice: Array<number> = [];
	commandTotal_price: number = 0;

	// to prevent html to be shown util checking the id validity
	showHtml: boolean = false;

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private message: NzMessageService,
		private _pageNotFoundService: PageNotFoundService,
		private _commandService: CommandService,
		private _reportService: ReportService
	) { }

	ngOnInit() {
		// Get Command
		this.getCommand();
	}

	// Get Command
	getCommand() : void {
		this._commandService.getCommandServer(this.id)
			.subscribe(
				(command) => {
					if(command != null){
						// to test if the id is valid
						if(typeof command.id !== 'undefined'){
							this.showHtml = true;
							
							// set The command
							this.command = new Command(
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

							// set command status
							this.setCommandStatus();

							// set the activeReportItem on init
							this.initActiveReportItem();
						}
						else {
							// send to commandNotFoundPage
							this._pageNotFoundService.showPageNotFound('Commande');
						}
					}
					else {
						this.command = new Command();
					
						// send to commandNotFoundPage
						this._pageNotFoundService.showPageNotFound('Commande');
					}
				},
				(error) => {
					this.command = new Command();
					console.log("error : ", error);

					// send to commandNotFoundPage
					this._pageNotFoundService.showPageNotFound('Commande');
				});
	}
	
	setCommandStatus(): void {
		this.commandStatus = this.command.status;

		if(this.commandStatus == -2){
			this.commandCanceledByAdmin = true;
			this.commandStatus = 1;
		}
		else if(this.commandStatus == -1){
			this.commandCanceledByClient = true;
			this.commandStatus = 1;
		}
	}

	// show CRUD
	showCrudItem(item: string): boolean{
		switch (item) {
			case 're-command':
				return this.command.status == -1;// canceled by client
			case 'edit':
				return this.command.status == 0; // not confirmed yet
			case 'cancel':
				return this.command.status == 0; // not confirmed yet
			case 'report':
				return true;					 // report is shown in all cases
			default:
				return false;
		}
	}


	/*
	-------------------------------------------------
	Actions
	-------------------------------------------------
	*/

	// General
	totalColspan: number = 3;
	
	// Edit command
	editMode: boolean = false;

	isSaveEditLoading: boolean = false;

	editClicked(): void {
		this.totalColspan = 4;
		this.editMode = true;
	}

	editCancel(): void {
		this.totalColspan = 3;
		this.editMode = false;

		// to refresh the command
		this.getCommand();
	}

	editOk(): void {
		// btn loader
		this.isSaveEditLoading = true;

		// validation
		var isCommandValid: boolean = true;
		
		// invalid because of status
		if(this.command.status != -1 && this.command.status != 0){
			isCommandValid = false;
		}

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
			this._commandService.updateCommandServer(this.command)
				.subscribe(
					(command) => {
						if(command != null) {
							this.message.create('success', `Votre commande a été renvoyée.`);
							
							// to refresh some elements
							this.totalColspan = 3;
							this.editMode = false;
							this.getCommand();
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
		
		// btn loader
		this.isSaveEditLoading = false;

	}

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
			this.message.create('error', `Une commande doit au moins avoir un produit`);
		}
		else{
			this.command.products_quantities = this.command.products_quantities.filter(
				(p) => {
					return p.product.id !== id;
				});
				
			this.command.total_price = calCommandTotPrice(this.command);
		}
	}


	// cancelCommand
	cancelOk(): void{
		// validation
		var isCommandValid: boolean = true;
		
		// invalid because of status
		if(this.command.status != 0){
			isCommandValid = false;
		}
		
		// if invalid
		if(!isCommandValid){
			this.message.create('error', `Vous ne pouvez pas annuler cette commande.`);
		}
		else {
			this._commandService.deleteCommandServer(this.command)
				.subscribe(
					(command) => {
						if(command != null) {
							this.message.create('success', `Votre commande a été annulée.`);
							
							// to refresh some elements
							this.totalColspan = 3;
							this.editMode = false;
							this.router.navigateByUrl('/dashboard/commands');
						}
						else {
							this.message.create('error', `Vous ne pouvez pas annuler cette commande.`);
						}
					},
					(error) => {
						this.message.create('error', `Aïe! une erreur c'est produite!`);
						console.error(error);
					}
				);
		}

	}


	/*
	-------------------------------------------------
	ReportModal
	-------------------------------------------------
	*/

	isReportModalVisible: boolean = false;
	alreadyReported: boolean = false;
	activeReportItem: string = '';
	reportingItems: Array<{value: string, name: string}> =
		[
			{value: 'not received', name: 'Commande non reçue'},
			{value: 'refused by admin', name: 'Commande refusée par l\'admin'},
			{value: 'technical problem', name: 'Problème technique'}
		];
	otherProblemItem: boolean = false;
	otherProblemMsg: string = '';
	otherProblemMsgLength: number = 0;
	otherProblemMsgMaxLength: number = 100;
	isSendLoading: boolean = false;
	
	// set the activeReportItem on init
	initActiveReportItem(): void {
		if(this.command.reportingReason !== ''){
			// to choose the item (if it is a normal item or it is 'other problem')
			var itsOtherProblemItem: boolean = true;

			this.reportingItems.forEach(reportingItem => {
				if(this.command.reportingReason === reportingItem.value){
					itsOtherProblemItem = false;
				}
			});

			this.alreadyReported = true;
			
			if(itsOtherProblemItem){
				this.otherProblemItem = true;
				this.otherProblemMsg = this.command.reportingReason;
				this.activeReportItem = 'other problem';
			}
			else {
				this.activeReportItem = this.command.reportingReason;
			}
		}
	}
	
	showReportModal(): void {
		this.isReportModalVisible = true;
	}
	
	chooseReportCartItem(item: string): void{
		if(!this.alreadyReported){
			this.activeReportItem = item;
			
			if(item === 'other problem') {
				this.otherProblemItem = true;
			}
			else {
				this.otherProblemItem = false;
			}
		}
	}


	handleReportModalCancel(): void {
	 	this.isReportModalVisible = false;
	}
	
	handleReportModalOk(): void {

		// send loader
		this.isSendLoading = true;
		
		// send to service
		if(!(this.activeReportItem === '' || (this.activeReportItem === 'other problem' && this.otherProblemMsg === ''))){
			this._reportService.createReportServer({commandId: this.command.id, reason: this.activeReportItem === 'other problem'? this.otherProblemMsg : this.activeReportItem})
				.subscribe(
					(report) => {
						if(report != null) {
							this.message.create('success', `Votre réclamation a été envoyée à l'admin.`);
							this.alreadyReported = true;
							this.isReportModalVisible = false;
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
		
		// send loader
		this.isSendLoading = false;
	}

	otherProblemMsgKeyPressed(){
		this.otherProblemMsgLength = this.otherProblemMsg.length;

		if(this.otherProblemMsgLength < this.otherProblemMsgMaxLength){
			
		}
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
