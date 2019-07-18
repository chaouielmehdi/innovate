
// baseURL
export const baseURL: string 				= 'http://localhost:8000/api/';


// User
export const userLoginURL: string 			=	baseURL+'user/login';
export const userLogoutURL: string 			=	baseURL+'user/logout';
export const userRefreshURL: string 		=	baseURL+'user/refresh';

export const userAsyncValidateURL: string 	=	baseURL+'user/asyncValidate';
export const userExistsURL: string 			=	baseURL+'user/exists';
export const userRecoverURL: string 		=	baseURL+'user/recover';
export const userCreateLogoURL: string 		=	baseURL+'user/uploadLogo';
export const userLogoBaseURL: string 		=	'http://localhost:8000/images/logos/'; // + the user logo-name.png
export const userCreateURL: string 			=	baseURL+'user/create';

export const userUpdateURL: string 			=	baseURL+'user/update';
export const userGetURL: string 			=	baseURL+'user/get';
export const userDeleteURL: string 			=	baseURL+'user/delete';


// Admin
export const adminLoginURL: string 			=	baseURL+'admin/login';
export const adminLogoutURL: string 		=	baseURL+'admin/logout';
export const adminRefreshURL: string 		=	baseURL+'admin/refresh';

export const adminAsyncValidateURL: string 	=	baseURL+'admin/asyncValidate';
export const adminCreateImageURL: string 	=	baseURL+'admin/uploadImage';
export const adminCreateURL: string 		=	baseURL+'admin/create';

export const adminUpdateURL: string 		=	baseURL+'admin/update';
export const adminGetURL: string 			=	baseURL+'admin/get';
export const adminDeleteURL: string 		=	baseURL+'admin/delete';


// Product
export const productCreateURL: string 		=	baseURL+'product/create';
export const productUpdateURL: string 		=	baseURL+'product/update';
export const productGetBestsURL: string 	=	'assets/data/products-best.json';
export const productsGetURL: string 		=	'assets/data/products.json';
export const productGetURL: string 			=	'assets/data/product.json';
export const productDeleteURL: string 		=	baseURL+'product/delete';


// Cart
export const cartCreateURL: string 			=	baseURL+'cart/create';
export const cartUpdateURL: string 			=	baseURL+'cart/update';
export const cartsGetURL: string 			=	'assets/data/cart.json';
export const cartDeleteURL: string 			=	baseURL+'cart/delete';


// Command
export const commandCreateURL: string 		=	baseURL+'command/create';
export const commandUpdateURL: string 		=	baseURL+'command/update';
export const commandsGetURL: string 		=	'assets/data/commands.json';
export const commandGetURL: string 			=	'assets/data/command.json';
export const commandDeleteURL: string 		=	baseURL+'command/delete';

export const commandSetViewedURL: string 	=	baseURL+'command/setCommandViewed';


// Statistics
export const statisticsGetURL: string 		= 'assets/data/statistics.json';


// Report
export const reportCreateURL: string 		=	baseURL+'report/create';