<!--
 * @name: 主机设备信息
 * @description: 硬件信息、操作系统信息、网络互联、外设记录
-->
<template>
    <Card :title="t('硬件信息')">
        <div class="space-y-4">
            <div class="flex">
                <span class="inline-block w-[80px] text-$color-text-tertiary flex-none">{{ t('主板') }} </span>
                <span class="break-all"> {{ hardwareInfo.boardName || '-' }}</span>
            </div>
            <div class="flex">
                <span class="inline-block w-[80px] text-$color-text-tertiary flex-none">{{ t('CPU') }} </span>
                <span class="break-all"> {{ hardwareInfo.cpuName || '-' }}</span>
            </div>

            <template v-if="osInfo.osType === 1">
                <div class="flex">
                    <span class="inline-block w-[80px] text-$color-text-tertiary flex-none"> {{ t('内存') }} </span>
                    <span class="break-all"> {{ hardwareInfo.ramName || '-' }}</span>
                </div>
            </template>

            <div class="flex">
                <div class="inline-block w-[80px] text-$color-text-tertiary flex-none">{{ t('网卡') }} </div>
                <div class="truncate">
                    <template v-if="hardwareInfo.networkInfoList?.length">
                        <div class="w-full flex" v-for="(network) in hardwareInfo.networkInfoList" :key="network.id">
                            <div class="inline-block truncate">
                                <span> {{ network.networkAdapterName }} </span>
                                <span class="text-$color-text-tertiary" :title="`${network.ip} / ${network.mac}`"> ( {{
                                    network.ip || '-'
                                }} /
                                    {{
                                        network.mac || '-'
                                    }}
                                </span>
                            </div>
                            <span class="text-$color-text-tertiary ">)</span>
                        </div>
                    </template>
                    <span v-else>-</span>
                </div>
            </div>

            <div class="flex">
                <span class="inline-block w-[80px] text-$color-text-tertiary flex-none">{{ t('硬盘') }} </span>
                <span class="break-all">{{ hardwareInfo.diskName || '-' }}</span>
            </div>
        </div>
    </Card>
</template>

<script lang="ts" setup>
/* 类型文件 */
import type { Hardware } from "../../types/host";
import type { OS } from "@/domains/app/types";
/* 第三方模块 */
import { onMounted, ref } from 'vue';
/* 共享模块 */
import Card from '@/shared/components/Card.vue';
import { useAssetInfoStore } from '@/entry/store';
import { t } from '@/entry/languages/useLanguage';
/* 本地模块 */
import { getAssetHardwareInfo } from '../../model/host'
import { getAssetDetailInfo } from '@/domains/app/model'

const { asset } = useAssetInfoStore()


/**
 * 获取硬件信息
 */
const hardwareInfo = ref<Partial<Hardware>>({})
async function getAssetHardwareInfoData() {
    hardwareInfo.value = await getAssetHardwareInfo({
        deviceIp: asset.assetIp, deviceMac: asset.assetMac,
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
    getAssetHardwareInfoData()
})

</script>
