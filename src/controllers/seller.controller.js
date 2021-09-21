const sellerController = {};
const { db } = require('../database');
const bcrypt = require('bcryptjs');

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
	const suppliers = await db.query(
		`select id, company_name from ${process.env.DB_SCHEMA}.supplier where status = 'Activo';`
	);

	const suppRows = suppliers.rows;
	res.render('seller/products', {
		headerSeller: true,
		menuSeller: true,
		title: 'Panel | Danca Store',
		suppRows,
		footerSeller: true,
	});
};

sellerController.addProduct = async (req, res) => {
	const {
		reference,
		name,
		price,
		picture,
		specs,
		information,
		color,
		stock,
		category,
		supplier,
	} = req.body;

	let errors = [];

	if (
		reference.length == 0 ||
		name.length == 0 ||
		price.length == 0 ||
		picture.length == 0 ||
		specs.length == 0 ||
		information.length == 0 ||
		color.length == 0 ||
		stock.length == 0 ||
		category.length == 0 ||
		supplier.length == 0
	) {
		req.flash('error_msg', 'Por favor llena los campos');
		res.redirect('/seller');
	} else {
		const suppliers = await db.query(
			`select id, company_name from ${process.env.DB_SCHEMA}.supplier where status = 'Activo';`
		);
		const suppRows = suppliers.rows;

		const resReference = await db.query(
			`select reference from ${process.env.DB_SCHEMA}.product where reference = $1`,
			[reference]
		);

		if (resReference.rows.length > 0) {
			errors.push({
				error: 'Referencia no válida',
			});
			res.render('seller/products', {
				headerSeller: true,
				menuSeller: true,
				title: 'Panel | Danca Store',
				errors,
				name,
				price,
				picture,
				specs,
				information,
				color,
				stock,
				category,
				supplier,
				suppRows,
				footerSeller: true,
			});
		} else {
			const response = await db.query(
				`insert into ${process.env.DB_SCHEMA}.product (reference,name,price,picture,specs,information,color,stock,id_category,id_supplier,status) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'Disponible');`,
				[
					reference,
					name,
					price,
					picture,
					specs,
					information,
					color,
					stock,
					category,
					supplier,
				]
			);
			req.flash('success_msg', `${name} agregado satisfactoriamente`);
			res.redirect('/seller');
		}
	}
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

	const passwordHash = await bcrypt.hash(password, 8);

	if (
		name.length == 0 ||
		last_name.length == 0 ||
		email.length == 0 ||
		phone_number.length == 0 ||
		town.length == 0 ||
		address.length == 0 ||
		password.length == 0 ||
		confirm_password.length == 0
	) {
		req.flash('error_msg', 'Por favor llena los campos');
		res.redirect(`/seller/user/update/${idUser}`);
	} else {
		if (email.indexOf('@') == -1) {
			req.flash('error_msg', 'Digite un correo válido');
			res.redirect(`/seller/user/update/${idUser}`);
		} else if (email.indexOf('@') >= 0) {
			const resEmail = await db.query(
				`select email from ${process.env.DB_SCHEMA}.user_ where email = $1;`,
				[email]
			);

			const resUserEmail = await db.query(
				`select email from ${process.env.DB_SCHEMA}.user_ u where id = $1;`,
				[idUser]
			);

			if (resUserEmail.rows[0].email == email || resEmail.rows.length == 0) {
				if (phone_number.length > 14) {
					req.flash(
						'error_msg',
						'El número de teléfono no debe tener más de 14 caracteres'
					);
					res.redirect(`/seller/user/update/${idUser}`);
				} else if (phone_number.length < 7) {
					req.flash(
						'error_msg',
						'El número de teléfono debe tener mínimo 7 caracteres'
					);
					res.redirect(`/seller/user/update/${idUser}`);
				} else {
					if (password.length < 6) {
						req.flash(
							'error_msg',
							'La contraseña debe tener mínimo 6 caracteres'
						);
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
						if (!match) {
							req.flash('error_msg', 'La contraseña actual no coincide');
							res.redirect(`/seller/user/update/${idUser}`);
						} else if (match) {
							// Complete update
							const resUser_ = await db.query(
								`update ${process.env.DB_SCHEMA}.user_ set login=$1,password=$2,email=$3,phone_number=$4,town=$5,address=$6 where id = $7;`,
								[
									email,
									passwordHash,
									email,
									phone_number,
									town,
									address,
									idUser,
								]
							);
							const resClient = await db.query(
								`update ${process.env.DB_SCHEMA}.client set name=$1,last_name=$2 where id_user = $3;`,
								[name, last_name, idUser]
							);
							req.flash('success_msg', 'Datos actualizados');
							res.redirect(`/seller/user/${idUser}`);
							// End complete update
						}
					}
				}
			} else if (resEmail.rows.length >= 1) {
				req.flash('error_msg', 'El correo ya está en uso');
				res.redirect(`/seller/user/update/${idUser}`);
			}
		}
	}
};

