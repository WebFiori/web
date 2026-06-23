<script setup lang="ts">
import { ref, onMounted } from 'vue'

const showBanner = ref(false)

onMounted(() => {
  const consent = localStorage.getItem('cookie-consent')
  if (consent === null) {
    showBanner.value = true
  } else if (consent === 'accepted') {
    grantConsent()
  }
})

function grantConsent() {
  window.gtag?.('consent', 'update', {
    'analytics_storage': 'granted'
  })
}

function accept() {
  localStorage.setItem('cookie-consent', 'accepted')
  grantConsent()
  showBanner.value = false
}

function decline() {
  localStorage.setItem('cookie-consent', 'declined')
  showBanner.value = false
}
</script>

<template>
  <v-slide-y-reverse-transition>
    <v-card
      v-if="showBanner"
      class="cookie-banner"
      elevation="8"
      rounded="lg"
    >
      <v-card-text class="pa-5">
        <div class="d-flex align-start ga-3">
          <v-icon icon="mdi-cookie" size="28" color="primary" class="mt-1" />
          <div class="flex-grow-1">
            <div class="text-subtitle-1 font-weight-bold mb-1">Cookie Preferences</div>
            <div class="text-body-2 text-medium-emphasis">
              We use analytics cookies to understand how visitors interact with our site.
              No personal data is sold or shared with third parties. You can change your preference at any time.
            </div>
          </div>
        </div>
      </v-card-text>
      <v-divider />
      <v-card-actions class="pa-4 pt-3">
        <v-spacer />
        <v-btn variant="text" size="small" @click="decline">
          Decline
        </v-btn>
        <v-btn variant="flat" color="primary" size="small" @click="accept">
          Accept Analytics
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-slide-y-reverse-transition>
</template>

<style scoped>
.cookie-banner {
  position: fixed;
  bottom: 24px;
  left: 24px;
  z-index: 9999;
  max-width: 420px;
  width: calc(100% - 48px);
}

@media (max-width: 600px) {
  .cookie-banner {
    left: 12px;
    bottom: 12px;
    max-width: calc(100% - 24px);
  }
}
</style>
