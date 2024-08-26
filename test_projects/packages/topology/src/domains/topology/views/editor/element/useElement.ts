/* 类型文件 */
import type { Ref } from 'vue';
import type { IG6GraphEvent } from '@antv/g6';
import type { CommonElementTypeInfo } from '../../../types';
import { IAsset } from '@guolisec/types';
/* 第三方模块 */
import { Graph } from '@antv/g6';
import { ref, reactive, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { onMountedOrActivated } from '@guolisec/utils';
/* 本地模块 */
import { DRAGGABLE_ELEMENT_TYPE } from '../../..//types/enum.ts';
import { useTopologyStoreWithOut } from '../../../model/store';
import { getAllAssetApi } from '../../../model/editor';

/**
 * 设备元素
 */
function useElement(): {
  assetList: Ref<IAsset[]>;
  loading: Ref<boolean>;
  getDataList: () => Promise<void>;
  queryForm: Ref<{
    name: string;
    assetGroupIdsIn: number[];
    assetIdsNotIn: number[];
  }>;
  total: Ref<number>;
  currentPage: Ref<number>;
  pageSize: Ref<number>;
  handleChangePage(page: number): void;
  handleCheckedChange(checked: any): void;
  checked: Ref<boolean>;
} {
  const store = useTopologyStoreWithOut();
  const { topologyInfo } = store;
  const queryForm = ref<{
    name: string;
    // 过滤资产，返回只包含固定资产组的资产
    assetGroupIdsIn: number[];
    // 过滤资产,返回不包含ids的资产
    assetIdsNotIn: number[];
  }>({
    name: '',
    assetGroupIdsIn: topologyInfo.assetGroup.map((item) => item.id),
    assetIdsNotIn: [],
  });
  const assetList = ref<IAsset[]>([]);
  const total = ref<number>(0);
  const currentPage = ref(1);
  const pageSize = ref(24);
  const loading = ref(false);

  async function getDataList() {
    loading.value = true;
    try {
      const content = await getAllAssetApi({
        page: currentPage.value,
        size: pageSize.value,
        ...queryForm.value,
      });
      assetList.value = content.slice(
        (currentPage.value - 1) * pageSize.value,
        currentPage.value * pageSize.value
      );
      total.value = content.length;
    } finally {
      loading.value = false;
    }
  }

  // 页码改变
  function handleChangePage(page: number) {
    currentPage.value = page;
    getDataList();
  }

  function doSearch() {
    handleChangePage(1);
  }

  const checked = ref(false);
  // 仅展示未添加资产
  function handleCheckedChange() {
    if (checked.value) {
      const assetList = store.getAllAssetElementDataList();
      queryForm.value.assetIdsNotIn = assetList.map((data) => Number(data?.id));
      getDataList();
    } else {
      queryForm.value.assetIdsNotIn = [];
      getDataList();
    }
  }

  onMountedOrActivated(async () => {
    await getAssetGroupIds();
    getDataList();
  });

  async function getAssetGroupIds() {
    const store = useTopologyStoreWithOut();
    const topologyInfo = await store.refreshTopologyInfo();
    queryForm.value.assetGroupIdsIn = topologyInfo.assetGroup.map((i) => i.id);
  }

  return {
    assetList,
    getDataList,
    handleChangePage,
    queryForm,
    currentPage,
    pageSize,
    total,
    loading,
    checked,
    handleCheckedChange,
  };
}

// 通用元素
function useCommonElement() {
  const commonElementList = ref<CommonElementTypeInfo[]>([
    {
      id: '100001',
      label: '线条',
      elementType: DRAGGABLE_ELEMENT_TYPE.LINE,
    },
    {
      id: '100002',
      label: '矩形',
      elementType: DRAGGABLE_ELEMENT_TYPE.BOX,
    },
    {
      id: '100003',
      label: '文本',
      elementType: DRAGGABLE_ELEMENT_TYPE.TEXT,
    },
  ]);

  return {
    commonElementList,
  };
}

function useElementDragger<T>(
  createNodeCb: (graphic, e: IG6GraphEvent, data: T) => void
) {
  const elementDragger = reactive({
    dragstart: (current) => {
      console.log(current, 1);
    },
    dragend: (e: DragEvent) => {
      console.log(e, 2);
    },
  });
  const store = useTopologyStoreWithOut();
  const storeRefs = storeToRefs(store);
  if (!storeRefs.graphic.value) {
    return {
      elementDragger,
    };
  }

  // 拖拽元素只挂载一次事件
  let isFinishMountEvent = false;
  let stop: null | Function = null;
  stop = watch(
    () => storeRefs.graphic.value,
    (newVal) => {
      if (isFinishMountEvent && stop) {
        stop();
      }
      // 实例存在并且可拖拽组件开始渲染的时候挂载事件
      if (newVal instanceof Graph && !isFinishMountEvent) {
        isFinishMountEvent = true;
        handleGraphicReady();
        if (stop !== null) {
          stop();
        }
      }
    },
    {
      immediate: true,
    }
  );

  // 处理菜单拖拽进容器
  // todo 这里的g6实例有闭包
  function createElementDragger() {
    // 数据闭包
    let data = null as null | T;
    const containerHandler = {
      /**
       * 拖拽组件进入容器，设置鼠标可放置状态
       */
      dragenter: (e: IG6GraphEvent) => {
        const orignalEvent = e.originalEvent as DragEvent;
        orignalEvent.dataTransfer!.dropEffect = 'move';
      },

      dragover: (e: IG6GraphEvent) => {
        const orignalEvent = e.originalEvent as DragEvent;
        orignalEvent.preventDefault();
      },

      /**
       * 拖拽组件离开容器，设置鼠标禁用状态
       */
      dragleave: (e: IG6GraphEvent) => {
        const orignalEvent = e.originalEvent as DragEvent;
        orignalEvent.dataTransfer!.dropEffect = 'none';
      },

      /**
       * 在容器中放置组件
       */
      drop: (e: IG6GraphEvent) => {
        const graphic = storeRefs.graphic.value;
        if (graphic !== undefined) {
          createNodeCb(graphic, e, data as T);
        }
      },
    };

    return {
      dragstart: (current: T) => {
        storeRefs.graphic.value?.on(
          'canvas:dragenter',
          containerHandler.dragenter
        );
        storeRefs.graphic.value?.on(
          'canvas:mouseover',
          containerHandler.dragover,
          true
        );
        storeRefs.graphic.value?.on(
          'canvas:dragleave',
          containerHandler.dragleave,
          true
        );
        storeRefs.graphic.value?.on('canvas:drop', containerHandler.drop, true);
        storeRefs.graphic.value?.on('node:drop', containerHandler.drop, true);
        data = current;
      },

      dragend: () => {
        storeRefs.graphic.value?.off(
          'canvas:dragenter',
          containerHandler.dragenter
        );
        storeRefs.graphic.value?.off(
          'canvas:mouseover',
          containerHandler.dragover
        );
        storeRefs.graphic.value?.off(
          'canvas:dragleave',
          containerHandler.dragleave
        );
        storeRefs.graphic.value?.off('canvas:drop', containerHandler.drop);
        storeRefs.graphic.value?.off('node:drop', containerHandler.drop);
        data = null;
      },
    };
  }

  /**
   * G6实例绑定拖拽事件
   * @description G6实例不一定存在，保证实例存在后调用该方法
   */
  async function handleGraphicReady() {
    const blockHandler = createElementDragger();
    elementDragger.dragstart = blockHandler.dragstart;
    elementDragger.dragend = blockHandler.dragend;
  }

  return {
    elementDragger,
  };
}

export { useElement, useElementDragger, useCommonElement };
