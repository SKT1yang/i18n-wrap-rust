<!--
 * @name: 服务器-运行状态
 * @description: 图表卡片，包含 CPU、内存、磁盘、网口信息
-->
<template>
    <div v-if="cpuInfoList.length || ramInfoList.length || diskInfoList.length || networkInfoList.length"
        class="grid gap-4 host-run-status-container ">
        <Card v-for="cpu in cpuInfoList" :key="cpu.cpuName">
            <template #title>
                <span class="text-base font-bold "> CPU </span>
                <span class="color-$color-text-tertiary ml-2">
                    {{ cpu?.cpuName }}
                </span>
            </template>

            <Statistic :title="t('使用率')" class="border-l-2 border-l-solid border-l-$blue-6 pl-4"
                :key="`${cpu?.cpuUsage}cpuUsage`" :valueStyle="{ fontWeight: 600 }">
                <template #formatter>
                    {{ cpu?.cpuUsage[0]?.cpuUsage ?? '-' }}
                </template>
                <template #suffix>
                    <span class="font-normal text-[16px]">%</span>
                </template>
            </Statistic>

            <div :id="cpu?.cpuName" class="h-[160px] w-full"></div>
        </Card>

        <Card v-for="(ram, index) in ramInfoList" :key="index">
            <template #title>
                <span class="text-base font-bold "> {{ t('内存') }} </span>
                <span class="color-$color-text-tertiary ml-2">
                    {{ ram.ramUsage[0]?.ramTotal ?? '-' }} G
                </span>
            </template>

            <div class="grid gap-2 "
                :class="asset.assetTypeCode === 25 ? 'server-memory-statistic' : 'memory-disk-statistic'">
                <Statistic :title="t('使用率')" :valueStyle="{ fontWeight: 600 }" :key="`${ram.ramName}ramUsage`"
                    class="border-l-2 border-l-solid border-l-$purple-6  pl-4 ">
                    <template #formatter>
                        {{ ram.ramUsage[0]?.ramUsage ?? '-' }}
                    </template>
                    <template #suffix>
                        <span class="font-normal text-[16px]">%</span>
                    </template>
                </Statistic>
                <Divider type="vertical" class="min-h-full" />
                <Statistic :title="t('使用中')" :valueStyle="{ fontWeight: 600 }" :key="`${ram.ramName}ramUsed`">
                    <template #formatter>
                        {{ ram.ramUsage[0]?.ramUsed ?? '-' }}
                    </template>
                    <template #suffix>
                        <span class="font-normal text-[16px]">G</span>
                    </template>
                </Statistic>
                <Statistic :title="t('可用')" :valueStyle="{ fontWeight: 600 }" :key="`${ram.ramName}ramFree`">
                    <template #formatter>
                        {{
                            ram.ramUsage[0]?.ramFree
                                ?? '-'
                        }}
                    </template>
                    <template #suffix>
                        <span class="font-normal text-[16px]">G</span>
                    </template>
                </Statistic>
                <Statistic :title="t('缓存')" :valueStyle="{ fontWeight: 600 }" :key="`${ram.ramName}ramCached`"
                    v-if="asset.assetTypeCode === 25">
                    <template #formatter>
                        {{
                            ram.ramUsage[0]?.ramCached
                                ?? '-'
                        }}
                    </template>
                    <template #suffix>
                        <span class="font-normal text-[16px]">G</span>
                    </template>
                </Statistic>
            </div>

            <div :id="`ramChart${index}`" class="h-[160px] w-full"></div>

        </Card>

        <Card v-for="(disk, index) in diskInfoList" :key="`disk-${index}`">
            <template #title>
                <span class="text-base font-bold "> {{ t('磁盘') }} </span>
                <span class="color-$color-text-tertiary ml-2">
                    {{ disk.diskName }}
                </span>
            </template>

            <div class="grid gap-4 memory-disk-statistic">
                <Statistic :title="t('使用率')" :valueStyle="{ fontWeight: 600 }" :key="`${disk.diskName}diskUsage`"
                    class="border-l-2 border-l-solid border-l-$cyan-6  pl-4">
                    <template #formatter>
                        {{ disk.diskUsage[0]?.diskUsage ?? '-' }}
                    </template>
                    <template #suffix>
                        <span class="font-normal text-[16px]">%</span>
                    </template>
                </Statistic>
                <Divider type="vertical" class="min-h-full" />
                <Statistic :title="t('使用中')" :valueStyle="{ fontWeight: 600 }" :key="`${disk.diskName}diskUsed`">
                    <template #formatter>
                        {{ disk.diskUsage[0]?.diskUsed ?? '-' }}
                    </template>
                    <template #suffix>
                        <span class="font-normal text-[16px]">G</span>
                    </template>
                </Statistic>
                <Statistic :title="t('可用')" :valueStyle="{ fontWeight: 600 }" :key="`${disk.diskName}diskFree`">
                    <template #formatter>
                        {{ disk.diskUsage[0]?.diskFree ?? '-' }}
                    </template>
                    <template #suffix>
                        <span class="font-normal text-[16px]">G</span>
                    </template>
                </Statistic>
            </div>

            <div :id="disk.diskName" class="h-[160px] w-full"></div>

        </Card>


        <Card v-for="network in networkInfoList" :key="network?.networkName">
            <template #title>
                <span class="text-base font-bold "> {{ t('网口') }} </span>
                <span class="color-$color-text-tertiary ml-2">
                    {{ network?.networkName }}
                </span>
            </template>

            <div class="grid grid-cols-2 gap-4">
                <Statistic :title="t('发送')" :valueStyle="{ fontWeight: 600 }" :key="`${network?.networkName}txSpeed`"
                    class="border-l-2 border-l-dashed border-l-$orange-6  pl-4 ">
                    <template #formatter>
                        {{ network.networkUsage[0]?.txSpeed ?? '-' }}
                    </template>
                    <template #suffix>
                        <span class="font-normal">bps</span>
                    </template>
                </Statistic>
                <Statistic :title="t('接收')" :valueStyle="{ fontWeight: 600 }" :key="`${network?.networkName}rxSpeed`"
                    class="border-l-2 border-l-solid border-l-$orange-6  pl-4 ">
                    <template #formatter>
                        {{ network.networkUsage[0]?.rxSpeed ?? '-' }}
                    </template>
                    <template #suffix>
                        <span class="font-normal">Kbps</span>
                    </template>
                </Statistic>
            </div>

            <div :id="network.networkName" class="h-[160px] w-full"></div>

        </Card>
    </div>
