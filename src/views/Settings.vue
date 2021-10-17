<script lang="ts" setup>
import { useRouter } from "vue-router";
import { appWindow } from "@tauri-apps/api/window";
import { ref } from "vue";

defineEmits(['changeTheme'])

const theme = ref("dark")
const changeIcon = () => {
  if (theme.value === "dark") {
    theme.value = "light"
  } else {
    theme.value = "dark"
  }
}

const router = useRouter()
const save = async () => {
  await appWindow.setAlwaysOnTop(false)
  await appWindow.hide()
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
    <n-button @click="save()">Save</n-button>
  </div>
</template>