<script lang="ts" setup>
import { ref } from "vue";
import { mainStore } from "../store/pinia";
import { appWindow } from "@tauri-apps/api/window";
import { register, unregisterAll } from "@tauri-apps/api/globalShortcut";

// Required because the event listener is at router-view
defineEmits(['changeTheme'])

const store = mainStore()
const visible = ref(false)

// register global shortcut
unregisterAll()
register("CmdOrControl+U", async () => {
  await appWindow.setFocus()
  if (visible.value) {
    await appWindow.hide()
    visible.value = false
  } else {
    await appWindow.show()
    visible.value = true
  }
})

appWindow.listen("tauri://blur", () => {
  if (visible.value) {
    visible.value = false
  }
})
</script>

<template>
  <n-h1 class="center" style="margin-top: 25px;">Hello {{ store.dec }}</n-h1>
  <div class="center">
    <n-button @click="store.dec--">Decrease</n-button>
    <n-button @click="store.dec++">Increment</n-button>
  </div>
  
</template>
