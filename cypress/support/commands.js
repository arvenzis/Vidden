Cypress.Commands.add('login', (username, password) => {
  cy.server()
  cy.route('POST', 'Authenticate').as('login')
  cy.visit('http://vidden.karenbrakband.nl')
  cy.get('input[name=emailaddress]').type(username)
  cy.get('input[name=password]').type(password)
  cy.get('form').submit()
  cy.wait('@login')
})

Cypress.Commands.add('logout', () => {
  cy.server()
  cy.route('GET', 'Logout').as('logout')
  cy.get('div').contains('UITLOGGEN').click()
  cy.wait('@logout')
})
