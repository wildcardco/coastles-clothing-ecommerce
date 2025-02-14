<template>
  <div v-if="false"><!-- SEO only component, no rendering needed --></div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: undefined
  },
  type: {
    type: String,
    default: 'website'
  },
  keywords: {
    type: String,
    default: 'streetwear, premium clothing, California style, urban fashion, designer clothes'
  }
})

// Ensure the image URL is absolute
const siteUrl = 'https://coastles.store'
// Use the full URL to the logo
const defaultLogoUrl = 'https://coastles.store/logo/logo.png'

const absoluteImageUrl = computed(() => {
  // For debugging
  console.log('Image prop:', props.image)
  
  if (!props.image) {
    console.log('Using default logo:', defaultLogoUrl)
    return defaultLogoUrl
  }
  if (props.image.startsWith('http')) {
    console.log('Using absolute URL:', props.image)
    return props.image
  }
  const fullUrl = `${siteUrl}${props.image}`
  console.log('Using constructed URL:', fullUrl)
  return fullUrl
})

// For debugging
console.log('Final OG Image URL:', absoluteImageUrl.value)

useHead({
  title: `${props.title} | Coastles - Premium Clothing`,
  meta: [
    {
      name: 'description',
      content: props.description
    },
    {
      name: 'keywords',
      content: props.keywords
    },
    // Open Graph
    {
      property: 'og:title',
      content: props.title
    },
    {
      property: 'og:description',
      content: props.description
    },
    {
      property: 'og:image',
      content: absoluteImageUrl.value
    },
    {
      property: 'og:image:secure_url',
      content: absoluteImageUrl.value
    },
    {
      property: 'og:image:width',
      content: '1200'
    },
    {
      property: 'og:image:height',
      content: '630'
    },
    {
      property: 'og:image:alt',
      content: 'Coastles Logo'
    },
    {
      property: 'og:type',
      content: props.type
    },
    {
      property: 'og:site_name',
      content: 'Coastles'
    },
    {
      property: 'og:url',
      content: `${siteUrl}${useRoute().path}`
    },
    // Twitter Card
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'twitter:title',
      content: props.title
    },
    {
      name: 'twitter:description',
      content: props.description
    },
    {
      name: 'twitter:image',
      content: absoluteImageUrl.value
    },
    {
      name: 'twitter:image:alt',
      content: 'Coastles Logo'
    },
    {
      name: 'twitter:domain',
      content: 'coastles.store'
    },
    {
      name: 'twitter:url',
      content: `${siteUrl}${useRoute().path}`
    }
  ],
  link: [
    {
      rel: 'canonical',
      href: `${siteUrl}${useRoute().path}`
    }
  ]
})
</script> 