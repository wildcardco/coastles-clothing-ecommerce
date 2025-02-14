<template>
  <div class="relative">
    <!-- Main Image with Navigation -->
    <div class="relative aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100">
      <!-- Previous button -->
      <button 
        v-if="media.length > 1"
        @click="prevImage"
        class="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      <!-- Main Image Container with Zoom -->
      <div 
        class="relative w-full h-full cursor-zoom-in"
        @mousemove="handleZoom"
        @mouseleave="resetZoom"
        @click="cycleZoomLevel"
        ref="imageContainer"
      >
        <img 
          v-if="media[currentIndex]?.image?.url"
          :src="media[currentIndex].image.url" 
          :alt="media[currentIndex].image.altText || ''"
          class="w-full h-full object-cover transition-transform duration-200"
          :style="{ 
            ...zoomStyle,
            transform: `scale(${currentZoomLevel})`,
            cursor: isMaxZoom ? 'zoom-out' : 'zoom-in'
          }"
          ref="mainImage"
        />
        <div v-if="isZoomed" class="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-sm">
          {{ Math.round(currentZoomLevel * 100) }}%
        </div>
      </div>

      <!-- Next button -->
      <button 
        v-if="media.length > 1"
        @click="nextImage"
        class="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>

    <!-- Thumbnails -->
    <div v-if="media.length > 1" class="flex gap-4 mt-4 overflow-x-auto scrollbar-hide">
      <button
        v-for="(item, index) in media"
        :key="item.id"
        @click="currentIndex = index"
        class="relative flex-shrink-0 cursor-pointer"
      >
        <img 
          :src="item.image.url" 
          :alt="item.image.altText || ''"
          class="h-20 w-20 rounded-md object-cover"
          :class="{ 
            'ring-2 ring-coastles-600': currentIndex === index,
            'opacity-50': currentIndex !== index 
          }"
        />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  media: {
    type: Array,
    required: true,
    default: () => []
  }
})

const currentIndex = ref(0)
const isZoomed = ref(false)
const imageContainer = ref(null)
const zoomStyle = ref({})
const zoomLevels = [1, 2, 3, 4]
const currentZoomIndex = ref(0)

const currentZoomLevel = computed(() => zoomLevels[currentZoomIndex.value])
const isMaxZoom = computed(() => currentZoomIndex.value === zoomLevels.length - 1)

const cycleZoomLevel = () => {
  if (currentZoomIndex.value === zoomLevels.length - 1) {
    // Reset zoom if at max level
    resetZoom()
  } else {
    // Increment zoom level
    currentZoomIndex.value++
    isZoomed.value = true
  }
}

const resetZoom = () => {
  isZoomed.value = false
  currentZoomIndex.value = 0
  zoomStyle.value = {}
}

const handleZoom = (event) => {
  if (!imageContainer.value || !isZoomed.value) return
  
  const rect = imageContainer.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  // Calculate percentage positions
  const xPercent = (x / rect.width) * 100
  const yPercent = (y / rect.height) * 100
  
  // Update transform origin
  zoomStyle.value = {
    transformOrigin: `${xPercent}% ${yPercent}%`
  }
}

const nextImage = () => {
  currentIndex.value = (currentIndex.value + 1) % props.media.length
  resetZoom()
}

const prevImage = () => {
  currentIndex.value = (currentIndex.value - 1 + props.media.length) % props.media.length
  resetZoom()
}
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;  /* Chrome, Safari and Opera */
}

.cursor-zoom-in {
  cursor: zoom-in;
}
</style>
