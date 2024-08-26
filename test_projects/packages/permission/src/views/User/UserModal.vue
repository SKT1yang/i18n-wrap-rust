<!--
 * @name: 配置系统用户
 * @description: Do not edit
-->

<template>
  <Modal :title="title" v-model:open="dialogVisible" @close="closeModal" width="100%">
    <User :systemInfo="props.current" scope="all" v-if="dialogVisible" />
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
import User from './index.vue'
import { useUserModal } from '../../controller/useUser';
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

const { dialogVisible, title, handleSubmit, closeModal } = useUserModal(props, emit)

</script>