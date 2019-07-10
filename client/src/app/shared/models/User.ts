
/**
 * User class
 */
export class User {
	constructor(
		public id?: number,
		public name?: string,
		public canal?: string,
		public address?: string,
		public email?: string,
		public password?: string,
		public phone?: string,
		public email_verified_at?: Date,
		public is_verified_account?: boolean,
		public is_verified_update?: boolean,
		public website?: string,
		public logo?: string,
		public access_token?: string,
		public created_at?: Date,
		public updated_at?: Date
	) { }
}