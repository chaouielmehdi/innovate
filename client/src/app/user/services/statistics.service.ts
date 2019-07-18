import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Statistics } from '../../shared/models/Statistics';
import { handleError } from '../../shared/functions/handle-http-error';
import { statisticsGetURL } from 'src/app/shared/app-config/URLs';

@Injectable({
  	providedIn: 'root'
})
export class StatisticService {

	private statisticsGetURL: string = statisticsGetURL;

	/**
	 * Creates an instance of statistic service.
	 * @param http 
	 */
	constructor(
	  	private http: HttpClient
	) { }







	

	/**
	 * Gets statistics
	 * @returns statistics$ 
	 */
	getStatistics(): Observable<Statistics> {
		console.log(`statisticsService => trying to getStatistics`);

		return this.http.get<Statistics>(this.statisticsGetURL).pipe(
			tap((statistic: Statistics) => console.log(`statisticService => fetched statistic = `, statistic)),
			catchError(handleError('statisticService => error in fetching statistic', null))
		);
	}

}
