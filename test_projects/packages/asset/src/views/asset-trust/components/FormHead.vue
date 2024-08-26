<template>
  <Form :model="selectedObj" :rules="rules">
    <Row justify="space-around">
      <Col :span="5">
      <FormItem label="资产名称">
        <Input :maxlength="30" placeholder="请输入资产名称或SN" v-model:value="selectedObj.name">
        </Input>
      </FormItem>
      </Col>
      <Col :span="5">
      <FormItem label="IP" name="assetIp">
        <Input :maxlength="30" placeholder="IP 地址" autocomplete="'off'" v-model:value="selectedObj.assetIp">
        </Input>
      </FormItem>
      </Col>
      <Col :span="5">
      <FormItem label="资产类型">
        <Select mode="multiple" placeholder="请选择资产类型" v-model:value="selectedObj.assetsType" :options="fileObj.types">
        </Select>
      </FormItem>
      </Col>
      <Col :span="5">
      <FormItem label="运行状态">
        <Select placeholder="请选择运行状态" :options="fileObj.status" v-model:value="selectedObj.runStatus">
        </Select>
      </FormItem>
      </Col>
    </Row>
    <Row>
      <Col :span="21">
      </Col>
      <Col :span="3">
      <FormItem class="right-0">
        <Button class="m-r-5" @click="clear">重置</Button>
        <Button type="primary" :disabled="disabled" @click="() => { data.current = 1; parentFunc('query') }">查询</Button>
      </FormItem>
      </Col>
    </Row>
  </Form>
</template>

<script lang='ts' setup>
import { Input, Form, FormItem, Row, Col, Select, Button } from "ant-design-vue"
import { reactive, onMounted, ref } from "vue"
import { getAssetOsListAPI } from "@/model/trust"
import { getRules } from "../../asset-field/utils/formRules"
import { baseType } from "../../asset-field/types";
import { useStore } from "@/model/trustStore";

const { data } = useStore();
const disabled = ref(false);
const rules = getRules(disabled);
const parentFunc = defineEmits(['query'])
const fileObj = reactive<{
  status: baseType[],
  types: baseType[]
}>({
  status: [{ value: '0', label: '离线' }, { value: '1', label: '在线' }, { value: '2', label: '闲置' }],
  types: []
})
const parentProp = defineProps<{ selectedObj: any }>()
onMounted(() => {
  getAssetOsListAPI().then((res) => {
    fileObj.types = res.map((value) => {
      return { value: value.assetTypeCode, label: value.assetTypeName }
    })
  })
})
const clear = () => {
  Object.keys(parentProp.selectedObj).forEach((value) => {
    parentProp.selectedObj[value] = undefined
  })
}
</script>
<style scoped></style>