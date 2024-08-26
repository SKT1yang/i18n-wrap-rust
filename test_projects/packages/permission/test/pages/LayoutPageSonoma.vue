<template>
  <div class="bg-red w-10000" v-if="show === 1">
    <table>
      <tr v-for="i in 2" :key="i">
        <td v-for="j in 100" :key="j">介绍了打开房间啊善良的</td>
      </tr>
    </table>
  </div>
  <div class="bg-red" v-if="show === 2">
    <table>
      <tr v-for="i in 500" :key="i">
        <td v-for="j in 2" :key="j">介绍了打开房间啊善良的</td>
      </tr>
    </table>
  </div>
  <div class="bg-red w-10000 h-10000" v-if="show === 3">

  </div>
  <div class="w-400 h-200 bg-red overflow-auto" v-if="show === 4">
    <Table :columns="columns"></Table>
  </div>
  <div class="w-10 h-10 bg-red" v-if="show === 5">
    <table>
      <tr v-for="i in 2" :key="i">
        <td v-for="j in 2" :key="j">介绍了打开房间啊善良的</td>
      </tr>
    </table>
  </div>
  <div class="w-full h-full bg-red" v-if="show === 6">
    111
  </div>
  <div class="absolute right-100 top-100">
    <button @click="show = 1">宽度超长</button>
    <button @click="show = 2">高度超长</button>
    <button @click="show = 3">长宽超长</button>
    <button @click="show = 4">中等内容</button>
    <button @click="show = 5">少部分内容</button>
    <button @click="show = 6">刚好充满</button>
  </div>
</template>

<script lang='ts' setup>
import { ref } from 'vue';
import type { ColumnsType } from 'ant-design-vue/es/table/interface'
import { Table } from 'ant-design-vue';
const show = ref(1)

const columns = ref<ColumnsType>([
  {
    title: '时间',
    width: 170,
    sorter: true,
    key: 'createTime',
    align: 'center',
    dataIndex: 'createTime',
  },
  {
    title: 'IP',
    width: 130,
    dataIndex: 'dstIp',
    align: 'center',
    customRender: ({ record, text }) => {
      return record.srcIp || text || '-'
    },
  },
  {
    title: 'MAC',
    width: 160,
    dataIndex: 'srcAssetMac',
    align: 'center',
    customRender: ({ record, text }) => {
      return text || record.dstAssetMac || '-'
    },
  },
  {
    title: '事件名称',
    width: 160,
    dataIndex: 'eventName',
    ellipsis: true,
    align: 'center',
    customRender: ({ text }) => {
      return text ?? '-'
    },
  },
  {
    title: '威胁等级',
    dataIndex: 'score',
    key: 'score',
    align: 'center',
    width: 130,
  },
  {
    title: '威胁等级',
    dataIndex: 'score',
    key: 'score',
    align: 'center',
    width: 130,
  },
  {
    title: '威胁等级',
    dataIndex: 'score',
    key: 'score',
    align: 'center',
    width: 130,
  },
  {
    title: '威胁等级',
    dataIndex: 'score',
    key: 'score',
    align: 'center',
    width: 130,
  },
  {
    title: '威胁等级',
    dataIndex: 'score',
    key: 'score',
    width: 130,
    align: 'center',
  },
  {
    title: '威胁等级',
    dataIndex: 'score',
    key: 'score',
    align: 'center',
    width: 130,
  },
  {
    title: '威胁等级',
    dataIndex: 'score',
    key: 'score',
    align: 'center',
    width: 130,
  },
  {
    title: '事件详情',
    dataIndex: 'naturalLanguageDescription',
    ellipsis: true,
    align: 'center',
    customRender: ({ text }) => {
      return text ?? '-'
    },
  },
  {
    title: '操作',
    width: 120,
    align: 'center',
    key: 'action',
  },
])

</script>
<style scoped></style>