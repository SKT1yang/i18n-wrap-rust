<!--
 * @Name: 系统日志
 * @Description: 系统日志
-->
<template>
  <div class="">
    <!-- 查询表单 -->
    <Form layout="inline" :model="searchForm">
      <FormItem>
        <Input v-model:value="searchForm.username" placeholder="用户名" allowClear :maxlength="60" />
      </FormItem>
      <FormItem>
        <Input v-model:value="searchForm.description" placeholder="描述" allowClear :maxlength="60" />
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSearch">
          <i class="i-base-search align-icon"></i>
          查询
        </Button>
      </FormItem>
    </Form>

    <Tabs v-model:activeKey="activeKey" destroy-inactive-tab-pane>
      <TabPane key="operation" tab="操作日志">
        <OperationLog ref="operationLogRef" :search-form="searchForm" />
      </TabPane>
      <TabPane key="system" tab="系统日志">
        <SystemLog ref="systemLogRef" :search-form="searchForm" />
      </TabPane>
      <TabPane key="error" tab="异常日志">
        <ErrorLog ref="errorLogRef" :search-form="searchForm" />
      </TabPane>
    </Tabs>
  </div>
</template>
<script setup lang="ts">
import { nextTick, ref } from 'vue';
import {  Form, FormItem, Input, Button, Tabs, TabPane } from 'ant-design-vue';
import SystemLog from './SystemLog.vue';
import OperationLog from './OperationLog.vue';
import ErrorLog from './ErrorLog.vue';

// 组件
const systemLogRef = ref<InstanceType<typeof SystemLog>>();
const operationLogRef = ref<InstanceType<typeof OperationLog>>();
const errorLogRef = ref<InstanceType<typeof ErrorLog>>();

// 查询表单数据
const searchForm = ref({
  username: '', // 用户名
  description: '', // 描述
});

// 激活标签
const activeKey = ref('operation');

function handleSearch() {
  nextTick(() => {
    if (activeKey.value === 'system') {
      systemLogRef.value && systemLogRef.value.doSearch();
    } else if (activeKey.value === 'operation') {
      operationLogRef.value && operationLogRef.value.doSearch();
    } else if (activeKey.value === 'error') {
      errorLogRef.value && errorLogRef.value.doSearch();
    }
  });
}
</script>
