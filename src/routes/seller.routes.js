const { Router } = require('express');
const {
	renderRol,
	redirectionSeller,
	renderHome,
	addProduct,
	renderProfile,
	renderUpdateUserInformation,
	updateUserInformation,
	updateUserImage,
	renderSuppliers,
	renderSuppliersForm,
	addSupplier,
	renderShoppingList,
} = require('../controllers/seller.controller');

const { isAuthenticatedSeller } = require('../helpers/auth');

const router = Router();

router
	.route('/seller/destiny')
	.get(isAuthenticatedSeller, renderRol)
	.post(isAuthenticatedSeller, redirectionSeller);

//router.get('/seller', isAuthenticatedSeller, renderHome);
router.get('/seller', renderHome);

router.post('/seller/product/add', isAuthenticatedSeller, addProduct);

router.get('/seller/user/:id', isAuthenticatedSeller, renderProfile);

router
	.route('/seller/user/update/:id')
	.get(isAuthenticatedSeller, renderUpdateUserInformation)
	.put(isAuthenticatedSeller, updateUserInformation);

router.put(
	'/seller/user/update/image/:id',
	isAuthenticatedSeller,
	updateUserImage
);

router.get('/seller/suppliers', isAuthenticatedSeller, renderSuppliers);

router
	.route('/seller/suppliers/add')
	.get(isAuthenticatedSeller, renderSuppliersForm)
	.post(isAuthenticatedSeller, addSupplier);

router.get('/seller/list', isAuthenticatedSeller, renderShoppingList);

module.exports = router;
