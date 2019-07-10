
// baseUrl
export const baseUrl: string = 'http://localhost:8000/api/';


// Admin
export const createAdminUrl: string 	=	baseUrl+'auth/register';
export const updateAdminUrl: string 	=	baseUrl+'admin/update';
export const getAdminUrl: string 		= 	'assets/data/admin.json';
export const deleteAdminUrl: string 	=	baseUrl+'admin/delete';

export const loginAdminUrl: string 		= 	baseUrl+'auth/login';
export const logoutAdminUrl: string 	= 	baseUrl+'auth/logout';
export const refreshAdminUrl: string 	= 	baseUrl+'auth/refresh';


// User
export const lightlyValidateUrl: string =	baseUrl+'auth/user/lightlyValidate';
export const createUserUrl: string 		=	baseUrl+'auth/user/create';
export const userEmailExistsUrl: string =	baseUrl+'auth/user/userEmailExists';
export const recoverUserUrl: string 	=	baseUrl+'auth/user/recover';
export const createUserLogoUrl: string 	=	baseUrl+'auth/user/uploadLogo';
export const userLogoBaseUrl: string 	=	'http://localhost:8000/images/logos/'; // + the user logo-name.png

export const loginUserUrl: string 		= 	baseUrl+'auth/user/login';
export const logoutUserUrl: string 		= 	baseUrl+'auth/user/logout';
export const refreshUserUrl: string 	= 	baseUrl+'auth/user/refresh';

export const updateUserUrl: string 		=	baseUrl+'user/update';
export const getUserUrl: string 		= 	'assets/data/user.json';
export const deleteUserUrl: string 		=	baseUrl+'user/delete';


// Product
export const createProductUrl: string 	=	baseUrl+'product/create';
export const updateProductUrl: string 	=	baseUrl+'product/update';
export const getBestProductsUrl: string =	'assets/data/products-best.json';
export const getProductsUrl: string 	=	'assets/data/products.json';
export const getProductUrl: string 		=	'assets/data/product.json';
export const deleteProductUrl: string 	=	baseUrl+'product/delete';


// Cart
export const createCartUrl: string 	=	baseUrl+'cart/create';
export const updateCartUrl: string 	=	baseUrl+'cart/update';
export const getCartsUrl: string 	=	'assets/data/cart.json';
export const deleteCartUrl: string 	=	baseUrl+'cart/delete';


// Command
export const createCommandUrl: string 	=	baseUrl+'command/create';
export const updateCommandUrl: string 	=	baseUrl+'command/update';
export const getCommandsUrl: string 	=	'assets/data/commands.json';
export const getCommandUrl: string 		=	'assets/data/command.json';
export const deleteCommandUrl: string 	=	baseUrl+'command/delete';

export const setCommandViewedUrl: string 	=	baseUrl+'command/setCommandViewed';



// Statistics
export const getStatisticsUrl: string 	= 'assets/data/statistics.json';


// Report
export const createReportUrl: string 	=	baseUrl+'report/create';