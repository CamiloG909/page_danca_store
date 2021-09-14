const sellerController = {};
const { db } = require('../database');

sellerController.renderRol = (req, res) => {
	res.render('seller/rol', {
		headerSkeleto: true,
		title: 'Bienvenido | Danca Store',
	});
};

sellerController.redirectionSeller = (req, res) => {
	const { rol } = req.body;
	if (rol == 'seller') {
		res.redirect('/seller');
	} else if (rol == 'client') {
		res.redirect('/home');
	}
};

sellerController.renderHome = async (req, res) => {
	const response = await db.query(`select * from surr.rol;`);
	res.render('seller/products', {
		headerSeller: true,
		menuSeller: true,
		title: 'Panel | Danca Store',
		response,
		footerSeller: true,
	});
};

sellerController.renderProfile = async (req, res) => {
	const idUser = req.user.rows[0].id;
	if (req.params.id != idUser) {
		return res.redirect(`/seller/user/${idUser}`);
	}
	const response = await db.query(
		`select u.id, c.name, c.last_name, u.email, u.phone_number, c.document_number, u.town, u.address, u.image_url from ${process.env.DB_SCHEMA}.client c inner join ${process.env.DB_SCHEMA}.user_ u on c.id_user = u.id where u.id = $1;`,
		[idUser]
	);
	const resRows = response.rows[0];
	const title = `${resRows.name} ${resRows.last_name}`;
	res.render('seller/profile', {
		headerSeller: true,
		title: `${title} | Danca Store`,
		menuSeller: true,
		resRows,
		footerSeller: true,
	});
};

sellerController.renderUpdateUserInformation = async (req, res) => {
	const idUser = req.user.rows[0].id;
	if (req.params.id != idUser) {
		return res.redirect(`/seller/user/update/${idUser}`);
	}
	const response = await db.query(
		`select u.id, c.name, c.last_name, u.email, u.phone_number, u.town, u.address, u.image_url from ${process.env.DB_SCHEMA}.client c inner join ${process.env.DB_SCHEMA}.user_ u on c.id_user = u.id where u.id = $1;`,
		[req.params.id]
	);
	const resRows = response.rows[0];
	res.render('seller/update-profile', {
		headerSeller: true,
		title: 'Actualizar perfil | Danca Store',
		menuSeller: true,
		resRows,
		footerSeller: true,
	});
};

sellerController.updateUserInformation = async (req, res) => {
	const idUser = req.user.rows[0].id;
	const {
		name,
		last_name,
		email,
		phone_number,
		town,
		address,
		password,
		confirm_password,
	} = req.body;

	if (password.length <= 4) {
		req.flash('error_msg', 'La contraseña debe tener mínimo 5 caracteres');
		res.redirect(`/seller/user/update/${idUser}`);
	} else {
		const resPass = await db.query(
			`select password from ${process.env.DB_SCHEMA}.user_ where id = $1;`,
			[idUser]
		);
		const match = await bcrypt.compare(
			confirm_password,
			resPass.rows[0].password
		);
		if (match) {
			const resEmail = await db.query(
				`select email from ${process.env.DB_SCHEMA}.user_ where email = $1;`,
				[email]
			);
			if (resEmail.rows.length >= 1) {
				req.flash('error_msg', 'El correo ya está en uso');
				res.redirect(`/seller/user/update/${idUser}`);
			} else {
				const passwordHash = await bcrypt.hash(password, 8);
				const resUser_ = await db.query(
					`update ${process.env.DB_SCHEMA}.user_ set login=$1,password=$2,email=$3,phone_number=$4,town=$5,address=$6 where id = $7;`,
					[email, passwordHash, email, phone_number, town, address, idUser]
				);
				const resClient = await db.query(
					`update ${process.env.DB_SCHEMA}.client set name=$1,last_name=$2 where id_user = $3;`,
					[name, last_name, idUser]
				);
				req.flash('success_msg', 'Datos actualizados');
				res.redirect(`/seller/user/update/${idUser}`);
			}
		} else {
			req.flash('error_msg', 'La contraseña actual no coincide');
			res.redirect(`/seller/user/update/${idUser}`);
		}
	}
};

module.exports = sellerController;
