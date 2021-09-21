const passport = require('passport');
const indexController = {};
const { db } = require('../database');
const bcrypt = require('bcryptjs');

indexController.renderIndex = (req, res) => {
	res.render('index', {
		title: 'Danca Store',
		footer: true,
	});
};

indexController.signin = passport.authenticate('local', {
	failureRedirect: '/',
	successRedirect: '/authority',
	failureFlash: true,
});

indexController.renderHelp = (req, res) => {
	res.render('help', {
		headerSkeleto: true,
		title: 'Ayuda | Danca Store',
		footerCN: true,
	});
};

indexController.renderSignup = (req, res) => {
	res.render('signup', {
		headerHelp: true,
		title: 'Registrarse | Danca Store',
	});
};

indexController.signup = async (req, res) => {
	let errors = [];
	const {
		name,
		last_name,
		document_type,
		document_number,
		email,
		phone_number,
		town,
		address,
		password,
	} = req.body;

	let documentTypeId;

	if (document_type == 'CC') {
		documentTypeId = 1;
	} else if (document_type == 'CE') {
		documentTypeId = 2;
	}

	const passwordHash = await bcrypt.hash(password, 8);

	if (
		name.length == 0 ||
		last_name.length == 0 ||
		document_type.length == 0 ||
		document_number.length == 0 ||
		email.length == 0 ||
		phone_number.length == 0 ||
		town.length == 0 ||
		address.length == 0 ||
		password.length == 0
	) {
		errors.push({
			error: 'Por favor llena los campos',
		});
		res.render('signup', {
			errors,
			headerHelp: true,
			title: 'Registrarse | Danca Store',
			name,
			last_name,
			document_type,
			document_number,
			email,
			phone_number,
			town,
			address,
			password,
		});
	} else {
		if (document_number.length > 12) {
			errors.push({
				error: 'El número de documento no debe tener más de 12 caracteres',
			});
			res.render('signup', {
				errors,
				headerHelp: true,
				title: 'Registrarse | Danca Store',
				name,
				last_name,
				document_type,
				email,
				phone_number,
				town,
				address,
				password,
			});
		} else if (document_number.length < 7) {
			errors.push({
				error: 'El número de documento debe tener mínimo 7 caracteres',
			});
			res.render('signup', {
				errors,
				headerHelp: true,
				title: 'Registrarse | Danca Store',
				name,
				last_name,
				document_type,
				email,
				phone_number,
				town,
				address,
				password,
			});
		} else if (document_number.includes('.') || document_number.includes(',')) {
			errors.push({
				error: 'El número de documento solo debe tener números',
			});
			res.render('signup', {
				errors,
				headerHelp: true,
				title: 'Registrarse | Danca Store',
				name,
				last_name,
				document_type,
				email,
				phone_number,
				town,
				address,
				password,
			});
		} else {
			if (email.indexOf('@') == -1) {
				errors.push({
					error: 'Digite un correo válido',
				});
				res.render('signup', {
					errors,
					headerHelp: true,
					title: 'Registrarse | Danca Store',
					name,
					last_name,
					document_type,
					document_number,
					phone_number,
					town,
					address,
					password,
				});
			} else if (email.indexOf('@') >= 0) {
				const resEmail = await db.query(
					`select email from ${process.env.DB_SCHEMA}.user_ where email = $1;`,
					[email]
				);
				if (resEmail.rows.length >= 1) {
					errors.push({
						error: 'El correo ya está en uso',
					});
					res.render('signup', {
						errors,
						headerHelp: true,
						title: 'Registrarse | Danca Store',
						name,
						last_name,
						document_type,
						document_number,
						phone_number,
						town,
						address,
						password,
					});
				} else {
					if (phone_number.length > 14) {
						errors.push({
							error: 'El número de teléfono no debe tener más de 14 caracteres',
						});
						res.render('signup', {
							errors,
							headerHelp: true,
							title: 'Registrarse | Danca Store',
							name,
							last_name,
							document_type,
							document_number,
							email,
							town,
							address,
							password,
						});
					} else if (phone_number.length < 7) {
						errors.push({
							error: 'El número de teléfono debe tener mínimo 7 caracteres',
						});
						res.render('signup', {
							errors,
							headerHelp: true,
							title: 'Registrarse | Danca Store',
							name,
							last_name,
							document_type,
							document_number,
							email,
							town,
							address,
							password,
						});
					} else {
						if (password.length < 6) {
							errors.push({
								error: 'La contraseña debe tener mínimo 6 caracteres',
							});
							res.render('signup', {
								errors,
								headerHelp: true,
								title: 'Registrarse | Danca Store',
								name,
								last_name,
								document_type,
								document_number,
								email,
								phone_number,
								town,
								address,
							});
						} else {
							// Complete register
							const resUser_ = await db.query(
								`insert into ${process.env.DB_SCHEMA}.user_ (login,password,email,phone_number,town,address,status) values ($1,$2,$3,$4,$5,$6,'Activo');`,
								[email, passwordHash, email, phone_number, town, address]
							);
							const resId = await db.query(
								`select id from ${process.env.DB_SCHEMA}.user_ where email = $1;`,
								[email]
							);

							const idUser = resId.rows[0].id;

							const resRol = await db.query(
								`insert into ${process.env.DB_SCHEMA}.user_rol (rol_name,id_user) values ('Cliente',$1)`,
								[idUser]
							);
							const resClient = await db.query(
								`insert into ${process.env.DB_SCHEMA}.client (id_document_type,document_number,name,last_name,id_user) values
						($1, $2, $3, $4, $5);`,
								[documentTypeId, document_number, name, last_name, idUser]
							);
							req.flash('success_msg', 'Te has registrado satisfactoriamente');
							res.redirect('/signup');
							// End complete register
						}
					}
				}
			}
		}
	}
};

indexController.logout = (req, res) => {
	req.logout();
	res.redirect('/');
};

module.exports = indexController;
