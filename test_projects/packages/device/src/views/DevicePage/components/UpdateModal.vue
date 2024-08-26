<template>
  <div>
    <Modal :open="open" :ok-text="'确认升级'" @ok="uploadFile" @cancel="parentEmits('update:open', false)"
      :ok-button-props="{ disabled: btnDisable, loading: btnisLoading }">
      <Upload :file-list="state.fileList" accept=".bin" :before-upload="beforeUpload" :remove="handleRemove"
        :disabled="state.uploading">
        <Button :loading="isLoading">
          <UploadOutlined />选择软件升级文件
        </Button>
      </Upload>
      <Progress v-show="state.progressShow" :percent="state.percentage" :stroke-width="5" />
    </Modal>
    <Teleport to="html">
      <div class="full-scream-loading" v-if="isLoading">
        <Spin size="large" tip="正在进行，请勿关闭"></Spin>
      </div>
    </Teleport>
  </div>
</template>

<script lang='ts' setup>
import { reactive, ref } from 'vue';
import { UploadOutlined } from "@ant-design/icons-vue"
import { Button, Modal, Upload, Progress, notification, message, Spin } from 'ant-design-vue'
import { uploadDeployApi } from '../../../model/device';

const parentProp = defineProps<{ open: boolean, record: any }>()
const parentEmits = defineEmits(['update:open', 'query'])

const state = reactive<any>({
  record: parentProp.record,
  fileList: [],
  uploading: false, // 上传状态
  progressShow: false, // 进度条展示
  percentage: 0, // 进度条百分比
});

const beforeUpload = (file) => {
  let extension = file.name.substring(file.name.lastIndexOf('.') + 1);
  if (extension.toLowerCase() !== 'bin') {
    notification.warning({
      message: '警告',
      description: '只能上传bin文件',
    });
  } else {
    state.fileList = [file];
  }
  btnDisable.value = false;
  return false;
};

// 升级请求是否完成
const done = ref(true);

const isLoading = ref(false)
const btnisLoading = ref(false)
const btnDisable = ref(true)

// 加载进度条
const initProgressInterval = () => {
  state.progressShow = true;
  state.uploading = true;
  state.percentage = 0;
  state.progressTimer = setInterval(() => {
    if (state.percentage === 100) {
      return;
    } else {
      state.percentage += 1;
    }
  }, 50);
};

// 关闭进度条
const clearProgressInterval = () => {
  clearInterval(state.progressTimer);
  state.progressShow = false;
  state.uploading = false;
};
// 文件上传
const uploadFile = () => {
  btnisLoading.value = true;
  done.value = false;
  isLoading.value = true;
  initProgressInterval();
  let data = new FormData();
  data.append('multipartFile', state.fileList[0]);
  message.success('正在升级，请耐心等待……');
  uploadDeployApi({ snList: parentProp.record.sn }, data)
    .then(() => {
      state.fileList = [];
      parentEmits('query')
      parentEmits('update:open', false)
    })
    .finally(() => {
      isLoading.value = false;
      clearProgressInterval();
      done.value = true;
      btnisLoading.value = false;
    });
};

const handleRemove = (file) => {
  const index = state.fileList.indexOf(file);
  const newFileList = state.fileList.slice();
  newFileList.splice(index, 1);
  state.fileList = newFileList;
};
</script>

<style scoped>
.full-scream-loading {
  background: rgba(43, 82, 190, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99999;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
}
</style>