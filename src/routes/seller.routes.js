const { Router } = require('express');
const {
	renderHome,
	renderProducts,
	addProduct,
	updateProduct,
	updateStatusProduct,
	deleteProduct,
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
const { body } = require('express-validator');

const router = Router();

router.get('/seller/home', isAuthenticatedSeller, renderHome);

router.get('/seller/products', isAuthenticatedSeller, renderProducts);

router.post(
	'/seller/products/add',
	isAuthenticatedSeller,
	[
		body(
			[
				'reference',
				'price',
				'name',
				'specs',
				'information',
				'color',
				'stock',
				'category',
				'supplier',
			],
			'Por favor completa todos los campos'
		)
			.not()
			.isEmpty()
			.trim(),
		body('stock', 'Por favor corrija las existencias').isInt(),
		body('category', 'ID de categoría no válida').isInt(),
		body('supplier', 'ID de proveedor no válido').isInt(),
	],
	addProduct
);

router.put(
	'/seller/product/edit',
	isAuthenticatedSeller,
	[
		body(
			[
				'reference',
				'price',
				'name',
				'specs',
				'information',
				'color',
				'stock',
				'category',
				'supplier',
			],
			'Por favor completa todos los campos'
		)
			.not()
			.isEmpty()
			.trim(),
		body('stock', 'Por favor corrija las existencias').isInt(),
		body('category', 'ID de categoría no válida').isInt(),
		body('supplier', 'ID de proveedor no válida').isInt(),
	],
	updateProduct
);

router.put(
	'/seller/product/edit-status',
	isAuthenticatedSeller,
	updateStatusProduct
);

router.delete('/seller/product/delete', isAuthenticatedSeller, deleteProduct);

router.get('/seller/user/:id', isAuthenticatedSeller, renderProfile);

router
	.route('/seller/user/update/:id')
	.get(isAuthenticatedSeller, renderUpdateUserInformation)
	.put(
		isAuthenticatedSeller,
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
			body('id', 'ID de proveedor no válido').not().isEmpty().isInt().trim(),
			body(
				['company_name', 'phone_number', 'email', 'town', 'address', 'status'],
				'Por favor completa todos los campos'
			)
				.not()
				.isEmpty()
				.trim(),
			body('phone_number')
				.isInt()
				.withMessage('El número de teléfono debe ser numérico')
				.isLength({ min: 5 })
				.withMessage('El número de teléfono debe tener mínimo 5 caracteres')
				.isLength({ max: 16 })
				.withMessage(
					'El número de teléfono no debe tener más de 16 caracteres'
				),
			body('email', 'Digite un correo válido').isEmail(),
		],
		updateSupplier
	)
	.delete(
		isAuthenticatedSeller,
		[body('id', 'ID de proveedor no válido').not().isEmpty().isInt().trim()],
		deleteSupplier
	);

router
	.route('/seller/suppliers/add')
	.get(isAuthenticatedSeller, renderSuppliersForm)
	.post(
		isAuthenticatedSeller,
		[
			body(
				['company_name', 'phone_number', 'email', 'town', 'address'],
				'Por favor completa todos los campos'
			)
				.not()
				.isEmpty()
				.trim(),
			body('phone_number')
				.isInt()
				.withMessage('El número de teléfono debe ser numérico')
				.isLength({ min: 5 })
				.withMessage('El número de teléfono debe tener mínimo 5 caracteres')
				.isLength({ max: 16 })
				.withMessage(
					'El número de teléfono no debe tener más de 16 caracteres'
				),
			body('email', 'Digite un correo válido').isEmail(),
		],
		addSupplier
	);

router.get('/seller/list', isAuthenticatedSeller, renderShoppingList);

module.exports = router;
