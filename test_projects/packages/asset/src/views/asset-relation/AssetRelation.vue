<!--
 * @name: 资产关系页面
 * @description: Do not edit
 * @path: \asset\src\views\relation\AssetRelation.vue
-->
<template>
  <div class="p-2 min-w-350" style="width: 100%">
    <Form layout="inline" :model="queryForm">
      <FormItem label="">
        <DatePicker v-model:value="queryForm.createTime" format="YYYY-MM-DD" value-format="YYYY-MM-DD HH:mm:ss" />
      </FormItem>
      <FormItem>
        <Checkbox v-model:value="queryForm.isIcp" />
        <span>只显示OT资产</span>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit">
          查询
        </Button>
      </FormItem>
    </Form>
    <RelationCharts ref="relationChartRef" />
  </div>
</template>
<script name="AssetRelation" lang="ts" setup>
/* 类型文件 */
import type { RelationInfo } from './types';
/* 第三方模块 */
import { ref, onMounted, reactive, provide } from 'vue'
import dayjs from 'dayjs';
import {
  Form, FormItem, DatePicker, Checkbox, Button
} from "ant-design-vue"
/* 本地模块 */
import RelationCharts from './RelationCharts.vue';
import { relationInfoKey } from './sysmbols';

const info = reactive<RelationInfo>({
  dialogIp: '',
  dialogDate: dayjs(),
  dialogType: '',
  relationshipChartWidth: (`${document.documentElement.clientWidth}` as unknown as number) - 36,
  isIcp: '0',
});

provide(relationInfoKey, info);
const relationChartRef = ref();
const queryForm = ref<{
  createTime: dayjs.Dayjs;
  isIcp: boolean,
}>({
  createTime: dayjs(),
  isIcp: false,
})

async function handleSubmit() {
  info.dialogDate = queryForm.value.createTime || dayjs();
  info.isIcp = queryForm.value.isIcp ? '1' : '0';
  await relationChartRef.value.getData();
}

onMounted(() => {
  relationChartRef.value.getData();
});
</script>
