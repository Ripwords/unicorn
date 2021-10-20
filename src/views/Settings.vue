<script lang="ts" setup>
import { useRouter } from "vue-router";
import { appWindow, PhysicalSize } from "@tauri-apps/api/window";
import { ref } from "vue";
import { mainStore } from "../store/pinia";
import { useMessage } from "naive-ui";  

defineEmits(mainStore().emits)

// Variables
const store = mainStore()
const theme = ref("dark")
const router = useRouter()
const message = useMessage()

// Functions
const done = async () => {
  await appWindow.setAlwaysOnTop(false)
  await appWindow.setSize(new PhysicalSize(800, 350))
  if (store.mode == "quick") {
    await appWindow.hide()
  }
  router.push("/home")
}

const updateGradient_1 = (value: any) => {
  store.gradient_1 = value
}

const updateGradient_2 = (value: any) => {
  store.gradient_2 = value
}

const companionMode = () => {
  store.mode = "companion"
  message.info("Companion Mode")
}

const quickMode = () => {
  store.mode = "quick"
  message.info("Quick Mode")
}
</script>

<template>
  <n-h1 class="center" style="margin-top: 12px;">
    <n-gradient-text
      :gradient="{
        deg: store.gradientDegree,
        from: store.gradient_1,
        to: store.gradient_2
      }"
    >Settings</n-gradient-text>
  </n-h1>
  <div class="center">
    <n-card style="width: 70%;">
      <n-space vertical size="large">
        <n-layout>
          <n-layout-header>
            <n-gradient-text
              :gradient="{
                deg: store.gradientDegree,
                from: store.gradient_1,
                to: store.gradient_2
              }"
            >Title Gradients</n-gradient-text>
          </n-layout-header>
          <n-layout has-sider>
            <n-layout-sider content-style="padding: 24px;">
              Gradient From
            </n-layout-sider>
            <n-layout-content content-style="padding: 24px;">
              <div class="center">
                <n-color-picker style="width: 90%;" :value="store.gradient_1" @update:value="updateGradient_1"></n-color-picker>
              </div>
            </n-layout-content>
          </n-layout>
          <n-layout has-sider>
            <n-layout-sider content-style="padding: 24px;">
              Gradient To
            </n-layout-sider>
            <n-layout-content content-style="padding: 24px;">
              <div class="center">
                <n-color-picker style="width: 90%;" :value="store.gradient_2" @update:value="updateGradient_2"></n-color-picker>
              </div>
            </n-layout-content>
          </n-layout>
          <n-layout has-sider>
            <n-layout-sider content-style="padding: 24px;">
              Gradient Degree
            </n-layout-sider>
            <n-layout-content content-style="padding: 24px;">
              <div class="center">
                <n-slider v-model:value="store.gradientDegree" :step="1" :max="180" :min="-180"/>
              </div>
            </n-layout-content>
          </n-layout>
          <n-layout has-sider>
            <n-layout-sider content-style="padding: 24px;">
              Theme
            </n-layout-sider>
            <n-layout-content content-style="padding: 24px;">
              <div class="center">
                <n-button @click="$emit('changeTheme')">
                  <i-akar-icons:moon-fill v-if="store.theme === 'dark'"></i-akar-icons:moon-fill>
                  <i-akar-icons:sun-fill v-if="store.theme === 'light'"></i-akar-icons:sun-fill>
                </n-button>
              </div>
            </n-layout-content>
          </n-layout>
          <n-layout has-sider>
            <n-layout-sider content-style="padding: 24px;">
              App Mode
            </n-layout-sider>
            <n-layout-content content-style="padding: 24px;">
              <div class="center">
                <n-button @click="companionMode()">Companion</n-button>
                <n-button @click="quickMode()">Quick</n-button>
              </div>
            </n-layout-content>
          </n-layout>
        </n-layout>
      </n-space>
      <br>
      <div class="center">
        <n-button @click="done()">Done</n-button>
      </div>
    </n-card>
  </div>
</template>