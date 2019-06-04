import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Command } from '../../shared/models/Command';
import { getCommandsUrl, getCommandUrl, createCommandUrl, updateCommandUrl, deleteCommandUrl, setCommandViewedUrl } from '../../shared/app-config/URLs';
import { handleError } from '../../shared/functions/handle-http-error';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  	providedIn: 'root'
})
export class CommandService {

	createCommandUrl: 		string = createCommandUrl;
	updateCommandUrl: 		string = updateCommandUrl;
	getCommandsUrl: 		string = getCommandsUrl;
	getCommandUrl: 			string = getCommandUrl;
	deleteCommandUrl: 		string = deleteCommandUrl;
	setCommandViewedUrl:	string = setCommandViewedUrl;

	/**
	 * Creates an instance of command service.
	 * @param http 
	 */
	constructor(
	  	private http: HttpClient
	) { }
	










	/**
	 * Creates command server side
	 * @param command 
	 * @returns command$
	 */
	createCommandServer(command: Command): Observable<Command> {
		console.log(`commandService => trying to createCommandServer : `, command);

		return this.http.post<Command>(this.createCommandUrl, command, httpOptions).pipe(
			tap((command: Command) => console.log(`commandService => created command = `, command)),
			catchError(handleError(`commandService => command not created`, null))
		);
	}












	/**
	 * Gets commands server side
	 * @returns commands$
	 */
	getCommandsServer(): Observable<Command[]> {
		console.log(`commandService => trying to getCommandsServer`);

		return this.http.get<Command[]>(this.getCommandsUrl).pipe(
			tap((commands: Command[]) => console.log(`commandService => fetched commands = `, commands)),
			catchError(handleError(`commandService => error in fetching commands`, null))
		);
	}


	/**
	 * Gets command server side
	 * @param id 
	 * @returns command$
	 */
	getCommandServer(id: number): Observable<Command> {
		console.log(`commandService => trying to getCommandServer`);

		// append the id to the url
		//const url = `${this.getCommandUrl}/${id}`;
		/**
		 * Tmp lines
		 */
		const url = `${this.getCommandUrl}`;
		
		return this.http.get<Command>(url).pipe(
			tap((command: Command) => console.log(`commandService => fetched command = `, command)),
			catchError(handleError(`commandService => error in fetching command`, null))
		);
	}







	
	/**
	 * Updates command server side
	 * @param command 
	 * @returns command$
	 */
	updateCommandServer(command: Command): Observable<Command> {
		console.log(`commandService => trying to updateCommandServer : `, command);

		return this.http.put<Command>(this.updateCommandUrl, command, httpOptions).pipe(
			tap((command: Command) => console.log(`commandService => updated command = `, command)),
			catchError(handleError(`commandService => command not updated`, null))
		);
	}








	


	/**
	 * Deletes command server side
	 * @param command 
	 * @returns command$
	 */
	deleteCommandServer(command: Command | number): Observable<Command> {
		console.log(`commandService => trying to deleteCommandServer : `, command);

		// append the id to the url
		const id = typeof command === 'number' ? command : command.id;
		const url = `${this.deleteCommandUrl}/${id}`;

		return this.http.delete<Command>(url, httpOptions).pipe(
			tap((command: Command) => console.log(`commandService => deleted command = `, command)),
			catchError(handleError(`commandService => command not deleted`, null))
		);
	}





	







	
	setCommandViewedServer(command: Command | number): Observable<Command> {
		console.log(`commandService => trying to setCommandViewedServer : `, command);

		// append the id to the url
		const id = typeof command === 'number' ? command : command.id;
		const url = `${this.setCommandViewedUrl}/${id}`;

		return this.http.post<Command>(url, httpOptions).pipe(
			tap((command: Command) => console.log(`commandService => command set to viewed = `, command)),
			catchError(handleError(`commandService => command not set to viewed`, null))
		);
	}

	
}
