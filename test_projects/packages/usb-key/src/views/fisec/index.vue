<!--
 * @name: Do not edit
 * @description: Do not edit
-->

<template>
  <div>
    <div class="space-x-4">
      <Button type="primary" @click="refresh">
        <i class="i-base-refresh-line align-icon"></i> {{ t('刷新') }}
      </Button>
      <Button
        type="primary"
        danger
        @click="handleEmergencyLogin"
        v-if="isShowByFeature('EmergencyLogin')"
      >
        <template #icon> </template>
        {{ t('紧急登录') }}
      </Button>
    </div>
    <TableUsbkeyDevice ref="TableUsbkeyDeviceRef" />
    <TableUsbKeyBindRelation ref="TableUsbKeyBindRelationRef" />
    <!-- UsbKey紧急登录 -->
    <ModalEmergencyLogin v-model:visible="emergencyVisible" />
  </div>
</template>

<script setup lang="ts">
import { type PropType, ref } from 'vue'
import { Button } from 'ant-design-vue'
import TableUsbkeyDevice from './UsbkeyDeviceList/TableUsbkeyDevice.vue'
import TableUsbKeyBindRelation from './UsbKeyBind/TableUsbKeyBindRelation.vue'
import ModalEmergencyLogin from './UsbKeyLogin/ModalEmergencyLogin.vue'
import { t } from '../../languages/useLanguage'

type Feature = 'EmergencyLogin'
type Features = Feature[]

/**
 * 根据当前特性是否在需要隐藏的特性列表里，判断是否应该显示
 * @description 必须在顶层setup调用
 * @param feature 当前特性
 * @returns
 */
function isShowByFeature(currentFeature: Feature) {
  return !props.hiddenFeatures?.includes(currentFeature)
}

const props = defineProps({
  hiddenFeatures: {
    type: Array as PropType<Features>
  }
})

const emergencyVisible = ref(false)
function handleEmergencyLogin() {
  emergencyVisible.value = true
}
const TableUsbkeyDeviceRef = ref<InstanceType<typeof TableUsbkeyDevice>>()
const TableUsbKeyBindRelationRef = ref<InstanceType<typeof TableUsbKeyBindRelation>>()
function refresh() {
  TableUsbkeyDeviceRef.value?.getDataList()
  TableUsbKeyBindRelationRef.value?.getBindRelation()
}
</script>
