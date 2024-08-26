<!--
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-05-31 18:42:48
 * @path: \glsec\apps\rsmp\src\domain\topology\views\OperateInstruction.vue
-->
<template>
  <Modal v-model:open="dialogVisible" title="操作说明" @close="handleColse" :width="440">
    <div v-for="(item, index) in operateInstructionList" :key="index"
      class="leading-10 border-0 border-b-1 border-solid border-gray-200">
      <span class="inline-block w-40">{{ item.operate }}</span>
      <span>{{ item.instruction }}</span>
    </div>
    <template #footer>
      <Button type="primary" @click="handleColse">我知道了</Button>
    </template>
  </Modal>
</template>
<script setup lang="ts">
import { Modal, Button, } from 'ant-design-vue';

const dialogVisible = defineModel<boolean>('value')

const operateInstructionList = [
  {
    operate: '鼠标滚轮',
    instruction: '画布放大/缩小'
  },
  {
    operate: '鼠标左键拖动',
    instruction: '拖动画布'
  },
  {
    operate: '右键上下文菜单',
    instruction: `1. 删除 2. 置于底层 3. 编辑矩形大小`
  },
  {
    operate: 'ctrl + 鼠标左键锚点',
    instruction: '设备元素连线'
  },
]

function handleColse() {
  dialogVisible.value = false
}
</script>