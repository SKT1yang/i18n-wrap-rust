<!--
 * @Name: 视图元素组件
 * @Description:可拖拽元素
 * @Author: ygd
 * @Date: 2022-02-12 15:19:30
 * @LastEditTime: 2022-10-26 09:25:43
 * @LastEditors: ygd
-->
<template>
  <div class="flex items-center justify-center" @click="handlestopPropagation" v-if="totalPages > 1">
    <Button class="mx-2" size="small" @click.stop="handlePrevious">
      <template #icon>
        <i class="i-base-left"></i>
      </template>
    </Button>
    <span>
      <InputNumber :controls="false" class="w-8 mx-1" size="small" v-model:value="InputPage" :maxlength="99999" />
      <span class="mx-1">/</span>
      <span class="mx-1">{{ totalPages }}</span>
    </span>
    <Button class="mx-2" size="small" @click.stop="handleNext">
      <template #icon>
        <i class="i-base-right"></i>
      </template>
    </Button>
  </div>
</template>

<script name="SimplePagination" lang="ts" setup>
import { watch, computed } from 'vue'
import { InputNumber, Button } from 'ant-design-vue';
import { useVModel } from '@guolisec/utils';

const props = defineProps<{
  page: number;
  size: number;
  total: number;
}>();

const emit = defineEmits(['change']);

// 处理当前页变化
const InputPage = useVModel(props, 'page');
watch(
  () => props.page,
  (v) => {
    emit('change', v);
  },
);

const totalPages = computed(() => {
  return Math.ceil(props.total / props.size);
});

/**
 * 前一页
 */
function handlePrevious() {
  if (InputPage.value > 1) {
    InputPage.value -= 1;
  }
}

/**
 * 下一页
 */
function handleNext() {
  if (InputPage.value < totalPages.value) {
    InputPage.value += 1;
  }
}

function handlestopPropagation(event: MouseEvent) {
  event.stopPropagation();
}
</script>