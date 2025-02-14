<template>
  <div v-if="false"><!-- SEO only component, no rendering needed --></div>
</template>

<script setup>
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
    default: '/images/og-image.jpg' // Add a default OG image
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
      content: props.image
    },
    {
      property: 'og:type',
      content: props.type
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
      content: props.image
    }
  ],
  link: [
    {
      rel: 'canonical',
      href: `https://coastles.store${useRoute().path}`
    }
  ]
})
</script> 