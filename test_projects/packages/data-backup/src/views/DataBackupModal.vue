<!--
 * @name: 数据备份 - 生成数据包
 * @description: Do not edit
 * @date: 2023-10-09 09:45:20
 * @path: \front\data-backup\src\views\DataBackupModal.vue
-->
<template>
    <Modal v-model:open="dialogVisible" title="生成备份文件" width="500px" :closable="false" :mask-closable="false">
        <Button type="primary" block @click="handleAddDatePicker" class="my-4">
            <i class="i-base-add-circle-line align-icon mr-1"></i>
            添加日期
        </Button>

        <div v-for="(item, index) in generatePacketsList" :key="index" class="mb-4">
            <DatePicker v-model:value="item.data" :disabled-date="disabledDate" value-format="YYYY-MM-DD 00:00:00"
                style="width: 86%" placeholder="请选择日期" />
            <Button type="primary" danger class="ml-2" @click="handleRemoveDatePicker(index)">
                <i class="i-base-indeterminate-circle-line  "></i>
            </Button>
        </div>

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
/* 第三方模块 */
import { Modal, DatePicker, Button, } from 'ant-design-vue';
/* 本地共享模块 */
/* 业务模块 */
import { useGeneratePackets } from '../controller/useDataBackup'

const props = defineProps({
    visible: {
        type: Boolean,
        required: true
    },
})

const emits = defineEmits(['update:visible', 'refresh'])

const {
    dialogVisible,
    generatePacketsList,
    disabledDate,
    handleAddDatePicker,
    handleRemoveDatePicker,
    confirmButtonStatus,
    handleConfirm,
    handleClose,
} = useGeneratePackets(props, emits)
</script>
