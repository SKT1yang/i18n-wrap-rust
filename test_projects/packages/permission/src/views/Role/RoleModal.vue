<!--
 * @name: 配置系统角色
 * @description: Do not edit
-->

<template>
  <Modal :title="title" v-model:open="dialogVisible" :width="1600">
    <Role :systemInfo="props.current" scope="all" v-if="dialogVisible" />
    <template #footer>
      <div>
        <Button @click="closeModal">{{ t('取消') }}</Button>
        <Button type="primary" @click="handleSubmit">{{ t('确定') }}</Button>
      </div>
    </template>
  </Modal>
</template>
<script setup lang="ts">
import type { PropType } from 'vue';
import type { SystemInfo } from '@guolisec/types';
import { Modal, Button } from 'ant-design-vue';
import Role from './index.vue'
import { useRoleModal } from '../../controller/useRole';
import { t } from '@/languages/useLanguage'

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

const { dialogVisible, title, handleSubmit, closeModal } = useRoleModal(props, emit)

</script>