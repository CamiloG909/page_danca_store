const sellerController = {};
const { db } = require('../database/connection');
const bcrypt = require('bcryptjs');
const { sellerQuerys } = require('../database/querys');
const { validationResult } = require('express-validator');

// Price formatter function
const formatterPrice = (object) => {
	for (let i = 0; i < object.length; i++) {
		const priceFormat = new Intl.NumberFormat('de-DE');
		const priceFormatted = priceFormat.format(object[i].price);
		const newResponse = object[i];
		newResponse.priceFormatted = priceFormatted;
	}
};
// First image function
const imageCardProduct = (object) => {
	for (let i = 0; i < object.length; i++) {
		const images = [];
		const resImages = object[i].picture;
		const arrImages = resImages.split(',');
		for (let i in arrImages) {
			let image = arrImages[i].trim();
			image = {
				image,
			};
			images.push(image);
		}

		const imageProduct = images[0].image;
		const newResponse = object[i];
		newResponse.image = imageProduct;
	}
};

sellerController.renderHome = (req, res) => {
	try {
		res.render('seller/home', {
			menuSeller: true,
			title: 'Inicio | Danca Store',
		});
	} catch {
		res.redirect('/error');
	}
};

sellerController.renderProducts = async (req, res) => {
	try {
		// Get all suppliers for edit products
		const allSupplier = await db.query(sellerQuerys.renderProducts[0]);
		const allSuppRows = allSupplier.rows;

		// Get active suppliers for new product
		const activeSuppliers = allSuppRows.filter(
			(supplier) => supplier.status === 'Activo'
		);

		// Get products
		const products = await db.query(sellerQuerys.renderProducts[1]);
		const prodRows = products.rows;

		// Status for color
		for (const product of prodRows) {
			if (product.status === 'Disponible') {
				const newResponse = product;
				newResponse.statusAvailable = true;
			}
		}

		// First image product for cards
		imageCardProduct(prodRows);
		// Price formatter
		formatterPrice(prodRows);

		res.render('seller/products', {
			headerSeller: true,
			menuSeller: true,
			title: 'Productos | Danca Store',
			allSuppRows,
			activeSuppliers,
			prodRows,
			footerSeller: true,
		});
	} catch {
		res.redirect('/error');
	}
};

sellerController.addProduct = async (req, res) => {
	try {
		// Validate errors
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400);
			req.flash('error_msg', errors.errors[0].msg);
			return res.redirect('/seller/products');
		}

		const {
			reference,
			name,
			picture,
			specs,
			information,
			color,
			stock,
			category,
			supplier,
		} = req.body;
		const price = req.body.price.replace(/\./g, '');

		// Validate if reference is unique
		const resReference = await db.query(sellerQuerys.addProduct[1], [
			reference,
		]);
		if (resReference.rows.length > 0) {
			req.flash('error_msg', `Referencia no válida`);
			return res.redirect('/seller/products');
		}

		// Validate price
		if (!Number(price)) {
			req.flash('error_msg', `Por favor corrija el precio`);
			return res.redirect('/seller/products');
		}

		// Verify category
		if (category != '1' && category != '2') {
			req.flash('error_msg', `Categoría no válida`);
			return res.redirect('/seller/products');
		}

		// Verify if supplier exists and active
		const suppliers = await db.query(sellerQuerys.addProduct[0], [supplier]);
		if (suppliers.rows.length < 1) {
			req.flash('error_msg', `Prooveedor no encontrado o está suspendido`);
			return res.redirect('/seller/products');
		}

		// Save in db
		await db.query(sellerQuerys.addProduct[2], [
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
	} catch {
		res.redirect('/error');
	}
};

