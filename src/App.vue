<script setup lang="ts">
import { darkTheme } from "naive-ui";
import { computed, ref, watch } from "vue";
import { mainStore } from "./store/pinia";
import { appWindow } from "@tauri-apps/api/window";
import { useRouter } from "vue-router";
import { register, unregisterAll } from "@tauri-apps/api/globalShortcut";

// Variables
const store = mainStore()
const router = useRouter()
const theme = ref(store.theme == 'light' ? null : darkTheme)
const mode = ref(computed(() => store.mode))
const visible = ref(false)

// Functions
const changeTheme = () => {
  theme.value = theme.value == null ? darkTheme : null
  store.theme = theme.value == null ? 'light' : 'dark'
}

const registerShortcuts = async () => {
  await register("CmdOrControl+U", async () => {
    await appWindow.setFocus()
    if (visible.value) {
      await appWindow.hide()
      visible.value = false
    } else {
      await appWindow.show()
      visible.value = true
    }
  })
}

// App init
appWindow.listen("settings", async () => {
  await appWindow.show()
  await appWindow.setAlwaysOnTop(true)
  await appWindow.center()
  router.push("/settings")
})

// Tauri events
appWindow.listen("tauri://blur", () => {
  if (visible.value) {
    visible.value = false
  }
})

appWindow.setDecorations(mode.value == "companion" ? true : false)
appWindow.setSkipTaskbar(mode.value == "quick" ? true : false)

// register global shortcut
unregisterAll()
if (mode.value != 'companion') {
  registerShortcuts()
} else {
  appWindow.show()
  appWindow.setFocus()
  register("CmdOrControl+U", () => {
    return
  })
}

// Watcher
watch(computed(() => store.mode), async () => {
  await appWindow.setDecorations(mode.value == "companion" ? true : false)
  await appWindow.setSkipTaskbar(mode.value == "quick" ? true : false)
  if (mode.value == "companion") {
    unregisterAll()
    await appWindow.show()
    await appWindow.setFocus()
    register("CmdOrControl+U", () => {
      return
    })
  } else {
    unregisterAll()
    registerShortcuts()
  }
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