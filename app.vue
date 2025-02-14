<template>
  <div class="min-h-screen bg-gray-50">
    <TheHeader />
    <CartFlyout />
    <main>
      <NuxtPage />
    </main>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap');

.page-enter-active,
.page-leave-active {
  transition: all 0.4s ease-out;
}

.page-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.page-enter-active::before,
.page-leave-active::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transform: translateX(-100%);
  animation: flash 0.5s ease-out;
  pointer-events: none;
  z-index: 9999;
}

@keyframes flash {
  0% {
    transform: translateX(-100%) skewX(-45deg);
  }
  100% {
    transform: translateX(100%) skewX(-45deg);
  }
}
</style>