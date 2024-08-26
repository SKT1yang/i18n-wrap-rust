<!--
 * @name: PLC-运行状态
 * @description: 图表卡片，包含 设备灯、CPU、存储器信息
-->

<template>
    <div class="space-y-6 plc-run-status-container">
        <Card :title="t('CPU')">
            <span class="color-$color-text-tertiary mr-1">{{ t('模块信息') }}</span>
            <span class="mr-6">
                {{
                    plcDetailData?.plcStatus?.type
                }}
            </span>
            <span class="color-$color-text-tertiary mr-1">{{ t('CPU 工作模式') }}</span> <span class="mr-6">
                {{ plcDetailData?.plcStatus?.plcStatus === 1 ? 'STOP' : 'RUN' }}
            </span>
            <span class="color-$color-text-tertiary mr-2">{{ t('状态') }}</span>
            <Tag :color="plcDetailData?.plcStatus?.errorStatus === 1 ? 'red' : 'green'">
                {{ plcDetailData?.plcStatus?.errorStatus === 1 ? t('异常') : t('正常') }}
            </Tag>
        </Card>

        <Card title="存储器" class="w-full min-h-160">
            <template v-if="plcDetailData?.memory?.length">
                <div class="grid storage gap-y-6">
                    <template v-for="(memory, index) in plcDetailData?.memory" :key="memory.name">
                        <div class="">
                            <div class="mb-1">
                                <span class="color-$color-text-tertiary">{{ memory.name }}</span>
                                <span class="color-$color-text-tertiary ml-2">{{ memory.type }}</span>
                                <div class="w-full">
                                    <Progress :percent="getProgressPercent(memory.rate)" class="w-[96%]" status="normal" />
                                </div>
                                <span class="color-$color-text-tertiary">{{ t('总计') }}</span> <span class="mr-6">
                                    {{ addCommas(memory.total) }} B
                                </span>
                                <span class="color-$color-text-tertiary">{{ t('已分配') }}</span> <span class="mr-6">
                                    {{ addCommas(memory.used) }} B
                                </span>
                                <span class="color-$color-text-tertiary">{{ t('空闲') }}</span> <span class="mr-4">
                                    {{ addCommas(memory.free) }} B
                                </span>
                            </div>
                            <Table :columns="columns" :data-source="memory.detail" :pagination="false" />
                        </div>
                        <!-- 在两表格之间添加分隔线 -->

                        <Divider
                            v-if="plcDetailData?.memory.length && index < plcDetailData?.memory.length - 1 && (index + 1) % 3 !== 0"
                            type="vertical" style="" class="min-h-full mx-[24px]" />
                    </template>
                </div>
            </template>
            <template v-else>
                <Empty />
            </template>

        </Card>
    </div>
</template>

<script lang="ts" setup>
import { Tag, Progress, Divider, Table, Empty } from 'ant-design-vue';
import Card from '@/shared/components/Card.vue'
import { t } from '@/entry/languages/useLanguage';
import { ColumnsType } from 'ant-design-vue/es/table';
import { onMounted, ref } from 'vue';
import { getPlcDeviceDetailApi } from '../../model/plc'
import { useAssetInfoStore } from '@/entry/store';
import type { PlcDeviceDetail } from "../../types/plc";

const { asset } = useAssetInfoStore()

function getProgressPercent(value) {
    return Number((value * 100).toFixed(2))
}

/**
 * 获取数据
 */

const plcDetailData = ref<PlcDeviceDetail>()

async function getAssetDetailOtherData() {
    const { assetDetailOtherVO } = await getPlcDeviceDetailApi({ deviceIp: asset.assetIp, deviceMac: asset.assetMac })
    plcDetailData.value = assetDetailOtherVO
}

// 存储器表格
const columns = ref<ColumnsType>([
    {
        title: t('存储器对象'),
        dataIndex: 'name'
    },
    {
        title: t('编号'),
        width: 120,
        align: 'right',
        dataIndex: 'serialNum'
    },
    {
        title: t('字节'),
        width: 120,
        align: 'right',
        dataIndex: 'size',
        customRender({ text }) {
            return addCommas(text)
        }
    },
])

/**
 * 给数字添加千分符(逗号)
 */
function addCommas(value: number) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

onMounted(() => {
    getAssetDetailOtherData()
})
</script>

<style>
.plc-run-status-container .storage {
    grid-template-columns: 1fr auto 1fr auto 1fr;
}
</style>