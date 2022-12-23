it('Login Success', () => {
  cy.visit('/')

  cy.login('kim@disruptsocial.net', 'password')
  cy.location('pathname').should('eq', '/articles')

  cy.wait(5000)
  cy.get('#nav-collapse > nav > ul > li:nth-child(9) > a > span.link').click()
  cy.location('pathname').should('eq', '/')

  cy.wait(3000)
  cy.go('back')
  cy.location('pathname').should('eq', '/')
});
