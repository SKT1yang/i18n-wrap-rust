<!--
 * @name: Do not edit
 * @description: Do not edit
-->

<template>
  <div class="space-y-4">
    <h4>{{ t('USB Key 绑定关系') }}</h4>
    <Table
      :data-source="dataList"
      :columns="columns"
      row-key="id"
      :pagination="false"
      bordered
      size="small"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <div class="space-x-5">
            <Button @click="handleUnbind(record)" type="primary">{{ t('解绑') }}</Button>
          </div>
        </template>
      </template>
    </Table>

    <ModalUsbKeyBindUser
      v-model:visible="visible"
      type="unbind"
      :record="current"
      @refresh="getBindRelation"
    />
  </div>
</template>
<script setup lang="ts">
/* 类型文件 */
import type { ColumnProps } from 'ant-design-vue/es/table'
/* 第三方模块 */
import { computed } from 'vue'
import { Button, Table } from 'ant-design-vue'
/* 本地模块 */
import { usrUSBkeyRelation } from '../../../controller/useFisec'
import ModalUsbKeyBindUser from './ModalUsbKeyBindUser.vue'
import { t } from '../../../languages/useLanguage'

const columns = computed<ColumnProps[]>(() => {
  return [
    {
      title: t('用户名'),
      dataIndex: 'username',
      align: 'center'
    },
    {
      title: t('sn值'),
      dataIndex: 'sn',
      align: 'center'
    },
    {
      title: t('操作'),
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      width: '200px',
      ellipsis: true
    }
  ]
})

const { dataList, visible, current, handleUnbind, getBindRelation } = usrUSBkeyRelation()

defineExpose({
  getBindRelation
})
</script>
