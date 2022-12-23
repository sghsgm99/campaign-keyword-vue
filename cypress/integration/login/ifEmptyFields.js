it('Login Empty Fields', () => {
  cy.visit('/');

  cy.get('#login-wrapper > form > input[type="text"]').click()

  cy.get('#login-wrapper > form > input[type="password"]').click()

  cy.get('#login-wrapper > form > div.d-flex.align-items-center.justify-content-end > button').click()

  cy.get(".text-error").should('be.visible')
});
