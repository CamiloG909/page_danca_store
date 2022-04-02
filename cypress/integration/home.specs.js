describe('page', () => {
	beforeEach(() => {
		cy.visit('/');
	});

	it('frontpage can be opened', () => {
		cy.get('.header-index__h1').should('exist');
	});

	it('login form can be loaded', () => {
		cy.contains('Iniciar sesión');
	});
});

describe('login', () => {
	beforeEach(() => {
		cy.visit('/');
	});

	it('login with normal user', () => {
		const email = 'client@email.com';
		const password = '123456';

		cy.get('#email-index').type(email);
		cy.get('#password-index').type(password);
		cy.get('.signin-form__btn').click();
		cy.url().should('include', '/home');
	});

	it('login with admin user', () => {
		const email = 'seller@email.com';
		const password = '123456';

		cy.get('#email-index').type(email);
		cy.get('#password-index').type(password);
		cy.get('.signin-form__btn').click();
		cy.url().should('include', '/seller/home');
	});

	it('login with wrong credentials', () => {
		const email = 'error@email.com';
		const password = 'erroruser';

		cy.get('#email-index').type(email);
		cy.get('#password-index').type(password);
		cy.get('.signin-form__btn').click();
		cy.get('.message-signin__text').should('exist');
	});
});

describe('redirection links', () => {
	beforeEach(() => {
		cy.visit('/');
	});

	it('redirection to registration page with first anchor', () => {
		cy.contains('a', 'Registrate ahora').click();
		cy.url().should('include', '/signup');
	});

	it('redirection to registration page with last anchor (button style)', () => {
		cy.contains('a', 'Registrarse').click();
		cy.url().should('include', '/signup');
	});
});

describe('logout', () => {
	beforeEach(() => {
		cy.visit('/');
	});

	it('login with normal user', () => {
		const email = 'client@email.com';
		const password = '123456';

		cy.get('#email-index').type(email);
		cy.get('#password-index').type(password);
		cy.get('.signin-form__btn').click();
		cy.url().should('include', '/home');
		cy.get('.bi-list').click();
		cy.get('.bi-door-open').click();
		cy.url().should('include', '/');
	});
});
