/*
 * @name: Do not edit
 * @description: Do not edit
 */

/* 类型文件 */
import type { PropType } from 'vue';
import type { Menu as MenuType } from '@guolisec/types';
import type { MenuInfo } from 'ant-design-vue/lib/menu/src/interface';
/* 第三方模块 */
import { defineComponent, ref, watch } from 'vue';
import { Menu, Button } from 'ant-design-vue';
import { useRouter } from '@guolisec/routerable';
/* 共享模块 */

/* 业务模块 */
import SubMenuItem from './SubMenuItem.vue';
import './index.css';

export default defineComponent({
  name: 'InlineMenu',
  components: {
    SubMenuItem,
    Menu,
  },
  props: {
    items: {
      type: Array as PropType<MenuType>,
      default: () => [],
    },
    showCollapseToggle: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['menuClick'],
  setup(props, { emit }) {
    function handleMenuClick({ key }: MenuInfo) {
      emit('menuClick', key);
    }

    const selectedKeys = ref<string[]>([]);
    const router = useRouter();

    if (router) {
      // 保证刷新页面等菜单选中状态正常
      selectedKeys.value = [router.currentRoute.value.path];
      watch(router.currentRoute, (currentRoute) => {
        if (!selectedKeys.value.includes(currentRoute.path)) {
          selectedKeys.value = [currentRoute.path];
        }
      });
    }
    const collapsed = ref(false);

    function toggleCollapsed() {
      collapsed.value = !collapsed.value;
    }

    // 菜单折叠按钮
    const ToggleButton = (
      <div class="w-full absolute bottom-0">
        <Button class="w-full" type="text" onClick={toggleCollapsed}>
          {collapsed.value ? (
            <i class="i-base-menu-unfold-line"></i>
          ) : (
            <i class="i-base-menu-fold-line"></i>
          )}
        </Button>
      </div>
    );

    function updateSelectedKeys(value) {
      selectedKeys.value = value;
    }

    return () => (
      // todo 包了一层 不够优雅
      <div
        class={[
          collapsed.value ? '' : 'w-64',
          'inline-menu',
          'h-full',
          'overflow-auto',
        ]}
      >
        <Menu
          class={['relative', 'pb-10', 'min-h-full']}
          onUpdate:selectedKeys={updateSelectedKeys}
          selectedKeys={selectedKeys.value}
          mode="inline"
          inlineCollapsed={collapsed.value}
          onClick={handleMenuClick}
          subMenuOpenDelay={0.2}
        >
          {props.items.map((item) => (
            <SubMenuItem item={item} key={item.path} />
          ))}
          {props.showCollapseToggle ? ToggleButton : null}
        </Menu>
      </div>
    );
  },
});
