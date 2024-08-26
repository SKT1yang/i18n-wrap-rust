
<!--
 * @Name: 网口设置
 * @Description: 
 * @Author: ygd
 * @Date: 2022-03-25 16:46:04
 * @LastEditTime: 2023-11-27 16:47:13
 * @LastEditors: Please set LastEditors
-->
<template>
  <div class="system-interface">
    <InterfaceView :interface-list="interfaceList" />
    <Table :data-source="interfaceList" :columns="columns" bordered size="small" :pagination="false">
      <template #bodyCell="{ column, record }">
        <div v-if="column.key === 'action'" class="space-x-5">
          <a type="text" @click="handleModify(record)">修改</a>
        </div>
      </template>
    </Table>
    <!-- 修改网口 -->
    <InterfaceModifyModal v-model:visible="dialogVisible" :current="current" @refresh="getNetworkcardInfo" />
  </div>
</template>
<script setup lang="ts">
/* 类型文件 */

/* 第三方模块 */
import {
  Table,
} from 'ant-design-vue';
/* 本地共享模块 */

/* 业务模块 */
import InterfaceView from './interface/InterfaceView.vue';
import InterfaceModifyModal from './interface/InterfaceModifyModal.vue';
import { useInterface } from '../../controller/useNetworkInterface';

const {
  columns,
  interfaceList,
  current,
  dialogVisible,
  getNetworkcardInfo,
  handleModify
} = useInterface()

</script>
