<!--
 * @name: 主机设备信息
 * @description: 硬件信息、操作系统信息、网络互联、外设记录
-->
<template>
    <Card :title="t('操作系统信息')" class="my-6">
        <div class="space-y-4">
            <div class="flex">
                <span class="inline-block w-[80px] text-$color-text-tertiary flex-none">{{ t('名称') }} </span>
                <span class="break-all">{{ osInfo.hostName || '-' }}</span>
            </div>
            <div class="flex">
                <span class="inline-block w-[80px] text-$color-text-tertiary flex-none">{{ t('版本') }} </span>
                <span class="break-all">{{ osInfo.osVersion || '-' }}</span>
            </div>
            <template v-if="osInfo.osType === 1">
                <div class="flex">
                    <span class="inline-block w-[80px] text-$color-text-tertiary flex-none">{{ t('内核名称') }} </span>
                    <span class="break-all">{{ osInfo.kernelName || '-' }}</span>
                </div>
                <div class="flex">
                    <span class="inline-block w-[80px] text-$color-text-tertiary flex-none">{{ t('内核版本') }} </span>
                    <span class="break-all"> {{ osInfo.kernelVersion || '-' }}</span>
                </div>
                <div class="flex">
                    <span class="inline-block w-[80px] text-$color-text-tertiary flex-none">{{ t('架构') }} </span>
                    <span class="break-all">{{ osInfo.hardwareArchitecture || '-' }}</span>
                </div>
            </template>

            <div class="flex">
                <span class="inline-block w-[80px] text-$color-text-tertiary flex-none"> IPv4 </span>
                <span class="break-all"> {{ osInfo.ipv4Address || '-' }}</span>
            </div>
            <div class="flex">
                <span class="inline-block w-[80px] text-$color-text-tertiary flex-none"> IPv6 </span>
                <span class="break-all"> {{ osInfo.ipv6Address || '-' }}</span>
            </div>
        </div>
    </Card>
</template>

<script lang="ts" setup>
import Card from '@/shared/components/Card.vue';
import { onMounted, ref } from 'vue';
import { useAssetInfoStore } from '@/entry/store/index';
import type { OS, } from "../types";
import { getAssetDetailInfo } from '../model'
import { t } from '@/entry/languages/useLanguage';

const { asset } = useAssetInfoStore()

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
})

</script>
