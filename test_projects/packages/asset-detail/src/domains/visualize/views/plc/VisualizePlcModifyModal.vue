
<!--
 * @name: 维护PLC机架信息
 * @description: Do not edit
-->
<template>
  <Modal :title="t('维护机架信息')" v-model:open="dialogVisible" destroy-on-close :width="1128" :closable="false"
    :mask-closable="false">
    <Form :model="dataForm" :rules="rules" layout="inline" ref="formRef">
      <FormItem name="num" :label="t('新增机架的槽数为')">
        <InputNumber v-model:value="dataForm.num" :min="1" :max="32" :precision="0" :controls="false"></InputNumber>
      </FormItem>
      <FormItem>
        <Button @click="handleCreate">{{ t('新增') }}</Button>
      </FormItem>
    </Form>
    <Alert class="mt-4" type="info" :message="t('填写时请确保有模块的槽位信息完整！')" show-icon />
    <Table :data-source="dataList" :columns="columns" class="mt-2" :pagination="false" row-key="uuid"
      :scroll="{ y: 400 }">
      <template #bodyCell="{ index, column, record }">
        <template v-if="column.key === 'blockGuideName'">
          <Input v-model:value="record.blockGuideName" :placeholder="t('机架名称')" :maxLength="50" allow-clear
            @blur="handleBlockGuideNameBlur(index, record.blockGuideName)"></Input>
        </template>

        <template v-if="column.key === 'blockCount'">
          {{ record.moduleVOList.length }}
        </template>

        <template v-if="column.key === 'action'">
          <Button type="link" @click="moveUp(index)" :disabled="index === 0">{{ t('上移') }}</Button>
          <Button type="link" @click="moveDown(index)" :disabled="index === dataList.length - 1">{{ t('下移') }}</Button>
          <Button type="link" v-if="record.flag === 1" @click="handleEmptyModule(record)" danger>{{
            t('清空模块信息')
          }}</Button>
          <Button type="link" v-if="record.flag === 1" @click="handleDeleteGuide(record)" danger>{{
            t('删除机架')
          }}</Button>
          <Button type="link" v-if="record.flag === 0" @click="handleCreateBlock(record)">{{ t('添加槽') }}</Button>
        </template>
      </template>

      <!-- 展开行 -->
      <template #expandedRowRender="{ record: moduleRecord, index: moduleindex }">
        <Table :data-source="moduleRecord.moduleVOList" :columns="columnsExpand" :pagination="false" row-key="id">
          <template #bodyCell="{ index: blockIndex, column: blockColumn, record: block }">
            <template v-if="blockColumn.key === 'blockSlotNo'">
              <div v-if="block.flag === 0 || moduleRecord.flag === 1">{{ block.blockSlotNo }}</div>
              <InputNumber v-else-if="block.flag === 0" v-model:value="block.blockSlotNo" :min="0" :max="25" :step="1"
                @blur="handleBlockNoBlur(moduleindex, blockIndex, moduleRecord.moduleVOList, block)">
              </InputNumber>
            </template>
            <template v-if="blockColumn.key === 'blockType'">
              <div v-if="block.flag === 0">{{ block.blockType }}</div>
              <Input v-model:value="block.blockType" :placeholder="t('模块类型')" :maxLength="45" allow-clear></Input>
            </template>
            <template v-if="blockColumn.key === 'blockModel'">
              <div v-if="block.flag === 0">{{ block.blockModel }}</div>
              <Input v-model:value="block.blockModel" :placeholder="t('模块型号')" :maxLength="255" allow-clear></Input>
            </template>
            <template v-if="blockColumn.key === 'blockVersion'">
              <div v-if="block.flag === 0">{{ block.blockVersion }}</div>
              <Input v-model:value="block.blockVersion" :placeholder="t('模块版本')" :maxLength="45" allow-clear></Input>
            </template>

            <template v-if="blockColumn.key === 'action'">
              <Button type="link" v-if="block.flag === 1" @click="handleEmptyBlock(block)" danger>{{ t('清空') }}</Button>
              <Button type="link" v-if="moduleRecord.flag === 0" @click="handleDeleteBlock(moduleindex, blockIndex)"
                danger>{{ t('删除') }}</Button>
            </template>
          </template>
        </Table>
      </template>
    </Table>
    <template #footer>
      <div class="flex justify-between mt-6">
        <Button @click="onCancel">{{ t('关闭') }}</Button>
        <div>
          <Button @click="handleSubmit(false)">{{ t('保存') }}</Button>
          <Button type="primary" @click="handleSubmit(true)">{{ t('应用') }}</Button>
        </div>
      </div>
    </template>
  </Modal>
