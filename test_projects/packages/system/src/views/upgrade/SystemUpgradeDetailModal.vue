<!--
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-04-12 16:17:26
 * @path: \feature-vue\platform\front\system\src\views\upgrade\SystemUpgradeDetailModal.vue
-->
<template>
  <Modal v-model:open="dialogVisible" title="更新详情" :footer="null" :width="950" @cancel="handleClose">
    <div id="detail" style=" height: 500px; overflow: auto; " ref="detailRef">
      <div v-for="(detail, index) in detailDataList" :key="index" class="leading-6"> {{ detail }}
      </div>
    </div>
  </Modal>
</template>

<script lang="ts" setup>
import { Modal } from 'ant-design-vue';

import { useUpgradeDetailModal } from '../../controller/upgrade/useSystemUpgrade'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
})

const emits = defineEmits(['update:visible', 'refresh'])

const {
  detailRef,
  dialogVisible,
  detailDataList,
  handleClose,
} = useUpgradeDetailModal(props, emits)
</script>
