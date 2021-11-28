const clientController = {};
const auth = require('basic-auth');
const { db } = require('../database/connection');
const bcrypt = require('bcryptjs');
const { clientQuerys } = require('../database/querys');
const { validationResult } = require('express-validator');
const {
	formatterPrice,
	imageCardProduct,
	statusChoose,
	numberRandom,
} = require('../helpers/functions');
const cloudinary = require('cloudinary');

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_KEY,
	api_secret: process.env.CLOUDINARY_SECRET,
});

const fs = require('fs-extra');

let rolUser;

clientController.renderRol = async (req, res) => {
	try {
		const response = await db.query(clientQuerys.renderRol, [
			req.user.rows[0].id,
		]);

		const rol = response.rows[0].rol_name;
		if (rol === 'Cliente') {
			rolUser = undefined;
			res.redirect('/home');
		} else if (rol === 'Vendedor') {
			rolUser = 'Vendedor';
			res.redirect('/seller/home');
		}
	} catch {
		res.redirect('/error');
	}
};

clientController.renderHome = async (req, res) => {
	try {
		const response = await db.query(clientQuerys.renderHome);
		imageCardProduct(response.rows);
		formatterPrice(response.rows);
		res.render('client/products', {
			headerClient: true,
			title: 'Inicio | Danca Store',
			rolUser,
			response,
			footer: true,
		});
	} catch {
		res.redirect('/error');
	}
};

clientController.renderComputers = async (req, res) => {
	try {
		const response = await db.query(clientQuerys.renderComputers);
		imageCardProduct(response.rows);
		formatterPrice(response.rows);
		res.render('client/products', {
			headerClient: true,
			title: 'Computadores | Danca Store',
			category: 'Computadores',
			rolUser,
			response,
			footer: true,
		});
	} catch {
		res.redirect('/error');
	}
};

clientController.renderPhones = async (req, res) => {
	try {
		const response = await db.query(clientQuerys.renderPhones);
		imageCardProduct(response.rows);
		formatterPrice(response.rows);
		res.render('client/products', {
			headerClient: true,
			title: 'Celulares | Danca Store',
			category: 'Celulares',
			rolUser,
			response,
			footer: true,
		});
	} catch {
		res.redirect('/error');
	}
};

clientController.renderProductDetail = async (req, res) => {
	try {
		if (!req.session.detailsProduct) {
			req.session.detailsProduct = [];
		}
		const idUser = req.user.rows[0];
		const response = await db.query(clientQuerys.renderProductDetail, [
			req.params.id,
		]);
		const colors = [];
		const resColors = response.rows[0].color;
		const arrColors = resColors.split(',');

		for (let color of arrColors) {
			color = color.trim();
			color = {
				color,
			};
			colors.push(color);
		}

		formatterPrice(response.rows);
		const title = response.rows[0].name;
		const resRows = response.rows[0];
		res.render('client/product-detail', {
			headerClient: true,
			title: `${title} | Danca Store`,
			rolUser,
			resRows,
			idUser,
			colors,
			footer: true,
		});
	} catch {
		res.redirect('/error');
	}
};

clientController.renderShoppingCart = (req, res) => {
	try {
		res.render('client/shopping-cart', {
			headerClient: true,
			category: 'Carrito de compras',
			title: 'Carrito de compras | Danca Store',
			rolUser,
			footer: true,
		});
	} catch {
		res.redirect('/error');
	}
};

