const { Router } = require('express');
const {
	renderRol,
	renderHome,
	renderComputers,
	renderPhones,
	renderProductDetail,
	renderShoppingCart,
	renderShoppingHistory,
	renderProfile,
	renderUpdateUserInformation,
	updateUserInformation,
} = require('../controllers/client.controller');

const { isAuthenticated } = require('../helpers/auth');

const router = Router();

router.get('/authority', isAuthenticated, renderRol);

router.get('/home', isAuthenticated, renderHome);
router.get('/category/computers', isAuthenticated, renderComputers);
router.get('/category/phones', isAuthenticated, renderPhones);

router.get('/product/:id', isAuthenticated, renderProductDetail);

router.get('/cart', isAuthenticated, renderShoppingCart);

router.get('/history/:id', isAuthenticated, renderShoppingHistory);

router.get('/user/:id', isAuthenticated, renderProfile);

router.get('/user/update/:id', isAuthenticated, renderUpdateUserInformation);
router.put('/user/update/:id', isAuthenticated, updateUserInformation);

module.exports = router;
