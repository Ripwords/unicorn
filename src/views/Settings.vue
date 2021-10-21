<script lang="ts" setup>
import { useRouter } from "vue-router";
import { appWindow, PhysicalSize } from "@tauri-apps/api/window";
import { useTimeout } from "@vueuse/core";
import { mainStore } from "../store/pinia";
import { useMessage } from "naive-ui";
import { ref, watch } from "vue";

defineEmits(mainStore().emits)

// Variables
const store = mainStore()
const router = useRouter()
const message = useMessage()
const showModal = ref(false)
const al = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
const ctrl = ref(store.trigger.includes("Ctrl"))
const alt = ref(store.trigger.includes("Alt"))
const key = ref(store.trigger[store.trigger.length - 1])

// Functions
const done = async () => {
  await appWindow.setSize(new PhysicalSize(800, 350))
  useTimeout(200)
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

const options = () => {
  const ar = []
  for (let i = 0; i < al.length; i++) {
    ar.push({
      value: `${al[i]}`,
      label: `${al[i]}`
    })
  }
  return ar
}

watch([key, alt, ctrl], () => {
  if (ctrl.value && alt.value) {
    store.trigger = `Ctrl+Alt+${key.value}`
  } else if (ctrl.value) {
    store.trigger = `Ctrl+${key.value}`
  } else if (alt.value) {
    store.trigger = `Alt+${key.value}`
  } else {
    message.error("At least one modifier has to be chosen")
    ctrl.value = true
    store.trigger = `Ctrl+${key.value}`
  }
})
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
            <n-layout-sider content-style="padding: 18px;">
              Gradient From
            </n-layout-sider>
            <n-layout-content content-style="padding: 18px;">
              <div class="center">
                <n-color-picker style="width: 90%;" :value="store.gradient_1" @update:value="updateGradient_1"></n-color-picker>
              </div>
            </n-layout-content>
          </n-layout>
          <n-layout has-sider>
            <n-layout-sider content-style="padding: 18px;">
              Gradient To
            </n-layout-sider>
            <n-layout-content content-style="padding: 18px;">
              <div class="center">
                <n-color-picker style="width: 90%;" :value="store.gradient_2" @update:value="updateGradient_2"></n-color-picker>
              </div>
            </n-layout-content>
          </n-layout>
          <n-layout has-sider>
            <n-layout-sider content-style="padding: 18px;">
              Gradient Degree
            </n-layout-sider>
            <n-layout-content content-style="padding: 18px;">
              <div class="center">
                <n-slider v-model:value="store.gradientDegree" :step="1" :max="180" :min="-180"/>
              </div>
            </n-layout-content>
          </n-layout>
          <n-layout has-sider>
            <n-layout-sider content-style="padding: 18px;">
              Theme
            </n-layout-sider>
            <n-layout-content content-style="padding: 18px;">
              <div class="center">
                <n-button @click="$emit('changeTheme')">
                  <i-akar-icons:moon-fill v-if="store.theme === 'dark'"></i-akar-icons:moon-fill>
                  <i-akar-icons:sun-fill v-if="store.theme === 'light'"></i-akar-icons:sun-fill>
                </n-button>
              </div>
            </n-layout-content>
          </n-layout>
          <n-layout has-sider>
            <n-layout-sider content-style="padding: 18px;">
              App Mode
            </n-layout-sider>
            <n-layout-content content-style="padding: 18px;">
              <div class="center">
                <n-button @click="companionMode()">Companion</n-button>
                <n-button @click="quickMode()">Quick</n-button>
              </div>
            </n-layout-content>
          </n-layout>
          <n-layout has-sider>
            <n-layout-sider content-style="padding: 18px;">
              Shortcut Trigger
            </n-layout-sider>
            <n-layout-content content-style="padding: 18px;">
              <div class="center" @click="showModal = true">
                <n-button>{{ store.trigger }}</n-button>
              </div>
              <n-modal v-model:show="showModal">
                <n-card style="width: 43%; height: 15%;" title="Shortcut Trigger" :bordered="false" size="huge">
                  <n-space>
                    <n-switch style="margin-right: 2%;" v-model:value="ctrl">
                      <template #checked>Ctrl</template>
                      <template #unchecked>Ctrl</template>
                    </n-switch>
                    +
                    <n-switch style="margin-left: 2%; margin-right: 2%;" v-model:value="alt">
                      <template #checked>Alt</template>
                      <template #unchecked>Alt</template>
                    </n-switch>
                    +
                    <n-cascader
                      v-model:value="key"
                      placeholder="Key"
                      expand-trigger="hover"
                      :options="options()"
                      style="width: 80px;"
                      :filterable="true"
                    />
                  </n-space>
                </n-card>
              </n-modal>
            </n-layout-content>
          </n-layout>
        </n-layout>
      </n-space>
      <br>
      <div class="center">
        <n-button @click="done(); $emit('changeSettingsMode')">Done</n-button>
      </div>
    </n-card>
  </div>
</template>