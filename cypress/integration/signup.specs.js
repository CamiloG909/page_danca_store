describe('register user', () => {
	beforeEach(() => {
		cy.visit('/signup');
	});

	it('should avoid submit form', () => {
		cy.get('.signup-form__btn').should('be.disabled');
		cy.get('.signup-form__btn').should('have.class', '--disabled');
	});

	it('should complete all the fields', () => {
		cy.get('#form-signup [name="name"]').type('Name');
		cy.get('#form-signup [name="last_name"]').type('Last name');
		cy.get('#form-signup [name="document_number"]').type('987654321');
		cy.get('#form-signup [name="email"]').type('usertest980@email.com');
		cy.get('#form-signup [name="phone_number"]').type('318254666');
		cy.get('#form-signup [name="town"]').type('Bogotá, D.C.');
		cy.get('#form-signup [name="address"]').type('Calle 9');
		cy.get('#form-signup [name="password"]').type('123456');
		cy.get('#form-signup .signup-form__btn').click();
		cy.get('.message-container').should('exist');
	});
});
