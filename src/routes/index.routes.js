const { Router } = require('express');
const {
	renderIndex,
	signin,
	renderHelp,
	renderSignup,
	signup,
	logout,
} = require('../controllers/index.controller');

const { isAuthenticated, isNotAuthenticated } = require('../helpers/auth');

const router = Router();

router.get('/', isNotAuthenticated, renderIndex);
router.post('/login', isNotAuthenticated, signin);

router.get('/signup', isNotAuthenticated, renderSignup);
router.post('/signup', isNotAuthenticated, signup);

router.get('/help', renderHelp);

router.get('/logout', logout);

module.exports = router;
