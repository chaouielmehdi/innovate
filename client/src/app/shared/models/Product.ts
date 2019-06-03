/**
 * Product class
 */
export class Product {
	constructor(
		public id?: number,
		public img?: string,
		public name?: string,
		public desc?: string,
		public in_store?: boolean,
		public price?: number,
		public sold?: number,
		public canal?: string,
		public isViewed?: boolean,
		public created_at?: Date,
		public updated_at?: Date
	) { }
}