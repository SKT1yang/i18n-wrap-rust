<!--
 * @name: 数据备份管理
 * @description: Do not edit
 * @date: 2023-10-07 15:56:15
 * @path: \front\data-backup\src\views\index.vue
-->
<template>
    <Tabs>
        <TabPane key="dataBackup" tab="数据备份" v-if="props.tabList.includes('dataBackup')">
            <DataBackup />
        </TabPane>
        <TabPane key="dataDump" tab="数据转储" v-if="props.tabList.includes('dataDump')">
            <DataDump />
        </TabPane>
        <TabPane key="dataSnapshot" tab="数据快照" v-if="props.tabList.includes('dataSnapshot')">
            <DataSnapshot />
        </TabPane>
    </Tabs>
</template>
<script setup lang="ts">
import { Tabs, TabPane } from 'ant-design-vue'
import DataBackup from './DataBackup.vue';
import DataDump from './DataDump.vue'
import DataSnapshot from './DataSnapshot.vue';
type TabListType = "dataSnapshot" | "dataBackup" | "dataDump"

const props = withDefaults(defineProps<{
    tabList: Array<TabListType>
}>(), {
    tabList: () => ["dataBackup", "dataDump"]
})

</script>