<script setup lang="ts">
import { darkTheme } from "naive-ui";
import { computed, ref, watch } from "vue";
import { mainStore } from "./store/pinia";
import { appWindow, PhysicalSize } from "@tauri-apps/api/window";
import { useRouter } from "vue-router";
import { register, unregisterAll } from "@tauri-apps/api/globalShortcut";

// Variables
const store = mainStore()
const router = useRouter()
const settingsMode = ref(false)
const theme = ref(store.theme == 'light' ? null : darkTheme)
const mode = ref(computed(() => store.mode))
const visible = ref(false)

// Functions
const changeTheme = () => {
  theme.value = theme.value == null ? darkTheme : null
  store.theme = theme.value == null ? 'light' : 'dark'
}

const changeSettingsMode = () => {
  settingsMode.value = !settingsMode.value
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
  await appWindow.setSize(new PhysicalSize(800, 615))
  await appWindow.center()
  await appWindow.show()
  await appWindow.setAlwaysOnTop(true)
  settingsMode.value = true
  router.push("/settings")
})

// Tauri events
appWindow.listen("tauri://blur", async () => {
  visible.value = false
  if (visible.value) {
    await appWindow.hide()
  }
})

appWindow.setDecorations(mode.value == "companion" ? true : false)
appWindow.setSkipTaskbar(mode.value == "quick" ? true : false)

// register global shortcut
unregisterAll()
if (mode.value == 'quick') {
  registerShortcuts()
  appWindow.setSize(new PhysicalSize(800, 350))
  appWindow.center()
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
    // TODO : Change the window size into a state variable so it can be persisted
    if (!settingsMode.value) {
      await appWindow.setSize(new PhysicalSize(800, 350))
    }
  } else if (mode.value == "quick") {
    unregisterAll()
    registerShortcuts()
    if (!settingsMode.value) {
      await appWindow.setSize(new PhysicalSize(800, 350))
    }
    await appWindow.center()
  }
})
</script>

<template>
  <n-config-provider :theme="theme">
    <n-message-provider>
      <router-view @changeTheme="changeTheme" @changeSettingsMode="changeSettingsMode"></router-view>
    </n-message-provider>
    <n-global-style />
  </n-config-provider>
</template>

<style>
.center {
  display: flex;
  justify-content: center;
}
</style>