<!--
 * @name: 新增/修改资产弹窗
 * @description: Do not edit
-->
<template>
  <Modal :title="title" v-model:open="dialogVisible" centered :width="1200" :closable="false" :mask-closable="false">
    <div class="h-[420px] overflow-auto pr-2">
      <Form :model="dataForm" class="grid grid-cols-2 gap-4" :rules="rules" ref="formRef"
        :label-col="{ style: { width: '160px' } }">
        <FormItem name="name" :label="t('资产名称')">
          <Input v-model:value.trim="dataForm.name" :maxlength="30" :placeholder="t('资产名称，默认为 IP 地址')"
            autocomplete="off" allow-clear />
        </FormItem>
        <FormItem name="assetTypeCode" :label="t('资产类型')">
          <SelectAssetType v-model:value="dataForm.assetTypeCode" />
        </FormItem>
        <FormItem name="assetGroupId" :label="t('资产组')">
          <SelectTreeAssetGroup v-model:value="dataForm.assetGroupId" />
        </FormItem>
        <FormItem name="trademarkCode" :label="t('资产品牌')">
          <SelectAssetTrademark v-model:trademarkCode="dataForm.trademarkCode" />
        </FormItem>
        <FormItem name="assetSeriesCode" :label="t('资产系列')">
          <SelectAssetSeries v-model:trademarkCode="dataForm.trademarkCode"
            v-model:assetSeriesCode="dataForm.assetSeriesCode" />
        </FormItem>
        <FormItem name="sn" :label="t('硬件序列号')"
          v-if="dataForm.assetTypeCode && [8, 10, 11, 12, 13, 16, 19, 23, 27, 28, 29, 45].includes(dataForm.assetTypeCode)">
          <Input v-model:value.trim="dataForm.sn" :maxlength="30" :placeholder="t('资产的硬件序列号')" autocomplete="off"
            allow-clear />
        </FormItem>
        <FormItem name="assetIp" :label="t('IP 地址')">
          <Input v-model:value.trim="dataForm.assetIp" allow-clear :maxlength="30" :placeholder="t('资产的 IP 地址')"
            autocomplete="off" />
        </FormItem>
        <FormItem name="assetMac" :label="t('MAC 地址')">
          <Input v-model:value.trim="dataForm.assetMac" :maxlength="30" :placeholder="t('资产的 MAC 地址')"
            autocomplete="off" allow-clear />
        </FormItem>
        <FormItem name="layer" :label="t('层级')" v-if="isShowByFeature('asset::layer')">
          <SelectAssetLayer class="w-95" v-model:value="dataForm.layer" />
        </FormItem>
        <FormItem name="runStatus" :label="t('运行状态')">
          <SelectRunStatus v-model:value="dataForm.runStatus" />
        </FormItem>
        <FormItem name="createTime" :label="t('入网时间')">
          <DatePicker class="w-full" show-time v-model:value="dataForm.createTime" value-format="YYYY-MM-DD HH:mm:ss"
            allow-clear :placeholder="t('选择入网时间')" />
        </FormItem>
        <!-- 1, 2, 17, 30, 3, 25: PLC DCS 主机 SIS 服务器 工作站 -->
        <FormItem name="softwareVersion" :label="t('软件版本')"
          v-if="dataForm.assetTypeCode && ![1, 2, 17, 30, 3, 25].includes(dataForm.assetTypeCode)">
          <Input v-model:value.trim="dataForm.softwareVersion" :maxlength="100" :placeholder="t('资产的软件版本')"
            autocomplete="off" allow-clear />
        </FormItem>
        <FormItem name="assetLocation" :label="t('所处位置')">
          <Input v-model:value.trim="dataForm.assetLocation" :maxlength="30" :placeholder="t('资产的所处位置')"
            autocomplete="off" allow-clear />
        </FormItem>
        <FormItem name="hardwareModel" :label="t('资产型号')"
          v-if="dataForm.assetTypeCode === 1 || dataForm.assetTypeCode === 45">
          <Input v-model:value.trim="dataForm.hardwareModel" :maxlength="30" :placeholder="t('资产的硬件型号')"
            autocomplete="off" allow-clear />
        </FormItem>
        <FormItem name="importance" :label="t('重要程度')" v-if="dataForm.assetTypeCode === 1">
          <SelectAssetImportance v-model:value="dataForm.importance" />
        </FormItem>
        <FormItem name="security" :label="t('责任部门:')">
          <Input v-model:value.trim="dataForm.security" :maxlength="30" :placeholder="t('资产的责任部门')" autocomplete="off"
            allow-clear />
        </FormItem>
        <FormItem name="os" :label="t('操作系统')"
          v-if="dataForm.assetTypeCode && [3, 25].includes(dataForm.assetTypeCode)">
          <Input v-model:value.trim="dataForm.os" :maxlength="60" :placeholder="t('请输入操作系统')" autocomplete="off" />
        </FormItem>
        <FormItem name="fieldId" :label="t('资产域')" v-if="isShowByFeature('asset-field')">
          <SelectAssetField v-model:value="dataForm.fieldId" />
        </FormItem>
        <FormItem name="safeFieldId" :label="t('安全域')" v-if="isShowByFeature('safe-field')">
          <SelectAssetSafeField v-model:value="dataForm.safeFieldId" />
        </FormItem>
        <FormItem name="port" label="HTTP 端口" v-if="dataForm.assetTypeCode && [11].includes(dataForm.assetTypeCode)">
          <InputNumber class="w-[330px]" v-model:value="dataForm.port" :min="0" :max="65535"
            :placeholder="t('资产的 HTTP 端口')" />
        </FormItem>
        <!-- 资产额外字段 -->
        <FormExtraFields v-model:value="dataForm" v-if="isShowByFeature('asset::extra-fields')" />
      </Form>

    </div>

    <template #footer>
      <div>
        <Button @click="closeModal">{{ t("取消") }}</Button>
        <Button type="primary" @click="handleSubmit">{{ t("确定") }}</Button>
      </div>
    </template>
  </Modal>
