const sellerController = {};
const { db } = require('../database/connection');
const bcrypt = require('bcryptjs');
const { sellerQuerys } = require('../database/querys');
const { validationResult } = require('express-validator');
const { formatterPrice, imageCardProduct } = require('../helpers/functions');
const cloudinary = require('cloudinary');
const path = require('path');

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_KEY,
	api_secret: process.env.CLOUDINARY_SECRET,
});

const fs = require('fs-extra');

sellerController.renderHome = (req, res) => {
	try {
		res.render('seller/home', {
			menuSeller: true,
			title: 'Inicio | Danca Store',
		});
	} catch (e) {
		console.log(e)
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

		// Get references of products for validation
		let references = await db.query(sellerQuerys.renderProducts[2]);
		references = references.rows;
		references = JSON.stringify(references);

		res.render('seller/products', {
			headerSeller: true,
			menuSeller: true,
			title: 'Productos | Danca Store',
			allSuppRows,
			activeSuppliers,
			prodRows,
			references,
			footerSeller: true,
		});
	} catch (e) {
		console.log(e)
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

		const { reference, name, color, stock, category, supplier } = req.body;
		const price = req.body.price.replace(/\./g, '');
		const specs = JSON.stringify(Object.values(req.body).slice(3, -5)).slice(
			2,
			-2
		);
		const information = JSON.stringify(
			Object.values(req.body).slice(4, -4)
		).slice(2, -2);

		// Validate if reference is unique
		const resReference = await db.query(sellerQuerys.addProduct[1], [
			reference,
		]);
		if (resReference.rows.length > 0) {
			req.flash('error_msg', `Referencia no v??lida`);
			return res.redirect('/seller/products');
		}

		// Validate price
		if (!Number(price)) {
			req.flash('error_msg', `Por favor corrija el precio`);
			return res.redirect('/seller/products');
		}

		// Verify category
		if (category != '1' && category != '2') {
			req.flash('error_msg', `Categor??a no v??lida`);
			return res.redirect('/seller/products');
		}

		// Verify if supplier exists and active
		const suppliers = await db.query(sellerQuerys.addProduct[0], [supplier]);
		if (suppliers.rows.length < 1) {
			req.flash('error_msg', `Prooveedor no encontrado o est?? suspendido`);
			return res.redirect('/seller/products');
		}

		// Validate images
		if (req.files.image.length != 6) {
			req.flash('error_msg', `Por favor verifique las im??genes`);
			return res.redirect('/seller/products');
		}

		// Validate files format
		const validationFiles = [];
		for (let image of req.files.image) {
			if (image.mimetype !== 'image/jpeg' && image.mimetype !== 'image/png') {
				validationFiles.push(true);
			}
		}
		if (validationFiles.length > 0) {
			req.flash('error_msg', `Por favor verifique las im??genes`);
			return res.redirect('/seller/products');
		}

		// Save images
		let imgURLs = [];
		let imgIDs = [];
		let imgPaths = [];

		for (let image of req.files.image) {
			const imagePath = path.join(
				__dirname,
				`../../public/uploads/${Date.now()}${image.name}`
			);

			// Upload image in server
			image.mv(imagePath);
			imgPaths.push(imagePath);
		}

		// Save images in Cloudinary
		for (let i = 0; i < imgPaths.length; i++) {
			const result = await cloudinary.v2.uploader.upload(imgPaths[i], {
				width: 590,
				height: 590,
				gravity: 'faces',
				crop: 'fill',
			});

			const { public_id, url } = result;

			imgURLs.push(url);
			imgIDs.push(public_id);

			fs.unlink(imgPaths[i]);
		}

		imgURLs = JSON.stringify(imgURLs).slice(2, -2).replace(/\"/g, '');
		imgIDs = JSON.stringify(imgIDs).slice(2, -2).replace(/\"/g, '');

		// Save in db
		await db.query(sellerQuerys.addProduct[2], [
			reference,
			name,
			price,
			imgURLs,
			imgIDs,
			specs,
			information,
			color,
			stock,
			category,
			supplier,
		]);

		req.flash('success_msg', `${name} agregado satisfactoriamente`);
		res.redirect('/seller/products');
	}	catch (e) {
		console.log(e)
		res.redirect('/seller/products');
	}
};

sellerController.updateProduct = async (req, res) => {
	try {
		// Validate ID
		if (!req.query.id) {
			req.flash('error_msg', `ID de producto no v??lido`);
			return res.redirect('/seller/products');
		}

		// Validate errors
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400);
			req.flash('error_msg', errors.errors[0].msg);
			return res.redirect('/seller/products');
		}

		const { reference, name, color, stock, category, supplier } = req.body;
		const price = req.body.price.replace(/\./g, '');
		const specs = JSON.stringify(Object.values(req.body).slice(4, -5)).slice(
			2,
			-2
		);
		const information = JSON.stringify(
			Object.values(req.body).slice(5, -4)
		).slice(2, -2);

		// Validate reference
		const resReference = await db.query(sellerQuerys.addProduct[1], [
			reference,
		]);
		const resReferenceRows = resReference.rows;
		if (resReferenceRows.length > 0) {
			// Check if the reference has not changed
			if (resReferenceRows[0].id != req.query.id) {
				req.flash('error_msg', `Referencia no v??lida`);
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
			req.flash('error_msg', `Categor??a no v??lida`);
			return res.redirect('/seller/products');
		}

		// Save in db
		await db.query(sellerQuerys.updateProduct, [
			reference,
			name,
			price,
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
	} catch (e) {
		console.log(e)
		res.redirect('/error');
	}
};

sellerController.updateStatusProduct = async (req, res) => {
	try {
		// Verify ID product
		if (!req.query.id) {
			req.flash('error_msg', `Id de producto no v??lido`);
			return res.redirect('/seller/products');
		}

		const status = req.query.status == 1 ? 'Disponible' : 'Agotado';

		await db.query(sellerQuerys.updateStatusProduct, [status, req.query.id]);

		req.flash('success_msg', `${req.query.product} actualizado a: ${status}`);
		res.redirect('/seller/products');
	} catch (e) {
		console.log(e)
		res.redirect('/error');
	}
};

sellerController.deleteProduct = async (req, res) => {
	try {
		// Verify ID product
		if (!req.query.id) {
			req.flash('error_msg', `ID de producto no v??lido`);
			return res.redirect('/seller/products');
		}

		// Delete images from Cloudinary
		let imgIDs = await db.query(sellerQuerys.deleteProduct[0], [req.query.id]);
		imgIDs = imgIDs.rows[0].picture_id;
		imgIDs = imgIDs.split(',');
		for (let imgID of imgIDs) {
			await cloudinary.v2.uploader.destroy(imgID);
		}

		// Delete product from DB
		try {
			await db.query(sellerQuerys.deleteProduct[1], [req.query.id]);
			req.flash('error_msg', `Se ha eliminado el producto`);
			res.redirect('/seller/products');
		} catch {
			req.flash('error_msg', 'No puede eliminar este producto');
			res.redirect('/seller/products');
		}
	} catch (e) {
		console.log(e)
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
	} catch (e) {
		console.log(e)
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
	} catch (e) {
		console.log(e)
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
			req.flash('error_msg', 'El correo ya est?? en uso');
			return res.redirect(`/seller/user/update/${idUser}`);
		}

		// Validate if user is typing new password
		if (password.length != 0 && password.length < 6) {
			req.flash('error_msg', 'La contrase??a debe tener al menos 6 caracteres');
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
			req.flash('error_msg', 'La contrase??a actual no coincide');
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
	} catch (e) {
		console.log(e)
		res.redirect('/error');
	}
};

sellerController.updateUserImage = async (req, res) => {
	try {
		const idUser = req.user.rows[0].id;

		// Validate images
		if (!req.files.image) {
			req.flash('error_msg', `Por favor agregue una imagen`);
			return res.redirect(`/seller/user/update/${idUser}`);
		}

		// Upload image in server
		const imagePath = path.join(
			__dirname,
			`../../public/uploads/${Date.now()}${req.files.image.name}`
		);

		req.files.image.mv(imagePath);

		// Save image to Cloudinary
		const result = await cloudinary.v2.uploader.upload(imagePath, {
			width: 198,
			height: 198,
			gravity: 'faces',
			crop: 'fill',
		});

		const { public_id, url } = result;

		// Delete image from cloudinary
		let imageId = await db.query(sellerQuerys.updateUserImage[0], [idUser]);
		if (imageId.rows[0].image_id) {
			await cloudinary.v2.uploader.destroy(imageId.rows[0].image_id);
		}

		// Update user image in db
		await db.query(sellerQuerys.updateUserImage[1], [url, public_id, idUser]);

		// Delete the file image from local server
		await fs.unlink(imagePath);
		req.flash('success_msg', 'Imagen actualizada');
		res.redirect(`/seller/user/${idUser}`);
	} catch (e) {
		console.log(e)
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
	} catch (e) {
		console.log(e)
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
	} catch (e) {
		console.log(e)
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
			req.flash('error_msg', `A??n hay productos activos de ${company_name}`);
			res.redirect('/seller/suppliers');
		}
	} catch (e) {
		console.log(e)
		res.redirect('/error');
	}
};

sellerController.renderSuppliersForm = (req, res) => {
	try {
		res.render('seller/add-suppliers', {
			headerSeller: true,
			title: 'A??adir proveedor | Danca Store',
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
	} catch (e) {
		console.log(e)
		res.redirect('/error');
	}
};

sellerController.renderShoppingList = async (req, res) => {
	try {
		let response = await db.query(sellerQuerys.renderShoppingList);
		response = response.rows;

		// Format price
		for (let i = 0; i < response.length; i++) {
			const priceFormat = new Intl.NumberFormat('de-DE');
			const priceFormatted = priceFormat.format(response[i].total_value);
			const newResponse = response[i];
			newResponse.totalValueFormatted = priceFormatted;
		}

		// Current status
		for (let i = 0; i < response.length; i++) {
			if (response[i].status === 'Completado') {
				const newResponse = response[i];
				newResponse.statusDelivered = true;
			} else if (response[i].status === 'En camino') {
				const newResponse = response[i];
				newResponse.statusWay = true;
			} else if (response[i].status === 'Pendiente') {
				const newResponse = response[i];
				newResponse.statusPending = true;
			}
		}

		formatterPrice(response);
		res.render('seller/shopping-list', {
			headerSeller: true,
			title: 'Lista de compras | Danca Store',
			category: 'Lista de compras',
			menuSeller: true,
			response,
			footerSeller: true,
		});
	} catch (e) {
		console.log(e)
		res.redirect('/error');
	}
};

sellerController.updateOrder = async (req, res) => {
	try {
		// Validate errors
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				message: errors.errors[0].msg,
			});
		}

		const { id, type } = req.body;

		if (type === '1') {
			await db.query(sellerQuerys.updateOrder[0], ['Pendiente', id]);
			await db.query(sellerQuerys.updateOrder[2], ['Pendiente', id]);

			return res.status(201).json({
				message: `Se actualiz?? el pedido ${id}`,
			});
		}

		if (type === '2') {
			const { company, shipping, delivery } = req.body;

			if (!company || !shipping || !delivery) {
				return res.status(400).json({
					message: 'Por favor complete todos los campos',
					empty: true,
				});
			}

			await db.query(sellerQuerys.updateOrder[0], ['En camino', id]);
			await db.query(sellerQuerys.updateOrder[1], [
				company,
				shipping,
				delivery,
				'Pendiente',
				id,
			]);

			return res.status(201).json({
				message: `Se actualiz?? el pedido ${id}`,
				data: { company, shipping, delivery },
			});
		}

		if (type === '3') {
			await db.query(sellerQuerys.updateOrder[0], ['Completado', id]);
			await db.query(sellerQuerys.updateOrder[2], ['Entregado', id]);

			return res.status(201).json({
				message: `Se actualiz?? el pedido ${id}`,
			});
		}
	} catch {
		res.status(500).json({
			message: 'Ha ocurrido un error',
		});
	}
};

sellerController.renderNewSeller = async (req, res) => {
	try {
		let response = await db.query(sellerQuerys.renderNewSeller);
		response = response.rows;

		res.render('seller/new-seller', {
			headerSeller: true,
			title: 'Agregar vendedor | Danca Store',
			category: 'Nuevo vendedor',
			menuSeller: true,
			response,
			footerSeller: true,
		});
	} catch (e) {
		console.log(e)
		res.redirect('/error');
	}
};

sellerController.newSeller = async (req, res) => {
	try {
		const { user } = req.body;

		await db.query(sellerQuerys.newSeller, [user]);

		res.redirect('/seller/newseller');
	} catch (e) {
		console.log(e)
		res.redirect('/error');
	}
};

module.exports = sellerController;
