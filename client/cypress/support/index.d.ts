/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to login via API directly
     * @example cy.login('email@example.com', 'password123')
     */
    login(email: string, password: string): Chainable<Response>;

    /**
     * Custom command to login by setting localStorage
     * @example cy.loginByLocalStorage({ id: '1', email: 'test@example.com' })
     */
    loginByLocalStorage(user): Chainable<void>;

    /**
     * Custom command to clear authentication data (logout)
     * @example cy.logout()
     */
    logout(): Chainable<void>;

    /**
     * Custom command to intercept sign-in requests
     * @example cy.interceptSignIn({ statusCode: 200, body: { ... } })
     */
    interceptSignIn(mockResponse): Chainable<void>;
  }
}
