<!--
 * @name: 网络互联
 * @description: 设备之间通信信息：两端设备IP、端口、进程信息
-->
<template>
    <Card :title="t('网络连接')">
        <template #rightExtra>
            <RadioGroup v-model:value="showType">
                <RadioButton value="chart">
                    <i class="i-base-mind-map w-[14px] h-[14px]"></i>
                </RadioButton>
                <RadioButton value="table"> <i class="i-base-table-view"></i></RadioButton>
            </RadioGroup>
        </template>

        <div v-show="showType === 'chart'">
            <InternetworkingChart />
        </div>
        <div v-show="showType === 'table'">
            <InternetworkingTable />
        </div>
    </Card>
</template>

<script setup lang="ts">
import { RadioButton, RadioGroup } from 'ant-design-vue'
import { ref } from 'vue';
import InternetworkingChart from './InternetworkingChart.vue';
import InternetworkingTable from './InternetworkingTable.vue';
import Card from '@/shared/components/Card.vue';
import { t } from '@/entry/languages/useLanguage'

const showType = ref('chart')

</script>