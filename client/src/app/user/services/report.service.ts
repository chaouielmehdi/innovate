import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { handleError } from '../../shared/functions/handle-http-error';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { reportCreateURL } from 'src/app/shared/app-config/URLs';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  	providedIn: 'root'
})
export class ReportService {

	reportCreateURL: string = reportCreateURL;

	/**
	 * Creates an instance of report service.
	 * @param http 
	 */
	constructor(
		private http: HttpClient
	) { }
	







	

	/**
	 * Creates report server side
	 * @param report 
	 * @returns report$
	 */
	createReportServer(report: {commandId: number, reason: string}): Observable<{commandId: number, reason: string}> {
		console.log(`reportService => trying to createReportServer : `, report);

		return this.http.post<{commandId: number, reason: string}>(this.reportCreateURL, report, httpOptions).pipe(
			tap((report: {commandId: number, reason: string}) => console.log(`reportService => created report = `, report)),
			catchError(handleError(`reportService => report not created`, null))
		);
	}
}
