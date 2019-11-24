describe('Assessment editing page', function () {
  before(function () {
    cy.server()
    cy.route('GET', '6', 'fixture:mockAnswers').as('getAssessmentTeacher')
    cy.login('BV0111996@windesheim.nl', 'Welkom01!')
    cy.visit('http://vidden.karenbrakband.nl/#/edit/1/6')
    cy.wait(['@getAssessmentTeacher'])
  })

  after(function () {
    cy.get('a').contains('Terug naar overzicht').click()
    cy.get('a').contains('Terug naar dashboard').click()
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
    cy.server()
    cy.route('POST', 'AnswerSave', '').as('answerSaved')

    cy.get('.assessment__question.d-sm-block').contains('De student heeft een gestructeerde beheeraanpak')
      .parent().get('#poor').click()
    cy.wait(['@answerSaved'])

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


