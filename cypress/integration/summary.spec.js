describe('Summary page', function () {
  before(function () {
    cy.server()
    cy.route('GET', '13').as('getNewAssessment')
    cy.login('BV0111996@windesheim.nl', 'Welkom01!')
    cy.visit('http://vidden.karenbrakband.nl/#/summary/13')
    cy.wait(['@getNewAssessment'])
  })

  after(function () {
    cy.get('a').contains('Terug naar overzicht').click()
    cy.get('a').contains('Terug naar dashboard').click()
    cy.logout()
  })

  it('Should show the chosen variables', function () {
    cy.get('h3').should('contain', 'ICT.AFSTSE.D19')
    cy.get('.mt-3').children('span').should('contain', 'Bernard Bos')
    cy.get('table').children('tr').eq(0).children('td').eq(1).should('contain', 'ICT.AFSTSE.D19')
    cy.get('table').children('tr').eq(1).children('td').eq(1).should('contain', '0')
    cy.get('table').children('tr').eq(2).children('td').eq(1).should('contain', '')
    cy.get('table').children('tr').eq(3).children('td').eq(1).should('contain', 'Nog geen resultaat berekend')
    cy.get('.card-title.mb-3').eq(0).should('contain', '(BV0111996)')
    cy.get('.card-title.mb-3').eq(1).should('contain', 'Nog geen tweede formulier ingevuld')
  })
})
