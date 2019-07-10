/**
 * Admin class
 */
export class Admin {
	constructor(
		public id?: number,
		public name?: string,
		public email?: string,
		public password?: string,
		public phone?: string,
		public email_verified_at?: Date,
		public logoUrl?: string,
		public access_token?: string,
		public created_at?: Date,
		public updated_at?: Date
	) { }
}