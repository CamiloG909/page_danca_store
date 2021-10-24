const sellerController = {};
const { db } = require('../database/connection');
const bcrypt = require('bcryptjs');
const { sellerQuerys } = require('../database/querys');
const { check, validationResult } = require('express-validator');

sellerController.renderHome = (req, res) => {
	res.render('seller/home', {
		menuSeller: true,
		title: 'Inicio | Danca Store',
	});
};

sellerController.renderProducts = async (req, res) => {
	const suppliers = await db.query(sellerQuerys.renderProducts);
	const suppRows = suppliers.rows;
	res.render('seller/products', {
		headerSeller: true,
		menuSeller: true,
		title: 'Productos | Danca Store',
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
		res.redirect('/seller/products');
	} else {
		const suppliers = await db.query(sellerQuerys.addProduct[0]);
		const suppRows = suppliers.rows;

		const resReference = await db.query(sellerQuerys.addProduct[1], [
			reference,
		]);

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
			const response = await db.query(sellerQuerys.addProduct[2], [
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
			]);
			req.flash('success_msg', `${name} agregado satisfactoriamente`);
			res.redirect('/seller/products');
		}
	}
};

sellerController.renderProfile = async (req, res) => {
	const idUser = req.user.rows[0].id;
	if (req.params.id != idUser) {
		return res.redirect(`/seller/user/${idUser}`);
	}
	const response = await db.query(sellerQuerys.renderProfile, [idUser]);
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
	const response = await db.query(sellerQuerys.renderUpdateUserInformation, [
		req.params.id,
	]);
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
			const resEmail = await db.query(sellerQuerys.updateUserInformation[0], [
				email,
			]);

			const resUserEmail = await db.query(
				sellerQuerys.updateUserInformation[1],
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
							sellerQuerys.updateUserInformation[2],
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
								sellerQuerys.updateUserInformation[3],
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
								sellerQuerys.updateUserInformation[4],
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
		const resUser_ = await db.query(sellerQuerys.updateUserImage, [
			image_url,
			idUser,
		]);
		req.flash('success_msg', 'Imagen actualizada');
		res.redirect(`/seller/user/${idUser}`);
	}
};

sellerController.renderSuppliers = async (req, res) => {
	try {
		const response = await db.query(sellerQuerys.renderSuppliers);
		const resRows = response.rows;

		for (const supplier of resRows) {
			if (supplier.status === 'Activo') {
				const newResponse = supplier;
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
	} catch {
		res.redirect('/error');
	}
};

sellerController.updateSupplier = async (req, res) => {
	try {
		// Validate
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400);
			req.flash('error_msg', errors.errors[0].msg);
			res.redirect('/seller/suppliers');
		} else {
			const {
				company_name_current,
				company_name,
				phone_number,
				email,
				town,
				address,
				status,
				id,
			} = req.body;

			// Validate company name
			if (company_name_current === company_name) {
				// Save in DB
				const response = await db.query(sellerQuerys.updateSupplier[1], [
					company_name,
					phone_number,
					town,
					address,
					email,
					status,
					id,
				]);
			} else {
				const resCompanyName = await db.query(sellerQuerys.updateSupplier[0], [
					company_name,
				]);

				if (resCompanyName.rows.length > 0) {
					req.flash('error_msg', `${company_name} ya ha sido agregado`);
					res.redirect('/seller/suppliers');
				} else {
					// Save in DB
					const response = await db.query(sellerQuerys.updateSupplier[1], [
						company_name,
						phone_number,
						town,
						address,
						email,
						status,
						id,
					]);
				}
			}

			req.flash(
				'success_msg',
				`${company_name} actualizado satisfactoriamente`
			);
			res.redirect('/seller/suppliers');
		}
	} catch {
		res.redirect('/error');
	}
};

sellerController.deleteSupplier = async (req, res) => {
	try {
		// Validate id
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400);
			req.flash('error_msg', errors.errors[0].msg);
			res.redirect('/seller/suppliers');
		} else {
			const { id, company_name } = req.body;

			try {
				// Delete from DB
				const response = await db.query(sellerQuerys.deleteSupplier, [id]);

				req.flash(
					'success_msg',
					`${company_name} eliminado satisfactoriamente`
				);
				res.redirect('/seller/suppliers');
			} catch {
				req.flash('error_msg', `Aún hay productos activos de ${company_name}`);
				res.redirect('/seller/suppliers');
			}
		}
	} catch {
		res.redirect('/error');
	}
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
		const resCompanyName = await db.query(sellerQuerys.addSupplier[0], [
			company_name,
		]);

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
					const response = await db.query(sellerQuerys.addSupplier[1], [
						company_name,
						phone_number,
						town,
						address,
						email,
					]);

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
