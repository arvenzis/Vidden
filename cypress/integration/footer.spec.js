describe('Footer', function () {
  beforeEach(function () {
    cy.visit('https://vidden.karenbrakband.nl')
  })

  it('Should display an error on absent credentials', function () {
    cy.get('.footer').should('contain', '© 2019 Vidden')
  })
})
