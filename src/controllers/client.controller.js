const clientController = {};
const auth = require('basic-auth');
const { db } = require('../database');
const bcrypt = require('bcryptjs');

// Price formatter function
const formatterPrice = (object) => {
	for (let i = 0; i < object.length; i++) {
		const priceFormat = new Intl.NumberFormat('de-DE');
		const priceFormatted = priceFormat.format(object[i].price);
		const newResponse = object[i];
		newResponse.priceFormatted = priceFormatted;
	}
};
// Image function
const imageCardProduct = (object) => {
	for (let i = 0; i < object.length; i++) {
		const images = [];
		const resImages = object[i].picture;
		const arrImages = resImages.split(',');
		for (let i in arrImages) {
			let image = arrImages[i].trim();
			let objImage = {
				image,
			};
			images.push(objImage);
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
	const response = await db.query(
		`select rol_name from ${process.env.DB_SCHEMA}.user_rol where id_user = $1;`,
		[req.user.rows[0].id]
	);
	const rol = response.rows[0].rol_name;
	if (rol === 'Cliente') {
		res.redirect('/home');
	} else if (rol === 'Vendedor') {
		res.redirect('/seller/destiny');
	}
};

clientController.renderHome = async (req, res) => {
	const response = await db.query(
		`select id, picture, name, price from ${process.env.DB_SCHEMA}.product where status = 'Disponible' order by id desc;`
	);
	imageCardProduct(response.rows);
	formatterPrice(response.rows);
	res.render('client/products', {
		headerClient: true,
		title: 'Inicio | Danca Store',
		response,
		footer: true,
	});
};

clientController.renderComputers = async (req, res) => {
	const response = await db.query(
		`select id, picture, name, price from ${process.env.DB_SCHEMA}.product where id_category = 1 and status = 'Disponible' order by id desc;`
	);
	imageCardProduct(response.rows);
	formatterPrice(response.rows);
	res.render('client/products', {
		headerClient: true,
		title: 'Computadores | Danca Store',
		category: 'Computadores',
		response,
		footer: true,
	});
};

clientController.renderPhones = async (req, res) => {
	const response = await db.query(
		`select id, picture, name, price from ${process.env.DB_SCHEMA}.product where id_category = 2 and status = 'Disponible' order by id desc;`
	);

	imageCardProduct(response.rows);
	formatterPrice(response.rows);
	res.render('client/products', {
		headerClient: true,
		title: 'Celulares | Danca Store',
		category: 'Celulares',
		response,
		footer: true,
	});
};

clientController.renderProductDetail = async (req, res) => {
	if (!req.session.detailsProduct) {
		req.session.detailsProduct = [];
	}
	const idUser = req.user.rows[0];
	const response = await db.query(
		`select p.id, p.reference, p.name, p.price, p.picture, p.specs, p.information, p.color, p.stock, s.company_name from ${process.env.DB_SCHEMA}.product p inner join ${process.env.DB_SCHEMA}.supplier s on p.id_supplier = s.id where p.id = $1;`,
		[req.params.id]
	);
	const colors = [];
	const resColors = response.rows[0].color;
	if (resColors === null) {
		return (colors = []);
	} else {
		const arrColors = resColors.split(',');
		for (let i in arrColors) {
			let color = arrColors[i].trim();
			let objColor = {
				color,
			};
			colors.push(objColor);
		}
	}

	const images = [];
	const resImages = response.rows[0].picture;
	if (resImages === null) {
		return (images = []);
	} else {
		const arrImages = resImages.split(',');
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
		resRows,
		idUser,
		images,
		colors,
		sendImage,
		footer: true,
	});
};

clientController.addCartProduct = (req, res) => {
	const detailsProductObj = {};
	const { user, product, reference, name, picture, price, amount, color } =
		req.body;
	detailsProductObj.user = user;
	detailsProductObj.product = product;
	detailsProductObj.reference = reference;
	detailsProductObj.name = name;
	detailsProductObj.picture = picture;
	detailsProductObj.price = price;
	detailsProductObj.amount = amount;
	detailsProductObj.color = color;

	if (amount > 3) {
		req.flash('error_msg', 'La cantidad no es válida');
	} else {
		req.session.detailsProduct.unshift(detailsProductObj);
		req.flash('success_msg', 'Producto agregado al carrito');
	}

	res.redirect(`/product/${product}`);
};

clientController.renderShoppingCart = (req, res) => {
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
		detailsProduct,
		total,
		footer: true,
	});
};