</template>
<script setup lang="ts">
/* 类型文件 */
import type { FormInstance } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';
import type { IAsset } from '@guolisec/types';
import type { PropType } from 'vue';
/* 第三方模块 */
import { ref, watch, computed } from 'vue'
import { message } from '@guolisec/toast'
import { Modal, Form, FormItem, Input, Button, DatePicker, InputNumber } from 'ant-design-vue';
import { useVModel, ipValidate, isMac, formatToDateTime, AssetScanPropertiesFactory, withoutSpacialCharValidate } from '@guolisec/utils';
/* 本地模块 */
import { Asset } from '@/types/class';
import { createAssetApi, modifyAssetApi } from '@/model/list'
import { isShowByFeature } from './context/useListContext';
import { t } from '@/languages/useLanguage'
/* 组件 */
import SelectAssetField from '@/views/form/SelectAssetField.vue';
import SelectAssetType from '@/views/form/SelectAssetType.vue';
import SelectRunStatus from '@/views/form/SelectRunStatus.vue';
import SelectAssetImportance from '@/views/form/SelectAssetImportance.vue';
import SelectTreeAssetGroup from '@/views/form/SelectTreeAssetGroup.vue';
import SelectAssetTrademark from '@/views/form/SelectAssetTrademark.vue';
import SelectAssetSeries from '../form/SelectAssetSeries.vue';
import SelectAssetSafeField from '@/views/form/SelectAssetSafeField.vue';
import SelectAssetLayer from '../form/SelectAssetLayer.vue';
import FormExtraFields from './FormExtraFields.vue';

// 父组件传值
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  asset: {
    type: Object as PropType<IAsset>,
    default: () => new Asset()
  },
  mode: {
    type: String as PropType<'create' | 'modify'>,
    default: 'create'
  },
  importance: {
    type: Number as PropType<0 | 1>,
  },
});

const title = computed(() => (props.mode === 'create' ? t('新增资产') : t('编辑资产')));

const showAssetExtraFields = ref(isShowByFeature('asset::extra-fields'))
const dataForm = ref(dataFormFactory());


