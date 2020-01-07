describe('Finish page', function () {
  before(function () {
    cy.login('BV0111996@windesheim.nl', 'Welkom01!')
    cy.openEditAssessmentPage()
    cy.openFinishPage()
  })

  after(function () {
    cy.backToBrowsePage()
    cy.backToDashboardPage() 
    cy.logout()
  })

  it('Should show "items loaded" message', function () {
    cy.get('.toasted-container.top-right')
      .should('be.visible')
      .and('contain', 'Items geladen')
  })

  it('Should show the full summary: metadata', function () {
    cy.get('h3')
      .should('be.visible')
      .and('contain', 'Overzicht beoordeling ICT.AFSTSE.D19 voor Diederick Prins (s1117810)')

    cy.get('.table.table-summary').get('td').eq(1).should('be.visible').and('contain', 'ICT.AFSTSE.D19')
    cy.get('.table.table-summary').get('td').eq(3).should('be.visible').and('contain', 'Afgerond')
    cy.get('.table.table-summary').get('td').eq(5).should('be.visible').and('contain', 'HBOICT Beoordelingsformulier stage- en afstudeerproject 2019-2020')
  })

  it('Should show the full summary: marks', function () {
    cy.get('.table.table-summary').get('td').eq(7).should('be.visible').and('contain', '4')
    cy.get('.table.table-summary').get('td').eq(9).should('be.visible').and('contain', '6')
  })

  it('Should show the the final mark', function () {
    cy.get('.final-mark').should('have.value', '4')
  })

  it('Should show the new mark if changed', function () {
    cy.get('.final-mark').type('.8')
    cy.get('.final-mark').should('have.value', '4.8')
  })

  it('Should show a message when mark is successfully finalized', function () {
    cy.server({
      status: 200
    })
    cy.route('POST', 'api/assessment/finalize', { userId: "7", assessmentMetaId: "3", finalMark: 8 }).as('finalize')
    cy.route('GET', 'api/Assessment/1', 'fixture:mockAssessment').as('getAssessment')
    cy.get('button').contains('Cijfer definitief maken').click()
    cy.wait(['@finalize', '@getAssessment'])
    cy.get('.success.flash__message').should('contain', 'Je beoordeling is definitief gemaakt')
  })  
})

describe('Finalized page', function () {
  before(function () {
    cy.login('BV0111996@windesheim.nl', 'Welkom01!')
    cy.openEditAssessmentPage()
    cy.openFinalizedFinishPage()
  })

  after(function () {
    cy.backToSummaryPage()
    cy.backToBrowsePage()
    cy.backToDashboardPage()
    cy.logout()
  })

  it('Should be impossible to make result final if assessment is already finalized', function () {
    cy.get('button').contains('Cijfer definitief maken').should('be.disabled')
  })
})
