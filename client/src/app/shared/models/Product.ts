/**
 * Product class
 */
export class Product {
	constructor(
		public id?: number,
		public image?: string,
		public name?: string,
		public code?: string,
		public description?: string,
		public in_store?: boolean,
		public price?: number,
		public sold?: number,
		public canal?: string,
		public items_number?: number,
		public created_at?: Date,
		public updated_at?: Date
	) { }
}