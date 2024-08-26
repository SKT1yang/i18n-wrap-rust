<!--
 * @name: 服务器时间展示
 * @description: Do not edit
-->
<template>
  <div v-show="formattedTime.date" class="flex-between text-white text-base">
    <i class="i-base-clock-circle text-xl"></i>
    <span class="ml-2">{{ formattedTime.date }}</span>
    <span class="ml-3">{{ formattedTime.week }}</span>
    <span class="ml-3">{{ formattedTime.time }}</span>
  </div>
</template>
<script setup lang="ts">
/* 第三方模块 */
import { ref, computed } from 'vue';
import dayjs from 'dayjs/esm/index'
import { useIntervalFn } from '@guolisec/utils';
/* 本地共享模块 */
import { http } from '@guolisec/request';
/* 业务模块 */
import { t } from '@/languages/useLanguage'

// 当前时间
const currentTime = ref<dayjs.Dayjs>()
const systemTimeStart = ref<dayjs.Dayjs>()
// 显示时间

const formattedTime = computed(() => {
  const weekMap = [t('星期日'), t('星期一'), t('星期二'), t('星期三'), t('星期四'), t('星期五'), t('星期六')]
  if (currentTime.value) {
    const currentWeek = weekMap[currentTime.value.toDate().getDay()]
    const temp = currentTime.value.format(`YYYY-MM-DD #HH:mm:ss`).split('#')
    return {
      date: temp[0],
      time: temp[1],
      week: currentWeek
    }
  } else {
    return {
      date: '',
      time: '',
      week: ''
    }
  }
})

// 获取系统时间
async function getSystemTime() {
  return await http.get<{ systemDate: string }>({
    url: '/api/systemDate'
  })
}

async function setCurrentTime() {
  const { systemDate } = await getSystemTime()
  systemTimeStart.value = systemDate ? dayjs(systemDate) : dayjs()
  currentTime.value = systemTimeStart.value
}

// 定时器
useIntervalFn(async () => {
  // 页面加载获取系统时间，避免接口轮询调用
  if (!systemTimeStart.value) {
    setCurrentTime()
  } else {
    currentTime.value = currentTime.value?.add(1, 'second')
  }
}, 1000, {
  immediate: true
})

// 定时器因为异步操作，显示的时间会延迟，每分钟更正一次为系统时间
useIntervalFn(async () => {
  setCurrentTime()
}, 60000)
</script>
