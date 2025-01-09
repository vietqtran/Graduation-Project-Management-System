import * as dotenv from 'dotenv'

import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      const environment = config.env.environment || 'develop'
      const envPath = `.env.cypress.${environment}`
      dotenv.config({ path: envPath })
      config.env = { ...config.env, BASE_URL: process.env.BASE_URL }
      return config
    }
  },
  viewportWidth: 1920,
  viewportHeight: 1080,
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack'
    }
  }
})
