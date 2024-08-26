<!--
 * @name: 知识库升级 - 升级记录
 * @description: 弹窗
 * @date: 2023-09-20 08:59:23
 * @path: \platform\front\knowledge-upgrade\\views\UpgradeRecordModal.vue
-->
<template>
    <Modal v-model:open="dialogVisible" title="升级记录" width="700px" :mask-closable="false" :footer="null"
        @cancle="handleClose">

        <Table row-key="id" size="small" :data-source="upgradeRecordData" bordered @change="handleTableChange"
            :columns="tableColumns"
            :pagination="{ total, current: currentPage, pageSize: 10, showTotal: (total) => `共 ${total} 条 `, showQuickJumper: true, }" />

    </Modal>
</template>

<script lang="ts" setup>
/* 类型文件 */
import type { KnowledgeType, } from '../types/upgrade'
import type { PropType } from 'vue';
/* 第三方模块 */
import { Modal, Table } from 'ant-design-vue';
/* 本地共享模块 */
/* 业务模块 */
import { useUpgradeRecordModal } from '../controller/useKnowledgeUpgrade'

const props = defineProps({
    visible: {
        type: Boolean,
        required: true
    },
    type: {
        type: String as PropType<KnowledgeType>,
        default: () => { }
    }
})

const emits = defineEmits(['update:visible'])

const {
    dialogVisible,
    upgradeRecordData,
    tableColumns,
    total,
    currentPage,
    handleTableChange,
    handleClose
} = useUpgradeRecordModal(props, emits)
</script>
