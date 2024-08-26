<!--
 * @name: 报表配置-添加模板
 * @description: 弹窗
 * @date: 2023-09-13 16:54:02
 * @path: \feature-vue\platform\front\reports\src\views\config\AddTemplateModal.vue
-->
<template>
    <Modal v-model:open="dialogVisible" :title="title" width="550px" :closable="false" :mask-closable="false">
        <Form :model="formData" :label-col="{ style: { width: '90px' } }" ref="formRef" :rules="rules">
            <FormItem :label="t('报告标题')" name="reportName">
                <Input v-model:value="formData.reportName" :maxlength="40" />
            </FormItem>

            <FormItem :label="t('报告类型')">
                <RadioGroup v-model:value="formData.type" :placeholder="t('请选择')">
                    <Radio value="日报"> {{ t('日报') }} </Radio>
                    <Radio value="周报"> {{ t('周报') }} </Radio>
                    <Radio value="月报"> {{ t('月报') }} </Radio>
                </RadioGroup>
            </FormItem>

            <FormItem :label="t('生成规则')" name="settime" v-if="formData.type === '日报'">
                <RangePicker v-model:value="formData.settime" />
            </FormItem>

            <FormItem :label="t('生成规则')" v-else-if="formData.type === '周报'" name="setweek">
                <Select v-model:value="formData.setweek" allowClear :placeholder="t('请选择')">
                    <SelectOption value="周一"> {{ t('周一') }} </SelectOption>
                    <SelectOption value="周二"> {{ t('周二') }} </SelectOption>
                    <SelectOption value="周三"> {{ t('周三') }} </SelectOption>
                    <SelectOption value="周四"> {{ t('周四') }}</SelectOption>
                    <SelectOption value="周五"> {{ t('周五') }}</SelectOption>
                    <SelectOption value="周六"> {{ t('周六') }}</SelectOption>
                    <SelectOption value="周日"> {{ t('周日') }}</SelectOption>
                </Select>
                <RangePicker v-model:value="formData.settime" />
            </FormItem>

            <FormItem :label="t('生成规则')" v-else name="setmonth">
                <Select v-model:value="formData.setmonth" allowClear :placeholder="t('请选择')">
                    <SelectOption value="月初"> {{ t('月初') }} </SelectOption>
                    <SelectOption value="月中"> {{ t('月中') }} </SelectOption>
                    <SelectOption value="月末"> {{ t('月末') }} </SelectOption>
                </Select>
            </FormItem>

            <FormItem :label="t('报告格式')">
                <RadioGroup v-model:value="formData.format">
                    <Radio value="word">word</Radio>
                    <Radio value="pdf">pdf</Radio>
                    <Radio value="html">html</Radio>
                </RadioGroup>
            </FormItem>

            <FormItem :label="t('报告内容')" name="content">
                <CheckboxGroup v-model:value="formData.content" :options="contentOptions" />
            </FormItem>
        </Form>

        <template #footer>
            <Button @click="handleClose"> {{ t('关闭') }} </Button>
            <Button type="primary" @click="handleConfirm" :loading="confirmButtonStatus">
                {{ t('确定') }}
            </Button>
        </template>

    </Modal>
</template>

<script lang="ts" setup>
/* 类型文件 */
/* 第三方模块 */
import { Modal, Form, FormItem, Input, Button, RangePicker, Select, SelectOption, RadioGroup, Radio, CheckboxGroup } from 'ant-design-vue';
/* 本地共享模块 */
import { t } from '@/entry/languages/useLanguage'
/* 业务模块 */
import { useAddTemplateModal } from '../../controller/useReportsConfig'

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
    title,
    contentOptions,
    handleConfirm,
    handleClose,
    confirmButtonStatus
} = useAddTemplateModal(props, emits)
</script>