clientController.clearProductsCart = (req, res) => {
	req.session.detailsProduct = [];
	res.redirect('/cart');
};

clientController.productsPay = async (req, res) => {
	const { user, product, amount, color } = req.body;
	let resAmount;
	// Validate amount number
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
	let mm = today.getMonth() + 1;
	let yyyy = today.getFullYear();
	if (dd < 10) {
		dd = '0' + dd;
	}
	if (mm < 10) {
		mm = '0' + mm;
	}
	today = `${dd}/${mm}/${yyyy}`;
	// Hours
	let hour = new Date();
	hour = `${hour.getHours()}:${hour.getMinutes()}:${hour.getSeconds()}`;

	const time = `${hour} ${today}`;

	for (let i in product) {
		// Get town and address user
		const resUser = await db.query(
			`select town,address from ${process.env.DB_SCHEMA}.user_ where id = $1`,
			[user[0]]
		);

		const userTown = resUser.rows[0].town;
		const userAddress = resUser.rows[0].address;

		const resOrder = await db.query(
			`insert into ${process.env.DB_SCHEMA}.order_ (id_client,order_date,status) values ($1,$2,'Pendiente');`,
			[user[i], today]
		);

		// Get last id order
		const resIdOrder = await db.query(
			`select id from ${process.env.DB_SCHEMA}.order_`
		);
		let idOrder = resIdOrder.rows;
		const idOrderLength = idOrder.length - 1;
		idOrder = idOrder[idOrderLength].id;

		// Get total value
		const response = await db.query(
			`select price from ${process.env.DB_SCHEMA}.product where id = $1;`,
			[product[i]]
		);
		let priceProduct = response.rows[0].price;
		priceProduct = parseInt(priceProduct);
		const total = priceProduct * amount[i];

		// Get color
		let colorProduct;
		if (typeof color === 'object') {
			colorProduct = color[i];
		} else if (typeof color === 'string') {
			colorProduct = color;
		}

		const resOrderDetails = await db.query(
			`insert into ${process.env.DB_SCHEMA}.order_details (id_order,id_product,total_value,amount,color) values ($1,$2,$3,$4,$5);`,
			[idOrder, product[i], total, amount[i], colorProduct]
		);

		const resPayment = await db.query(
			`insert into ${process.env.DB_SCHEMA}.payment (id_method_payment,id_order,bill_date,status) values ($1,$2,$3,'Completado')`,
			[numberRandom(1, 3), idOrder, time]
		);

		const resShipping = await db.query(
			`insert into ${process.env.DB_SCHEMA}.shipping (id_order,shipping_company_name,town,address,shipping_date,delivery_date,status) values ($1,$2,$3,$4,$5,$6,'Pendiente')`,
			[idOrder, '-------', userTown, userAddress, '-------', '-------']
		);
	}

	req.session.detailsProduct = [];
	req.flash('payComplete_msg', 'Pago completo');
	res.redirect('/cart');
};