sellerController.updateUserImage = async (req, res) => {
	const idUser = req.user.rows[0].id;
	const { image_url } = req.body;

	if (image_url.length == 0) {
		req.flash('error_msg', 'Por favor llena el campo');
		res.redirect(`/seller/user/update/${idUser}`);
	} else {
		const resUser_ = await db.query(
			`update ${process.env.DB_SCHEMA}.user_ set image_url = $1 where id = $2;`,
			[image_url, idUser]
		);
		req.flash('success_msg', 'Imagen actualizada');
		res.redirect(`/seller/user/${idUser}`);
	}
};

sellerController.renderSuppliers = async (req, res) => {
	const response = await db.query(
		`select id, company_name, phone_number, email, town, address, status from ${process.env.DB_SCHEMA}.supplier order by id DESC;`
	);
	const resRows = response.rows;

	for (let i in resRows) {
		if (resRows[i].status === 'Activo') {
			const newResponse = resRows[i];
			newResponse.statusActive = true;
		}
	}

	res.render('seller/suppliers', {
		headerSeller: true,
		title: 'Proveedores | Danca Store',
		menuSeller: true,
		category: 'Proveedores',
		resRows,
		footerSeller: true,
	});
};

sellerController.renderSuppliersForm = (req, res) => {
	res.render('seller/add-suppliers', {
		headerSeller: true,
		title: 'Añadir proveedor | Danca Store',
		menuSeller: true,
		footerSeller: true,
	});
};

sellerController.addSupplier = async (req, res) => {
	const { company_name, phone_number, email, town, address } = req.body;

	let errors = [];

	if (
		company_name.length == 0 ||
		phone_number.length == 0 ||
		email.length == 0 ||
		town.length == 0 ||
		address.length == 0
	) {
		errors.push({
			error: 'Por favor llena los campos',
		});
		res.render('seller/add-suppliers', {
			headerSeller: true,
			title: 'Añadir proveedor | Danca Store',
			errors,
			company_name,
			phone_number,
			email,
			town,
			address,
			menuSeller: true,
			footerSeller: true,
		});
	} else {
		const resCompanyName = await db.query(
			`select company_name from ${process.env.DB_SCHEMA}.supplier where company_name = $1;`,
			[company_name]
		);

		if (resCompanyName.rows.length > 0) {
			errors.push({
				error: `${company_name} ya ha sido agregado`,
			});
			res.render('seller/add-suppliers', {
				headerSeller: true,
				title: 'Añadir proveedor | Danca Store',
				errors,
				phone_number,
				email,
				town,
				address,
				menuSeller: true,
				footerSeller: true,
			});
		} else {
			if (phone_number.length > 16) {
				errors.push({
					error: 'El número de teléfono no debe tener más de 16 caracteres',
				});
				res.render('seller/add-suppliers', {
					headerSeller: true,
					title: 'Añadir proveedor | Danca Store',
					errors,
					company_name,
					email,
					town,
					address,
					menuSeller: true,
					footerSeller: true,
				});
			} else if (phone_number.length < 5) {
				errors.push({
					error: 'El número de teléfono debe tener mínimo 5 caracteres',
				});
				res.render('seller/add-suppliers', {
					headerSeller: true,
					title: 'Añadir proveedor | Danca Store',
					errors,
					company_name,
					email,
					town,
					address,
					menuSeller: true,
					footerSeller: true,
				});
			} else {
				if (email.indexOf('@') == -1) {
					errors.push({
						error: 'Digite un correo válido',
					});
					res.render('seller/add-suppliers', {
						headerSeller: true,
						title: 'Añadir proveedor | Danca Store',
						errors,
						company_name,
						phone_number,
						town,
						address,
						menuSeller: true,
						footerSeller: true,
					});
				} else if (email.indexOf('@') >= 0) {
					// Complete register
					const response = await db.query(
						`insert into ${process.env.DB_SCHEMA}.supplier (company_name,phone_number,town,address,email,status) values ($1,$2,$3,$4,$5,'Activo');`,
						[company_name, phone_number, town, address, email]
					);

					req.flash(
						'success_msg',
						`${company_name} agregado satisfactoriamente`
					);
					res.redirect('/seller/suppliers');
				}
			}
		}
	}
};

sellerController.renderShoppingList = (req, res) => {
	res.render('seller/shopping-list', {
		headerSeller: true,
		title: 'Lista de compras | Danca Store',
		menuSeller: true,
		footerSeller: true,
	});
};

module.exports = sellerController;
