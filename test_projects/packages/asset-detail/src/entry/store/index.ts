import type { Ref } from 'vue';
import { useStore } from '@guolisec/storable';
import { ref } from 'vue';
import { defineStore } from 'pinia';
import { IAsset } from '@guolisec/types';
import { Asset } from '../../shared/types/class';
import { getAssetDetailApi } from '../../domains/asset/model';

interface State {
  // 要展示详情的主资产
  asset: Ref<IAsset>;
  // 关联资产
  relationAsset: Ref<IAsset>;
  // 首次查看的时间范围
  queryTime: Ref<[string, string]>;
  getAssetDetail(assetId: any): Promise<void>;
  getRelationAssetDetail(assetId: any): Promise<void>;
  setTime(paramTime: any): void;

  /********************** UI逻辑 **********************/
  tabKey: Ref<string>;
  setTabKey(tabKey: string): void;
}

const useAssetInfoStore = defineStore<string, State>(
  'asset::detail::info',
  () => {
    /********************** 主资产逻辑 **********************/

    const asset = ref<IAsset>(new Asset());
    // 获取主资产数据
    async function getAssetDetail(assetId) {
      if (!!assetId) {
        const mainAsset = await getAssetDetailApi({
          id: assetId,
        });
        Object.assign(asset.value, mainAsset);
      } else {
        console.warn('获取不到资产id');
      }
    }

    /********************** 关联资产逻辑 **********************/

    const relationAsset = ref<IAsset>(new Asset());
    // 获取主资产数据
    async function getRelationAssetDetail(assetId) {
      if (!!assetId) {
        const data = await getAssetDetailApi({
          id: assetId,
        });
        Object.assign(relationAsset.value, data);
      } else {
        console.warn('获取不到关联资产id');
      }
    }

    /********************** 时间处理逻辑 **********************/

    const queryTime = ref<[string, string]>(['', '']);
    function setTime(time) {
      queryTime.value = time;
    }

    /********************** UI逻辑 **********************/

    const tabKey = ref<string>('overview');
    function setTabKey(key: string) {
      tabKey.value = key;
    }

    return {
      asset,
      relationAsset,
      queryTime,
      getAssetDetail,
      getRelationAssetDetail,
      setTime,
      tabKey,
      setTabKey,
    };
  }
);

// Need to be used outside the setup
function useAssetInfoStoreWithOut() {
  const store = useStore();
  return useAssetInfoStore(store);
}

export { useAssetInfoStore, useAssetInfoStoreWithOut };