</template>
<script setup lang="ts">
/* 类型文件 */
import type { PropType } from 'vue';
import type { FormInstance } from 'ant-design-vue'
import type { ColumnProps } from "ant-design-vue/es/table";
import type { Rule } from "ant-design-vue/es/form";
/* 第三方模块 */
import { ref, watch } from 'vue'
import {
  Modal, Form, FormItem, Button, InputNumber, Input, Table, message, Alert
} from 'ant-design-vue'
import { useVModel, cloneDeep, uuid } from '@guolisec/utils'
/* 本地模块 */
import { ModuleVOItem, ModulePlcVisualize } from '../../types/plc'
import { savePlcModuleApi } from '../../model/plc'
import { useAssetInfoStore } from '@/entry/store';
import { t as i18nTranslate } from "@/entry/languages";
import { t } from "@/entry/languages/useLanguage";

/********************** 处理外部状态或配置 **********************/

// 父组件传值
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  current: {
    type: Array as PropType<ModulePlcVisualize[]>,
    default: () => {
      return []
    }
  },
});

const { asset } = useAssetInfoStore()

/********************** 初始化状态 **********************/

const emit = defineEmits(['update:visible', 'refresh']);
const dialogVisible = useVModel(props, 'visible', emit)

watch(
  () => props.visible,
  async (val) => {
    if (val) {
      formRef.value?.resetFields()
      dataList.value = cloneDeep(props.current)
    }
  },
)

/********************** 表单 **********************/

let dataForm = ref({
  num: 1,
});

const formRef = ref<FormInstance>()

const rules = ref<Record<string, Rule[]>>({
  num: [
    {
      required: true,
      validator: (_rule, value) => {
        if (!value) {
          return Promise.reject(t("输入槽数"));
        }
        if (/[0-9]/.test(value)) {
          return Promise.resolve();
        } else {
          return Promise.reject(t("输入整数数字"));
        }
      },
      trigger: "change",
    },
  ]
})

/**
 * 添加机架
 */
async function handleCreate() {
  if (dataList.value.length > 50) {
    message.warning(i18nTranslate('机架数不能超过 50 个'))
    return
  }
  await formRef.value?.validate()
  let maxBlockGuideNo = 0;
  let moduleVOList: ModuleVOItem[] = [];
  if (dataList.value.length > 0) {
    // 获得最大的机架号
    dataList.value.forEach((module) => {
      if (maxBlockGuideNo < module.blockGuideNo) {
        maxBlockGuideNo = module.blockGuideNo;
      }
    })
  }
  for (let i = 0; i < dataForm.value.num; i++) {
    moduleVOList.push({
      blockType: "",
      blockModel: "",
      blockVersion: "",
      blockRunStatus: 0,
      blockSlotNo: i,
      flag: 1
    })
  }
  dataList.value.push({
    blockGuideName: '',
    blockGuideNo: maxBlockGuideNo + 1,
    moduleVOList: moduleVOList,
    flag: 1, // 0-后台扫描出的机架  1-手动添加的机架
    uuid: uuid()
  })
}

/********************** 表格 **********************/

// 模块列表
let dataList = ref<ModulePlcVisualize[]>([]);

const columns = ref<ColumnProps<ModulePlcVisualize>[]>([
  {
    title: t("机架名称"),
    dataIndex: "blockGuideName",
    key: "blockGuideName",
    align: "center",
    ellipsis: true,
  },
  {
    title: t("槽数"),
    dataIndex: "blockCount",
    key: "blockCount",
    align: "center",
    ellipsis: true,
  },
  {
    title: t("操作"),
    dataIndex: "action",
    key: "action",
    align: "center",
    ellipsis: true,
    width: 500
  },
]);

/**
 * 校验机架名称是否重复
 * @param moduleIndex 
 * @param blockGuideName 
 */
function handleBlockGuideNameBlur(moduleIndex: number, blockGuideName: string) {
  for (let i = 0; i < dataList.value.length; i++) {
    if (dataList.value[i].blockGuideName === blockGuideName && moduleIndex !== i) {
      message.warning(i18nTranslate('已存在该机架名称'));
      dataList.value[moduleIndex].blockGuideName = '';
      return;
    }
  }
}

// 上移
function moveUp(index) {
  dataList.value.splice(index - 1, 1, ...dataList.value.splice(index, 1, dataList.value[index - 1]))
}
// 下移
function moveDown(index) {
  dataList.value.splice(index, 1, ...dataList.value.splice(index + 1, 1, dataList.value[index]))
}

function handleEmptyModule(record) {
  record.moduleVOList.forEach(element => {
    element.blockModel = "";
    element.blockType = "";
    element.blockRunStatus = "";
    element.blockVersion = "";
  });
}

function handleDeleteGuide(record) {
  let index = 0;
  for (let i = 0; i < dataList.value.length; i++) {
    if (dataList.value[i].blockGuideNo === record.blockGuideNo) {
      index = i;
      break;
    }
  }
  dataList.value.splice(index, 1);
}

function handleCreateBlock(record) {
  let blockSlotNo = record.moduleVOList[record.moduleVOList.length - 1].blockSlotNo + 1;
  record.moduleVOList.push({
    deviceIp: record.deviceIp,
    deviceMac: record.deviceMac,
    blockType: "",
    blockModel: "",
    blockVersion: "",
    blockRunStatus: 0,
    blockSlotNo: blockSlotNo,
    flag: 1, // 0-后台扫描出的槽  1-手动添加的槽
  })

}