clientController.productsPay = async (req, res) => {
	try {
		class Product {
			constructor(product, amount, color) {
				this.id = product;
				this.amount = amount;
				this.color = color;
			}
		}

		const products = [];
		// Validate data
		const { product, amount, color } = req.body;
		const errorMsg = 'Ha ocurrido un error, por favor verifique los productos';
		let oneProduct;
		// If is one product
		if (
			typeof product === 'string' ||
			typeof amount === 'string' ||
			typeof color === 'string'
		) {
			if (
				typeof product === 'object' ||
				typeof amount === 'object' ||
				typeof color === 'object'
			) {
				req.flash('error_msg', errorMsg);
				return res.redirect('/cart');
			} else {
				// Validate if is empty
				if (!product || !amount || !color || amount > 3) {
					req.flash('error_msg', errorMsg);
					return res.redirect('/cart');
				}

				oneProduct = true;
			}
		} else {
			// Validate length of arrays
			if (
				product.length !== amount.length ||
				product.length !== color.length ||
				amount.length !== color.length
			) {
				req.flash('error_msg', errorMsg);
				return res.redirect('/cart');
			}
			// Validate if is empty
			for (let i = 0; i < product.length; i++) {
				if (!product[i] || !amount[i] || !color[i] || amount[i] > 3) {
					req.flash('error_msg', errorMsg);
					return res.redirect('/cart');
				}
			}
		}

		// Complete array products
		// Create new products
		if (oneProduct) {
			const newProduct = new Product(product, amount, color);
			products.push(newProduct);
		} else {
			for (let i = 0; i < product.length; i++) {
				const newProduct = new Product(product[i], amount[i], color[i]);
				products.push(newProduct);
			}
		}

		// Save in DB
		for (let product of products) {
			// ID User
			const idUser = req.user.rows[0].id;
			// Date
			let today = new Date();
			let dd = today.getDate();
			dd = dd < 10 ? '0' + dd : dd;
			let mm = today.getMonth() + 1;
			mm = mm < 10 ? '0' + mm : mm;
			today = `${dd}/${mm}/${today.getFullYear()}`;
			// Hours
			let hour = new Date();
			hour = `${hour.getHours()}:${hour.getMinutes()}:${hour.getSeconds()}`;
			const time = `${hour} ${today}`;

			// 1- Create Order
			await db.query(clientQuerys.productsPay[0], [idUser, today]);

			// Get id order
			const resIdOrder = await db.query(clientQuerys.productsPay[1]);
			const idOrder = resIdOrder.rows[0].id;
			// Calculate total value
			const resProduct = await db.query(clientQuerys.productsPay[2], [
				product.id,
			]);
			const totalValue = resProduct.rows[0].price * product.amount;

			// 2- Create Order Details
			await db.query(clientQuerys.productsPay[3], [
				idOrder,
				product.id,
				totalValue,
				product.amount,
				product.color,
			]);

			// 3- Create Payment
			await db.query(clientQuerys.productsPay[4], [
				numberRandom(1, 3),
				idOrder,
				time,
			]);

			// Get town and address
			const resUser = await db.query(clientQuerys.productsPay[5], [idUser]);
			const userTown = resUser.rows[0].town;
			const userAddress = resUser.rows[0].address;

			// 4- Create Shipping
			await db.query(clientQuerys.productsPay[6], [
				idOrder,
				userTown,
				userAddress,
			]);
		}

		req.flash('payComplete_msg', 'Pago completo');
		res.redirect('/cart');
	} catch {
		res.redirect('/error');
	}
};

clientController.renderShoppingHistory = async (req, res) => {
	try {
		const idUser = req.user.rows[0].id;

		const response = await db.query(clientQuerys.renderShoppingHistory, [
			idUser,
		]);

		// Format price
		for (let i = 0; i < response.rows.length; i++) {
			const priceFormat = new Intl.NumberFormat('de-DE');
			const priceFormatted = priceFormat.format(response.rows[i].total_value);
			const newResponse = response.rows[i];
			newResponse.totalValueFormatted = priceFormatted;
		}

		formatterPrice(response.rows);
		imageCardProduct(response.rows);
		statusChoose(response.rows);
		res.render('client/shopping-history', {
			headerClient: true,
			category: 'Historial de compras',
			title: 'Historial de compras | Danca Store',
			rolUser,
			response,
			footer: true,
		});
	} catch {
		res.redirect('/error');
	}
};

