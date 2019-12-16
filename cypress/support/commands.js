Cypress.Commands.add('login', (username, password) => {
  cy.clearCache()
  cy.server({
    status: 200
  })
  cy.route('POST', 'Authenticate', 'fixture:mockAuthenticate').as('login')
  cy.visit('https://vidden.karenbrakband.nl')
  cy.get('input[name=emailaddress]').type(username)
  cy.get('input[name=password]').type(password)
  cy.get('form').submit()
  cy.wait('@login')
})

Cypress.Commands.add('loginFalse', (username, password) => {
  cy.clearCache()
  cy.server({
    status: 400,
  })
  cy.route('POST', 'Authenticate', '').as('loginFalse')
  cy.visit('https://vidden.karenbrakband.nl')
  cy.get('input[name=emailaddress]').type(username)
  cy.get('input[name=password]').type(password)
  cy.get('form').submit()
  cy.wait('@loginFalse')
})

Cypress.Commands.add('logout', () => {
  cy.server({
    status: 200
  })
  cy.route('GET', 'Logout', '').as('logout')
  cy.get('div').contains('Uitloggen').click()
  cy.wait('@logout')  
})

Cypress.Commands.add('openBrowsePage', () => {
  cy.server()
  cy.route('GET', 'GetAssessments', 'fixture:mockAssessments').as('assessments')
  cy.get('a').contains('Bladeren').click()
  cy.wait('@assessments')
})

Cypress.Commands.add('backToBrowsePage', () => {
  cy.server()
  cy.route('GET', 'GetAssessments', 'fixture:mockAssessments').as('getAssessments')
  cy.get('a').contains('Bladeren').click()
  cy.wait(['@getAssessments'])
})

Cypress.Commands.add('openNewAssessmentPage', () => {
  cy.server()
  cy.route('GET', 'GetStudents', 'fixture:mockStudents').as('getStudents')
  cy.route('GET', 'Template', 'fixture:mockTemplate').as('getTemplate')
  cy.get('a').contains('Nieuw').click()
  cy.wait(['@getStudents', '@getTemplate'])
})

Cypress.Commands.add('openEditAssessmentPage', () => {
  cy.server()
  cy.route('GET', '6', 'fixture:mockAnswers').as('getAssessmentTeacher')
  cy.route('GET', 'assessment/1/question/6', 'fixture:mockAnswers').as('getAssessmentTeacher')
  cy.route('GET', '/api/assessment/GetSummary/1/1/6', 'fixture:mockCompetence1').as('competence1')
  cy.route('GET', '/api/assessment/GetSummary/1/2/6', 'fixture:mockCompetence2').as('competence2')
  cy.route('GET', '/api/assessment/GetSummary/1/3/6', 'fixture:mockCompetence3').as('competence3')
  cy.route('GET', '/api/assessment/GetSummary/1/4/6', 'fixture:mockCompetence4').as('competence4')
  cy.route('GET', '/api/assessment/GetSummary/1/5/6', 'fixture:mockCompetence5').as('competence5')
  cy.route('GET', '/api/assessment/GetSummary/1/6/6', 'fixture:mockCompetence6').as('competence6')
  cy.visit('https://vidden.karenbrakband.nl/#/edit/1/6')
  cy.wait(['@getAssessmentTeacher'])
  cy.wait(['@competence1'])
  cy.wait(['@competence2'])
  cy.wait(['@competence3'])
  cy.wait(['@competence4'])
  cy.wait(['@competence5'])
  cy.wait(['@competence6'])
})

Cypress.Commands.add('chooseAnswer', (answer) => {
  cy.server()
  cy.route('POST', 'AnswerSave', '').as('answerSaved')
  const answerWithHash = '#' + answer;
  cy.get('.assessment__question.d-sm-block').contains('De student heeft een gestructeerde beheeraanpak')
    .parent().get(answerWithHash).click()
  cy.wait(['@answerSaved'])
})

Cypress.Commands.add('addComment', (comment, field) => {
  cy.server()
  cy.route('POST', 'CommentsSave', '').as('commentSaved')
  cy.get('label').contains(field).parent().get('#opmerkingen').type(comment)
  cy.get('h4').contains('Opmerkingen').click()
  cy.wait(['@commentSaved'])
  cy.get('.toasted-container.top-right')
    .should('be.visible')
    .and('contain', 'Opmerking opgeslagen')
})

Cypress.Commands.add('confirmNewAssessment', () => {
  cy.server()
  cy.route('POST', 'assessment', 13).as('postNewAssessment')
  cy.route('GET', '13', 'fixture:mockAssessment').as('getNewAssessment')
  cy.get('a').contains('Bevestigen').click()
  cy.wait(['@postNewAssessment'])
  cy.wait(['@getNewAssessment'])
})

Cypress.Commands.add('openSummaryPage', () => {
  cy.server()
  cy.route('GET', '13', 'fixture:mockSummary').as('getSummary')
  cy.visit('https://vidden.karenbrakband.nl/#/summary/13')
  cy.wait(['@getSummary'])
})

Cypress.Commands.add('backToSummaryPage', () => {
  cy.server()
  cy.route('GET', '1', 'fixture:mockSummary').as('getSummary')
  cy.get('a').contains('Samenvatting beoordeling').click()
  cy.wait(['@getSummary'])
})

Cypress.Commands.add('backToDashboardPage', () => {
  cy.get('a').contains('Dashboard').click()
})

Cypress.Commands.add('clearCache', () => {
  cy.window().then((win) => {
    win.sessionStorage.clear()
  })
})
