<!--
 * @name: Do not edit
 * @description: Do not edit
-->

<template>
  <div class="space-y-4">
    <h4>{{ t('当前插入 USB Key 设备') }}</h4>
    <Table :data-source="dataList" :columns="columns" bordered :pagination="false" size="small">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <div class="space-x-5">
            <Button @click="handleModify(record)" type="primary">{{ t('修改管理员PIN') }}</Button>
            <Button @click="handleReset(record)" type="primary" danger>{{
              t('重置用户PIN')
            }}</Button>
          </div>
        </template>
      </template>
    </Table>

    <!-- 修改管理员PIN弹窗 -->
    <ModalModifyAdminPin v-model:visible="modifyVisible" :record="current" @refresh="getDataList" />
    <!-- 重置用户PIN弹窗 -->
    <ModalResetPin v-model:visible="resetVisible" :record="current" @refresh="getDataList" />
  </div>
</template>
<script setup lang="ts">
/* 类型文件 */
import type { ColumnProps } from 'ant-design-vue/es/table'
/* 第三方模块 */
import { computed } from 'vue'
import { Button, Table } from 'ant-design-vue'
/* 本地模块 */
import { useUsbKeyDevice } from '../../../controller/useFisec'
import ModalModifyAdminPin from './ModalModifyAdminPin.vue'
import ModalResetPin from './ModalResetPin.vue'
import { t } from '../../../languages/useLanguage'

const columns = computed<ColumnProps[]>(() => {
  return [
    {
      title: t('设备序列号'),
      dataIndex: 'sn',
      align: 'center'
    },
    {
      title: t('登录可重试次数'),
      dataIndex: 'retryCount',
      align: 'center'
    },
    {
      title: t('剩余重试次数'),
      dataIndex: 'remainCount',
      align: 'center'
    },
    {
      title: t('操作'),
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      ellipsis: true
    }
  ]
})

const { dataList, current, modifyVisible, resetVisible, getDataList, handleModify, handleReset } =
  useUsbKeyDevice()

defineExpose({
  getDataList
})
</script>
