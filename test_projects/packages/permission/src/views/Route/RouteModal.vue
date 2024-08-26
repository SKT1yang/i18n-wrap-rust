<!--
 * @name: 配置系统路由
 * @description: Do not edit
 * @date: 2023-03-16 13:10:45
 * @path: \permission\src\views\Route\RouteModal.vue
-->

<template>
  <Modal :title="title" v-model:open="dialogVisible" @close="closeModal" width="100%" wrap-class-name="full-modal">
    <Route :current="current" v-if="dialogVisible" />
    <template #footer>
      <div>
        <Button @click="closeModal">取消</Button>
        <Button type="primary" @click="handleSubmit">确定</Button>
      </div>
    </template>
  </Modal>
</template>
<script setup lang="ts">
import type { PropType } from 'vue';
import type { SystemInfo } from '@guolisec/types';
import { Modal, Button } from 'ant-design-vue';
import Route from './index.vue'
import { useRouteModal } from '../../controller/useRoute';

// 父组件传值
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  current: {
    type: Object as PropType<SystemInfo>,
    default: () => { }
  },
});

const emit = defineEmits(['update:visible', 'refresh']);

const { dialogVisible, title, handleSubmit, closeModal } = useRouteModal(props, emit)

</script>

<style>
.full-modal .ant-modal {
  max-width: 100%;
  top: 0;
  padding-bottom: 0;
  margin: 0;
}
</style>