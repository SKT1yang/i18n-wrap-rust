<!--
 * @name: 上送资产组结构
 * @description: 资产健康监测将当前的资产组结构上送到平台
-->
<template>
    <Form ref="formRef" :model="dataForm" :rules="rules" layout="inline" :disabled="isUploadLoading">
        <FormItem label="资产组标识" tooltip="用于在平台上生成一级资产组名称" name="body" :label-col="{ style: { width: '100px' } }">

            <Input v-model:value="dataForm.body" placeholder="不能超过 16 个字" allow-clear :maxlength="16"
                :disabled="!isEditStatus || isUploadLoading" />
        </FormItem>
        <FormItem>
            <Button class="buttonMargin" @click="handleEdit" v-show="isEditStatus">
                应用
            </Button>
            <Button class="buttonMargin" @click="() => { isEditStatus = true }" v-show="!isEditStatus">
                修改
            </Button>
            <Button class="buttonMargin ml-4" type="primary" @click="handleUpload" :loading="isUploadLoading"
                :disabled="isUploadLoading">
                开始上送
            </Button>
        </FormItem>
    </Form>
    <div class="mt-4" v-if="lastUploadResult">
        <span class="text-$color-text-description">上次上送时间：</span>
        {{ lastUploadResult?.createTime? formatToDateTime(lastUploadResult.createTime) : '-' }}
        <span class="text-$color-text-description ml-4">上次上送结果：</span>
        <Tag :color="lastUploadResult?.logType ? 'success' : 'error'">{{ lastUploadResult?.logType? '成功': '失败' }}</Tag>
    </div>
</template>
<script setup lang="ts">
import type { Rule } from "ant-design-vue/es/form";
import { ref, onMounted } from 'vue'
import { Form, FormItem, Input, Button, FormInstance, message, Tag } from 'ant-design-vue';
import {
    getClientNameApi, setClientNameApi, assetGroupSyncApi, getSystemLogsAllApi
} from '../../model/cascade';

import { withoutSpacialCharValidate, formatToDateTime } from '@guolisec/utils';

// 表单实例
const formRef = ref<FormInstance>();

const dataForm = ref({
    body: ''
});

const rules = ref<Record<string, Rule[]>>({
    body: [
        {
            validator: withoutSpacialCharValidate({
                allowEmpty: true
            }),
            trigger: 'blur',
        },
    ]
})

const isEditStatus = ref(false) // 输入框是否是可输入状态
async function getClientName() {
    dataForm.value = await getClientNameApi()
    isEditStatus.value = dataForm.value.body ? false : true
};

/**
 * 设置资产组标识
 */
const isUploadLoading = ref(false)
async function handleEdit() {
    try {
        isUploadLoading.value = true
        await setClientName()
        isEditStatus.value = false
    } finally {
        isUploadLoading.value = false
    }
}

async function setClientName() {
    await formRef.value?.validateFields()
    await setClientNameApi(dataForm.value)
    message.success('应用成功！');
    getClientName();
};

/**
 * 获取资产组同步状态
 */
const lastUploadResult = ref<{ createTime: string; logType: boolean }>()
async function getSystemLogsAll() {
    const { content } = await getSystemLogsAllApi({
        description: '资产组同步',
        size: 1,
        sort: "createTime,desc"
    })
    lastUploadResult.value = content[0]
}

/**
 * 上送资产组结构状态
 */
async function handleUpload() {
    try {
        isUploadLoading.value = true
        await assetGroupSyncApi(dataForm.value)
        message.success("上送成功！")
    } finally {
        isUploadLoading.value = false
        getSystemLogsAll()
    }
}

onMounted(() => {
    formRef.value?.clearValidate()
    getClientName();
    getSystemLogsAll()
});
</script>