<!--
 * @name: 资产元素
 * @description: Do not edit
-->
<script lang="tsx" name="Element">
import type { PropType } from 'vue'
import { defineComponent } from 'vue';
import { useElementDragger } from './useElement'
import { Device } from '@guolisec/graph'
import { IAsset } from '@guolisec/types'
import { dragCreateAssetNode } from '../../../service/dragCreateNode';
import { useColorSchemeMode } from '@guolisec/utils'

export default defineComponent({
  name: 'AssetElement',
  props: {
    assetInfo: {
      type: Object as PropType<IAsset>,
      default: () => ({}),
    },
  },
  emits: ['refresh'],
  setup(props, { emit }) {
    const { elementDragger } = useElementDragger(dragCreateAssetNode);
    const { colorSchemeMode } = useColorSchemeMode()

    function handleDragEnd(e) {
      elementDragger.dragend(e)
      // 添加资产后自动刷新
      emit('refresh')
    }
    return () => {
      return (
        <div class="w-1/3 flex-col flex items-center justify-center"
          draggable
          onDragend={handleDragEnd}
          onDragstart={() => elementDragger.dragstart(props.assetInfo)}>
          <div class="flex-center rounded-full w-14 h-14 p-1 relative" data-code={props.assetInfo.assetTypeCode}>
            <Device assetTypeCode={props.assetInfo.assetTypeCode} color={colorSchemeMode.value === 'dark' ? '#ffffff' : '#000000'} class="text-5xl"></Device>
          </div>
          <div class="w-20 overflow-ellipsis truncate text-xs text-center mt-2 mb-4">{props.assetInfo.name}</div>
        </div >
      );
    };
  },
});
</script>