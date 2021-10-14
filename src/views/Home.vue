<script lang="ts" setup>
import { mainStore } from "../store/pinia";
import { NButton, NH1 } from "naive-ui";

const store = mainStore()
defineEmits(['changeTheme'])
</script>

<template>
  <n-h1>Hello {{ store.dec }}</n-h1>
  <div style="display: flex; justify-content: center;">
    <n-button @click="store.dec++">Increment</n-button>
    <n-button @click="store.dec--">Decrease</n-button>
  </div>
  <n-button @click="$emit('changeTheme')">Change Theme</n-button>
</template>