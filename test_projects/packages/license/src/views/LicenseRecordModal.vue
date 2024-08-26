<!--
 * @name: 授权管理 - 升级记录
 * @description: 弹窗
 * @date: 2023-09-20 08:59:23
 * @path: \front\license\src\views\LicenseRecordModal.vue
-->
<template>
    <Modal v-model:open="dialogVisible" :title="`${props.data.licenseName}记录`" width="700px" :mask-closable="false"
        :footer="null" @cancle="handleClose">

        <Table row-key="id" size="small" :data-source="licenseRecordData" bordered :columns="tableColumns"
            :pagination="false" />

    </Modal>
</template>

<script lang="ts" setup>
/* 类型文件 */
import type { LicenseModule, LicenseName } from '../types/license'
import type { PropType } from 'vue';
/* 第三方模块 */
import { Modal, Table } from 'ant-design-vue';
/* 本地共享模块 */
/* 业务模块 */
import { useLicenseRecordModal } from '../controller/useLicense'

const props = defineProps({
    visible: {
        type: Boolean,
        required: true
    },
    data: {
        type: Object as PropType<{ licenseModule: LicenseModule, licenseName: LicenseName }>,
        required: true
    },
})

const emits = defineEmits(['update:visible'])

const {
    dialogVisible,
    licenseRecordData,
    tableColumns,
    handleClose,
} = useLicenseRecordModal(props, emits)
</script>
