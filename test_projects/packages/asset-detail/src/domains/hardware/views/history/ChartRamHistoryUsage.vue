<!--
 * @name: 资产内存历史使用率
 * @description: 通用，只要资产有内存
-->

<template>
    <div v-if="showChart" ref="ramChartRef" class="h-50"></div>
    <Empty v-else />
</template>

<script lang="ts" setup>
/* 类型文件 */
import type { MemoryRate } from '../../types/history'
/* 第三方模块 */
import { ref, PropType, watch, nextTick, computed } from 'vue';
import { Empty } from 'ant-design-vue';
import dayjs from 'dayjs';
import * as echarts from 'echarts/core'
import { formatToDateTime, cssVar } from '@guolisec/utils'
/* 本地模块 */
import { queryPlcMemRateByTime } from '../../model/history'
import { useAssetInfoStore } from '@/entry/store';
import { t } from "@/entry/languages/useLanguage";

const props = defineProps({
    time: {
        type: Object as PropType<[string, string]>,
        default: () => []
    }
})

const { asset } = useAssetInfoStore()

watch(() => props.time, () => {
    getPlcMemRateByTime()
}, {
    immediate: true
})

const ramChartRef = ref<HTMLElement>()

const showChart = ref(false)

async function getPlcMemRateByTime() {
    const dateTime = [
        formatToDateTime(props.time[0]),
        formatToDateTime(props.time[1]),
    ]
    const { assetIp, assetMac } = asset
    const res = await queryPlcMemRateByTime({ assetIp, assetMac, dateTime })
    // 遍历全部内存使用率，如果值为 -1 或 null，替换成 undefined，并且有效值时，才生成图表
    let hasEffectiveValue = false
    const ramList = res.map((ram) => {
        const memRateValueList: (number | undefined)[] = []
        ram.memRateValueList.forEach((rate) => {
            if (typeof rate === 'number' && rate !== -1) {
                hasEffectiveValue = true
                memRateValueList.push(rate)
            } else {
                memRateValueList.push(undefined)
            }
        })
        return { ...ram, memRateValueList }
    })
    if (hasEffectiveValue) {
        showChart.value = true;
        nextTick(() => {
            initEcharts(ramList);
        });
    } else {
        showChart.value = false;
    }
}

const colorList = computed(() => {
    return [
        cssVar('--blue-6'),
        cssVar('--purple-6'),
        cssVar('--cyan-6'),
        cssVar('--green-6'),
        cssVar('--magenta-6'),
        cssVar('--pink-6'),
        cssVar('--red-6'),
        cssVar('--orange-6'),
        cssVar('--yellow-6'),
        cssVar('--volcano-6'),
        cssVar('--geekblue-6'),
        cssVar('--gold-6'),
        cssVar('--lime-6')
    ]
})

const initEcharts = (data: MemoryRate[]) => {
    // 不同内存在某个时间段内的上送的数据不一致，先将不同内存的所有时间汇聚在一起，过滤掉重复的时间，并按大小顺序排列
    let timeList: string[] = data.reduce((prev: string[], cur) => {
        const createTimeSet = new Set([...prev, ...cur.createTimeList])
        return [...createTimeSet]
    }, []);

    timeList = timeList.sort((a, b) => {
        return dayjs(a).unix() - dayjs(b).unix()
    })

    const xAxisData = timeList.map((time) => formatToDateTime(time));

    // 根据以上得到的时间，如果某个内存在该时间点上有数据，将该值加入数组，如果对应的时间点上没有数据，用 undefined 占位
    const ramSeriesData = data.map((ram) => {
        const { createTimeList, memRateValueList, memRateName } = ram
        const rateList = timeList.map((time) => {
            const index = createTimeList.indexOf(time)
            if (index > -1) {
                return memRateValueList[index]
            } else {
                return undefined
            }
        })

        return {
            name: memRateName,
            type: 'line',
            smooth: true,
            data: rateList
        }
    })

    if (ramChartRef.value) {
        const chart = echarts.init(ramChartRef.value)
        chart.setOption(
            getCommomOption(
                xAxisData,
                ramSeriesData,
            ),
            false,
        );
    }
};

const getCommomOption = (xAxisData, seriesData) => {
    return {
        color: colorList.value,
        legend: {
            right: 0,
            type: 'scroll'
        },
        tooltip: {
            show: true,
            trigger: 'axis',
            formatter: function (params) {
                console.log(params)
                const content = params.reduce((prev, cur) => {
                    return prev + '<br>' +
                        cur.marker
                        +
                        "<span style='margin-left: 8px;'>"
                        +
                        cur.seriesName
                        +
                        '</span>' +
                        "<span style='font-weight: bolder;margin-left: 16px;'>" +
                        (typeof cur.value === 'number' ? cur.value +
                            ' %' : t('暂无数据')) +

                        '</span>'
                }, '')
                return (
                    params[0].name + content
                );
            },
        },
        grid: {
            top: 40,
            bottom: 50,
            right: 40,
        },
        xAxis: {
            type: 'category',
            // nameGap: 50,
            data: xAxisData,
            axisTick: {
                // show: false,
            },
        },
        dataZoom: xAxisData.length > 50 ? [
            {
                type: 'inside',
                start: 90,
                end: 100,

            }, {
                start: 80,
                end: 100,
                height: 10,
                bottom: '15'
            }
        ] : undefined,
        yAxis: {
            type: 'value'
        },
        series: seriesData
    };
};

</script>