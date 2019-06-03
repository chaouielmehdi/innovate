
/**
 * Statistic class
 */
export class Statistics {
	constructor(
		public commands?: {
			count: number,
			delivered: number,
			confirmed: number,
			commanded: number,
			canceled: number,
			notViewedNumber: number
		},
		public cart?: {
			count: number,
			canceled: number
		},
		public credits?: {
			count: number,
			paid: number
		},
		public products?: {
			notViewedNumber: number
		},
		public support?: {
			notViewedNumber: number
		}
	) { }
}