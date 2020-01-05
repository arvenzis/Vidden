describe('Footer', function () {
  beforeEach(function () {
    cy.visit('')
  })

  it('Should display an error on absent credentials', function () {
    cy.get('.footer').should('contain', '© 2020 Vidden')
  })
})
