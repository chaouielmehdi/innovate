import { Product } from './Product';
/**
 * Cart class
 */
export class Cart {
	constructor(
		public id?: number,
		public client_id?: number,
		public product?: Product,
		public quantity?: number,
		public total_price?: number,
		public created_at?: Date,
		public updated_at?: Date
	) { }
}