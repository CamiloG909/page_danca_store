const { Router } = require('express');
const {
	renderRol,
	redirectionSeller,
	renderHome,
	renderProducts,
	addProduct,
	renderProfile,
	renderUpdateUserInformation,
	updateUserInformation,
	updateUserImage,
	renderSuppliers,
	updateSupplier,
	deleteSupplier,
	renderSuppliersForm,
	addSupplier,
	renderShoppingList,
} = require('../controllers/seller.controller');

const { isAuthenticatedSeller } = require('../helpers/auth');
const { check, validationResult } = require('express-validator');

const router = Router();

router.get('/seller/home', isAuthenticatedSeller, renderHome);

router
	.route('/seller/products')
	.get(isAuthenticatedSeller, renderProducts)
	.put(isAuthenticatedSeller, renderProducts)
	.delete(isAuthenticatedSeller, renderProducts);

router.post('/seller/products/add', isAuthenticatedSeller, addProduct);

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

router
	.route('/seller/suppliers')
	.get(isAuthenticatedSeller, renderSuppliers)
	.put(
		isAuthenticatedSeller,
		[
			check('id', 'Id no válido').isLength({ min: 1 }).isNumeric(),
			check('company_name')
				.isLength({ min: 1 })
				.withMessage('Por favor llena los campos'),
			check('phone_number')
				.isLength({ min: 5 })
				.withMessage('El número de teléfono debe tener mínimo 5 caracteres')
				.isNumeric()
				.withMessage('El número de teléfono debe ser numérico')
				.isLength({ max: 16 })
				.withMessage(
					'El número de teléfono no debe tener más de 16 caracteres'
				),
			check('email')
				.isLength({ min: 1 })
				.withMessage('Por favor llena los campos')
				.isEmail()
				.withMessage('Digite un correo válido'),
			check('town', 'town no valido')
				.isLength({ min: 1 })
				.withMessage('Por favor llena los campos'),
			check('address')
				.isLength({ min: 1 })
				.withMessage('Por favor llena los campos'),
			check('status')
				.isLength({ min: 1 })
				.withMessage('Por favor llena los campos'),
		],
		updateSupplier
	)
	.delete(
		isAuthenticatedSeller,
		[check('id', 'Id no válido').isLength({ min: 1 }).isNumeric()],
		deleteSupplier
	);

router
	.route('/seller/suppliers/add')
	.get(isAuthenticatedSeller, renderSuppliersForm)
	.post(isAuthenticatedSeller, addSupplier);

router.get('/seller/list', isAuthenticatedSeller, renderShoppingList);

module.exports = router;
