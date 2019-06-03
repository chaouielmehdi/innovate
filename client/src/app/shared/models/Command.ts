import { Product } from './Product';
/**
 * Command class
 */
export class Command {
	constructor(
		public id?: number,
		public client_id?: number,
		public code?: string,
		public status?: number,
		public total_price?: number,
		public products_quantities?: Array<{product: Product, quantity: number, price: number}>,
		public reportingReason?: string,
		public isViewed?: boolean,
		public created_at?: Date,
		public updated_at?: Date
	) { }
}