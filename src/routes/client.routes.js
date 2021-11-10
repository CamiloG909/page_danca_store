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
const { body, check } = require('express-validator');

const router = Router();

router.get('/authority', isAuthenticated, renderRol);

router.get('/home', isAuthenticated, renderHome);
router.get('/category/computers', isAuthenticated, renderComputers);
router.get('/category/phones', isAuthenticated, renderPhones);

router.route('/product/:id').get(isAuthenticated, renderProductDetail);

router.get('/cart', isAuthenticated, renderShoppingCart);

router.post('/cart/pay', isAuthenticated, productsPay);

router.get('/history', isAuthenticated, renderShoppingHistory);

router.get('/user/:id', isAuthenticated, renderProfile);

router
	.route('/user/update/:id')
	.get(isAuthenticated, renderUpdateUserInformation)
	.put(
		isAuthenticated,
		[
			body(
				[
					'name',
					'last_name',
					'email',
					'phone_number',
					'town',
					'address',
					'confirm_password',
				],
				'Por favor completa todos los campos'
			)
				.not()
				.isEmpty()
				.trim(),
			body('email', 'Digite un correo válido').isEmail(),
			body('phone_number')
				.isInt()
				.withMessage('Por favor corrija el número de teléfono')
				.isLength({ min: 7 })
				.withMessage('El número de teléfono debe tener mínimo 7 caracteres')
				.isLength({ max: 14 })
				.withMessage(
					'El número de teléfono no debe tener más de 14 caracteres'
				),
		],
		updateUserInformation
	);

router.put(
	'/user/update/image/:id',
	isAuthenticated,
	[
		body('image_url')
			.not()
			.isEmpty()
			.trim()
			.withMessage('Por favor completa el campo')
			.isURL()
			.withMessage('Por favor ingresa una URL válida'),
	],
	updateUserImage
);

module.exports = router;
