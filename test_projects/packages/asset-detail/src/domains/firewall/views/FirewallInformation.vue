<!--
 * @name: 主机设备信息
 * @description: 硬件信息、操作系统信息、网络互联、外设记录
-->
<template>
    <Card :title="t('防火墙信息')">

        <template v-if="osInfo.osType === 0">
            <div class="mb-4">
                <span class="inline-block w-[120px] text-$color-text-tertiary">{{ t('域防火墙状态') }} </span>
                <span
                    :class="firewallData[0].domainStatus === 'Enable' ? 'color-$color-success' : 'color-$color-error'">
                    <i :class="firewallData[0].privateStatus === 'Enable' ? 'i-base-shield-check-fill' : 'i-base-shield-fill'"
                        class="align-icon"></i>{{
                            firewallData[0].domainStatus === 'Enable' ?
                                t('开启') : t('关闭')
                        }}
                </span>
            </div>
            <div class="mb-4">
                <span class="inline-block w-[120px] text-$color-text-tertiary">{{ t('专用防火墙状态') }} </span>
                <span
                    :class="firewallData[0].privateStatus === 'Enable' ? 'color-$color-success' : 'color-$color-error'">
                    <i :class="firewallData[0].privateStatus === 'Enable' ? 'i-base-shield-check-fill' : 'i-base-shield-fill'"
                        class="align-icon"></i>{{
                            firewallData[0].privateStatus === 'Enable' ?
                                t('开启') : t('关闭')
                        }}
                </span>
            </div>

            <div class="mb-4">
                <span class="inline-block w-[120px] text-$color-text-tertiary">{{ t('公用防火墙状态') }} </span>
                <span
                    :class="firewallData[0].publicStatus === 'Enable' ? 'color-$color-success' : 'color-$color-error'">
                    <i :class="firewallData[0].privateStatus === 'Enable' ? 'i-base-shield-check-fill' : 'i-base-shield-fill'"
                        class="align-icon"></i>{{
                            firewallData[0].publicStatus === 'Enable' ?
                                t('开启') : t('关闭')
                        }}
                </span>
            </div>

        </template>
        <template v-else-if="osInfo.osType === 1">
            <div class="mb-4">
                <span class="inline-block w-[120px] text-$color-text-tertiary">{{ t('防火墙状态') }} </span>
                <span :class="firewallData.length ? 'color-$color-success' : 'color-$color-error'">
                    <i class="i-base-shield-check-fill align-icon"></i>{{ firewallData.length ? t('开启') : t('关闭') }}
                </span>
            </div>

            <div class="w-[600px]">
                <Empty v-if="firewallData.length === 0" />
                <Table v-else :data-source='firewallData' row-key='id' :columns='firewallColumns' :pagination="false"
                    :scroll="{ y: 280 }" />
            </div>
        </template>
    </Card>
</template>

<script lang="ts" setup>
/* 类型文件 */
import type { ColumnsType } from 'ant-design-vue/es/table/interface'
import type { Firewall } from "../types";
import type { OS } from '@/domains/app/types';
/* 第三方模块 */
import { onMounted, ref } from 'vue';
import { Table, Empty } from 'ant-design-vue';
/* 本地模块 */
import Card from '@/shared/components/Card.vue';
import { getAssetFirewallList } from '../model'
import { useAssetInfoStore } from '@/entry/store';
import { t } from '@/entry/languages/useLanguage';
import { getAssetDetailInfo } from '@/domains/app/model'

const { asset } = useAssetInfoStore()

/**
 * 获取防火墙信息
 */

const firewallColumns: ColumnsType = [
    {
        title: 'To',
        dataIndex: 'firewallTo',
        customRender({ text }) {
            return text || '-'
        }
    },
    {
        title: 'Action',
        dataIndex: 'action',
        customRender({ text }) {
            return text || '-'
        }
    },
    {
        title: 'From',
        dataIndex: 'firewallFrom',
        customRender({ text }) {
            return text || '-'
        }
    },
]
const firewallData = ref<Firewall[]>([])

async function getAssetFirewallListData() {
    firewallData.value = await getAssetFirewallList({
        deviceIp: asset.assetIp, deviceMac: asset.assetMac
    })
}

/**
 * 获取操作系统信息
 */
const osInfo = ref<Partial<OS>>({})
async function getAssetDetailInfoData() {
    osInfo.value = await getAssetDetailInfo({
        deviceIp: asset.assetIp, deviceMac: asset.assetMac
    })
}

onMounted(async () => {
    await getAssetDetailInfoData()
    getAssetFirewallListData()
})

</script>