sellerController.updateProduct = async (req, res) => {
	try {
		// Validate ID
		if (!req.query.id) {
			req.flash('error_msg', `ID de producto no válido`);
			return res.redirect('/seller/products');
		}

		// Validate errors
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400);
			req.flash('error_msg', errors.errors[0].msg);
			return res.redirect('/seller/products');
		}

		const {
			reference,
			name,
			picture,
			specs,
			information,
			color,
			stock,
			category,
			supplier,
		} = req.body;
		const price = req.body.price.replace(/\./g, '');

		// Validate reference
		const resReference = await db.query(sellerQuerys.addProduct[1], [
			reference,
		]);
		const resReferenceRows = resReference.rows;
		if (resReferenceRows.length > 0) {
			// Check if the reference has not changed
			if (resReferenceRows[0].id != req.query.id) {
				req.flash('error_msg', `Referencia no válida`);
				return res.redirect('/seller/products');
			}
		}

		// Validate price
		if (!Number(price)) {
			req.flash('error_msg', `Por favor corrija el precio de ${name}`);
			return res.redirect('/seller/products');
		}

		// Verify category
		if (category != '1' && category != '2') {
			req.flash('error_msg', `Categoría no válida`);
			return res.redirect('/seller/products');
		}

		// Save in db
		await db.query(sellerQuerys.updateProduct, [
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
			req.query.id,
		]);
		req.flash('success_msg', `${name} actualizado satisfactoriamente`);
		res.redirect('/seller/products');
	} catch {
		res.redirect('/error');
	}
};

sellerController.updateStatusProduct = async (req, res) => {
	try {
		// Verify ID product
		if (!req.query.id) {
			req.flash('error_msg', `Id de producto no válido`);
			return res.redirect('/seller/products');
		}

		const status = req.query.status == 1 ? 'Disponible' : 'Agotado';

		await db.query(sellerQuerys.updateStatusProduct, [status, req.query.id]);

		req.flash('success_msg', `${req.query.product} actualizado a: ${status}`);
		res.redirect('/seller/products');
	} catch {
		res.redirect('/error');
	}
};

sellerController.deleteProduct = async (req, res) => {
	try {
		// Verify ID product
		if (!req.query.id) {
			req.flash('error_msg', `ID de producto no válido`);
			return res.redirect('/seller/products');
		}

		try {
			await db.query(sellerQuerys.deleteProduct, [req.query.id]);
			req.flash(
				'success_msg',
				`${req.query.product} eliminado satisfactoriamente`
			);
			res.redirect('/seller/products');
		} catch {
			req.flash('error_msg', 'Producto vendido, no lo puede eliminar');
			res.redirect('/seller/products');
		}
	} catch {
		res.redirect('/error');
	}
};

sellerController.renderProfile = async (req, res) => {
	try {
		// Validate errors
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400);
			req.flash('error_msg', errors.errors[0].msg);
			return res.redirect('/seller/products');
		}

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
	} catch {
		res.redirect('/error');
	}
};

sellerController.renderUpdateUserInformation = async (req, res) => {
	try {
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
	} catch {
		res.redirect('/error');
	}
};

sellerController.updateUserInformation = async (req, res) => {
	try {
		const idUser = req.user.rows[0].id;

		// Validate errors
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400);
			req.flash('error_msg', errors.errors[0].msg);
			return res.redirect(`/seller/user/update/${idUser}`);
		}

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

		// Validate email
		const resEmail = await db.query(sellerQuerys.updateUserInformation[0], [
			email,
		]);
		const resUserEmail = await db.query(sellerQuerys.updateUserInformation[1], [
			idUser,
		]);
		if (resEmail.rows.length > 0 && resUserEmail.rows[0].email != email) {
			req.flash('error_msg', 'El correo ya está en uso');
			return res.redirect(`/seller/user/update/${idUser}`);
		}

		// Validate if user is typing new password
		if (password.length != 0 && password.length < 6) {
			req.flash('error_msg', 'La contraseña debe tener al menos 6 caracteres');
			return res.redirect(`/user/update/${idUser}`);
		}
		const passwordHash =
			password.length > 0 ? await bcrypt.hash(password, 8) : false;

		// Validate current password
		const resPass = await db.query(sellerQuerys.updateUserInformation[2], [
			idUser,
		]);
		const match = await bcrypt.compare(
			confirm_password,
			resPass.rows[0].password
		);
		if (!match) {
			req.flash('error_msg', 'La contraseña actual no coincide');
			return res.redirect(`/seller/user/update/${idUser}`);
		}

		// Update user information
		if (!passwordHash) {
			await db.query(sellerQuerys.updateUserInformation[3], [
				email,
				email,
				phone_number,
				town,
				address,
				idUser,
			]);
		} else {
			await db.query(sellerQuerys.updateUserInformation[4], [
				email,
				passwordHash,
				email,
				phone_number,
				town,
				address,
				idUser,
			]);
		}
		await db.query(sellerQuerys.updateUserInformation[5], [
			name,
			last_name,
			idUser,
		]);
		req.flash('success_msg', 'Datos actualizados');
		res.redirect(`/seller/user/${idUser}`);
	} catch {
		res.redirect('/error');
	}
};

