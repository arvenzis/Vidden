describe('Assessment editing page', function () {
  before(function () {    
    cy.login('BV0111996@windesheim.nl', 'Welkom01!')
    cy.openEditAssessmentPage()
  })

  after(function () {
    cy.backToSummaryPage()
    cy.backToBrowsePage()
    cy.backToDashboardPage()
    cy.logout()
  })

  it('Should show the first question answered with Excellent', function () {
    cy.get('.assessment__question.d-sm-block').contains('De student heeft een gestructeerde beheeraanpak')
      .parent().get('#excellent').should('have.class', 'assessment__answer excellent active')
    cy.get('.assessment__question.d-sm-block').contains('De student heeft een gestructeerde beheeraanpak')
      .parent().get('#good').should('have.class', 'assessment__answer good')
    cy.get('.assessment__question.d-sm-block').contains('De student heeft een gestructeerde beheeraanpak')
      .parent().get('#proficient').should('have.class', 'assessment__answer proficient')
    cy.get('.assessment__question.d-sm-block').contains('De student heeft een gestructeerde beheeraanpak')
      .parent().get('#poor').should('have.class', 'assessment__answer poor')
  })

  it('Should show the first question answered with Poor after Poor is clicked', function () {
    cy.chooseAnswer('poor')

    cy.get('.assessment__question.d-sm-block').contains('De student heeft een gestructeerde beheeraanpak')
      .parent().get('#excellent').should('have.class', 'assessment__answer excellent')
    cy.get('.assessment__question.d-sm-block').contains('De student heeft een gestructeerde beheeraanpak')
      .parent().get('#good').should('have.class', 'assessment__answer good')
    cy.get('.assessment__question.d-sm-block').contains('De student heeft een gestructeerde beheeraanpak')
      .parent().get('#proficient').should('have.class', 'assessment__answer proficient')
    cy.get('.assessment__question.d-sm-block').contains('De student heeft een gestructeerde beheeraanpak')
      .parent().get('#poor').should('have.class', 'assessment__answer poor active')
  })
})
