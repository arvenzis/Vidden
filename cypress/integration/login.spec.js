describe('Test the API Authenticate endpoint', function() {
    it('Should return a 200 status when my credentials are correct', function() {
        cy.request({
            method: 'POST', 
            url: 'User/Authenticate', 
            body: '{"emailaddress": "s1019744@student.windesheim.nl",  "password": "12345"}',
            headers: {
                'Content-Type': 'application/json'
            },
            failOnStatusCode: false
        })
        .then((response) => {
            expect(response.status).to.eq(200)
        })
    })
    it('Should return a 400 status when my credentials are incorrect', function() {
        cy.request({
            method: 'POST', 
            url: 'User/Authenticate', 
            body: '{"emailaddress": "string",  "password": "string"}',
            headers: {
                'Content-Type': 'application/json'
            },
            failOnStatusCode: false
        })
        .then((response) => {
            expect(response.status).to.eq(400)
            expect(response.body).to.eq("Username or password is incorrect")
        })
    })
})
describe('Test the login functionality', function() {

    const username = 's1019744@student.windesheim.nl'
    const password = '12345'

    beforeEach(function () {
        cy.visit('http://vidden.karenbrakband.nl')
      })
    
    it('Should display an error on login', function () {
        // incorrect username on purpose
        cy.get('input[name=emailaddress]').type('test@test.com')
        cy.get('input[name=password]').type('password123{enter}')
  
        // we should have visible errors now
        cy.get('label.alert')
        .should('be.visible')
        .and('contain', 'Uw gebruikersnaam en / of wachtwoord is onjuist.')
      })

      it('Should redirect to /dashboard on success', function () {
        cy.get('input[name=emailaddress]').type(username)
        cy.get('input[name=password]').type(password)
        cy.get('form').submit()
  
        // we should be redirected to /dashboard
        cy.url().should('include', '/dashboard')
        cy.get('span.header__user').should('contain', 'Bernard Bos')
      })
  })