</template>

<script setup lang="ts">
import { Divider, Statistic } from 'ant-design-vue'
import Card from '@/shared/components/Card.vue';
import { useColorSchemeMode, cssVar } from "@guolisec/utils"
import { onMounted, watch, ref, nextTick, onUnmounted } from 'vue';
import { getAssetRunStatus, getSystemDate } from '../../model/host.js'
import { useAssetInfoStore } from '@/entry/store';
import type { CPU, Disk, Ram, Network } from "../../types/host.js";
import { t } from '@/entry/languages/useLanguage';
import { useECharts } from '@guolisec/utils/echarts';
import type { EChartsOption } from 'echarts';
import { useIntervalFn } from '@guolisec/utils';
import dayjs from 'dayjs';

/**
 * 获取系统时间
 */
const systemTime = ref<string>()
async function getSystemDateData() {
    const { systemDate } = await getSystemDate()
    systemTime.value = systemDate
}

const { pause, resume } = useIntervalFn(() => {
    getAssetRunStatusData()
}, 10 * 1000, {
    immediate: false
})

const { asset } = useAssetInfoStore()

const { colorSchemeMode } = useColorSchemeMode()

watch(colorSchemeMode, async () => {
    cpuEchartsInfoList.value = []
    ramEchartsInfoList.value = []
    diskEchartsInfoList.value = []
    networkEchartsInfoList.value = []
    getAssetRunStatusData()
})

onMounted(() => {
    getAssetRunStatusData()
    resume()
})

onUnmounted(() => {
    pause()
})

const cpuEchartsInfoList = ref<HardwareChart[]>([])
const ramEchartsInfoList = ref<HardwareChart[]>([])
const diskEchartsInfoList = ref<HardwareChart[]>([])
const networkEchartsInfoList = ref<HardwareChart[]>([])

