const clientController = {};
const auth = require('basic-auth');
const { db } = require('../database/connection');
const bcrypt = require('bcryptjs');
const { clientQuerys } = require('../database/querys');
const { validationResult } = require('express-validator');

let rolUser;

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
// Status selector
const statusChoose = (object) => {
	for (let i = 0; i < object.length; i++) {
		if (object[i].status === 'Completado') {
			const newResponse = object[i];
			newResponse.statusDelivered = true;
		} else if (object[i].status === 'En camino') {
			const newResponse = object[i];
			newResponse.statusWay = true;
		} else if (object[i].status === 'Pendiente') {
			const newResponse = object[i];
			newResponse.statusPending = true;
		}
	}
};
// Generate random number
const numberRandom = (min, max) => {
	return Math.floor(Math.random() * (max + 1 - min) + min);
};

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

		const images = [];
		const resImages = response.rows[0].picture;
		if (resImages === null) {
			return (images = []);
		} else {
			const arrImages = resImages.split(',');
			// for (let image of arrImages) {
			// 	image = image.trim()
			// 	image = {
			// 		image
			// 	}
			// 	images.push(image)
			// }
			// Delete when fix images with js
			for (let i in arrImages) {
				let idImage = i;
				let image = arrImages[i].trim();
				let objImage = {
					idImage,
					image,
				};
				images.push(objImage);
			}
		}

		const sendImage = images[0];
		formatterPrice(response.rows);
		const title = response.rows[0].name;
		const resRows = response.rows[0];
		res.render('client/product-detail', {
			headerClient: true,
			title: `${title} | Danca Store`,
			rolUser,
			resRows,
			idUser,
			images,
			colors,
			sendImage,
			footer: true,
		});
	} catch {
		res.redirect('/error');
	}
};

clientController.addCartProduct = (req, res) => {
	try {
		const { user, product, reference, name, picture, price, amount, color } =
			req.body;

		const detailsProductObj = {
			user,
			product,
			reference,
			name,
			picture,
			price,
			amount,
			color,
		};

		if (amount > 3) {
			req.flash('error_msg', 'La cantidad no es válida');
		} else {
			req.session.detailsProduct.unshift(detailsProductObj);
			req.flash('success_msg', 'Producto agregado al carrito');
		}

		res.redirect(`/product/${product}`);
	} catch {
		res.redirect('/error');
	}
};

clientController.renderShoppingCart = (req, res) => {
	try {
		const idUser = req.user.rows[0].id;
		let detailsProduct;
		let total = {
			total: 0,
		};

		if (req.session.detailsProduct) {
			const details = req.session.detailsProduct;
			const userDetailsProduct = details.filter((e) => e.user == idUser);
			detailsProduct = userDetailsProduct;
		} else {
			detailsProduct = [];
		}

		if (detailsProduct.length >= 1) {
			for (let i in detailsProduct) {
				let priceWithout = detailsProduct[i].price.replace(/\./g, '');
				let price = parseInt(priceWithout);
				let totalValue = price * detailsProduct[i].amount;
				total.total += totalValue;
			}
		} else {
			detailsProduct = [];
		}

		const priceFormat = new Intl.NumberFormat('de-DE');
		const priceFormatted = priceFormat.format(total.total);
		total.total = priceFormatted;

		res.render('client/shopping-cart', {
			headerClient: true,
			category: 'Carrito de compras',
			title: 'Carrito de compras | Danca Store',
			rolUser,
			detailsProduct,
			total,
			footer: true,
		});
	} catch {
		res.redirect('/error');
	}
};

clientController.clearProductsCart = (req, res) => {
	try {
		req.session.detailsProduct = [];
		res.redirect('/cart');
	} catch {
		res.redirect('/error');
	}
};

clientController.productsPay = async (req, res) => {
	try {
		const { user, product, amount, color } = req.body;
		// Validate amount
		let resAmount;
		if (amount.length > 1) {
			const amountValue = amount.find((e) => e > 3);
			if (amountValue == undefined) {
				resAmount = true;
			} else {
				resAmount = false;
			}
		} else {
			if (amount <= 3) {
				resAmount = true;
			} else {
				resAmount = false;
			}
		}
		if (!resAmount) {
			req.flash('error_msg', 'La cantidad no es válida');
			res.redirect('/cart');
		}

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

		for (let i in product) {
			// Get town and address user
			const resUser = await db.query(clientQuerys.productsPay[0], [user[i]]);

			const userTown = resUser.rows[0].town;
			const userAddress = resUser.rows[0].address;

			const resOrder = await db.query(clientQuerys.productsPay[1], [
				user[i],
				today,
			]);

			// Get last id order
			const resIdOrder = await db.query(clientQuerys.productsPay[2]);
			let idOrder = resIdOrder.rows;
			const idOrderLength = idOrder.length - 1;
			idOrder = idOrder[idOrderLength].id;

			// Get total value
			const response = await db.query(clientQuerys.productsPay[3], [
				product[i],
			]);
			let priceProduct = response.rows[0].price;
			priceProduct = parseInt(priceProduct);
			const total = priceProduct * amount[i];

			// Get color
			let colorProduct = typeof color === 'object' ? color[i] : color;

			const resOrderDetails = await db.query(clientQuerys.productsPay[4], [
				idOrder,
				product[i],
				total,
				amount[i],
				colorProduct,
			]);

			const resPayment = await db.query(clientQuerys.productsPay[5], [
				numberRandom(1, 3),
				idOrder,
				time,
			]);

			const resShipping = await db.query(clientQuerys.productsPay[6], [
				idOrder,
				'-------',
				userTown,
				userAddress,
				'-------',
				'-------',
			]);
		}

		req.session.detailsProduct = [];
		req.flash('payComplete_msg', 'Pago completo');
		res.redirect('/cart');
	} catch (e) {
		console.log(e);
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
			newResponse.priceFormatted = priceFormatted;
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

		// Validate errors
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400);
			req.flash('error_msg', errors.errors[0].msg);
			return res.redirect(`/user/update/${idUser}`);
		}

		const { image_url } = req.body;

		// Update user image in DB
		await db.query(clientQuerys.updateUserImage, [image_url, idUser]);
		req.flash('success_msg', 'Imagen actualizada');
		res.redirect(`/user/${idUser}`);
	} catch {
		res.redirect('/error');
	}
};

module.exports = clientController;
