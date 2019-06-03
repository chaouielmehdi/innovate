import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

/**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
export function handleError<T> (operation = 'operation', result?: T) {
	return (error: HttpErrorResponse): Observable<T> => {
		
		// TODO: better job of transforming error for user consumption
		console.log(`\n ${operation} failed : ${error.message}`);

		// Let the app keep running by returning an empty result.
		return of(result as T);
	};
}