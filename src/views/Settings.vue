<script lang="ts" setup>
import { useRouter } from "vue-router";
import { appWindow } from "@tauri-apps/api/window";

const router = useRouter()
const save = async () => {
  await appWindow.setAlwaysOnTop(false)
  await appWindow.hide()
  router.push("/home")
}
</script>

<template>
  <n-h1 class="center">Settings</n-h1>
  <div class="center">
    <n-button @click="save()">Save</n-button>
  </div>
</template>