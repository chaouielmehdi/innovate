
/**
 * User class
 */
export class User {
	constructor(
		public id?: number,
		public email?: string,
		public password?: string,
		public code?: string,
		public username?: string,
		public logo?: string,
		public canal?: string,
		public address?: string,
		public phone?: string,
		public website?: string,
		public status?: number, // 0: Account created, 1: Account validated by admin, 2: Account updated waiting for admin approval
		public email_verified_at?: Date,
		public access_token?: string,
		public created_at?: Date,
		public updated_at?: Date
	) { }
}

export const accountCreatedStatus: number = 0;
export const accountValidatedStatus: number = 1;
export const accountUpdatedStatus: number = 2;
