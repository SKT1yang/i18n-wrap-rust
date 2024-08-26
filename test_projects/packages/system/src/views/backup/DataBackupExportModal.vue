<!--
 * @Name: Do not edit
 * @Description: Do not edit
 * @Author: lkq
 * @Date: 2022-03-21 11:12:25
 * @LastEditTime: 2023-10-08 12:49:16
 * @LastEditors: Please set LastEditors
-->
<template>
  <div class="systemBackUpDataBackupExportDodal">
    <Modal v-model:open="state.visible" title="导出" width="20%" :mask-closable="false" @ok="output" @cancel="closeModal">
      <div style="padding: 10px">
        <Button type="primary" size="small" block @click="addDatePicker">
          <i class="i-base-plus"></i>
          添加日期
        </Button>
        <div v-for="(item, index) in state.datePickerList" :key="index" class="my-2 flex items-center">
          <DatePicker v-model:value="item.date" :disabled-date="disabledDate" value-format="YYYY-MM-DD 00:00:00"
            style="width: 90%" />
          <Button type="primary" size="small" danger style="margin-left: 5px" @click="removeDatePicker(index)">
            <i class="i-base-indeterminate-circle-line"></i>
          </Button>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script setup name="SystemBackUpDataBackupExportDodal" lang="ts">
import { reactive } from 'vue'
import { Modal, DatePicker, Button, message } from 'ant-design-vue';
import dayjs, { Dayjs } from 'dayjs';
import { createBackupRecordApi } from '../../model/backup';

let state = reactive<{
  visible: boolean;
  datePickerList: {
    date: string
  }[]
}>({
  visible: false, // 弹框标志
  datePickerList: [], //日期选择器列表（支持多个）
});

const emit = defineEmits(['getOutputRecord']);

// 打开弹框
const openModal = () => {
  state.visible = true;
};

// 关闭弹框
const closeModal = () => {
  state.visible = false;
  state.datePickerList = [];
};

const disabledDate = (current: Dayjs) => {
  return current && current > dayjs().endOf('day');
};

// 添加日期选择器
const addDatePicker = () => {
  if (state.datePickerList.length >= 7) {
    message.warning('最多添加七个日期！');
  } else {
    state.datePickerList.push({
      date: '',
    });
  }
};

// 移除日期选择器
const removeDatePicker = (index) => {
  state.datePickerList.splice(index, 1);
};

// 生成导出记录
const output = () => {
  if (state.datePickerList.length === 0) {
    message.warning('至少选择一个日期');
  } else {
    let createTime: string[] = [];
    for (let i = 0; i < state.datePickerList.length; i++) {
      if (state.datePickerList[i].date) {
        createTime.push(dayjs(state.datePickerList[i].date).format());
      } else {
        message.warning('请检查日期');
        return;
      }
    }
    createBackupRecordApi({
      createTime: createTime,
    }).then(() => {
      message.success('操作成功');
      emit('getOutputRecord');
      closeModal();
    });
  }
};

// 暴露变量
defineExpose({
  openModal,
});
</script>
