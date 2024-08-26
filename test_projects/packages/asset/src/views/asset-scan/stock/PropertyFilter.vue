<template>
  <Modal :title="title" v-model:open="dialogVisible" @cancel="closeModal">

    <CheckboxGroup v-model:value="properties">
      <div class="grid grid-cols-4 gap-4">
        <Checkbox value="name" disabled>资产名称</Checkbox>
        <Checkbox value="assetTypeCode" disabled>资产类型</Checkbox>
        <Checkbox value="assetGroupId">资产组</Checkbox>
        <Checkbox value="trademarkCode" disabled>资产品牌</Checkbox>
        <Checkbox value="assetSeriesCode" disabled>资产系列</Checkbox>
        <Checkbox value="assetIp" disabled>资产IP</Checkbox>
        <Checkbox value="assetMac" disabled>资产Mac地址</Checkbox>
        <Checkbox value="softwareVersion">软件版本</Checkbox>
        <Checkbox value="assetLocation">所处位置</Checkbox>
        <Checkbox value="runStatus">运行状态</Checkbox>
        <Checkbox value="createTime">入网时间</Checkbox>
        <Checkbox value="hardwareModel">硬件型号</Checkbox>
        <Checkbox value="importance">重要程度</Checkbox>
        <Checkbox value="security">责任部门</Checkbox>
        <Checkbox value="os">操作系统</Checkbox>
      </div>
    </CheckboxGroup>

    <template #footer>
      <Button @click="closeModal">取消</Button>
      <Button @click="handleRecover">恢复默认</Button>
      <Button type="primary" :disabled="loading" @click.prevent="handleSubmit">应用</Button>
    </template>
  </Modal>
</template>
<script setup lang="ts">
/* 类型文件 */
import type { PropType } from 'vue'
/* 第三方模块 */
import { ref, watch, computed } from 'vue'
import { Modal, Button, CheckboxGroup, Checkbox } from 'ant-design-vue';
import { useVModel } from '@guolisec/utils';
import { PROPERTY_FILTER_DEFAULT } from './model/stock.data';
/* 本地模块 */

/********************** 外部状态或配置 **********************/

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  current: {
    type: Object as PropType<(string | number)[]>,
  },
});

const emit = defineEmits(['update:visible', 'refresh']);

/********************** 初始化状态 **********************/

watch(
  () => props.visible,
  (v) => {
    if (v) {
      if (props.current) {
        properties.value = props.current
      } else {
        factory()
      }
    }
  },
)

/********************** 表单 **********************/

const properties = ref<(string | number)[]>([]);

function factory() {
  properties.value = PROPERTY_FILTER_DEFAULT
}

/********************** 弹窗 **********************/

const title = computed(() => {
  return `自定义表单项`
})

const dialogVisible = useVModel(props, 'visible', emit)

function closeModal() {
  dialogVisible.value = false
}

/********************** 确认结束 **********************/

const loading = ref(false)

async function handleSubmit() {
  emit('refresh', properties.value);
  closeModal();
}

function handleRecover() {
  factory()
  handleSubmit()
}
</script>
