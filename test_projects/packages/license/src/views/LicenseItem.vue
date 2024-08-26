<!--
 * @name: 授权管理 - 单个授权组件
 * @description: Do not edit
 * @date: 2023-09-19 09:39:19
 * @path: \front\license\src\views\LicenseItem.vue
-->
<template>
    <Card style="min-width: 320px">
        <template #title>
            {{ props.data.licenseName }}
        </template>
        <template #extra>
            <div class="flex">
                <Upload :file-list="uploadFileList" :before-upload="beforeUpload" accept=".lns" :max-count="1"
                    :disabled="uploadStatus" :custom-request="uploadFile">
                    <Button plain :disabled="uploadStatus">
                        导入
                    </Button>
                </Upload>
                <Button type="link" @click="handleOpenModal">授权记录</Button>
            </div>
        </template>

        <template v-if="props.data.licenseModule === 2">
            <div class="text-base">
                个数：{{ lastestRecordData?.counts }} 个
            </div>

        </template>
        <template v-if="props.data.licenseModule === 3">
            <div class="text-base">
                逾期时间： {{ formatToDateTime(lastestRecordData?.expireTime) }}
            </div>

        </template>

    </Card>
    <UpgradeRecordModal v-model:visible="dialogVisible" :data="props.data" />
</template>

<script setup lang="ts">
/* 类型文件 */
import type { PropType } from 'vue';
import type {
    LicenseModule,
    LicenseName,
} from "../types/license";
/* 第三方模块 */
import { Card, Button, Upload } from 'ant-design-vue';
/* 本地共享模块 */
/* 业务模块 */
import { useLicenseItem } from '../controller/useLicense'
import UpgradeRecordModal from './LicenseRecordModal.vue'

const props = defineProps({
    data: {
        type: Object as PropType<{ licenseModule: LicenseModule, licenseName: LicenseName }>,
        required: true
    },
})

const {
    lastestRecordData,
    beforeUpload,
    uploadFile,
    uploadFileList,
    uploadStatus,
    formatToDateTime,
    dialogVisible,
    handleOpenModal
} = useLicenseItem(props)
</script>