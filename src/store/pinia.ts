import { defineStore } from "pinia"
import { useStorage } from "@vueuse/core";

export const mainStore = defineStore('main', {
  state: () => {
    return {
      dec: useStorage('dec', 4),
      theme: useStorage('theme', 'light'),
      mode: useStorage('mode', "quick"),
      emits: [
        'changeTheme',
        'changeSettingsMode'
      ],
      gradient_1: useStorage('gradient_1', "#7b0d8f"),
      gradient_2: useStorage('gradient_2', "#79badd"),
      gradientDegree: useStorage('gradientDegree', 180)
    }
  }
})