export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-graphql-client'
  ],

  runtimeConfig: {
    public: {
      "graphql-client": {
        clients: {
          default: {
            host: process.env.SHOPIFY_STOREFRONT_URL || 'https://4d7f1d-86.myshopify.com/api/2024-01/graphql.json',
            headers: {
              'Content-Type': 'application/json',
              'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || '4e299f747bbee0bda43e552b6706e128'
            },
          }
        }
      }
    }
  },

  app: {
    head: {
      title: 'Coastles - Premium Clothing',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Discover premium clothing at Coastles' },
        { name: 'robots', content: 'index, follow' },
        { name: 'googlebot', content: 'index, follow' }
      ],
      link: [
        { rel: 'canonical', href: 'https://coastles.store' }
      ]
    },
    pageTransition: {
      name: 'page',
      mode: 'out-in'
    }
  },

  compatibilityDate: '2024-12-17',

  devtools: {
    enabled: true
  },

  nitro: {
    preset: 'vercel-edge',
    routeRules: {
      // Cart and checkout handling
      '/cart': {
        redirect: {
          to: 'https://checkout.coastles.store/cart',
          statusCode: 302
        }
      },
      '/cart/**': {
        redirect: {
          to: 'https://checkout.coastles.store/cart/:splat',
          statusCode: 302
        }
      },
      '/checkout': {
        redirect: {
          to: 'https://checkout.coastles.store/checkout',
          statusCode: 302
        }
      },
      '/checkouts/**': {
        redirect: {
          to: 'https://checkout.coastles.store/checkouts/:splat',
          statusCode: 302
        }
      },
      '/account': {
        redirect: {
          to: 'https://checkout.coastles.store/account',
          statusCode: 302
        }
      },

      // Root security headers
      '/': {
        headers: {
          'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
          'Access-Control-Allow-Origin': 'https://checkout.coastles.store',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }
    }
  },

  ssr: true,
  
  // Add debug logging
  hooks: {
    'nitro:init': () => {
      console.log('Nitro initialized')
    },
    'close': () => {
      console.log('Nitro closing')
    }
  }
})
