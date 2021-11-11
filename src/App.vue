<script lang="ts" setup>
import { darkTheme } from "naive-ui";
import { useRouter } from "vue-router";
import { mainStore } from "./store/pinia";
import { computed, ref, watch } from "vue";
import { appWindow, PhysicalSize } from "@tauri-apps/api/window";
import { register, unregisterAll } from "@tauri-apps/api/globalShortcut";

// Variables
const store = mainStore()
const router = useRouter()
const settingsMode = ref(false)
const theme = ref(store.theme == "light" ? null : darkTheme)

// Functions
const changeTheme = () => {
  theme.value = theme.value == null ? darkTheme : null
  store.theme = theme.value == null ? 'light' : 'dark'
}

const registerShortcuts = () => {
  register(store.trigger, async () => {
    if (await appWindow.isVisible()) {
      appWindow.hide()
    } else {
      appWindow.show()
      appWindow.setFocus()
    }
  })
}

const settingsChanged = () => {
  appWindow.setAlwaysOnTop(false)
  settingsMode.value = false
}

const setSettingsWindow = () => {
  if (store.mode == "companion") {
    appWindow.setSize(new PhysicalSize(store.width, store.height))
  } else if (store.mode == "quick") {
    appWindow.setSize(new PhysicalSize(store.width, store.height - store.winSizeDiff))
  }
}

// Initialize Application & event listening
appWindow.setDecorations(store.mode == "companion" ? true : false)
appWindow.setSkipTaskbar(store.mode == "quick" ? true : false)
if (store.mode == 'quick') {
  registerShortcuts()
  appWindow.setSize(new PhysicalSize(store.width, store.smHeight))
  appWindow.center()
} else if (store.mode == "companion") {
  appWindow.setSize(new PhysicalSize(store.width, store.smHeight))
  appWindow.show()
  appWindow.setFocus()
  unregisterAll()
  register(store.trigger, () => {
    return
  })
}

appWindow.listen("settings", () => {
  setSettingsWindow()
  appWindow.center()
  appWindow.show()
  appWindow.setAlwaysOnTop(true)
  settingsMode.value = true
  router.push('/settings')
})

appWindow.listen("tauri://blur", async () => {
  if (await appWindow.isVisible()) {
    if (store.mode == "quick" && !settingsMode.value) {
      appWindow.hide()
    }
  }
})

// Watcher
watch(computed(() => store.mode), () => {
  appWindow.setDecorations(store.mode == "companion" ? true : false)
  appWindow.setSkipTaskbar(store.mode == "quick" ? true : false)
  if (!settingsMode.value) {
    appWindow.setSize(new PhysicalSize(store.width, store.smHeight))
  }
  if (store.mode == "companion") {
    unregisterAll()
    register(store.trigger, () => {
      return
    })
    appWindow.show()
    appWindow.setFocus()
  } else if (store.mode == "quick") {
    unregisterAll()
    registerShortcuts()
    appWindow.center()
  }
  setSettingsWindow()
})

watch(computed(() => store.trigger), () => {
  if (store.mode == "companion") {
    unregisterAll()
    register(store.trigger, () => {
      return
    })
  } else if (store.mode == "quick") {
    unregisterAll()
    registerShortcuts()
  }
})
</script>

<template>
  <n-config-provider :theme="theme">
    <n-message-provider>
      <router-view @changeTheme="changeTheme" @changeSettingsMode="settingsChanged"></router-view>
    </n-message-provider>
    <n-global-style />
  </n-config-provider>
</template>

<style>
.center {
  display: flex;
  justify-content: center;
}

::-webkit-scrollbar {
  width: 0px;
}
</style>