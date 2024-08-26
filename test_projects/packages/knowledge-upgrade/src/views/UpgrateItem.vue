<!--
 * @name: 知识库升级 - 单个知识库升级组件
 * @description: Do not edit
-->
<template>
    <Card style="min-width: 320px">
        <div class="flex justify-between mb-2">
            <div class="text-xl font-semibold"> {{ currentKnowledgeBase.typeName }} </div>
            <div class="flex space-x-4">
                <Button @click="handleOpenModal">升级记录</Button>
                <Button v-if="lastestRecordData && data.name === lastestRecordData.name" type="primary" :disabled="true"
                    class="ml-5">已最新</Button>
                <Popconfirm v-else title="确定要升级吗?" ok-text="确认" cancel-text="取消" :disabled="uploadStatus"
                    @confirm="uploadFile()">
                    <Button type="primary" style="margin-left: 20px" :loading="uploadStatus"
                        :disabled="uploadStatus">升级</Button>
                </Popconfirm>
            </div>
        </div>
        <div class="text-slate-400 text-sm mb-1">
            当前版本:
        </div>
        <div class="mb-2">
            {{ data?.name }}
        </div>
        <!-- <div class="text-slate-400 text-sm mb-1">
            导入时间:
        </div>
        <div class="mb-2">{{ formatToDateTime(data?.createTime) }}</div> -->
        <div class="text-slate-400 text-sm mb-1">
            最后升级时间:
        </div>
        <div>
            {{ formatToDateTime(lastestRecordData?.createTime) }}
        </div>
    </Card>
    <UpgradeRecordModal v-model:visible="dialogVisible" :type="currentKnowledgeBase.type" />
</template>

<script setup lang="ts">
/* 类型文件 */
import type { PropType } from 'vue';
import type { KnowledgeBase, } from '../types/upgrade'
/* 第三方模块 */
import { Card, Button, Popconfirm } from 'ant-design-vue';
/* 本地共享模块 */
/* 业务模块 */
import { useUpgradeItem } from '../controller/useKnowledgeUpgrade'
import UpgradeRecordModal from './UpgradeRecordModal.vue'

const props = defineProps({
    data: {
        type: Object as PropType<KnowledgeBase>,
        required: true
    },
})

const emit = defineEmits(['loading'])

const {
    currentKnowledgeBase,
    lastestRecordData,
    uploadFile,
    uploadStatus,
    formatToDateTime,
    dialogVisible,
    handleOpenModal
} = useUpgradeItem(props, emit)
</script>