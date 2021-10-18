<script setup lang="ts">
import { darkTheme } from "naive-ui";
import { ref } from "vue";
import { mainStore } from "./store/pinia";
import { appWindow } from "@tauri-apps/api/window";
import { useRouter } from "vue-router";
import { checkUpdate, installUpdate } from "@tauri-apps/api/updater";
import { relaunch } from "@tauri-apps/api/process";

// check for updates
try {
  const { shouldUpdate } = await checkUpdate()
  if (shouldUpdate) {
    await installUpdate()
    await relaunch()
  }
} catch (err) {
  console.error(err)
}

const store = mainStore()
const router = useRouter()
const theme = ref()
theme.value = store.theme == 'light' ? null : darkTheme

const changeTheme = () => {
  theme.value = theme.value == null ? darkTheme : null
  store.theme = theme.value == null ? 'light' : 'dark'
}

appWindow.listen("settings", async () => {
  console.log("i heard")
  await appWindow.show()
  await appWindow.setAlwaysOnTop(true)
  await appWindow.center()
  router.push("/settings")
})
</script>

<template>
  <n-config-provider :theme="theme">
    <router-view @changeTheme="changeTheme"></router-view>
    <n-global-style />
  </n-config-provider>
</template>

<style>
.center {
  display: flex;
  justify-content: center;
}
</style>