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