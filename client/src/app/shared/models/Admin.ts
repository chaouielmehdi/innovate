/**
 * Admin class
 */
export class Admin {
	constructor(
		public id?: number,
		public email?: string,
		public password?: string,
		public first_name?: string,
		public last_name?: string,
		public phone?: string,
		public is_super_admin?: boolean,
		public access_token?: string,
		public created_at?: Date,
		public updated_at?: Date
	) { }
}