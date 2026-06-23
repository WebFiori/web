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
  <v-snackbar
    v-model="showBanner"
    :timeout="-1"
    location="bottom"
    multi-line
    color="surface"
    class="cookie-consent"
  >
    <div class="d-flex align-center flex-wrap ga-3">
      <div class="text-body-2 flex-grow-1">
        We use cookies to analyze site traffic and improve your experience. No personal data is shared with third parties.
      </div>
      <div class="d-flex ga-2">
        <v-btn variant="outlined" size="small" @click="decline">Decline</v-btn>
        <v-btn variant="flat" color="primary" size="small" @click="accept">Accept</v-btn>
      </div>
    </div>
  </v-snackbar>
</template>
