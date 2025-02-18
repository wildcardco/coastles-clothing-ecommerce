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
      // Checkout routes
      '/cart/**': {
        proxy: {
          to: 'https://checkout.coastles.store/**',
          headers: {
            'x-debug-proxy': 'cart-route'
          }
        }
      },
      '/checkouts/**': {
        proxy: {
          to: 'https://checkout.coastles.store/**',
          headers: {
            'x-debug-proxy': 'checkouts-route'
          }
        }
      },

      // Authentication routes with detailed debugging
      '/authentication/6511172010/**': {
        proxy: {
          to: 'https://checkout.coastles.store/authentication/6511172010/**',
          headers: {
            'x-debug-proxy': 'auth-specific-route'
          }
        }
      },
      '/authentication/**': {
        proxy: {
          to: 'https://checkout.coastles.store/authentication/**',
          headers: {
            'x-debug-proxy': 'auth-general-route'
          }
        }
      },
      '/account/**': {
        proxy: {
          to: 'https://checkout.coastles.store/account/**',
          headers: {
            'x-debug-proxy': 'account-route'
          }
        }
      },
      '/challenge/**': {
        proxy: {
          to: 'https://checkout.coastles.store/challenge/**',
          headers: {
            'x-debug-proxy': 'challenge-route'
          }
        }
      },
      '/oauth/**': {
        proxy: {
          to: 'https://checkout.coastles.store/oauth/**',
          headers: {
            'x-debug-proxy': 'oauth-route'
          }
        }
      },
      '/login/**': {
        proxy: {
          to: 'https://checkout.coastles.store/login/**',
          headers: {
            'x-debug-proxy': 'login-route'
          }
        }
      },
      '/callback': {
        proxy: {
          to: 'https://checkout.coastles.store/callback',
          headers: {
            'x-debug-proxy': 'callback-route'
          }
        }
      },

      // Root security headers
      '/': {
        headers: {
          'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
        }
      }
    },
    debug: true
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