const cpuInfoList = ref<CPU[]>([])
const ramInfoList = ref<Ram[]>([])
const diskInfoList = ref<Disk[]>([])
const networkInfoList = ref<Network[]>([])
async function getAssetRunStatusData() {
    await getSystemDateData()
    const createTime = [dayjs(systemTime.value).subtract(6, 'minute').format("YYYY-MM-DD HH:mm:ss"), dayjs(systemTime.value).format("YYYY-MM-DD HH:mm:ss")]
    const { cpu, ram, disk, network } = await getAssetRunStatus({
        deviceIp: asset.assetIp,
        deviceMac: asset.assetMac,
        createTime
    })
    cpuInfoList.value = cpu
    ramInfoList.value = ram
    diskInfoList.value = disk
    networkInfoList.value = network

    const cpuRenderedChartsNames = cpuEchartsInfoList.value.map(item => item?.name)
    cpu.forEach(item => {
        const { usage, color, name } = getRunStatusInfo(item, 'cpu', 'cpuName', 'cpuUsage', 'cpuUsage')
        if (cpuRenderedChartsNames.includes(name)) {
            cpuEchartsInfoList.value.forEach(echartInfo => {
                if (echartInfo?.name === name) {
                    echartInfo?.update(usage)
                }
            })
        } else {
            const echartInfo = new HardwareChart({ usage, color, name })
            cpuEchartsInfoList.value.push(echartInfo)
        }
    })

    // 过滤掉 CPU 中之前有、现在没有的数据，防止之后有数据时，图表更新失败
    const currentCpuNames = cpu.map(item => item.cpuName) // 获取当前获取的CPU数据的名称
    cpuEchartsInfoList.value = cpuEchartsInfoList.value.filter((item) => {
        if (currentCpuNames.includes(item.name)) {
            return true
        }
        return false
    })

    // 内存不会上送名称，根据 ram 的序号区分, 一般只会有一个内存（多个内存会合在一起上送）
    const ramRenderedChartsNames = ramEchartsInfoList.value.map(item => item?.name)
    ram.forEach((item, index) => {
        item.ramName = `ramChart${index}`
        const { usage, color, name } = getRunStatusInfo(item, 'ram', 'ramName', 'ramUsage', 'ramUsage')
        if (ramRenderedChartsNames.includes(name)) {
            ramEchartsInfoList.value.forEach(echartInfo => {
                if (echartInfo?.name === name) {
                    echartInfo?.update(usage)
                }
            })
        } else {
            const echartInfo = new HardwareChart({ usage, color, name })
            ramEchartsInfoList.value.push(echartInfo)
        }
    })

    // 如果当前获取的内存数据为空，清空内存的历史图表数据
    ramEchartsInfoList.value = ram.length ? ramEchartsInfoList.value : []

    const diskRenderedChartsNames = diskEchartsInfoList.value.map(item => item?.name)
    disk.forEach(item => {
        const { usage, color, name } = getRunStatusInfo(item, 'disk', 'diskName', 'diskUsage', 'diskUsage')
        if (diskRenderedChartsNames.includes(name)) {
            diskEchartsInfoList.value.forEach(echartInfo => {
                if (echartInfo?.name === name) {
                    echartInfo?.update(usage)
                }
            })
        } else {
            const echartInfo = new HardwareChart({ usage, color, name })
            diskEchartsInfoList.value.push(echartInfo)
        }
    })

    // 过滤掉磁盘中之前有、现在没有的数据，防止之后有数据时，图表更新失败
    const currentDiskNames = disk.map(item => item.diskName) // 获取当前获取的磁盘数据的名称
    diskEchartsInfoList.value = diskEchartsInfoList.value.filter((item) => {
        if (currentDiskNames.includes(item.name)) {
            return true
        }
        return false
    })

    const networkRenderedChartsNames = networkEchartsInfoList.value.map(item => item?.name)
    network.forEach(item => {

        const rxSpeed = item.networkUsage.map(item => item.rxSpeed)
        const txSpeed = item.networkUsage.map(item => item.txSpeed)
        const name = item.networkName
        const usage = [rxSpeed, txSpeed]
        const color = colorOptions.network

        if (networkRenderedChartsNames.includes(name)) {
            networkEchartsInfoList.value.forEach(echartInfo => {
                if (echartInfo?.name === name) {
                    echartInfo?.update(usage)
                }
            })
        } else {
            const echartInfo = new HardwareChart({ usage, color, name })
            networkEchartsInfoList.value.push(echartInfo)
        }
    })

    // 过滤掉网卡中之前有、现在没有的数据，防止之后有数据时，图表更新失败
    const currentNetworkNames = network.map(item => item.networkName) // 获取当前获取的网卡数据的名称
    networkEchartsInfoList.value = networkEchartsInfoList.value.filter((item) => {
        if (currentNetworkNames.includes(item.name)) {
            return true
        }
        return false
    })
}

const colorOptions = {
    cpu: 'blue',
    ram: 'purple',
    disk: 'cyan',
    network: 'orange'
}

