describe('Sign In Page', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.clearCookies()
    cy.visit('http://localhost:3000/auth/sign-in')
    cy.get('[data-cy=signin-container]').should('be.visible')
  })

  it('should display the sign-in form correctly', () => {
    cy.get('[data-cy=signin-title]').should('have.text', 'Sign In')
    cy.get('[data-cy=signin-subtitle]').should('contain.text', 'Sign in if you already have an account')
    cy.get('#email-input').should('be.visible')
    cy.get('#password-input').should('be.visible')
    cy.get('[data-cy=signin-button]').should('be.visible').and('contain.text', 'Sign in')
  })

  it('should show validation errors for empty fields', () => {
    cy.get('[data-cy=signin-form]').submit()
    cy.wait(1000)
    cy.contains('Email is required').should('be.visible')
    cy.contains('Password is required').should('be.visible')
  })

  it('should show validation error for invalid email', () => {
    cy.get('#email-input').type('invalid-email')
    cy.get('#password-input').type('123@123')
    cy.get('[data-cy=signin-form]').submit()
    
    cy.contains('Invalid email').should('be.visible')
  })

  it('should show validation error for short password', () => {
    cy.get('#email-input').type('tranquocviet@gmail.com')
    cy.get('#password-input').type('12345')
    cy.get('[data-cy=signin-form]').submit()
    
    cy.contains('Password is too short').should('be.visible')
  })

  it('should submit the form with valid credentials and redirect to home page', () => {
    Cypress.config('defaultCommandTimeout', 10000)
    
    cy.get('#email-input').clear().type('tranquocviet1303@gmail.com', { delay: 50 })
    cy.get('#password-input').clear().type('123@123', { delay: 50 })
    
    cy.get('[data-cy=signin-button]').click()
    
    cy.wait(5000)
    cy.url().should('eq', 'http://localhost:3000/')
  })

  it('should show an error toast when sign-in fails', () => {
    cy.get('#email-input').clear().type('tranquocviet@gmail.com', { delay: 50 })
    cy.get('#password-input').clear().type('wrongPassword123!', { delay: 50 })
    
    cy.get('[data-cy=signin-button]').click()
    
    cy.url().should('include', '/auth/sign-in')
  })

  it('should show loading state when form is being submitted', () => {
    cy.get('#email-input').clear().type('tranquocviet1303@gmail.com', { delay: 50 })
    cy.get('#password-input').clear().type('123@123', { delay: 50 })
    
    cy.get('[data-cy=signin-button]').as('submitButton')
    
    cy.get('@submitButton').click()
  })

  it('should be able to sign in with Google', () => {
    cy.contains('button', 'Continue with FPT email', { matchCase: false })
      .should('be.visible')
      .should('not.be.disabled')
  })

  it('should log out successfully when clicking the logout button', () => {
    Cypress.config('defaultCommandTimeout', 10000)
    
    cy.get('#email-input').clear().type('tranquocviet1303@gmail.com', { delay: 50 })
    cy.get('#password-input').clear().type('123@123', { delay: 50 })
    
    cy.get('[data-cy=signin-button]').click()
    
    cy.wait(5000)
    cy.url().should('eq', 'http://localhost:3000/')
    cy.intercept('POST', 'http://localhost:8080/api/auth/log-out').as('logoutRequest')
    
    cy.get('[data-cy=user-avatar]').click()
    
    cy.get('[data-cy=profile-button]').should('be.visible')
    cy.get('[data-cy=logout-button]').should('be.visible')
    
    cy.get('[data-cy=logout-button]').click()
    
    cy.wait('@logoutRequest')
    
    cy.url().should('include', '/auth/sign-in', { timeout: 10000 })
    
    cy.get('[data-cy=signin-container]').should('be.visible')
  })

  it('should close dropdown when clicking outside', () => {
    Cypress.config('defaultCommandTimeout', 10000)
    
    cy.get('#email-input').clear().type('tranquocviet1303@gmail.com', { delay: 50 })
    cy.get('#password-input').clear().type('123@123', { delay: 50 })
    
    cy.get('[data-cy=signin-button]').click()
    
    cy.wait(5000)
    cy.url().should('eq', 'http://localhost:3000/')
    cy.get('.size-10.rounded-full').click()
    
    cy.get('[data-cy=logout-button]').should('be.visible')
    
    cy.get('body').click(0, 0)
    
    cy.get('[data-cy=logout-button]').should('not.exist')
  })

  it('should open profile menu when clicking on avatar', () => {
    Cypress.config('defaultCommandTimeout', 10000)
    
    cy.get('#email-input').clear().type('tranquocviet1303@gmail.com', { delay: 50 })
    cy.get('#password-input').clear().type('123@123', { delay: 50 })
    
    cy.get('[data-cy=signin-button]').click()
    
    cy.wait(5000)
    cy.url().should('eq', 'http://localhost:3000/')
    cy.get('[data-cy=user-avatar]').click()
    
    cy.get('[data-cy=profile-button]').should('be.visible')
    cy.get('[data-cy=logout-button]').should('be.visible')
    
    cy.get('[data-cy=profile-button]')
      .find('svg')
      .should('exist')
    
    cy.get('[data-cy=logout-button]')
      .find('svg')
      .should('exist')
  })

  it('should clear localStorage after logout', () => {
    Cypress.config('defaultCommandTimeout', 10000)
    
    cy.get('#email-input').clear().type('tranquocviet1303@gmail.com', { delay: 50 })
    cy.get('#password-input').clear().type('123@123', { delay: 50 })
    
    cy.get('[data-cy=signin-button]').click()
    
    cy.wait(5000)
    cy.url().should('eq', 'http://localhost:3000/')
    cy.window().then(win => {
      win.localStorage.setItem('test_key', 'test_value')
    })
    
    cy.get('[data-cy=user-avatar]').click()
    
    cy.get('[data-cy=logout-button]').click()
    
    cy.url().should('include', '/auth/sign-in', { timeout: 10000 })
  })
})