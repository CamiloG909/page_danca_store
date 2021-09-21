const { Router } = require('express');
const {
	renderRol,
	renderHome,
	renderComputers,
	renderPhones,
	renderProductDetail,
	addCartProduct,
	renderShoppingCart,
	clearProductsCart,
	productsPay,
	renderShoppingHistory,
	redirectionShoppingHistory,
	renderProfile,
	renderUpdateUserInformation,
	updateUserInformation,
	updateUserImage,
} = require('../controllers/client.controller');

const { isAuthenticated } = require('../helpers/auth');

const router = Router();

router.get('/authority', isAuthenticated, renderRol);

router.get('/home', isAuthenticated, renderHome);
router.get('/category/computers', isAuthenticated, renderComputers);
router.get('/category/phones', isAuthenticated, renderPhones);

router
	.route('/product/:id')
	.get(isAuthenticated, renderProductDetail)
	.post(isAuthenticated, addCartProduct);

router.get('/cart', isAuthenticated, renderShoppingCart);
router
	.route('/cart/clear')
	.get(isAuthenticated, (req, res) => res.redirect('/home'))
	.post(isAuthenticated, clearProductsCart);

router
	.route('/cart/pay')
	.get(isAuthenticated, (req, res) => res.redirect('/home'))
	.post(isAuthenticated, productsPay);

router.get('/history/:id', isAuthenticated, renderShoppingHistory);
router.get('/history', isAuthenticated, redirectionShoppingHistory);

router.get('/user/:id', isAuthenticated, renderProfile);

router
	.route('/user/update/:id')
	.get(isAuthenticated, renderUpdateUserInformation)
	.put(isAuthenticated, updateUserInformation);

router.put('/user/update/image/:id', isAuthenticated, updateUserImage);

module.exports = router;
