<template>
  <div>
    <Alert message="1. 自动生成网络拓扑时会重新计算拓扑图内元素的位置，可能导致手动绘制元素的位置信息丢失" type="error"></Alert>
    <Alert message="2. 如果选择的资产组中不包含交换机，可能导致自动生成的拓扑图不准确" type="error"></Alert>
    <Alert message="3. 有连接关系的设备必须保持在线，否则连接关系生成不准确" type="error"></Alert>
  </div>
</template>

<script lang='ts' setup>
import { Alert } from 'ant-design-vue'

</script>