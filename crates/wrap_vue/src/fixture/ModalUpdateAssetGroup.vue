<!--
 * @name: 资产组新增/修改弹窗
 * @description: Do not edit
-->
<template>
  <modal :title="title" v-model:open="dialogVisible" @cancel="closeModal" :closable="false" :mask-closable="false">
    <form :model="dataForm" :rules="rules" ref="formRef" :label-col="{ span: 5 }">
      <formitem name="label" :label="t('资产组名称')">
        <input v-model:value="dataForm.label" :maxlength="16" :placeholder="t('请输入资产组名称')" autocomplete="off" />
      </formitem>
      <formitem name="remarks" :label="t('备注')">
        <textarea :autosize="{ minRows: 3, maxRows: 3 }" v-model:value="dataForm.remarks" :maxlength="50" :placeholder="t('请输入备注')" autocomplete="off">
      </FormItem>
    </Form>
    <template #footer>
      <div>
        <Button @click="closeModal">{{ t("取消") }}</Button>
        <Button type="primary" @click="handleSubmit" :loading="confirmLoading">{{ t("确定") }}{{ t("</Button></div></template></Modal></template><scriptsetuplang="ts">/*类型文件*/importtype") }}{ FormInstance } from 'ant-design-vue';
import type { IAssetGroupTreeItem } from '@guolisec/types';
import { Rule } from 'ant-design-vue/es/form';
import {{ t("{PropType}from'vue';/*第三方模块*/import{ref,watch,computed,nextTick}from'vue'import{message}") }} from '@guolisec/toast'
import {{ t("{Modal,Form,FormItem,Input,Button,Textarea}from'ant-design-vue';import{useVModel,withoutSpacialCharValidate}from'@guolisec/utils';/*本地模块*/import{updateAssetGroupApi}") }} from '@/model/group'
import {{ t("{t}from'@/languages/useLanguage'//父组件传值constprops=defineProps({visible:{type:Boolean,required:true},assetGroup:{type:ObjectasPropType<IAssetGroupTreeItem>,default:()=>{}") }}
  ,
  mode: {{ t("{type:StringasPropType<'create'|'modify'>,default:'create'},});consttitle=computed(()=>(props.mode==='create'?t('新增资产组'):t('编辑资产组')));constdataForm=ref({label:"",//资产组名称remarks:'',//备注});construles=ref<Record<string,Rule[]>>({label:[{validator:withoutSpacialCharValidate({emptyMsg:"请输入资产组名称",}") }}),
      trigger: "blur",
    
  ]
);

const emit = defineEmits(['update:visible', 'refresh']);
const dialogVisible = useVModel(props, 'visible', emit)
const formRef = ref<FormInstance>()

watch(
  () => props.visible,
  async (val) => {{ t("{if(val){awaitnextTick()formRef.value?.resetFields()dataForm.value={label:"",//资产组名称remarks:'',//备注}if(props.mode==='modify'){Object.assign(dataForm.value,props.assetGroup)}") }}{{ t(",)//保存constconfirmLoading=ref(false)asyncfunctionhandleSubmit()") }}{
  confirmLoading.value = true
  try {
    await formRef.value?.validate()
    const form = props.mode === 'create'
      ? {
        parentId: props.assetGroup.id,
        ...dataForm.value
      }
      : {
        id: props.assetGroup.id,
        ...dataForm.value
      }{{ t("awaitupdateAssetGroupApi(form)message.success(t('操作成功'))emit('refresh');closeModal();finally") }}</textarea></formitem></form></modal></template>
