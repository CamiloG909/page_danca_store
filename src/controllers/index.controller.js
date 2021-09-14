const passport = require('passport');
const indexController = {};
const { db } = require('../database');
const bcrypt = require('bcryptjs');

indexController.renderIndex = (req, res) => {
	res.render('index', { title: 'Danca Store', footer: true });
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

// TODO: Arreglar errores para que no se borren todos los values y validar entrada de datos
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

	if (password.length <= 4) {
		errors.push({ error: 'La contraseña debe tener mínimo 5 caracteres' });
		req.flash('error_msg', 'La contraseña debe tener mínimo 5 caracteres');
	}
	if (errors.length > 0) {
		res.redirect('/signup');
		// res.render('signup', {
		// errors,
		// headerHelp: true,
		// title: 'Registrarse | Danca Store',
		// name,
		// last_name,
		// document_type,
		// document_number,
		// email,
		// phone_number,
		// town,
		// address,
		// });
	} else {
		const resEmail = await db.query(
			`select email from ${process.env.DB_SCHEMA}.user_ where email = $1;`,
			[email]
		);
		if (resEmail.rows.length >= 1) {
			req.flash('error_msg', 'El correo ya está en uso');
			res.redirect('/signup');
		} else {
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
		}
	}
};

indexController.logout = (req, res) => {
	req.logout();
	res.redirect('/');
};

module.exports = indexController;
