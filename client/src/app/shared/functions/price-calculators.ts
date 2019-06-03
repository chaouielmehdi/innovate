import { Command } from '../models/Command';


/**
 * Calculates total price
 * @param price 
 * @param sold 
 * @param quantity 
 * @returns tot price
 */
export function calTotPrice(price: number, sold: number, quantity: number): number{
	return (price-price*sold/100)*quantity;
}



// unused
/**
 * Calculates Many Command's ProductsQuantities Total Price
 * @param command 
 * @returns products quantities tot price 
 */
export function calProductsQuantitiesTotPrice(command: Command): Array<number>{
	var productsQuantitiesPrices: Array<number> = [];

		command.products_quantities.forEach((product_quantity) => {
			var productQuantityPrice: number = 0;
	
			productQuantityPrice += calTotPrice(
				product_quantity['product'].price,
				product_quantity['product'].sold,
				product_quantity['quantity']
			);

			productsQuantitiesPrices.push(productQuantityPrice);
		});


	return productsQuantitiesPrices;
}



/**
 * Calculates One Command Total Price
 * @param command 
 * @returns command tot price 
 */
export function calCommandTotPrice(command: Command): number {
	var commandTotalPrice: number = 0;

	command.products_quantities.forEach((product_quantity) => {
		commandTotalPrice += calTotPrice(
			product_quantity['product'].price,
			product_quantity['product'].sold,
			product_quantity['quantity']
		);
	});

	return commandTotalPrice;
}



/*
-------------------------------------------------
Many Commands Total Price
-------------------------------------------------
*/
// unused

/**
 * Calculates Many Commands Total Price
 * @param commands 
 * @returns commands tot price 
 */
export function calCommandsTotPrice(commands: Command[]): Array<number>{
	var commandTotalPrices: Array<number> = [];

	commands.forEach((command) => {
		var commandTotalPrice: number = 0;

		command.products_quantities.forEach((product_quantity) => {
			commandTotalPrice += calTotPrice(
				product_quantity['product'].price,
				product_quantity['product'].sold,
				product_quantity['quantity']
			);
		});

		commandTotalPrices.push(commandTotalPrice);
	});

	return commandTotalPrices;
}
