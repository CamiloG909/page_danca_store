const passport = require('passport');
const indexController = {};
const { db } = require('../database/connection');
const bcrypt = require('bcryptjs');
const { indexQuerys } = require('../database/querys');
const { validationResult } = require('express-validator');

indexController.renderIndex = (req, res) => {
	try {
		res.render('index', {
			title: 'Danca Store',
			footer: true,
		});
	} catch {
		res.redirect('/error');
	}
};

indexController.signin = passport.authenticate('local', {
	failureRedirect: '/',
	successRedirect: '/authority',
	failureFlash: true,
});

indexController.renderHelp = (req, res) => {
	try {
		res.render('help', {
			title: 'Ayuda | Danca Store',
			footerCN: true,
		});
	} catch {
		res.redirect('/error');
	}
};

indexController.renderSignup = (req, res) => {
	try {
		res.render('signup', {
			headerHelp: true,
			title: 'Registrarse | Danca Store',
		});
	} catch {
		res.redirect('/error');
	}
};

indexController.signup = async (req, res) => {
	try {
		// Validate errors
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400);
			req.flash('error_msg', errors.errors[0].msg);
			return res.redirect('/signup');
		}

		const {
			name,
			last_name,
			document_number,
			email,
			phone_number,
			town,
			address,
			password,
		} = req.body;
		const document_type = req.body.document_type === 'CC' ? 1 : 2;
		const passwordHash = await bcrypt.hash(password, 8);

		// Validate email
		const resEmail = await db.query(indexQuerys.signUp[0], [email]);
		if (resEmail.rows.length > 0) {
			req.flash('error_msg', 'El correo ya está en uso');
			return res.redirect('/signup');
		}

		// Save user in DB
		await db.query(indexQuerys.signUp[1], [
			email,
			passwordHash,
			email,
			phone_number,
			town,
			address,
		]);
		// Get new id user for other table
		const resId = await db.query(indexQuerys.signUp[2], [email]);
		const idUser = resId.rows[0].id;
		await db.query(indexQuerys.signUp[3], [idUser]);
		await db.query(indexQuerys.signUp[4], [
			document_type,
			document_number,
			name,
			last_name,
			idUser,
		]);
		req.flash(
			'success_msg',
			'Registro completado, vuelve al inicio para loguearte'
		);
		res.redirect('/signup');
	} catch {
		res.redirect('/error');
	}
};

indexController.logout = (req, res) => {
	try {
		req.logout();
		res.redirect('/');
	} catch {
		res.redirect('/error');
	}
};

indexController.renderError = (req, res) => {
	res.render('error', {
		title: 'Woops! | Danca Store',
		footerCN: true,
	});
};

module.exports = indexController;
