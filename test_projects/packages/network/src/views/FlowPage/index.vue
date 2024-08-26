<!--
 * @Name: 流量分析layout
 * @Description: 流量分析layout
 * @Author: bwb
-->
<template>
  <div class="p-4">
    <Card style="width: 100%">
      <Tabs>
        <TabPane key="statistic" tab="实时流量分析">
          <FlowAnalysis />
        </TabPane>
      </Tabs>
    </Card>
  </div>
</template>
<script setup name="FlowStatistic" lang="ts">
import { Card, Tabs, TabPane } from 'ant-design-vue';
import FlowAnalysis from '../../views/FlowPage/components/FlowAnalysis.vue';
</script>