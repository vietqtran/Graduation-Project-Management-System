import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      return config
    },
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 5000,
    env: {
      API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
      DEVICE_ID: 'cypress-test-device-id'
    }
  },

  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack'
    }
  }
})
