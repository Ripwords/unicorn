<script lang="ts" setup>
import { mainStore } from "../store/pinia";

// Required because the event listener is at router-view
defineEmits(['changeTheme'])

// Variables
const store = mainStore()
</script>

<template>
  <n-h1 class="center" style="margin-top: 25px;">Hello {{ store.dec }}</n-h1>
  <div class="center">
    <n-button @click="store.dec--">Decrease</n-button>
    <n-button @click="store.dec++">Increment</n-button>
  </div>
  
</template>
