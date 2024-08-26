<template>
    <div class="text-$color-text-tertiary">*{{ t('仅展示外部关系') }}</div>
    <div class="w-full min-w-[700px] h-[695px] asset-type-distribute" ref="internetworkingRef"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useAssetInfoStore } from '@/entry/store';
import { getAssetCommunicationInfoNoSelf } from '../../model/internetworking';
import { useColorSchemeMode, cssVar } from "@guolisec/utils"
import { useECharts } from '@guolisec/utils/echarts'
import type { EChartsOption } from 'echarts'
import { t } from '@/entry/languages/useLanguage'

const { colorSchemeMode } = useColorSchemeMode()

watch(colorSchemeMode, async () => {
    getAssetCommunicationInfoData()
})

const { asset } = useAssetInfoStore()


const nodeData = ref<any[]>([])
const edgeData = ref<any[]>([])
const categoriesData = ref<string[]>([])

async function getAssetCommunicationInfoData() {
    const content = await getAssetCommunicationInfoNoSelf({
        deviceIp: asset.assetIp, deviceMac: asset.assetMac, pidNot: 0
    })
    edgeData.value = []
    nodeData.value = []

    const localNode = {
        name: asset.assetIp,
        fixed: true,
        tooltip: {
            show: false
        },
        symbolSize: 64,
        itemStyle: {
            color: cssVar('--blue-5')
        },
        label: {
            show: true,
            position: 'bottom'
        },
    }

    nodeData.value.push(localNode)
    if (content.length) {
        const remoteIpList: string[] = []
        content.forEach(item => {
            const { state, remoteIp, pid, localIp, localPort, remotePort, programName, protocol, } = item
            if (!categoriesData.value.includes(state)) {
                categoriesData.value.push(state)
            }

            if (!remoteIpList.includes(remoteIp)) {
                console.log(remoteIpList, remoteIp,)
                nodeData.value.push({
                    name: remoteIp,
                    symbolSize: 32,
                    itemStyle: {
                        color: cssVar('--blue-2'),
                        borderColor: cssVar('--blue-5'),
                        borderWidth: 2
                    },
                    label: {
                        show: true,
                        position: 'bottom'
                    },
                    tooltip: {
                        show: false
                    },
                })
                remoteIpList.push(remoteIp)
            }
            const lineColor = getColors(categoriesData.value)[categoriesData.value.indexOf(state)]
            edgeData.value.push({
                source: asset.assetIp,
                target: remoteIp,
                lineStyle: {
                    color: lineColor,
                    width: 2
                },
                tooltip: {
                    formatter: function () {
                        return `<div class="mb-2"> <span class="w-[12px] h-[12px] rounded-xl inline-block mr-2" style="background: ${lineColor}"></span> <span class="text-$color-text-tertiary mr-2">${pid}</span>  <span >${programName || '-'}</span> </div>` +
                            `<div class="mb-2 min-w-[280px]"> <span class="text-$color-text-tertiary inline-block w-[64px]">${t('本地信息')}</span> <span>${localIp}: ${localPort}</span></div>` +
                            `<div class="mb-2"> <span class="text-$color-text-tertiary inline-block w-[64px]">${t('远程信息')}</span> <span>${remoteIp}: ${remotePort}</span></div>` +
                            `<div class="mb-2"> <span class="text-$color-text-tertiary inline-block w-[64px]">${t('协议')}</span> <span>${protocol}</span></div>` +
                            `<div> <span class="text-$color-text-tertiary inline-block w-[64px]">${t('状态')}</span> <span>${state}</span></div>`
                    },
                }
            })
        })
    }
    generateChart()
}

const internetworkingRef = ref()

let setInternetworkingOptions: undefined | ((options: EChartsOption) => void) = undefined

const options: () => EChartsOption = () => {
    return {
        tooltip: {
            trigger: 'item',
        },
        autoCurveness: true,
        legend: {
            type: 'scroll',
            selectedMode: false,
            orient: "horizontal",
            top: 0,
            right: 0,
            data: categoriesData.value
        },
        scaleLimit: {
            min: 0.4,
            max: 2
        },
        series: [
            {
                name: 'graph',
                type: 'graph',
                layout: "circular",
                data: nodeData.value,
                links: edgeData.value,
                categories: categoriesData.value.map(item => { return { name: item } }),
                roam: true,
                avoidLabelOverlap: false,
                label: {
                    show: false,
                },
                emphasis: {
                    focus: 'adjacency',
                    label: {
                        show: false,
                    },
                },
                labelLine: {
                    show: false,
                },
                color: getColors(categoriesData.value)
            },
        ],
    }
}


const colorList = [
    cssVar('--purple-5'),
    cssVar('--magenta-5'),
    cssVar('--cyan-5'),
    cssVar('--green-5'),
    cssVar('--pink-5'),
    cssVar('--red-5'),
    cssVar('--geekblue-5'),
    cssVar('--orange-5'),
    cssVar('--yellow-5'),
    cssVar('--volcano-5'),
    cssVar('--lime-5'),
    cssVar('--geekblue-6'),
    cssVar('--purple-6'),
    cssVar('--magenta-6'),
    cssVar('--cyan-6'),
    cssVar('--green-6'),
    cssVar('--pink-6'),
    cssVar('--red-6'),
    cssVar('--orange-6'),
    cssVar('--yellow-6'),
    cssVar('--volcano-6'),
    cssVar('--gold-6'),
    cssVar('--lime-6'),
]
// 需要保证 state 为 ESTABLISHED 的颜色为 blue-5，LISTEN 的颜色为 gold-5
function getColors(stateList: string[]) {
    let specialColorNumber = 0
    return stateList.map((state, index) => {
        console.log(index, 'index')
        switch (state) {
            case 'ESTABLISHED':
                specialColorNumber++
                return cssVar('--blue-5');
            case 'LISTEN':
                specialColorNumber++
                return cssVar('--gold-5')
            default:
                return colorList[index - specialColorNumber]
        }
    })
}

function generateChart() {
    if (internetworkingRef.value) {
        const { setOptions } = useECharts(internetworkingRef.value)
        setInternetworkingOptions = setOptions
        setInternetworkingOptions(options())
    }
}


onMounted(() => {
    getAssetCommunicationInfoData()

})
</script>