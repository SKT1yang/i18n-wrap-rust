<!--
 * @name: 罗克韦尔PLC 数据字段描述表格
 * @description: 
-->

<template>
  <table class="border-collapse text-left">
    <thead>
      <tr class="bg-$color-bg-layout">
        <th class="p-2" colspan="2">{{ headerTitle }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in dataList">
        <td class="p-2 ">{{ item[0] || '-' }}</td>
        <td class="w-[200px]">{{ item[1] || '-' }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script lang='ts' setup>
import type { PropType } from 'vue';

defineProps({
  headerTitle: {
    type: String,
    required: true
  },
  dataList: Array as PropType<(string | undefined)[][]>
})

</script>

<style scoped>
tbody tr {
  border-bottom: 1px solid var(--color-border);
}
</style>