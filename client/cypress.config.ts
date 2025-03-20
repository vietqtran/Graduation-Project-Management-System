import * as dotenv from 'dotenv'

import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      const environment = config.env.environment || 'develop'
      const envPath = `.env.cypress.${environment}`
      dotenv.config({ path: envPath })
      config.env = { ...config.env, BASE_URL: process.env.BASE_URL }
      return config
    },
  },
  viewportWidth: 1280,
  viewportHeight: 720,
  defaultCommandTimeout: 10000,
  video: false,
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack'
    }
  }
})
