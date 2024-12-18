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
        host: process.env.SHOPIFY_STOREFRONT_URL || 'https://4d7f1d-86.myshopify.com/api/2024-01/graphql.json',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || '4e299f747bbee0bda43e552b6706e128'
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

  compatibilityDate: '2024-12-17'
})