clientController.renderShoppingHistory = async (req, res) => {
	const idUser = req.user.rows[0].id;
	if (req.params.id != idUser) {
		return res.redirect(`/history/${idUser}`);
	}

	const response = await db.query(
		`select p.picture, p.name, od.total_value, o.order_date, o.id, o.status, s.delivery_date
		from ${process.env.DB_SCHEMA}.order_ o
		inner join ${process.env.DB_SCHEMA}.client c on o.id_client = c.id
		inner join ${process.env.DB_SCHEMA}.order_details od on od.id_order = o.id
		inner join ${process.env.DB_SCHEMA}.product p on od.id_product = p.id
		inner join ${process.env.DB_SCHEMA}.shipping s on s.id_order= o.id
		where c.id_user = $1
		order by o.id DESC
		;`,
		[idUser]
	);

	for (let i = 0; i < response.rows.length; i++) {
		const priceFormat = new Intl.NumberFormat('de-DE');
		const priceFormatted = priceFormat.format(response.rows[i].total_value);
		const newResponse = response.rows[i];
		newResponse.priceFormatted = priceFormatted;
	}

	imageCardProduct(response.rows);
	statusChoose(response.rows);
	res.render('client/shopping-history', {
		headerClient: true,
		category: 'Historial de compras',
		title: 'Historial de compras | Danca Store',
		response,
		footer: true,
	});
};

clientController.redirectionShoppingHistory = (req, res) => {
	const idUser = req.user.rows[0].id;
	res.redirect(`/history/${idUser}`);
};

clientController.renderProfile = async (req, res) => {
	const idUser = req.user.rows[0].id;
	if (req.params.id != idUser) {
		return res.redirect(`/user/${idUser}`);
	}
	const response = await db.query(
		`select u.id, c.name, c.last_name, u.email, u.phone_number, c.document_number, u.town, u.address, u.image_url from ${process.env.DB_SCHEMA}.client c inner join ${process.env.DB_SCHEMA}.user_ u on c.id_user = u.id where u.id = $1;`,
		[idUser]
	);
	const resRows = response.rows[0];
	const title = `${resRows.name} ${resRows.last_name}`;
	res.render('client/profile', {
		headerClient: true,
		title: `${title} | Danca Store`,
		resRows,
		footer: true,
	});
};

clientController.renderUpdateUserInformation = async (req, res) => {
	const idUser = req.user.rows[0].id;
	if (req.params.id != idUser) {
		return res.redirect(`/user/update/${idUser}`);
	}
	const response = await db.query(
		`select u.id, c.name, c.last_name, u.email, u.phone_number, u.town, u.address, u.image_url from ${process.env.DB_SCHEMA}.client c inner join ${process.env.DB_SCHEMA}.user_ u on c.id_user = u.id where u.id = $1;`,
		[req.params.id]
	);
	const resRows = response.rows[0];
	res.render('client/update-profile', {
		headerClient: true,
		title: 'Actualizar perfil | Danca Store',
		resRows,
		footer: true,
	});
};

clientController.updateUserInformation = async (req, res) => {
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
		res.redirect(`/user/update/${idUser}`);
	} else {
		if (email.indexOf('@') == -1) {
			req.flash('error_msg', 'Digite un correo válido');
			res.redirect(`/user/update/${idUser}`);
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
					res.redirect(`/user/update/${idUser}`);
				} else if (phone_number.length < 7) {
					req.flash(
						'error_msg',
						'El número de teléfono debe tener mínimo 7 caracteres'
					);
					res.redirect(`/user/update/${idUser}`);
				} else {
					if (password.length < 6) {
						req.flash(
							'error_msg',
							'La contraseña debe tener mínimo 6 caracteres'
						);
						res.redirect(`/user/update/${idUser}`);
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
							res.redirect(`/user/update/${idUser}`);
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
							res.redirect(`/user/${idUser}`);
							// End complete update
						}
					}
				}
			} else if (resEmail.rows.length >= 1) {
				req.flash('error_msg', 'El correo ya está en uso');
				res.redirect(`/user/update/${idUser}`);
			}
		}
	}
};

clientController.updateUserImage = async (req, res) => {
	const idUser = req.user.rows[0].id;
	const { image_url } = req.body;

	if (image_url.length == 0) {
		req.flash('error_msg', 'Por favor llena el campo');
		res.redirect(`/user/update/${idUser}`);
	} else {
		const resUser_ = await db.query(
			`update ${process.env.DB_SCHEMA}.user_ set image_url = $1 where id = $2;`,
			[image_url, idUser]
		);
		req.flash('success_msg', 'Imagen actualizada');
		res.redirect(`/user/${idUser}`);
	}
};

module.exports = clientController;
