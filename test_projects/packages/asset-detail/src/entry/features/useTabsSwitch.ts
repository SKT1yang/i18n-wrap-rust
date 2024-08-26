import { watchEffect, toRef } from 'vue';
import { useAssetInfoStore } from '../store'

/**
 * 
 * @returns 
 */
function useTabsSwitch(keys?: string[]) {
  const assetStore = useAssetInfoStore()

  function handleChange(key) {
    assetStore.setTabKey(key)
    history.replaceState({
      ...history.state,
      tab: key,
    }, '')
  }

  watchEffect(() => {
    const { tab } = history.state

    if (tab && tab !== assetStore.tabKey) {
      handleChange(tab)
      return
    }

    // 不在keys的范围之内，将state和store的key都改成配置的第一个key
    if (keys && keys?.length > 0) {
      handleChange(keys[0])
      return
    }

    handleChange('overview')
    return
  })

  return {
    activeKey: toRef(assetStore.tabKey),
    handleChange
  }
}

export {
  useTabsSwitch
}