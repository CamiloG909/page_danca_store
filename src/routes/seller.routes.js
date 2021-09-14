const { Router } = require('express');
const {
	renderRol,
	redirectionSeller,
	renderHome,
	renderProfile,
	renderUpdateUserInformation,
	updateUserInformation,
} = require('../controllers/seller.controller');

const { isAuthenticatedSeller } = require('../helpers/auth');

const router = Router();

router.get('/seller/destiny', isAuthenticatedSeller, renderRol);
router.post('/seller/destiny', isAuthenticatedSeller, redirectionSeller);

router.get('/seller', isAuthenticatedSeller, renderHome);

router.get('/seller/user/:id', isAuthenticatedSeller, renderProfile);

router.get(
	'/seller/user/update/:id',
	isAuthenticatedSeller,
	renderUpdateUserInformation
);
router.put(
	'/seller/user/update/:id',
	isAuthenticatedSeller,
	updateUserInformation
);

module.exports = router;
