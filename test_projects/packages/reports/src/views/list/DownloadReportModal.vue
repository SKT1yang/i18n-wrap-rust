<!--
 * @name: 报表列表 - 选择下载报表类型并下载
 * @description: 弹窗
 * @date: 2023-09-14 19:52:08
 * @path: \feature-vue\platform\front\reports\src\views\list\DownloadReportModal.vue
-->
<template>
    <Modal v-model:open="dialogVisible" :title="title" width="550px" :closable="false" :mask-closable="false">

        <RadioGroup v-model:value="typeId" name="radioGroup" style="margin-left: 20%; margin-top: 8%">
            <Radio :value="0">word</Radio>
            <!-- <Radio :value="1">pdf</Radio>
        <Radio :value="2">html</Radio> -->
        </RadioGroup>

        <template #footer>
            <Button @click="handleClose"> {{ t('关闭') }}</Button>
            <Button type="primary" @click="handleConfirm" :loading="confirmButtonStatus">
                {{ t('确定') }}
            </Button>
        </template>

    </Modal>
</template>

<script lang="ts" setup>
/* 类型文件 */
/* 第三方模块 */
import { Modal, Button, } from 'ant-design-vue';
/* 本地共享模块 */
import { t } from '@/entry/languages/useLanguage'
/* 业务模块 */
import { useDownloadReportModal } from '../../controller/useReportsList'

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

const emits = defineEmits(['update:visible'])

const {
    dialogVisible,
    title,
    handleConfirm,
    handleClose,
    confirmButtonStatus
} = useDownloadReportModal(props, emits)
</script>
