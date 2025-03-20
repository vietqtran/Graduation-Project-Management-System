/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// Custom command to login programmatically without UI
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.request({
    method: 'POST',
    url: '/api/auth/sign-in', // Update this URL to match your API endpoint
    body: { 
      email, 
      password,
      device_id: Cypress.env('DEVICE_ID') || 'cypress-test-device',
      device: JSON.stringify({
        name: 'Cypress Test Browser',
        os: Cypress.platform,
        type: 'Testing',
        browser: Cypress.browser.name
      })
    },
    failOnStatusCode: false
  }).then((response) => {
    if (response.status === 200) {
      // Store auth data if needed for your app
      window.localStorage.setItem('user', JSON.stringify(response.body.data.user));
      if (response.body.data.deviceId) {
        window.localStorage.setItem('device_id', response.body.data.deviceId);
      }
    }
    return response;
  });
});

// Custom command to simulate being already logged in
Cypress.Commands.add('loginByLocalStorage', (user) => {
  window.localStorage.setItem('user', JSON.stringify(user));
});

// Custom command to simulate being logged out
Cypress.Commands.add('logout', () => {
  window.localStorage.removeItem('user');
  window.localStorage.removeItem('device_id');
});

// Custom command to intercept sign-in requests
Cypress.Commands.add('interceptSignIn', (mockResponse = {}) => {
  // Try to intercept both potential API paths
  cy.intercept('POST', '/api/auth/sign-in', mockResponse).as('signInApiRequest');
  cy.intercept('POST', '/auth/sign-in', mockResponse).as('signInRequest');
});

// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
