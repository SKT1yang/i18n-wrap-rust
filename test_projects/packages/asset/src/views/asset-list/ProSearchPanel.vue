<!--
 * @name: 高级查询面板
 * @description: Do not edit
-->
<template>
    <div class="pro-search-container z-50 rounded-[8px] shadow-md mb-4 p-4" v-show="showPanel">

        <Form layout="inline" :label-col="{ style: { width: '80px',  } }" class="gap-y-4">
            <FormItem :label="t('资产名称')">
                <Input class="w-45" v-model:value="queryForm.name" autocomplete="off" :placeholder="t('资产名称或 SN')"
                    allowClear />
            </FormItem>
            <FormItem :label="t('IP 地址')">
                <Input class="w-45" v-model:value="queryForm.assetIp" :placeholder="t('IP 地址')" allowClear />
            </FormItem>
            <FormItem :label="t('MAC 地址')">
                <Input class="w-45" v-model:value="queryForm.assetMac" :placeholder="t('MAC 地址')" allowClear />
            </FormItem>
            <FormItem :label="t('资产类型')">
                <SelectAssetType v-model:value="queryForm.assetTypeCode" style="width: 180px" allow-clear />
            </FormItem>
            <FormItem :label="t('资产品牌')">
                <SelectAssetTrademark style="width: 180px" v-model:value="queryForm.trademarkCode" allowClear />
            </FormItem>
            <FormItem :label="t('资产组')" v-if="!hiddenFeatures?.includes('asset::group')">
                <SelectTreeAssetGroup v-model:value="queryForm.assetGroupId" style="width: 180px" />
            </FormItem>
            <FormItem :label="t('资产域')" v-if="!hiddenFeatures?.includes('asset-field')">
                <SelectAssetField v-model:value="queryForm.fieldId" style="width: 180px" />
            </FormItem>
            <FormItem :label="t('重要程度')" v-if="!hiddenFeatures?.includes('asset::importance')">
                <SelectAssetImportance v-model:value="queryForm.importance" style="width: 180px" />
            </FormItem>
            <FormItem :label="t('运行状态')" v-if="!hiddenFeatures?.includes('asset::run-status')">
                <SelectRunStatus v-model:value="queryForm.runStatus" style="width: 180px" />
            </FormItem>
            <FormItem :label="t('开放端口')" v-if="!hiddenFeatures?.includes('asset::port')">
                <Select :options="[]" @change="handlePortsChange" style="width:180px" v-model:value="queryForm.ports"
                    mode="tags" :placeholder="t('支持输入多个端口')" />
            </FormItem>

            <div class="mt-4 text-right w-full">
                <Button @click="handleReset" class="mr-4">
                    {{ t("重置") }}
                </Button>
                <Button type="primary" @click="handleSearch" class="mr-2">
                    {{ t("查询") }}
                </Button>
                <Button type="link" @click="handleCollapse">
                    <i class="i-base-arrow-up-s-line align-icon mr-1"></i>
                    {{ t("收起") }}
                </Button>
            </div>
        </Form>
    </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { injectAssetListContext } from './context/useListContext';
import { useVModel, isPort } from '@guolisec/utils';
import { Button, Form, FormItem, Input, Select } from "ant-design-vue"
import { t } from '@/languages/useLanguage'
import SelectAssetField from '../form/SelectAssetField.vue'
import SelectAssetImportance from '../form/SelectAssetImportance.vue'
import SelectRunStatus from '../form/SelectRunStatus.vue'
import SelectAssetType from '../form/SelectAssetType.vue'
import SelectTreeAssetGroup from "../form/SelectTreeAssetGroup.vue";
import SelectAssetTrademark from "../form/SelectAssetTrademark.vue"

type AssetQuery = {
    signP: 'null';
    sort: string;
    assetModuleFlag: true;
    name: string;
    fieldId?: string;
    assetTypeCode?: number;
    assetGroupId?: string;
    assetIp: string;
    runStatus?: number;
    importance?: number;
    assetMac?: string;
    trademarkCode?: number;
    ports?: number[]
}

const props = defineProps({
    showPanel: {
        type: Boolean,
        default: false
    },
})

const emit = defineEmits(['update:showPanel', 'refresh']);

const showPanel = useVModel(props, 'showPanel', emit)

const queryForm = defineModel<AssetQuery>('value', { type: Object as PropType<AssetQuery>, default: {} })

const { hiddenFeatures } = injectAssetListContext()

/**
 * 开放端口选择框输入新的值，做相关校验
 * @param value 开放端口的输入值
 */
function handlePortsChange(value) {
    console.log(value, "value", value.slice(0, 3))

    // 校验是否符合端口格式
    let ports = value.reduce((prev, cur) => {
        if (isPort(cur)) {
            prev.push(cur)
        }
        return prev
    }, [])

    // 避免输入重复值
    ports = [...new Set(ports)]

    // 最多输入三个端口
    if (ports.length > 3) {
        ports = ports.splice(0, 3)
    }

    queryForm.value.ports = ports
}

/**
 * 重置
 */
function handleReset() {
    Object.keys(queryForm.value).forEach(key => {
        if (key !== 'signP' && key !== 'sort' && key !== 'assetModuleFlag') {
            queryForm.value[key] = undefined
        }
    })
}

/**
 * 查询
 */
function handleSearch() {
    emit('refresh');
}

/**
 * 收起
 */
function handleCollapse() {
    showPanel.value = false
}
</script>

<style scoped>
.pro-search-container {
    display: block;
    background-color: var(--color-bg-container);
}
</style>