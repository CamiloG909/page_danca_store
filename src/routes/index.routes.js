const { Router } = require('express');
const {
	renderIndex,
	signin,
	renderHelp,
	renderSignup,
	signup,
	logout,
} = require('../controllers/index.controller');

const { isNotAuthenticated } = require('../helpers/auth');

const router = Router();

router.get('/', isNotAuthenticated, renderIndex);
router.post('/login', isNotAuthenticated, signin);

router
	.route('/signup')
	.get(isNotAuthenticated, renderSignup)
	.post(isNotAuthenticated, signup);

router.get('/help', renderHelp);

router.get('/logout', logout);

module.exports = router;
