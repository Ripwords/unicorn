<script setup lang="ts">
import { NConfigProvider, NGlobalStyle, darkTheme } from "naive-ui";
import { ref } from "vue";
import { mainStore } from "./store/pinia";

const store = mainStore()
const theme = ref()
theme.value = store.theme == 'light' ? null : darkTheme

const changeTheme = () => {
  theme.value = theme.value == null ? darkTheme : null
  store.theme = theme.value == null ? 'light' : 'dark'
}
</script>

<template>
  <n-config-provider :theme="theme">
    <router-view @changeTheme="changeTheme"></router-view>
    <n-global-style />
  </n-config-provider>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
