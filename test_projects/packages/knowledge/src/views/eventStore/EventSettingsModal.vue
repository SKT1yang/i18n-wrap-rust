<!--
 * @name: 事件库 - 事件配置
 * @description: Do not edit
 * @date: 2023-09-21 15:40:32
 * @path: \knowledge\src\views\eventStore\EventSettingsModal.vue
-->
<template>
    <Modal v-model:open="dialogVisible" :title="title" width="550px" :closable="false" :mask-closable="false">
        <Form :model="formData" :label-col="{ style: { width: '130px' } }" ref="formRef" :rules="rules">
            <template v-if="props.type === 'abnormal'">
                <FormItem label="设置指定的安全事件是异常行为：" name="abnormal" :label-col="{ style: { width: '220px' } }">
                    <Switch v-model:checked="formData.abnormal" :disabled="confirmButtonStatus"></Switch>
                </FormItem>
            </template>
            <template v-else-if="props.type === 'alarm'">
                <FormItem label="发现指定的安全事件进行告警：" name="alarm" :label-col="{ style: { width: '200px' } }">
                    <Switch v-model:checked="formData.alarm" :disabled="confirmButtonStatus"></Switch>
                </FormItem>
            </template>
            <template v-else>
                <FormItem label="潜在危害分析设置：" name="harmStatus">
                    <Switch v-model:checked="formData.harmStatus" :disabled="confirmButtonStatus"></Switch>
                </FormItem>
                <FormItem label="潜在危害分析设置：" name="unit" v-if="formData.harmStatus">
                    <Select v-model:value="formData.unit" :options="alarmSettingData" style="width: 80%"
                        :disabled="confirmButtonStatus" />
                </FormItem>
                <FormItem label="发生次数：" name="threshold" v-if="formData.harmStatus">
                    <InputNumber v-model:value="formData.threshold" placeholder="发生次数" :min="1" :max="10000"
                        style="width: 80%" :disabled="confirmButtonStatus">
                        <template #addonAfter>次</template>
                    </InputNumber>
                </FormItem>
            </template>
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
import { Modal, Form, FormItem, Button, Switch, Select, InputNumber } from 'ant-design-vue';
/* 本地共享模块 */
/* 业务模块 */
import { useEventSettingsModal } from '../../controller/useEventStore'

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
    alarmSettingData,
    confirmButtonStatus,
    handleConfirm,
    handleClose,
} = useEventSettingsModal(props, emits)
</script>
