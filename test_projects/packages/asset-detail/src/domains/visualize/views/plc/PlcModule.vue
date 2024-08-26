<!--
 * @name: PLC的普通模块
 * @description: Do not edit
-->

<template>
  <div class="flex" v-show="moduleVo.repeat !== 1">
    <div @click="handleExpand(moduleVo, moduleVo.id)" class="cursor-pointer">
      <div class="h-60 color-$color-bg-base flex flex-col items-center w-12">
        <div class="w-full h-3" :style="{ backgroundColor: `var(${topBarColor})` }"></div>
        <div
          class="w-full h-57 flex flex-col items-center  border-l border-b border-r-0 border-t-0 border-zinc-400 border-solid"
          :class="[expand ? 'bg-$color-text-label' : 'bg-$color-text-placeholder']">
          <i :class="expand ? 'i-base-arrow-right-s-line' : 'i-base-arrow-down-s-line'" class="py-3 text-xl" />
          <span class="w-12 h-50 leading-12 block module-vo-text overflow-hidden truncate">
            Slot{{ moduleVo.blockSlotNo }} : {{ moduleVo.blockModel || 'Empty' }}
          </span>
        </div>
      </div>
    </div>
    <CollapseTransition animation-duration="0.3s" orientation="horizontal">
      <div class="module-collapse font-base w-50 h-60 p-2 border border-solid border-slate-200 text-slate-800"
        v-if="expand" id="content">
        <div class="text-slate-400 w-50 h-5">{{ t('模块类型') }}</div>
        <div class="my-2 truncate" :title="moduleVo.blockType">{{ moduleVo.blockType || t('暂无') }}</div>
        <div class="text-slate-400 w-50 h-5">{{ t('模块型号') }}</div>
        <div class="my-2 truncate" :title="moduleVo.blockModel">{{ moduleVo.blockModel || t('暂无') }}</div>
        <div class="text-slate-400 w-50 h-5">{{ t('模块版本') }}</div>
        <div class="my-2 truncate" :title="moduleVo.blockVersion">{{ moduleVo.blockVersion || t('暂无') }}</div>
      </div>
    </CollapseTransition>
  </div>
</template>

<script lang='ts' setup>
import type { PropType } from 'vue';
import type { ModuleVOItem } from '../../types/plc';
import { computed } from 'vue';
import { CollapseTransition } from '@guolisec/collapse'
import { t } from "@/entry/languages/useLanguage";

const props = defineProps({
  moduleVo: {
    type: Object as PropType<ModuleVOItem>,
    required: true
  },
  expandId: {
    type: Number,
  }
})

const topBarColor = computed(() => {
  if (props.moduleVo.blockType.indexOf('以太网模块') > -1) {
    return '--purple-6';
  } else if (props.moduleVo.blockType.indexOf('模拟量输入模块') > -1) {
    return '--purple-5';
  } else if (props.moduleVo.blockType.indexOf('模拟量输出模块') > -1) {
    return '--gold-5';
  } else if (props.moduleVo.blockType.indexOf('数字量输入模块') > -1) {
    return '--blue-5';
  } else if (props.moduleVo.blockType.indexOf('数字量输出模块') > -1) {
    return '--cyan-6';
  } else if (props.moduleVo.blockType || props.moduleVo.blockModel || props.moduleVo.blockVersion) {
    return '--color-text-description';
  } else {
    return '--color-text-disabled';
  }
})

const emit = defineEmits(['expand'])

const expand = computed(() => {
  return props.moduleVo.id && props.expandId === props.moduleVo.id
})

function handleExpand(data: ModuleVOItem, id: number = 0) {
  if (props.expandId === id) {
    emit('expand', undefined)
  } else {
    if (data.blockType || data.blockModel || data.blockVersion) {
      emit('expand', id)
    }
  }
}

</script>

<style scoped>
.module-vo-text {
  writing-mode: vertical-rl
}
</style>