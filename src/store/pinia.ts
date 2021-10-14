import { defineStore } from "pinia"
import { useStorage } from "@vueuse/core";

export const mainStore = defineStore('main', {
  state: () => {
    return {
      dec: useStorage('dec', 4),
      theme: useStorage('theme', 'light')
    }
  }
})