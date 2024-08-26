<!--
 * @name: Do not edit
 * @description: Do not edit
-->
<script lang="ts">
import { useMonitor } from '../../../../controller/usePermission';
/* 类型文件 */
import type { PropType } from 'vue';

/* 第三方模块 */
import { defineComponent, h } from 'vue';

/* 本地共享模块 */

/* 业务模块 */
import { DesignMap } from './otherLayouts'

type DesignName = keyof typeof DesignMap

export default defineComponent({
  name: 'OnePiece',
  props: {
    designName: {
      type: String as PropType<DesignName>,
      require: true,
      default: 'BigSur'
    }
  },
  setup(props, { slots }) {
    // 用户行为监测
    useMonitor();
    return () => h(DesignMap[props.designName], null, slots);
  },
});
</script>
