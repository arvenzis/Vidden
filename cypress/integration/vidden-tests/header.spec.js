describe('Header', function () {
  before(function () {
    cy.login('s1019744@student.windesheim.nl', '12345')
  })

  after(function () {
    cy.logout()
  })

  it('Should display the name and account number in the header', function () {
    cy.get('.header__user').should('contain', 'Bernard Bos (s1019744)')
  })

})