sellerController.updateUserImage = async (req, res) => {
	try {
		const idUser = req.user.rows[0].id;

		// Validate errors
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400);
			req.flash('error_msg', errors.errors[0].msg);
			return res.redirect(`/seller/user/update/${idUser}`);
		}

		const { image_url } = req.body;

		// Update user image in db
		await db.query(sellerQuerys.updateUserImage, [image_url, idUser]);
		req.flash('success_msg', 'Imagen actualizada');
		res.redirect(`/seller/user/${idUser}`);
	} catch {
		res.redirect('/error');
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
		// Validate errors
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400);
			req.flash('error_msg', errors.errors[0].msg);
			return res.redirect('/seller/suppliers');
		}

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

		// Validate if company name is already in use
		const resCompanyName = await db.query(sellerQuerys.updateSupplier[0], [
			company_name,
		]);
		if (
			company_name_current !== company_name &&
			resCompanyName.rows.length > 0
		) {
			req.flash('error_msg', `${company_name} ya ha sido agregado`);
			return res.redirect('/seller/suppliers');
		}

		// Save in DB
		await db.query(sellerQuerys.updateSupplier[1], [
			company_name,
			phone_number,
			town,
			address,
			email,
			status,
			id,
		]);
		req.flash('success_msg', `${company_name} actualizado satisfactoriamente`);
		res.redirect('/seller/suppliers');
	} catch {
		res.redirect('/error');
	}
};

sellerController.deleteSupplier = async (req, res) => {
	try {
		// Validate errors
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400);
			req.flash('error_msg', errors.errors[0].msg);
			return res.redirect('/seller/suppliers');
		}

		const { id, company_name } = req.body;

		try {
			// Delete from DB
			await db.query(sellerQuerys.deleteSupplier, [id]);
			req.flash('success_msg', `${company_name} eliminado satisfactoriamente`);
			res.redirect('/seller/suppliers');
		} catch {
			req.flash('error_msg', `Aún hay productos activos de ${company_name}`);
			res.redirect('/seller/suppliers');
		}
	} catch {
		res.redirect('/error');
	}
};

sellerController.renderSuppliersForm = (req, res) => {
	try {
		res.render('seller/add-suppliers', {
			headerSeller: true,
			title: 'Añadir proveedor | Danca Store',
			menuSeller: true,
			footerSeller: true,
		});
	} catch {
		res.redirect('/error');
	}
};

sellerController.addSupplier = async (req, res) => {
	try {
		// Validate errors
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400);
			req.flash('error_msg', errors.errors[0].msg);
			return res.redirect('/seller/suppliers/add');
		}

		const { company_name, phone_number, email, town, address } = req.body;

		// Validate if company name is already in use
		const resCompanyName = await db.query(sellerQuerys.addSupplier[0], [
			company_name,
		]);
		if (resCompanyName.rows.length > 0) {
			req.flash('error_msg', `${company_name} ya ha sido agregado`);
			return res.redirect('/seller/suppliers/add');
		}

		// Save in DB
		await db.query(sellerQuerys.addSupplier[1], [
			company_name,
			phone_number,
			town,
			address,
			email,
		]);
		req.flash('success_msg', `${company_name} agregado satisfactoriamente`);
		res.redirect('/seller/suppliers');
	} catch {
		res.redirect('/error');
	}
};

sellerController.renderShoppingList = (req, res) => {
	try {
		res.render('seller/shopping-list', {
			headerSeller: true,
			title: 'Lista de compras | Danca Store',
			menuSeller: true,
			footerSeller: true,
		});
	} catch {
		res.redirect('/error');
	}
};

module.exports = sellerController;
