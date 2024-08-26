<!--
 * @name: 垂直菜单
 * @description: Do not edit
-->

<template>
    <div class="w-64">
        <template v-for="item in items" :key="item.path">
            <SubMenuItem :item="item" instance-move />
        </template>
    </div>
</template>
<script lang="ts">


/* 类型文件 */
import type { PropType } from 'vue'
import type { Menu } from '@guolisec/types'
/* 第三方模块 */
import { defineComponent } from 'vue'
/* 共享模块 */

/* 业务模块 */
import SubMenuItem from './SubMenuItem.vue'


export default defineComponent({
    name: 'HorizontalMenu',
    components: {
        SubMenuItem,
    },
    props: {
        items: {
            type: Array as PropType<Menu>,
            default: () => [],
        },
        prefix: {
            type: String,
            default: 'vc-menu',
        }
    },
})
</script>
