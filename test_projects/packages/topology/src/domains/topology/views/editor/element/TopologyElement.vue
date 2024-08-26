<!--
 * @name: 拓扑左边可拖拽元素区
 * @description: Do not edit
 * @date: 2023-02-15 09:51:27
 * @path: \feature-vue\platform\front\topology\src\domains\topology\views\editor\element\TopologyElement.vue
-->
<template>
  <div class="topology-element p-4 bg-$color-bg-base">
    <div class="font-bold mb-4">拓扑元素</div>
    <Collapse v-model:activeKey="activeKey" class="overflow-y-auto" accordion ghost>
      <CollapsePanel key="common">
        <template #header>
          <div class="flex items-center">
            <span class="ml-2 font-bold">通用</span>
            <span class="ml-2 text-xs tracking-widest text-gray-400">
              {{ commonElementList.length }}
              <span>项</span>
            </span>
          </div>
        </template>
        <div class="flex items-center flex-wrap my-2 max-h-72 overflow-y-scroll">
          <CommonElement v-for="commonElement in commonElementList" :key="commonElement.id"
            :element-info="commonElement" />
        </div>
      </CollapsePanel>
      <CollapsePanel key="asset">
        <template #header>
          <div class="flex justify-between">
            <div class="flex items-center">
              <span class="ml-2 font-bold">资产</span>
              <span class="ml-2 text-xs tracking-widest text-gray-400">{{ total }} 项</span>
            </div>
            <div>
              <Checkbox @change="handleCheckedChange" v-model:checked="checked" @click.stop />
              <span class="ml-2" @click.stop>仅展示未添加资产</span>
            </div>
          </div>
        </template>
        <Input v-model:value="queryForm.name" placeholder="搜索资产名称" @pressEnter="handleChangePage(1)" @blur="handleChangePage(1)" allow-clear>
        <template #prefix>
          <i class="i-base-search"></i>
        </template>
        </Input>
        <Spin :spinning="loading">
          <div class="flex items-center flex-wrap my-2 max-h-120 overflow-y-scroll">
            <AssetElement v-for="asset in assetList" :key="asset.id" :asset-info="asset" @refresh="handleCheckedChange" />
          </div>
          <SimplePagination class="mt-2" v-model:page="currentPage" :total="total" :size="pageSize"
            @change="handleChangePage" />
        </Spin>
      </CollapsePanel>
    </Collapse>
  </div>
</template>

<script name="TopologyElement" lang="ts" setup>
import { ref } from 'vue'
import { Collapse, CollapsePanel, Spin, Checkbox, Input } from 'ant-design-vue';
import AssetElement from './AssetElement.vue'
import CommonElement from './CommonElement.vue';
import SimplePagination from './SimplePagination.vue';
import { useElement, useCommonElement } from './useElement'

const activeKey = ref('asset')

const { assetList, loading, queryForm, pageSize, currentPage, total, handleChangePage, checked, handleCheckedChange, } = useElement()

const { commonElementList } = useCommonElement()

</script>

<style scoped>
.topology-element {
  width: 320px;
  flex: 0 0 320px;
}

.topology-element ::-webkit-scrollbar {
  width: 0px;
}
</style>
