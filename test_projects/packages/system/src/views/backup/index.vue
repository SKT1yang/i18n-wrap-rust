<!--
 * @Name: 系统备份
 * @Description: 系统管理-系统备份
 * @Author: lkq
 * @Date: 2022-03-18 13:28:12
 * @LastEditTime: 2022-03-23 13:24:23
 * @LastEditors: lkq
-->
<template>
  <div class="p-4">
    <Card>
      <Tabs>
        <TabPane key="dataSnapshot" tab="数据快照">
          <DataSnapshot />
        </TabPane>
        <TabPane key="dataBackup" tab="数据备份">
          <DataBackup />
        </TabPane>
        <TabPane key="dataDump" tab="数据转储">
          <DataDump />
        </TabPane>
      </Tabs>
    </Card>
  </div>
</template>
<script setup lang="ts">
import { Card, Tabs, TabPane } from 'ant-design-vue';
import DataSnapshot from './DataSnapshot.vue';
import DataBackup from './DataBackup.vue';
import DataDump from './DataDump.vue';

defineOptions({
  name: 'SystemBackUp'
})
</script>
