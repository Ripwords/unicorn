<script lang="ts" setup>
import { computed, ref } from 'vue';
import convert from './convert';
import { AllMeasuresUnits } from "convert-units";

const props = defineProps<{
  unit_1: AllMeasuresUnits;
  unit_2: AllMeasuresUnits;
}>()

const input = ref(null)
const output = ref(computed(() => {
  if (input.value != null) {
    return convert(input.value).from(props.unit_1).to(props.unit_2)
  }
  return null
}))
</script>

<template>
  <n-space vertical>
    <n-input-number :show-button="false" v-model:value="input">
      <template #suffix>{{ unit_1 }}</template>
    </n-input-number>
    <n-input-number 
      :show-button="false"
      v-model:value="output"
      style="pointer-events: none;"
      placeholder=""
    >
      <template #suffix>{{ unit_2 }}</template>
    </n-input-number>
  </n-space>
</template>