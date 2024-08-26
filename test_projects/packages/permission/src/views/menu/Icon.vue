<template>
  <i :class="props.icon">
    <!-- 给unocss识别 -->
    <i v-if="false" class="icon-placeholder" :class="[
      // rsmp 靶场调度管理平台
      'i-base-earth',
      'i-base-task-line',
      'i-base-book-mark-line',
      'i-base-award-line',
      'i-base-book-2-line',
      'i-base-box-1-line',

      // ahm 工控资产健康检测系统开发
      'i-base-home-3-line', // 首页
      'i-base-scan-2-line', // 资产发现
      'i-base-archive-2-line', // 资产管理
      'i-base-organization-chart', // 网络拓扑
      'i-base-signal-tower-line', // 实时监测
      'i-base-list-settings-line', // 策略配置
      'i-base-survey-line', // 统计报表
      'i-base-archive-stack-line', // 组件管理
      'i-base-home-office-line', // 准入控制

      // 通用
      'i-base-setting', // 系统管理
    ]"></i>
  </i>
</template>

<script lang='ts' setup>
const props = defineProps({
  icon: {
    type: String,
  },
})
</script>