function dataFormFactory(): Partial<IAsset> {
  const asset = {
    name: "", // 资产名称
    fieldId: undefined, // 资产域
    assetTypeCode: undefined,
    assetGroupId: undefined, // 资产组
    trademarkCode: undefined, // 资产品牌
    assetSeriesCode: undefined, // 资产系列
    sn: undefined, // 硬件序列号
    assetIp: '', // 资产IP
    assetMac: '', // 资产 MAC 地址
    softwareVersion: undefined, // 软件版本
    assetLocation: '', // 所处位置
    runStatus: undefined, // 运行状态
    createTime: '', // 入网时间
    hardwareModel: '', // 资产型号
    importance: undefined, // 重要程度
    security: '', // 责任部门
    os: undefined, // 操作系统
    safeFieldId: undefined, // 安全域
    port: undefined, // http端口
    layer: undefined // 所在层级
  }

  if (showAssetExtraFields) {
    Object.assign(asset, new AssetScanPropertiesFactory())
  }

  return asset
}

const rules = computed(() => {
  const result: Record<string, Rule[]> = {
    name: [
      {
        required: true,
        message: t("请输入资产名称"),
        trigger: "blur",
      },
      {
        validator: withoutSpacialCharValidate({
          allowEmpty: true
        }),
        trigger: "blur",
      }
    ],
    assetTypeCode: [
      {
        required: true,
        message: t("请选择资产类型"),
        trigger: "change",
      }
    ],
    assetGroupId: [
      {
        required: true,
        message: t("请选择资产组"),
        trigger: "change",
      }
    ],
    trademarkCode: [
      {
        required: true,
        message: t("请选择资产品牌"),
        trigger: "change",
      }
    ],
    assetSeriesCode: [
      {
        required: true,
        message: t("请选择资产系列"),
        trigger: "change",
      }
    ],
    assetIp: [
      {
        required: true,
        validator: ipValidate({
          emptyMsg: t('请输入资产 IP'),
          errorMsg: t('IP 格式输入错误')
        }),
      }
    ],
    assetMac: [
      {
        validator: (_rule, value, callback) => {
          if (value) {
            if (isMac(value)) {
              callback();
            } else {
              callback(t('MAC 格式输入错误'));
            }
          }
          callback()
        },

        trigger: "blur",
      }
    ],
    runStatus: [
      {
        required: true,
        message: t("请选择运行状态"),
        trigger: "blur",
      }
    ],
    softwareVersion: [],
    sn: [],
    layer: [
      {
        required: true,
        message: t('请选择层级'),
        trigger: "change",
      }
    ]
  }

  // 国利网安设备软件版本必填
  result.softwareVersion = dataForm.value.trademarkCode === 35 ? [{
    required: true,
    message: t("请输入软件版本"),
    trigger: "blur",
  }] : []

  // 国利网安交换机，sn必填
  result.sn = [{
    required: snRequired.value,
    message: t("请输入硬件序列号"),
    trigger: "blur",
  }]

  if (props.mode === 'modify') {
    result.createTime = [
      {
        required: true,
        message: t("请选择入网时间"),
        trigger: "change",
      }
    ]
  }
  return result
})

// sn 是否必填
const snRequired = computed(() => {
  if (dataForm.value.assetTypeCode === 8) {
    return dataForm.value.trademarkCode === 35
  } else {
    return true
  }
})

const emit = defineEmits(['update:visible', 'refresh']);
const dialogVisible = useVModel(props, 'visible', emit)
const formRef = ref<FormInstance>()

watch(
  () => props.visible,
  async (val) => {
    if (val) {
      dataForm.value = dataFormFactory()
      formRef.value?.resetFields()
      if (props.mode === 'modify') {
        const temp = props.asset
        // todo
        if (temp.assetGroupId) {
          temp.assetGroupId = String(temp.assetGroupId)
        }
        if (temp.createTime) {
          temp.createTime = formatToDateTime(temp.createTime)
        }
        Object.assign(dataForm.value, props.asset)
      }
    }
  },
)

// 保存
async function handleSubmit() {
  await formRef.value?.validate()
  const form = dataForm.value
  if (form.createTime) {
    form.createTime = new Date(form.createTime).toISOString()
  }
  if (props.importance === 1) {
    form.importance = 1
  }
  props.mode === 'create' ? await createAssetApi(form) : await modifyAssetApi(form)
  message.success(t('操作成功'))
  emit('refresh');
  closeModal();
}

function closeModal() {
  dialogVisible.value = false
  emit('refresh');
}
</script>
