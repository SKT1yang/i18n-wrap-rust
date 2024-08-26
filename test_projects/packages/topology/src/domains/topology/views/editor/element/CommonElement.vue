<!--
 * @name: 可拖拽通用元素
 * @description: Do not edit
 * @date: 2023-02-15 16:35:52
 * @path: \glsec\apps\rsmp\src\domain\topology\views\TopologyElement\CommonElement.vue
-->
<script lang="tsx" name="Element">
import type { PropType } from 'vue'
import { CommonElementTypeInfo } from '../../..//types/index'
import { defineComponent } from 'vue';
import { useElementDragger } from './useElement'
import { dragCreateCommonNode } from '../../..//service/dragCreateNode';

export default defineComponent({
  name: 'CommonTopologyElement',
  props: {
    elementInfo: {
      type: Object as PropType<CommonElementTypeInfo>,
      default: () => ({}),
    },
  },
  setup(props) {
    const { elementDragger } = useElementDragger(dragCreateCommonNode);
    return () => {
      let icon = <i class="i-base-slash-line text-5xl" />
      if (props.elementInfo.id === '100002') {
        icon = <i class="i-base-rect-line text-5xl" />
      }
      if (props.elementInfo.id === '100003') {
        icon = <i class="i-base-text text-5xl" />
      }
      return (
        <div class="w-1/3 flex-col flex-center"
          draggable
          onDragend={elementDragger.dragend}
          onDragstart={() => elementDragger.dragstart(props.elementInfo)}>
          <div class="flex-center rounded-full w-14 h-14 p-1">
            {icon}
          </div>
          <span class="text-xs mt-2 mb-4">{props.elementInfo.label}</span>
        </div >
      );
    };
  },
});
</script>