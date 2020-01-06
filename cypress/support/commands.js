Cypress.Commands.add('login', (username, password) => {
  cy.clearCache()
  cy.server({
    status: 200
  })
  cy.route('POST', 'api/User/Authenticate/', 'fixture:mockAuthenticate').as('login')
  cy.route('GET', 'api/userpreference/getshowgradinginwords/6', false).as('getShowGradingInWords')
  cy.route('GET', 'api/userpreference/getlanguagepreference/6', 'nl_NL').as('getLanguagePreference') 
  cy.visit('')
  cy.get('input[name=emailaddress]').type(username)
  cy.get('input[name=password]').type(password)
  cy.get('form').submit()
  cy.wait('@login')
  cy.wait('@getShowGradingInWords')
  cy.wait('@getLanguagePreference')
})

Cypress.Commands.add('loginFalse', (username, password) => {
  cy.clearCache()
  cy.server({
    status: 400,
  })
  cy.route('POST', 'api/User/Authenticate/', '').as('loginFalse')
  cy.visit('')
  cy.get('input[name=emailaddress]').type(username)
  cy.get('input[name=password]').type(password)
  cy.get('form').submit()
  cy.wait('@loginFalse')
})

Cypress.Commands.add('logout', () => {
  cy.server({
    status: 200
  })
  cy.route('GET', 'api/User/Logout/', '').as('logout')
  cy.get('div').contains('Uitloggen').click()
  cy.wait('@logout')
})

Cypress.Commands.add('openBrowsePage', () => {
  cy.server()
  cy.route('GET', 'api/Assessment/GetAssessments/', 'fixture:mockAssessments').as('assessments')
  cy.get('a').contains('Bladeren').click()
  cy.wait('@assessments')
})

Cypress.Commands.add('backToBrowsePage', () => {
  cy.server()
  cy.route('GET', 'api/Assessment/GetAssessments/', 'fixture:mockAssessments').as('getAssessments')
  cy.get('a').contains('Bladeren').click()
  cy.wait(['@getAssessments'])
})

Cypress.Commands.add('openNewAssessmentPage', () => {
  cy.server()
  cy.route('GET', 'api/Student/GetStudents', 'fixture:mockStudents').as('getStudents')
  cy.route('GET', 'api/Template/', 'fixture:mockTemplate').as('getTemplate')
  cy.route('GET', 'api/Teacher/GetTeachers', 'fixture:mockTeachers').as('getTeachers')
  cy.get('a').contains('Nieuw').click()
  cy.wait(['@getStudents', '@getTemplate', '@getTeachers'])
})

Cypress.Commands.add('openEditAssessmentPage', () => {
  cy.server({
    status: 200
  })
  cy.route('GET', 'api/assessment/1/question/6', 'fixture:mockAnswers').as('getAssessmentTeacher')
  cy.route('GET', 'api/assessment/GetSummary/1/1/6', 'fixture:mockCompetence1').as('competence1')
  cy.route('GET', 'api/assessment/GetSummary/1/2/6', 'fixture:mockCompetence2').as('competence2')
  cy.route('GET', 'api/assessment/GetSummary/1/3/6', 'fixture:mockCompetence3').as('competence3')
  cy.route('GET', 'api/assessment/GetSummary/1/4/6', 'fixture:mockCompetence4').as('competence4')
  cy.route('GET', 'api/assessment/GetSummary/1/5/6', 'fixture:mockCompetence5').as('competence5')
  cy.route('GET', 'api/assessment/GetSummary/1/6/6', 'fixture:mockCompetence6').as('competence6')
  cy.route('GET', 'api/assessment/1', 'fixture:mockAssessment').as('getAssessment')
  cy.visit('edit/1/6')
  cy.wait(['@getAssessmentTeacher', '@getAssessment', '@competence1', '@competence2', '@competence3', '@competence4', '@competence5', '@competence6']) 
})

Cypress.Commands.add('chooseAnswer', (answer) => {
  cy.server()
  cy.route('POST', 'api/assessment/AnswerSave', '').as('answerSaved')
  const answerWithHash = '#' + answer;
  cy.get('.assessment__question.d-sm-block').contains('De student heeft een gestructeerde beheeraanpak')
    .parent().get(answerWithHash).click()
  cy.wait(['@answerSaved'])
})

Cypress.Commands.add('addComment', (comment, field) => {
  cy.server()
  cy.route('POST', 'api/assessment/CommentsSave', '').as('commentSaved')
  cy.get('label').contains(field).parent().get('#opmerkingen').type(comment)
  cy.get('h4').contains('Opmerkingen').click()
  cy.wait(['@commentSaved'])
  cy.get('.toasted-container.top-right')
    .should('be.visible')
    .and('contain', 'Opmerking opgeslagen')
})

Cypress.Commands.add('confirmNewAssessment', () => {
  cy.server()
  cy.route('POST', 'api/assessment', 13).as('postNewAssessment')
  cy.route('GET', 'api/Assessment/13', 'fixture:mockAssessment').as('getNewAssessment')
  cy.get('a').contains('Bevestigen').click()
  cy.wait(['@postNewAssessment'])
  cy.wait(['@getNewAssessment'])
})

Cypress.Commands.add('openSummaryPage', () => {
  cy.server()
  cy.route('GET', 'api/Assessment/13', 'fixture:mockSummary').as('getSummary')
  cy.visit('summary/13')
  cy.wait(['@getSummary'])
})

Cypress.Commands.add('backToSummaryPage', () => {
  cy.server()
  cy.route('GET', 'api/Assessment/1', 'fixture:mockSummary').as('getSummary')
  cy.get('a').contains('Samenvatting beoordeling').click()
  cy.wait(['@getSummary'])
})

Cypress.Commands.add('backToDashboardPage', () => {
  cy.get('a').contains('Dashboard').click()
})

Cypress.Commands.add('openFinishPage', () => {
  cy.server()
  cy.route('GET', 'api/assessment/1/fullsummary/6', 'fixture:mockFullSummary').as('getFullSummary')
  cy.route('GET', 'api/assessment/1', 'fixture:mockAssessment').as('getAssessment')
  cy.get('.sidebar--open-button').click()
  cy.get('.sidebar__group--child--title').contains('Communicatie').click()
  cy.get('a').contains('Bevestigen').click() 
  cy.wait(['@getAssessment', '@getFullSummary'])
})

Cypress.Commands.add('openFinalizedFinishPage', () => {
  cy.server()
  cy.route('GET', 'api/assessment/1/fullsummary/6', 'fixture:mockFullSummaryFinal').as('getFullSummaryFinal')
  cy.route('GET', 'api/assessment/1', 'fixture:mockAssessmentFinal').as('getAssessmentFinal')
  cy.get('.sidebar--open-button').click()
  cy.get('.sidebar__group--child--title').contains('Communicatie').click()
  cy.get('a').contains('Bevestigen').click()
  cy.wait(['@getAssessmentFinal', '@getFullSummaryFinal'])
})


Cypress.Commands.add('backToEditAssessmentPage', () => {
  cy.server()
  cy.route('GET', 'api/assessment/1/question/6', 'fixture:mockAnswers').as('getAssessmentTeacher')
  cy.get('a').contains('Bewerken').click()
  cy.wait(['@getAssessmentTeacher'])
})

Cypress.Commands.add('clearCache', () => {
  cy.window().then((win) => {
    win.sessionStorage.clear()
  })
})

