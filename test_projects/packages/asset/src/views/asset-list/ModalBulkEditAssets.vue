<!--
 * @name: 批量编辑资产弹窗
 * @description: Do not edit
-->
<template>
  <Modal v-model:open="dialogVisible" :width="500" @cancel="closeModal" :closable="false" :mask-closable="false" centered>
    <template #title>
      {{ t("批量编辑资产") }}
      <span class="font-normal text-[14px] ml-2">
        {{ t("已选择{}个资产", props.assets.length) }}
      </span>
    </template>
    <Form :model="dataForm" class=" mt-6" :rules="rules" ref="formRef" :label-col="{ style: { width: '110px' } }">
      <FormItem name="assetTypeCode" :label="t('资产类型')">
        <SelectAssetType v-model:value="dataForm.assetTypeCode" />
      </FormItem>
      <FormItem name="trademarkCode" :label="t('资产品牌')">
        <SelectAssetTrademark v-model:trademarkCode="dataForm.trademarkCode" />
      </FormItem>
      <FormItem name="assetSeriesCode" :label="t('资产系列')">
        <SelectAssetSeries v-model:trademarkCode="dataForm.trademarkCode"
          v-model:assetSeriesCode="dataForm.assetSeriesCode" />
      </FormItem>
    </Form>

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
import type { IAsset } from '@guolisec/types';
import type { PropType } from 'vue';
import type { Rule } from 'ant-design-vue/es/form';
/* 第三方模块 */
import { ref, watch } from 'vue'
import { message } from '@guolisec/toast'
import { Modal, Form, FormItem, Button } from 'ant-design-vue';
import { useVModel, } from '@guolisec/utils';
/* 本地模块 */
import { createAssetBatchApi } from '@/model/list'
import { t } from '@/languages/useLanguage'
/* 组件 */
import SelectAssetType from '@/views/form/SelectAssetType.vue';
import SelectAssetTrademark from '@/views/form/SelectAssetTrademark.vue';
import SelectAssetSeries from '../form/SelectAssetSeries.vue';

// 父组件传值
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  assets: {
    type: Object as PropType<Partial<IAsset>[]>,
    default: () => []
  },
});

const emit = defineEmits(['update:visible', 'refresh']);
const dialogVisible = useVModel(props, 'visible', emit)
const formRef = ref<FormInstance>()

const canEditedKeys = ['assetTypeCode', 'trademarkCode', 'assetSeriesCode']

watch(
  () => props.visible,
  async (val) => {
    if (val) {
      formRef.value?.resetFields()
      if (props.assets.length === 1) {
        Object.assign(dataForm.value, props.assets[0])
      } else {
        const keysTimes = props.assets.reduce((prev, cur) => {
          canEditedKeys.forEach(key => {
            if (!(typeof cur[key] === undefined)) {
              if (!prev[key]) {
                prev[key] = [cur[key]]
              } else {
                if (!prev[key].includes(cur[key])) {
                  prev[key].push(cur[key])
                }
              }
            }
          })
          return prev
        }, {})
        console.log(keysTimes, 'keysTimes')
        Object.keys(keysTimes).forEach((key) => {
          if (keysTimes[key].length > 1) {
            dataForm.value[key] = t('多个')
          } else {
            dataForm.value[key] = keysTimes[key][0]
          }
        })
      }
    }
  },
)
const dataForm = ref<{ assetTypeCode?: number; trademarkCode?: number; assetSeriesCode?: number }>({});

const rules: Record<string, Rule[]> = {
  assetTypeCode: [
    {
      required: true,
      message: t("请选择资产类型"),
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
}

// 批量编辑
async function handleSubmit() {
  await formRef.value?.validate()
  const assetList = [...props.assets]
  canEditedKeys.forEach((key) => {
    if (dataForm.value[key] !== t('多个')) {
      assetList.forEach(item => {
        item[key] = dataForm.value[key]
        if (key === 'trademarkCode') {
          item.trademarkName = undefined
        } else if (key === 'assetSeriesCode') {
          item.assetSeriesName = undefined
          item.assetSeriesNameLong = undefined
        } else if (key === 'assetTypeCode') {
          item.assetTypeName = undefined
        }
      })

    }
  })
  await createAssetBatchApi(assetList)

  message.success(t('编辑成功'))
  emit('refresh');
  closeModal();
}

function closeModal() {
  dialogVisible.value = false
  emit('refresh');
}
</script>