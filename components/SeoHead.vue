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
    default: '/logo/logo.png' // Updated to use the Coastles logo
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
const absoluteImageUrl = computed(() => {
  if (props.image.startsWith('http')) {
    return props.image
  }
  return `${siteUrl}${props.image}`
})

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