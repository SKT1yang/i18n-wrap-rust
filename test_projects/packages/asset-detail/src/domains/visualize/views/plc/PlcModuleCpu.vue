<!--
 * @name: PLC的CPU模块
 * @description: Do not edit
-->

<template>
  <div class="flex ml-1" v-show="moduleVo.repeat !== 1">
    <div @click="handleExpand(moduleVo, moduleVo.id)" class="cursor-pointer">

      <div class="h-60 color-$color-bg-base flex flex-col items-center w-20" v-if="ledStatus?.length">
        <div class="w-full h-3 bg-$blue-1"></div>
        <div
          class="w-full h-47 flex flex-col items-center  border-l border-b border-r-0 border-t-0 border-zinc-300 border-solid bg-$color-text-placeholder">
          <LedStatusPlc :ledStatus="ledStatus" :module-vo="moduleVo" />
        </div>
        <div class="w-full h-10 bg-$color-text-secondary"></div>
      </div>
      <img :src="plcBlocktypeCpu" class="block" alt="plcBlocktypeCpu" v-else>
    </div>
    <CollapseTransition animation-duration="0.3s" orientation="horizontal">
      <div class="module-collapse font-base w-50 h-60 p-2 border border-solid border-slate-200 text-slate-800"
        v-if="expand" id="content">
        <div class="text-slate-400 w-50 h-5">{{ t('模块类型') }}</div>
        <div class="my-2 truncate" :title="moduleVo.blockType">{{ moduleVo.blockType || t('暂无') }}</div>
        <div class="text-slate-400 w-50 h-5"> {{ t('模块型号') }}</div>
        <div class="my-2 truncate" :title="moduleVo.blockModel">{{ moduleVo.blockModel || t('暂无') }}</div>
        <div class="text-slate-400 w-50 h-5"> {{ t('模块版本') }}</div>
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
import plcBlocktypeCpu from '../../assets/plc-blocktype-cpu.svg'

import LedStatusPlc from './LedStatusPlc.vue';
import { t } from "@/entry/languages/useLanguage";

const props = defineProps({
  moduleVo: {
    type: Object as PropType<ModuleVOItem>,
    required: true
  },
  ledStatus: {
    type: Object as PropType<{
      flash: 0 | 1; status: 0 | 1; name: string
    }[]>,
  },
  expandId: {
    type: Number,
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