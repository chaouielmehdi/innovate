
// baseURL
export const baseURL: string = 'http://localhost:8000/api/';


// User
export const userAsyncValidateUrl: string 	=	baseURL+'user/asyncValidate';
export const userCreateUrl: string 			=	baseURL+'user/create';
export const userExistsUrl: string 			=	baseURL+'user/exists';
export const userRecoverUrl: string 		=	baseURL+'user/recover';
export const userCreateLogoUrl: string 		=	baseURL+'user/uploadLogo';
export const userLogoBaseURL: string 		=	'http://localhost:8000/images/logos/'; // + the user logo-name.png

export const userLoginUrl: string 			=	baseURL+'user/login';
export const userLogoutUrl: string 			=	baseURL+'user/logout';
export const userRefreshURL: string 		=	baseURL+'user/refresh';

export const userUpdateURL: string 			=	baseURL+'user/update';
export const userGetURL: string 			=	baseURL+'user/me';
export const userDeleteURL: string 			=	baseURL+'user/delete';


// Admin
export const createAdminUrl: string 	=	baseURL+'auth/register';
export const updateAdminUrl: string 	=	baseURL+'admin/update';
export const getAdminUrl: string 		=	'assets/data/admin.json';
export const deleteAdminUrl: string 	=	baseURL+'admin/delete';

export const loginAdminUrl: string 		=	baseURL+'auth/login';
export const logoutAdminUrl: string 	=	baseURL+'auth/logout';
export const refreshAdminUrl: string 	=	baseURL+'auth/refresh';


// Product
export const createProductUrl: string 	=	baseURL+'product/create';
export const updateProductUrl: string 	=	baseURL+'product/update';
export const getBestProductsUrl: string =	'assets/data/products-best.json';
export const getProductsUrl: string 	=	'assets/data/products.json';
export const getProductUrl: string 		=	'assets/data/product.json';
export const deleteProductUrl: string 	=	baseURL+'product/delete';


// Cart
export const createCartUrl: string 	=	baseURL+'cart/create';
export const updateCartUrl: string 	=	baseURL+'cart/update';
export const getCartsUrl: string 	=	'assets/data/cart.json';
export const deleteCartUrl: string 	=	baseURL+'cart/delete';


// Command
export const createCommandUrl: string 	=	baseURL+'command/create';
export const updateCommandUrl: string 	=	baseURL+'command/update';
export const getCommandsUrl: string 	=	'assets/data/commands.json';
export const getCommandUrl: string 		=	'assets/data/command.json';
export const deleteCommandUrl: string 	=	baseURL+'command/delete';

export const setCommandViewedUrl: string 	=	baseURL+'command/setCommandViewed';


// Statistics
export const getStatisticsUrl: string 	= 'assets/data/statistics.json';


// Report
export const createReportUrl: string 	=	baseURL+'report/create';