it('Login Failed', () => {
  cy.visit('/');
  cy.login('test@test.com', 'test')
  cy.get(".text-error").should('be.visible')
});
