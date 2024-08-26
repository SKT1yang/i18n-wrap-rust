<!--
 * @name: Do not edit
 * @description: Do not edit
-->
<template>
  <div class="p-2 min-w-350">
    <Tabs v-model:active-key="tabKey">
      <TabPane :key="0" tab="待确认资产">
        <FormHead :selectedObj="selectedObj" @query="query" />
        <FormBody @query="query" :loading="loading" :tabKey="tabKey" />
      </TabPane>
      <TabPane :key="1" tab="已忽略资产">
        <FormHead :selectedObj="selectedObj" @query="query" />
        <FormBody :loading="loading" @query="query" :tabKey="tabKey" />
      </TabPane>
    </Tabs>
  </div>
</template>

<script lang='ts' setup>
import { Tabs, TabPane } from "ant-design-vue"
import { ref, reactive, onMounted } from "vue"
import FormHead from "./components/FormHead.vue"
import FormBody from "./components/FormBody.vue"
import { trustingAssetPageAPI } from "@/model/trust"
import { useStore } from "@/model/trustStore";

const { data } = useStore();
const loading = ref(false)
let selectedObj = reactive<{
  name?: string,
  assetIp?: string,
  assetsType?: number,
  runStatus?: number
}>({
  name: undefined,
  assetIp: undefined,
  assetsType: undefined,
  runStatus: undefined
})
const tabKey = ref(0)
onMounted(() => {
  query();
})
const query = (sort?: string) => {
  loading.value = true;
  trustingAssetPageAPI({
    page: data.current, size: data.pageSize,
    name: selectedObj.name as string,
    assetIp: selectedObj.assetIp,
    assetTypeCodes: selectedObj.assetsType,
    runStatus: selectedObj.runStatus,
    ignoreStatus: tabKey.value,
    treat: false,
    sort: sort ?? 'createTime,desc'
  }).then((res) => {
    loading.value = false;
    let indexShow = 1 + (data.current - 1) * data.pageSize;
    data.total = res.totalElements;
    data.list = res.content.map((value) => {
      return { ...value, index: indexShow++ }
    })
  })
}
</script>
<style scoped></style>