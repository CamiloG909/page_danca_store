const { Router } = require('express');
const {
	renderIndex,
	signin,
	renderHelp,
	renderSignup,
	signup,
	logout,
	renderError,
} = require('../controllers/index.controller');

const { isNotAuthenticated } = require('../helpers/auth');
const { body } = require('express-validator');

const router = Router();

router.get('/', isNotAuthenticated, renderIndex);
router.post('/login', isNotAuthenticated, signin);

router
	.route('/signup')
	.get(isNotAuthenticated, renderSignup)
	.post(
		isNotAuthenticated,
		[
			body(
				[
					'name',
					'last_name',
					'document_type',
					'document_number',
					'email',
					'phone_number',
					'town',
					'address',
					'password',
				],
				'Por favor completa todos los campos'
			)
				.not()
				.isEmpty()
				.trim(),
			body('document_number')
				.isInt()
				.withMessage('El número de documento debe ser numérico')
				.isLength({ min: 7 })
				.withMessage('El número de documento debe tener al menos 7 dígitos')
				.isLength({ max: 12 })
				.withMessage('El número de documento no debe tener más de 12 dígitos'),
			body('email', 'Digite un correo válido').isEmail(),
			body('phone_number')
				.isInt()
				.withMessage('El número de teléfono debe ser numérico')
				.isLength({ min: 7 })
				.withMessage('El número de teléfono debe tener al menos 7 dígitos')
				.isLength({ max: 14 })
				.withMessage('El número de teléfono no debe tener más de 14 dígitos'),
			body(
				'password',
				'La contraseña debe tener al menos 6 caracteres'
			).isLength({ min: 6 }),
		],
		signup
	);

router.get('/help', renderHelp);

router.get('/logout', logout);

router.get('/error', renderError);

module.exports = router;
