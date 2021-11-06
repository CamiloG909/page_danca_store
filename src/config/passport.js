const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { db } = require('../database/connection');

passport.use(
	new LocalStrategy(
		{
			usernameField: 'email',
			passwordField: 'password',
		},
		async (email, password, done) => {
			try {
				const response = await db.query(
					`select id, email, password from ${process.env.DB_SCHEMA}.user_ where email = $1;`,
					[email]
				);
				const user = response.rows[0];
				if (response.rows.length <= 0) {
					return done(null, false, {
						message: 'Email o contraseña incorrecta',
					});
				} else {
					const match = await bcrypt.compare(
						password,
						response.rows[0].password
					);
					if (match) {
						return done(null, user);
					} else {
						return done(null, false, {
							message: 'Email o contraseña incorrecta',
						});
					}
				}
			} catch {
				res.redirect('/error');
			}
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	try {
		await db.query(
			`select id from ${process.env.DB_SCHEMA}.user_ where id = $1;`,
			[id],
			(err, user) => {
				done(err, user);
			}
		);
	} catch {
		res.redirect('/error');
	}
});
