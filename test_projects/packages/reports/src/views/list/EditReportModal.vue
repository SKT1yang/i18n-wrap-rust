<!--
 * @name: 报表列表 - 编辑报表
 * @description: 弹窗
 * @date: 2023-09-14 19:24:54
 * @path: \feature-vue\platform\front\reports\src\views\list\EditReportModal.vue
-->
<template>
    <Modal v-model:open="dialogVisible" :title="t('修改报表信息')" width="500px" :closable="false" :mask-closable="false">
        <Form :model="formData" :label-col="{ style: { width: '80px' } }" ref="formRef" :rules="rules">
            <FormItem :label="t('报表名称')" name="reportName">
                <Input v-model:value="formData.reportName" :maxlength="50" show-count :placeholder="t('报表名称')" />
            </FormItem>

            <FormItem :label="t('备注')" name="remarks">
                <Textarea v-model:value="formData.remarks" :maxlength="100" show-count
                    :auto-size="{ minRows: 3, maxRows: 3 }" :placeholder="t('备注')" />
            </FormItem>
        </Form>

        <template #footer>
            <Button @click="handleClose">{{ t('关闭') }}</Button>
            <Button type="primary" @click="handleConfirm" :loading="confirmButtonStatus">
                {{ t('确定') }}
            </Button>
        </template>

    </Modal>
</template>

<script lang="ts" setup>
/* 类型文件 */
/* 第三方模块 */
import { Modal, Form, FormItem, Input, Button, Textarea } from 'ant-design-vue';
/* 本地共享模块 */
import { t } from '@/entry/languages/useLanguage'
/* 业务模块 */
import { useEditReportModal } from '../../controller/useReportsList'

const props = defineProps({
    visible: {
        type: Boolean,
        required: true
    },
    current: {
        type: Object,
        default: () => { }
    }
})

const emits = defineEmits(['update:visible', 'refresh'])

const {
    dialogVisible,
    formRef,
    formData,
    rules,
    handleConfirm,
    handleClose,
    confirmButtonStatus,
} = useEditReportModal(props, emits)
</script>
