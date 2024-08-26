<!--
 * @Name: 顶部水平菜单
 * @Description: Do not edit
-->
<template>
    <div :class="prefixClass(prefix, 'menu')" :style="primaryMenuStyle">
        <template v-for="item in items" :key="item.path">
            <SubMenuItem :item="item" :class="prefixClass(prefix, 'primary-menu')" placement="bottom-start" instance-move
                @menu-click="handleClick" />
        </template>
    </div>
</template>
<script lang="ts">


/* 类型文件 */
import type { PropType } from 'vue'
import type { Menu } from '@guolisec/types'
/* 第三方模块 */
import { defineComponent, computed } from 'vue'
/* 共享模块 */

/* 业务模块 */
import SubMenuItem from './SubMenuItem.vue'
import { prefixClass } from './helper'


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
            default: 'vc',
        },
        primaryBgColor: {
            type: String,
            default: '',
        },
        primaryFontColor: {
            type: String,
            default: '',
        }
    },
    setup(props, { emit }) {
        const primaryMenuStyle = computed(() => {
            return {
                color: props.primaryFontColor,
                backgroundColor: props.primaryBgColor
            }
        })

        function handleClick(item) {
            emit('menu-click', item)
        }

        return {
            prefixClass,
            primaryMenuStyle,
            handleClick
        }
    }
})
</script>

<style>
.vc-menu {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--bg, #fff);
    color: var(--font, rgba(0, 0, 0, 0.88));
    line-height: 40px;
    font-size: 16px;
    /* 位置 */

    /* 盒子 */

    /* 修饰 */

    /* 文字 */

    /* 其他 */

}

.vc-sub-menu.vc-primary-menu:hover {
    background-color: transparent;
}

.vc-sub-menu {
    padding-inline: 16px;
    height: 40px;
    line-height: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-radius: 4px;
    margin-inline: 4px;
    margin-block: 4px;
}

.vc-sub-menu:hover {
    background-color: rgba(0, 0, 0, .06);
}

.v-popper--theme-dropdown .v-popper__inner {
    border: 0px solid #ddd;
}

.vc-menu-content {
    display: flex;
    align-items: center;
    justify-content: flex-start;
}

.vc-menu-icon {
    margin-right: 4px;
}
</style>
