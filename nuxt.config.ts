export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-graphql-client'
  ],

  'graphql-client': {
    codegen: {
      enabled: true
    },
    clients: {
      default: {
        host: process.env.SHOPIFY_STOREFRONT_URL,
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
        },
      }
    }
  },

  app: {
    head: {
      title: 'Coastles - Premium Clothing',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Discover premium clothing at Coastles' }
      ]
    }
  },

  compatibilityDate: '2024-12-17',

  devtools: {
    enabled: true
  }
})
