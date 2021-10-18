<script lang="ts" setup>
import { useRouter } from "vue-router";
import { appWindow } from "@tauri-apps/api/window";
import { ref } from "vue";
import { mainStore } from "../store/pinia";

defineEmits(['changeTheme'])

// Variables
const store = mainStore()
const theme = ref("dark")
const router = useRouter()

// Functions
const changeIcon = () => {
  if (theme.value === "dark") {
    theme.value = "light"
  } else {
    theme.value = "dark"
  }
}

const done = async () => {
  await appWindow.setAlwaysOnTop(false)
  if (store.mode == "companion") {
    await appWindow.minimize()
  } else if (store.mode == "quick") {
    await appWindow.hide()
  }
  router.push("/home")
}
</script>

<template>
  <n-h1 class="center" style="margin-top: 25px;">Settings</n-h1>
  <div class="center">
    <n-button @click="$emit('changeTheme'); changeIcon()">
      <i-akar-icons:moon-fill v-if="theme === 'dark'"></i-akar-icons:moon-fill>
      <i-akar-icons:sun-fill v-if="theme === 'light'"></i-akar-icons:sun-fill>
    </n-button>
  </div>
  <div class="center">
    <n-button @click="store.mode = 'companion'">Companion</n-button>
    <n-button @click="store.mode = 'quick'">Quick</n-button>
  </div>
  <br>
  <div class="center">
    <n-button @click="done()">Done</n-button>
  </div>
</template>