/********************** 展开表格 **********************/

const columnsExpand = ref<ColumnProps<ModuleVOItem>[]>([
  {
    title: t("槽号"),
    dataIndex: "blockSlotNo",
    key: "blockSlotNo",
    align: "center",
    ellipsis: true,
  },
  {
    title: t("模块类型"),
    dataIndex: "blockType",
    key: "blockType",
    align: "center",
    ellipsis: true,
  },
  {
    title: t("模块型号"),
    dataIndex: "blockModel",
    key: "blockModel",
    align: "center",
    ellipsis: true,
  },
  {
    title: t("模块版本"),
    dataIndex: "blockVersion",
    key: "blockVersion",
    align: "center",
    ellipsis: true,
  },
  {
    title: t("操作"),
    dataIndex: "action",
    key: "action",
    align: "center",
    ellipsis: true,
    width: 200
  },
]);

function handleEmptyBlock(block) {
  block.blockModel = "";
  block.blockType = "";
  block.blockRunStatus = "";
  block.blockVersion = "";
}

function handleDeleteBlock(moduleIndex, blockIndex) {
  dataList.value[moduleIndex].moduleVOList.splice(blockIndex, 1)
}

function handleBlockNoBlur(moduleIndex, blockIndex, moduleVOList, block) {
  let beforeIndex = 0;
  let blockSlotNo = block.blockSlotNo;
  for (let i = 0; i < moduleVOList.length; i++) {
    if (moduleVOList[i].blockSlotNo === blockSlotNo && blockIndex !== i) {
      if (moduleVOList[i].repeat === 1) {
        message.warning(i18nTranslate('该槽位是CPU模块，已在其他机架上展示'));
      } else {
        message.warning(i18nTranslate('已存在该槽号'));
      }

      dataList.value[moduleIndex].moduleVOList[blockIndex].blockSlotNo = undefined;
      return;
    }
    if (moduleVOList[i].blockSlotNo < blockSlotNo) {
      beforeIndex++;
    }
  }
  let tempModuleVOList = JSON.parse(JSON.stringify(dataList.value[moduleIndex].moduleVOList));
  let temp = tempModuleVOList[blockIndex];
  tempModuleVOList[blockIndex] = moduleVOList[beforeIndex];
  tempModuleVOList[beforeIndex] = temp;
  dataList.value[moduleIndex].moduleVOList = tempModuleVOList;
}

/********************** 弹窗结束 **********************/

function closeModal() {
  dialogVisible.value = false
  emit('refresh');
}

// 保存
async function handleSubmit(close) {
  const lcmGroupList: ModuleVOItem[] = []
  let saveData = {
    deviceIp: asset.assetIp,
    deviceMac: asset.assetMac,
  };
  let moduleList = cloneDeep(dataList.value);
  let validFlag = true;
  for (let i = 0; i < moduleList.length; i++) {
    let moduleVOList = moduleList[i].moduleVOList;
    if (!moduleList[i].blockGuideName) {
      message.warning(i18nTranslate('机架名称不能为空'));
      validFlag = false;
      return;
    }

    for (let j = 0; j < moduleVOList.length; j++) {
      const item = moduleVOList[j]
      // 如果是后台扫描出的机架，且机架槽为手动添加的，槽内的信息必须填写完整
      if (moduleList[i].flag === 0 && item.flag === 1) {
        if (!item.blockModel || !item.blockType || !item.blockVersion || !item.blockSlotNo) {
          message.warning(`${i18nTranslate('请完整填写 {} 的 {} 号槽的模块信息！', moduleList[i].blockGuideName, item.blockSlotNo)} `);
          validFlag = false;
          return;
        }
      } else {
        // 如果填写了槽内模块类型、模块型号、模块版本任一信息，要求完整填写该槽内所有信息
        if ((item.blockModel || item.blockType || item.blockVersion) && !(item.blockModel && item.blockType && item.blockVersion)) {
          message.warning(`${i18nTranslate('请完整填写 {} 的 {} 号槽的模块信息！', moduleList[i].blockGuideName, item.blockSlotNo)} `);
          validFlag = false;
          return;
        }
      }
      if (!item.deviceIp) {
        item.deviceIp = asset.assetIp;
      }
      if (!item.deviceMac) {
        item.deviceMac = asset.assetMac;
      }
      item.blockGuideName = moduleList[i].blockGuideName;
      item.blockGuideNo = moduleList[i].blockGuideNo;
      item.guideNoNum = i;
    }
    lcmGroupList.push(...moduleVOList)
  }

  if (validFlag) {
    savePlcModuleApi({
      ...saveData,
      lcmGroupList
    }).then(() => {
      if (close) {
        message.success(i18nTranslate('应用成功'));
        closeModal();
      } else {
        message.success(i18nTranslate('保存成功'));
      }
    })
  }
}

function onCancel() {
  dialogVisible.value = false
  emit('refresh');
}
</script>