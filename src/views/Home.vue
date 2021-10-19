<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { mainStore } from "../store/pinia";
import convert from "../components/convert";
import Cascader from "../components/Cascader.vue";
import { AllMeasuresUnits } from "convert-units";
import { capitalizeFirstLetter } from '../components/functions';

// Required because the event listener is at router-view
defineEmits(mainStore().emits)

// Variables
const store = mainStore()
const title = ref("Unicorn")
const gradient_1 = ref(store.gradient_1)
const gradient_2 = ref(store.gradient_2)

// Functions
const changeTitle = (event: AllMeasuresUnits | undefined) => {
  if (event != undefined) {
    title.value = capitalizeFirstLetter(convert().describe(event).measure)
  } else {
    title.value = "Unicorn"
  }
}

// Watcher
watch([computed(() => store.gradient_1), computed(() => store.gradient_2)], () => {
  gradient_1.value = store.gradient_1
  gradient_2.value = store.gradient_2
})
</script>

<template>
  <n-h1 class="center" style="margin-top: 25px;">
    <n-gradient-text type="info"
      :gradient="{
        from: gradient_1,
        to: gradient_2
      }"
    >{{ title }} 🦄</n-gradient-text>
  </n-h1>
  <Cascader @valueChange="changeTitle"/>
  
</template>