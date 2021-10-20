<script lang="ts" setup>
import { ref } from "vue";
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

// Functions
const changeTitle = (event: AllMeasuresUnits | undefined) => {
  if (event != undefined) {
    title.value = capitalizeFirstLetter(convert().describe(event).measure)
  } else {
    title.value = "Unicorn"
  }
}
</script>

<template>
  <n-h1 class="center" style="margin-top: 25px;">
    <n-gradient-text type="info"
      :gradient="{
        deg: store.gradientDegree,
        from: store.gradient_1,
        to: store.gradient_2
      }"
    >{{ title }} 🦄</n-gradient-text>
  </n-h1>
  <Cascader @valueChange="changeTitle"/>
  
</template>