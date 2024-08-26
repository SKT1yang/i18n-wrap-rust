<!--
 * @name: 事件库 - 添加事件
 * @description: Do not edit
 * @date: 2023-09-22 13:21:23
 * @path: \knowledge\src\views\eventStore\AddEventModal.vue
-->
<template>
    <Modal v-model:open="dialogVisible" :title="title" width="550px" :closable="false" :mask-closable="false">
        <Form :model="formData" :label-col="{ style: { width: '90px' } }" ref="formRef" :rules="rules">

            <FormItem label="事件名称：" name="name">
                <Input v-model:value="formData.name" placeholder="事件名称" :maxlength="20" show-count allow-clear />
            </FormItem>

            <FormItem label=" 事件类型：" name="typeList">
                <Cascader v-model:value="formData.typeList" placeholder="事件类型" :options="eventTypeTreeData"
                    :field-names="{ label: 'name', value: 'id', children: 'eventTypes' }" />
            </FormItem>

            <FormItem label="事件级别：" name="level">
                <Select v-model:value="formData.level" :options="eventLevelData" placeholder="事件级别" />
            </FormItem>

            <FormItem label="事件特征：" name="tag">
                <Input v-model:value="formData.tag" allow-clear placeholder="事件特征" />
            </FormItem>

            <FormItem label="事件描述：" name="description">
                <Textarea v-model:value="formData.description" placeholder="事件描述" :maxlength="80" show-count
                    :auto-size="{ minRows: 3, maxRows: 3 }" allow-clear />
            </FormItem>

        </Form>

        <template #footer>
            <Button @click="handleClose">关闭</Button>
            <Button type="primary" @click="handleConfirm" :loading="confirmButtonStatus">
                确认
            </Button>
        </template>

    </Modal>
</template>

<script lang="ts" setup>
/* 类型文件 */
import type { Event } from '../../types/eventStore'
import type { PropType } from 'vue';
/* 第三方模块 */
import { Modal, Form, FormItem, Button, Select, Textarea, Input, Cascader } from 'ant-design-vue';
/* 本地共享模块 */
/* 业务模块 */
import { useAddEventStoreModal } from '../../controller/useEventStore'

const props = defineProps({
    visible: {
        type: Boolean,
        required: true
    },
    records: {
        type: Object as PropType<Event[]>,
        default: () => []
    },
    type: {
        type: String as PropType<"abnormal" | 'alarm' | "threshold">,
        default: () => "abnormal"
    }
})

const emits = defineEmits(['update:visible', 'refresh'])

const {
    dialogVisible,
    title,
    formRef,
    formData,
    rules,
    eventLevelData,
    eventTypeTreeData,
    confirmButtonStatus,
    handleConfirm,
    handleClose,
} = useAddEventStoreModal(props, emits)
</script>
