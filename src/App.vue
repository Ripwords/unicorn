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

const registerShortcuts = async () => {
  await register(store.trigger, async () => {
    await appWindow.setFocus()
    if (await appWindow.isVisible()) {
      await appWindow.hide()
    } else {
      await appWindow.show()
      await appWindow.setFocus()
    }
  })
}

const settingsChanged = async () => {
  await appWindow.setAlwaysOnTop(false)
  settingsMode.value = false
}

const setSettingsWindow = async () => {
  if (store.mode == "companion") {
    await appWindow.setSize(new PhysicalSize(800, 635))
  } else if (store.mode == "quick") {
    await appWindow.setSize(new PhysicalSize(800, 595))
  }
}

// App Init & events
appWindow.setDecorations(store.mode == "companion" ? true : false)
appWindow.setSkipTaskbar(store.mode == "quick" ? true : false)
unregisterAll()
if (store.mode == 'quick') {
  registerShortcuts()
  appWindow.setSize(new PhysicalSize(800, 350))
  appWindow.center()
} else if (store.mode == "companion") {
  appWindow.setSize(new PhysicalSize(800, 350))
  appWindow.show()
  appWindow.setFocus()
  unregisterAll()
  register(store.trigger, () => {
    return
  })
}

appWindow.listen("settings", async () => {
  await setSettingsWindow()
  await appWindow.center()
  await appWindow.setAlwaysOnTop(true)
  await appWindow.show()
  settingsMode.value = true
  router.push('/settings')
})

appWindow.listen("tauri://blur", async () => {
  if (await appWindow.isVisible()) {
    if (store.mode == "quick" && !settingsMode.value) {
      await appWindow.hide()
    }
  }
})

// Watcher
watch(computed(() => store.mode), async () => {
  await appWindow.setDecorations(store.mode == "companion" ? true : false)
  await appWindow.setSkipTaskbar(store.mode == "quick" ? true : false)
  if (!settingsMode.value) {
    await appWindow.setSize(new PhysicalSize(800, 350))
  }
  if (store.mode == "companion") {
    await unregisterAll()
    await register(store.trigger, () => {
      return
    })
    await appWindow.show()
    await appWindow.setFocus()
  } else if (store.mode == "quick") {
    await unregisterAll()
    await registerShortcuts()
    await appWindow.center()
  }
  await setSettingsWindow()
})

watch(computed(() => store.trigger), async () => {
  if (store.mode == "companion") {
    await unregisterAll()
    await register(store.trigger, () => {
      return
    })
  } else if (store.mode == "quick") {
    await unregisterAll()
    await registerShortcuts()
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