<!--
 * @name: 资产详情-弹窗
 * @description: Do not edit
 * @path: \assets-detail\src\views\ModalAssetDetail\index.vue
-->
<template>
  <Modal :title="t('资产详情')" v-model:open="dialogVisible" width="100%" wrap-class-name="ant-full-modal"
    @cancel="closeModal" :mask-closable="false" destroy-on-close :footer="false">
    <AssetDetail :assetId="assetId" :related-asset-id="relatedAssetId" :time="time"></AssetDetail>
  </Modal>
</template>
<script setup lang="ts">
/* 类型文件 */
import type { PropType } from 'vue';
/* 第三方模块 */
import { nextTick, watch } from 'vue'
import { Modal } from 'ant-design-vue';
import { useVModel } from '@guolisec/utils';
/* 本地模块 */
import AssetDetail from './AssetDetail.vue';
import { type Features } from '@/entry/features/useContext'
import { t } from "@/entry/languages/useLanguage";

// 父组件传值
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  time: {
    type: Object as PropType<[string, string]>,
    default: () => []
  },
  assetId: {
    type: Number,
    require: true
  },
  // 和主资产直接连接的资产的id
  relatedAssetId: {
    type: Number,
  },
  hiddenFeatures: {
    type: Object as PropType<Features>,
    default: () => []
  },
  closeFeatures: {
    type: Object as PropType<Features>,
    default: () => []
  },
});

const emit = defineEmits(['update:visible', 'refresh']);

const dialogVisible = useVModel(props, 'visible', emit)
watch(
  () => props.visible,
  async (val) => {
    if (val) {
    }
  },
)
function closeModal() {
  dialogVisible.value = false
  emit('refresh');
  nextTick(() => {
  });
}
</script>

<style scoped lang="less">
.ant-full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }

  .ant-modal-content {
    display: flex;
    flex-direction: column;
    min-height: calc(100vh);
  }

  .ant-modal-body {
    flex: 1;
  }
}
</style>