function getRunStatusInfo(info, type, nameKey, usagekey, usageValueKey,) {
    const usage = (info[usagekey] || []).map(item => item[usageValueKey])
    return {
        name: info[nameKey],
        usage,
        color: colorOptions[type]
    }
}


class HardwareChart {
    name: string;
    color: string;
    areaStyleColor: string
    setOptions?: (options: EChartsOption, clear?: boolean) => void

    constructor(info: { color: string; name: string, usage: number[] | number[][] } = { color: 'blue', name: '', usage: [] }) {
        this.name = info.name
        this.color = info.color
        this.areaStyleColor = ''

        nextTick(() => {
            this.render(info)
        })

    }

    // 获取区域样式颜色
    getAreaStyleColor(color: string) {
        const redHexColor = cssVar(`--${color}-6`).slice(1, 3)
        const greenHexColor = cssVar(`--${color}-6`).slice(3, 5)
        const blueHexColor = cssVar(`--${color}-6`).slice(5, 7)
        return `rgba(${parseInt(redHexColor, 16)},${parseInt(greenHexColor, 16)},${parseInt(blueHexColor, 16)},0.1)`
    }

    // 返回基础 option
    getBasicOption(usage: number[] | number[][] = []) {
        const maxValue = usage.length && Array.isArray(usage[0]) ? undefined : 100
        console.log(usage.length && Array.isArray(usage[0]), usage )
        return {
            color: [cssVar(`--${this.color}-6`)],
            grid: {
                top: '40px',
                left: 0,
                right: 0,
                bottom: "30px"
            },
            yAxis: {
                name: '5 分钟',
                max: maxValue,
                min: 0,
                nameLocation: 'start',
                nameTextStyle: {
                    align: 'left'
                },
                type: 'value',
                splitLine: {
                    show: true,
                },
                axisLine: {
                    show: false,
                },
                axisLabel: {
                    show: false
                },
                axisTick: {
                    show: false,
                },
                minInterval: 1,
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                inverse: true,
                splitLine: {
                    show: false,
                },
                name: '',
                axisLine: {
                    show: false,
                },
                axisLabel: {
                    fontSize: 10,
                    showMinLabel: true,
                    showMaxLabel: false,
                    align: 'right',
                    formatter(value) {
                        if (Number(value) != 0) {
                            return ''
                        }
                        return value
                    }
                },
                axisTick: {
                    show: false,
                },
                data: new Array(10).fill(0).map((_val, index) => index++),
            },
        }
    }


    private getSeries(usage = []) {
        if (usage.length && Array.isArray(usage[0])) {
            const seriesList = usage.map((item, index) => {
                return {
                    name: '',
                    symbol: 'none',
                    data: item,
                    type: 'line',
                    itemStyle: {
                        color: cssVar(`--${this.color}-5`),
                    },
                    lineStyle: {
                        width: 2,
                        type: index === 1 ? 'dashed' : undefined
                    },
                    areaStyle: {
                        color: this.areaStyleColor
                    }
                }
            })

            return { series: seriesList }
        }

        return {
            series: [
                {
                    name: '',
                    symbol: 'none',
                    data: usage,
                    type: 'line',
                    itemStyle: {
                        color: cssVar(`--${this.color}-5`),
                    },
                    lineStyle: {
                        width: 2
                    },
                    areaStyle: {
                        color: this.areaStyleColor
                    }
                },
            ],
        }
    }

    render(info) {
        const { name, usage, color = 'blue' } = info

        const dom = document.getElementById(`${name}`)

        if (dom) {
            this.areaStyleColor = this.getAreaStyleColor(color)
            const { setOptions } = useECharts(dom)
            const options = this.getBasicOption(usage)
            const series = this.getSeries(usage)
            console.log("series", series, "xAxis", { ...options, ...series, })
            setOptions({ ...options, ...series, } as EChartsOption)
            this.setOptions = setOptions
        }
    }

    update(usage) {
        const series = this.getSeries(usage)
        this.setOptions && this.setOptions({ ...series } as EChartsOption, false)
    }
}

</script>

<style>
.host-run-status-container {
    grid-template-columns: repeat(3, minmax(480px, 1fr));
}

.host-run-status-container .memory-disk-statistic {
    grid-template-columns: 1fr auto 1fr 1fr;
}

.host-run-status-container .server-memory-statistic {
    grid-template-columns: 1fr auto 1fr 1fr 1fr;
}
</style>