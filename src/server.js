const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const methodoverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();
require('./config/passport');

// Settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine(
	'.hbs',
	exphbs({
		defaultLayout: 'default',
		layoutsDir: app.get('views'),
		partialsDir: path.join(app.get('views'), 'partials'),
		extname: '.hbs',
	})
);
app.set('view engine', '.hbs');

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(methodoverride('_m'));
app.use(
	session({
		secret: process.env.TK_SECRET,
		resave: true,
		saveUninitialized: true,
	})
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global variables
app.use((req, res, next) => {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.payComplete_msg = req.flash('payComplete_msg');
	res.locals.error_text = req.flash('error_text');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
});

// Routes
app.use(require('./routes/index.routes'));
app.use(require('./routes/client.routes'));
app.use(require('./routes/seller.routes'));

// Static files
app.use(express.static(path.resolve(__dirname, '../public')));

module.exports = app;
