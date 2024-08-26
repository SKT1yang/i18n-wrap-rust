<!--
 * @Name: 接口
 * @Description: Do not edit
 * @Author: ygd
 * @Date: 2022-03-14 19:38:27
 * @LastEditTime: 2023-11-27 16:52:54
 * @LastEditors: Please set LastEditors
-->
<template>
  <div>
    <span style="width: 60px">管理口：</span>
    <div class="interface-list" style="margin-top: 5px">
      <div class="item" v-for="item in mgmtList" :key="item.networkCardName">
        <div class="left">
          <i :class="[getImg(item), 'text-5xl']"></i>
          <span>{{ item.networkCardName }}</span>
        </div>
        <div class="right">
          <span class="right-t">
            上行流量：
            <span>{{ item.upFlow }}</span>
          </span>
          <span class="right-b">
            下行流量：
            <span>{{ item.downFlow }}</span>
          </span>
        </div>
        <div class="switch-s">
          <Tag color="warning" v-show="item.interfaceDirection" style="margin-left: 26px">单通</Tag>
        </div>
      </div>
    </div>
    <span style="width: 60px">业务口：</span>
    <div class="interface-list" style="margin-top: 5px">
      <div class="item" v-for="item in interfaceDList" :key="item.networkCardName">
        <div class="left">
          <i :class="[getImg(item), 'text-5xl']"></i>
          <span>{{ item.networkCardName }}</span>
        </div>
        <div class="right">
          <span class="right-t">
            上行流量：
            <span>{{ item.upFlow }}</span>
          </span>
          <span class="right-b">
            下行流量：
            <span>{{ item.downFlow }}</span>
          </span>
        </div>
        <div class="switch-s">
          <Tag color="warning" v-show="item.interfaceDirection" style="margin-left: 26px">单通</Tag>
        </div>
      </div>
    </div>
    <div class="interface-list">
      <div class="item" v-for="item in interfaceGList" :key="item.networkCardName">
        <div class="left">
          <i :class="[getImg(item), 'text-5xl']"></i>
          <span>{{ item.networkCardName }}</span>
        </div>
        <div class="right">
          <span class="right-t">
            上行流量：
            <span>{{ item.upFlow }}</span>
          </span>
          <span class="right-b">
            下行流量：
            <span>{{ item.downFlow }}</span>
          </span>
        </div>
        <div class="switch-s">
          <Tag color="warning" v-show="item.interfaceDirection" style="margin-left: 26px">单通</Tag>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
/* 类型文件 */
import { NetworkInterface } from '../../../types/interface';
/* 第三方模块 */
import { Tag } from 'ant-design-vue';
/* 共享模块 */

/* 业务模块 */

import type { PropType } from 'vue'
import { computed } from 'vue'

const props = defineProps({
  interfaceList: {
    type: Array as PropType<NetworkInterface[]>,
    default() {
      return [];
    },
    require: true,
  },
});

const interfaceGList = computed<NetworkInterface[]>(() => {
  return props.interfaceList.filter((networkInterface) => {
    return !networkInterface.mgmt && networkInterface.interfaceType;
  });
});

const interfaceDList = computed<NetworkInterface[]>(() => {
  return props.interfaceList.filter((networkInterface) => {
    return !networkInterface.mgmt && !networkInterface.interfaceType;
  });
});

const mgmtList = computed<NetworkInterface[]>(() => {
  return props.interfaceList.filter((networkInterface) => {
    return networkInterface.mgmt;
  });
});

function getImg(item) {
  if (item.interfaceType) {
    if (item.status) {
      return 'i-base-opitical-interface text-green-500';
    } else {
      return 'i-base-opitical-interface text-gray-500';
    }
  } else {
    if (item.status) {
      return 'i-base-network-interface text-green-500';
    } else {
      return 'i-base-network-interface text-gray-500';
    }
  }
}
</script>

<style lang="scss" scoped>
.interface-list {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;

  .item {
    position: relative;
    width: calc(25% - 15px);
    height: 120px;
    margin-right: 20px;
    margin-bottom: 20px;
    border-radius: 10px;
    display: flex;

    &:nth-of-type(4n) {
      margin-right: 0;
    }

    .left {
      width: 60px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin: 0 20px;

      span {
        font-weight: 600;
      }
    }

    .right {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;

      .right-t,
      .right-b {
        font-size: 12px;
      }

      .right-t {
        margin-bottom: 20px;
      }
    }

    .switch-s {
      position: absolute;
      left: 30px;
      bottom: 4px;
    }
  }
}
</style>
