
import { AbstractControl } from '@angular/forms';

/**
 * Passwords confirmation validator
 * @param control 
 * @returns confirmation validator 
 */
export function passwordConfirmationValidator(control: AbstractControl): { [key:string]: boolean} {
	const password = control.get('password').value;
	const password_confirmation = control.get('password_confirmation').value;

	var misMatch = password && password_confirmation && password != password_confirmation ? { 'misMatch': true  } : { 'misMatch': false };
	
	return misMatch;
}

