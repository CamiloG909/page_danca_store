const auth = {};
const { db } = require('../database/connection');

auth.isAuthenticated = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/');
};

auth.isNotAuthenticated = (req, res, next) => {
	if (!req.isAuthenticated()) {
		return next();
	}

	res.redirect('/authority');
};

auth.isAuthenticatedSeller = async (req, res, next) => {
	if (req.isAuthenticated()) {
		const response = await db.query(
			`select id_user,rol_name from ${process.env.DB_SCHEMA}.user_rol u where id_user = $1;`,
			[req.user.rows[0].id]
		);
		const rol = response.rows[0].rol_name;
		if (rol === 'Vendedor') {
			return next();
		}

		res.redirect('/authority');
	} else {
		res.redirect('/');
	}
};

module.exports = auth;