clientController.renderProfile = async (req, res) => {
	try {
		// Validate param id user
		const idUser = req.user.rows[0].id;
		if (req.params.id != idUser) {
			return res.redirect(`/user/${idUser}`);
		}

		const response = await db.query(clientQuerys.renderProfile, [idUser]);
		const resRows = response.rows[0];
		const title = `${resRows.name} ${resRows.last_name}`;
		res.render('client/profile', {
			headerClient: true,
			title: `${title} | Danca Store`,
			rolUser,
			resRows,
			footer: true,
		});
	} catch {
		res.redirect('/error');
	}
};

clientController.renderUpdateUserInformation = async (req, res) => {
	try {
		const idUser = req.user.rows[0].id;
		if (req.params.id != idUser) {
			return res.redirect(`/user/update/${idUser}`);
		}
		const response = await db.query(clientQuerys.renderUpdateUserInformation, [
			req.params.id,
		]);
		const resRows = response.rows[0];
		res.render('client/update-profile', {
			headerClient: true,
			title: 'Actualizar perfil | Danca Store',
			rolUser,
			resRows,
			footer: true,
		});
	} catch {
		res.redirect('/error');
	}
};

clientController.updateUserInformation = async (req, res) => {
	try {
		const idUser = req.user.rows[0].id;

		// Validate errors
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400);
			req.flash('error_msg', errors.errors[0].msg);
			return res.redirect(`/user/update/${idUser}`);
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
		const resEmail = await db.query(clientQuerys.updateUserInformation[0], [
			email,
		]);
		const resUserEmail = await db.query(clientQuerys.updateUserInformation[1], [
			idUser,
		]);
		if (resEmail.rows.length > 0 && resUserEmail.rows[0].email != email) {
			req.flash('error_msg', 'El correo ya está en uso');
			return res.redirect(`/user/update/${idUser}`);
		}

		// Validate if user is typing new password
		if (password.length != 0 && password.length < 6) {
			req.flash('error_msg', 'La contraseña debe tener al menos 6 caracteres');
			return res.redirect(`/user/update/${idUser}`);
		}
		const passwordHash =
			password.length > 0 ? await bcrypt.hash(password, 8) : false;

		// Validate current password
		const resPass = await db.query(clientQuerys.updateUserInformation[2], [
			idUser,
		]);
		const match = await bcrypt.compare(
			confirm_password,
			resPass.rows[0].password
		);
		if (!match) {
			req.flash('error_msg', 'La contraseña actual no coincide');
			return res.redirect(`/user/update/${idUser}`);
		}

		// Update user information
		if (!passwordHash) {
			await db.query(clientQuerys.updateUserInformation[3], [
				email,
				email,
				phone_number,
				town,
				address,
				idUser,
			]);
		} else {
			await db.query(clientQuerys.updateUserInformation[4], [
				email,
				passwordHash,
				email,
				phone_number,
				town,
				address,
				idUser,
			]);
		}
		await db.query(clientQuerys.updateUserInformation[5], [
			name,
			last_name,
			idUser,
		]);
		req.flash('success_msg', 'Datos actualizados');
		res.redirect(`/user/${idUser}`);
	} catch {
		res.redirect('/error');
	}
};

clientController.updateUserImage = async (req, res) => {
	try {
		const idUser = req.user.rows[0].id;

		// Validate images
		if (req.files.length != 1) {
			req.flash('error_msg', `Por favor agregue una imagen`);
			return res.redirect(`/user/update/${idUser}`);
		}

		const { path } = req.files[0];

		// Save image to Cloudinary
		const result = await cloudinary.v2.uploader.upload(path, {
			width: 198,
			height: 198,
			gravity: 'faces',
			crop: 'fill',
		});

		const { public_id, url } = result;

		// Delete image from cloudinary
		let imageId = await db.query(clientQuerys.updateUserImage[0], [idUser]);
		if (imageId.rows[0].image_id) {
			await cloudinary.v2.uploader.destroy(imageId.rows[0].image_id);
		}

		// Update user image in db
		await db.query(clientQuerys.updateUserImage[1], [url, public_id, idUser]);

		// Delete the file image from local server
		await fs.unlink(path);
		req.flash('success_msg', 'Imagen actualizada');
		res.redirect(`/user/${idUser}`);
	} catch {
		res.redirect('/error');
	}
};

module.exports = clientController;
