describe('Sign In Page', () => {
  beforeEach(() => {
    cy.visit('/auth/sign-in')
  })

  it('should display the sign-in form correctly', () => {
    cy.get('[data-cy="signin-container"]').should('be.visible')
    cy.get('[data-cy="signin-title"]').should('have.text', 'Sign In')
    cy.get('[data-cy="signin-subtitle"]').should('have.text', 'Sign in if you already have an account')
    cy.get('[data-cy="email-input"]').should('be.visible')
    cy.get('[data-cy="password-input"]').should('be.visible')
    cy.get('[data-cy="signin-button"]').should('be.visible')
    cy.get('[data-cy="passkey-button"]').should('be.visible')
  })

  it('should validate email and password fields', () => {
    cy.get('[data-cy="signin-button"]').click()
    cy.contains('Email is required').should('be.visible')
    cy.contains('Password is required').should('be.visible')

    cy.get('[data-cy="email-input"]').type('invalidemail')
    cy.get('[data-cy="signin-button"]').click()
    cy.contains('Invalid email').should('be.visible')

    cy.get('[data-cy="email-input"]').clear().type('valid@example.com')
    cy.get('[data-cy="password-input"]').type('12345')
    cy.get('[data-cy="signin-button"]').click()
    cy.contains('Password is too short').should('be.visible')
  })

  it('should navigate to sign-up page when clicking sign-up link', () => {
    cy.get('[data-cy="sign-up-link"]').click()
    cy.url().should('include', '/auth/sign-up')
  })

  it('should attempt to sign in with valid credentials', () => {
    cy.intercept('POST', '/api/auth/sign-in', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          user: { id: 1, email: 'test@example.com' },
          deviceId: 'test-device-id'
        }
      }
    }).as('signInRequest')

    cy.get('[data-cy="email-input"]').type('test@example.com')
    cy.get('[data-cy="password-input"]').type('password123')
    cy.get('[data-cy="signin-button"]').click()

    cy.wait('@signInRequest').its('request.body').should('deep.include', {
      email: 'test@example.com',
      password: 'password123'
    })

    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })

  it('should show error toast on failed sign in', () => {
    cy.intercept('POST', '/api/auth/sign-in', {
      statusCode: 401,
      body: {
        success: false,
        message: 'Invalid credentials'
      }
    }).as('failedSignIn')

    cy.get('[data-cy="email-input"]').type('wrong@example.com')
    cy.get('[data-cy="password-input"]').type('wrongpassword')
    cy.get('[data-cy="signin-button"]').click()

    cy.wait('@failedSignIn')
    cy.contains('Invalid credentials').should('be.visible')
  })

  it('should attempt passkey authentication with valid email', () => {
    // Stub WebAuthn
    cy.stubWebAuthn()

    cy.intercept('GET', '/api/auth/passkey/verify*', {
      statusCode: 200,
      body: {
        success: true,
        data: { challenge: 'test-challenge', options: {} }
      }
    }).as('passkeyVerifyRequest')

    cy.intercept('POST', '/api/auth/passkey/verify-login', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          user: { id: 1, email: 'test@example.com' }
        }
      }
    }).as('passkeyLoginRequest')

    cy.get('[data-cy="email-input"]').type('test@example.com')
    cy.get('[data-cy="passkey-button"]').click()

    cy.wait('@passkeyVerifyRequest')
    cy.wait('@passkeyLoginRequest')

    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })

  it('should handle Google sign-in', () => {
    const googleUserStub = {
      email: 'google@example.com',
      photoURL: 'https://example.com/photo.jpg',
      displayName: 'Google User'
    }

    cy.intercept('POST', '/api/auth/google/sign-in', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          user: { id: 1, email: 'google@example.com' }
        }
      }
    }).as('googleSignIn')

    cy.window().then((win) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      win.googleSignInCallback = cy.stub().callsFake((user) => {
        cy.get('@googleAuthFunction').invoke('call', null, googleUserStub)
      })
    })

    cy.get('[data-cy="google-signin-button"]').should('be.visible')
  })

  it('should handle GitHub sign-in', () => {
    cy.get('[data-cy="github-signin-button"]').should('be.visible')
  })
})

export {}
