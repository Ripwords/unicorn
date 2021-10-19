<script lang="ts" setup="props, {emit}">
import { appWindow } from "@tauri-apps/api/window";
import { mainStore } from "../store/pinia";
import { ref } from "vue";
import convert from "./convert";
import { capitalizeFirstLetter } from './functions'
import Input from "./Input.vue";


// Variables
const store = mainStore()
const value = ref(null)
const unitToConvert = ref(null)
const emit = defineEmits(['valueChange'])

// Functions
const subCategories = (it: number) => {
  const subCats = []
  for (let i = 0; i < convert().possibilities(convert().measures()[it]).length; i++) {
    subCats.push({
      value: convert().possibilities(convert().measures()[it])[i],
      label: convert().possibilities(convert().measures()[it])[i]
    })
  }
  return subCats
}

const categories = () => {
  const cats = []
  for (let i = 0; i < convert().measures().length; i++) {
    cats.push({
      value: convert().measures()[i],
      label: capitalizeFirstLetter(convert().measures()[i]),
      children: subCategories(i)
    })
  }
  return cats
}

const availableConversions = () => {
  if (value.value != null) {
    const units = []
    for (let i = 0; i < convert().from(value.value).possibilities().length; i++) {
      units.push({
        value: convert().from(value.value).possibilities()[i],
        label: convert().from(value.value).possibilities()[i]
      })
    }
    return units
  }
  return
}

const handleUpdate = () => {
  if (value.value != null) {
    const units = convert().from(value.value).possibilities()
    if (unitToConvert.value != null && !units.includes(unitToConvert.value)) {
      unitToConvert.value = null
    }
  }
}

// Tauri events
appWindow.listen("tauri://blur", () => {
  if (store.mode == "quick") {
    value.value = null
    emit('valueChange', value.value)
  }
})
</script>

<template>
  <div class="center">
    <div style="width: 40%;">
      <n-cascader
        v-model:value="value"
        expand-trigger="hover"
        :options="categories()"
        check-strategy="child"
        :show-path="true"
        :filterable="true"
        @update:value="handleUpdate(); $emit('valueChange', value)"
      ></n-cascader>
    </div>
    <div v-if="value" style="width: 30%;">
      <n-cascader 
        v-model:value="unitToConvert"
        expand-trigger="hover"
        :options="availableConversions()"
        :show-path="true"
        :filterable="true"
      />
    </div>
  </div>
  <br>
  <div class="center">
    <div style="width: 60%;">
      <Input v-if="value && unitToConvert" :unit_1="value" :unit_2="unitToConvert"/> 
    </div>
  </div>
</template>