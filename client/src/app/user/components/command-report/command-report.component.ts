import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommandService } from 'src/app/user/services/command.service';
import { Command } from 'src/app/shared/models/Command';
import { PageNotFoundService } from 'src/app/user/services/page-not-found.service';
import { fade } from 'src/app/shared/animations/fade';

@Component({
	selector: 'app-command-report',
	templateUrl: './command-report.component.html',
	styleUrls: ['./command-report.component.css'],
	animations: [ fade ]
})
export class CommandReportComponent implements OnInit {

	private id = +this.activatedRoute.snapshot.paramMap.get('id');
	command: Command = new Command();
	reportAutre: boolean = false;
	reportMsg: string = '';
	
	// to prevent html to be shown util checking the id validity
	showHtml: boolean = false;

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private _commandService: CommandService,
		private _pageNotFoundService: PageNotFoundService
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

	

	/*
	-------------------------------------------------
	Backward
	-------------------------------------------------
	*/

	backward(): void{
		var id = this.command.id;
		this.router.navigateByUrl('/dashboard/command-details/'+id);
	}
}
