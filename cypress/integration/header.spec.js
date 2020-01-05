describe('Header', function () {
  before(function () {
    cy.login('BV0111996@windesheim.nl', 'Welkom01!')
  })

  after(function () {
    cy.logout()
  })

  it('Should display the name and account number in the header', function () {
    cy.get('.header__user').should('contain', 'Arjen Korevaar (BV0111996)')
  })

  it('Header: Should redirect to settings page', function () {
    cy.get('.header__user').click()
    cy.url().should('include', '/settings')
    cy.go('back')
  })
})
