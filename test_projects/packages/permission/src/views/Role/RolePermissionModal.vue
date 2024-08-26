
<!--
 * @name: 角色权限配置弹窗
 * @description: Do not edit
-->
<template>
  <Modal :title="t('修改权限')" v-model:open="dialogVisible" :width="500" @close="closeModal">
    <Tree @check="handleCheck" v-if="permissionTree && permissionTree.length" checkable checkStrictly
      :treeData="permissionTree" v-model:checkedKeys="roleAuthList"
      :fieldNames="{ key: 'id', title: 'title', children: 'children' }" />
    <template #footer>
      <div>
        <Button @click="closeModal">{{ t('取消') }}</Button>
        <Button type="primary" @click="handleSubmit">{{ t('确定') }}</Button>
      </div>
    </template>
  </Modal>
</template>
<script setup name="CreateUserModal" lang="ts">
/* 类型文件 */
import type { TreeProps } from 'ant-design-vue';
import type { Key } from 'ant-design-vue/es/vc-tree/interface';
import type { PermissionItem } from '@guolisec/types';
/* 第三方模块 */
import { ref, watch, nextTick } from 'vue'
import { message } from '@guolisec/toast'
import { Modal, Tree, Button } from 'ant-design-vue'
import { useVModel, isArray, cloneDeep } from '@guolisec/utils'
/* 共享模块 */
import { usePermissionStoreWithOut } from '../../model/store'
import { t } from '@/languages/useLanguage'
/* 业务模块 */
import { treeDataTranslate } from '../../utils'
import { getPermissionByRole, setRolePermission, getPermissionList } from '../../service/role'

// 父组件传值
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  current: {
    type: Object,
    default: () => {
      return {}
    }
  }
});

const emit = defineEmits(['update:visible', 'refresh']);
const dialogVisible = useVModel(props, 'visible', emit)
const permissionStore = usePermissionStoreWithOut()
const systemId = permissionStore.getSystemInfo?.id

// 权限树状列表
let permissionTree = ref<TreeProps['treeData']>([]);
let permissionList = ref<
  PermissionItem[]
>([]);

type checkedKeys = { checked: Key[]; halfChecked: Key[]; }
// 某个角色权限
let roleAuthList = ref<checkedKeys>({
  checked: [],
  halfChecked: [],
});



watch(
  dialogVisible,
  async (val) => {
    if (val) {
      await nextTick()
      permissionTree.value = []
      roleAuthList.value = {
        checked: [],
        halfChecked: [],
      }
      getPermissionTree()
    }
  },
)

let homePageId = ref()
async function getPermissionTree() {
  permissionTree.value = []
  if (systemId) {
    const list = await getPermissionList({
      id: systemId
    })
    permissionList.value = cloneDeep(list);
    homePageId.value = findSystemHomePageId(list)
    let result = treeDataTranslate(list, 0)
    if (result) {
      permissionTree.value = result as unknown as TreeProps['treeData']
    }
    await getRolePermission()
  }

}

// 获取首页权限id
function findSystemHomePageId(permissionList: PermissionItem[]) {
  let homePageUrl = ''
  // 首页必须已 '/xxxx' 格式
  let splitTemp = (permissionStore.systemInfo?.homePageUrl || '/home').split('/')
  if (splitTemp[0] === '' && splitTemp.length === 2) {
    homePageUrl = splitTemp[1]
  }
  // url匹配优先
  let targetPermission = permissionList.find((permission) => {
    return permission.path.replace(/\//g, '') === homePageUrl
  })
  // url未匹配上，使用name匹配
  if (!targetPermission) {
    targetPermission = permissionList.find((permission) => {
      return permission.name.toLowerCase() === 'home'
    })
  }

  if (targetPermission) {
    targetPermission.title = `${targetPermission.title}(必选)`
    return targetPermission.id
  } else {
    return undefined
  }
}

async function getRolePermission() {
  const response = await getPermissionByRole({
    id: props.current.id
  })
  const idList = Object.keys(response).map(i => Number(i))
  roleAuthList.value.checked.push(...idList);
}

/**
 * 用户选中或者撤销
 * @param checkedKeys
 * @param info
 */
const handleCheck = (checkedKeys: checkedKeys, info) => {
  // 选中
  if (info.checked) {
    // 处理下级节点
    if (isArray(info.node.children)) {
      getUnSelectedChildIds(checkedKeys.checked, info.node.children);
    }
    // 处理同级节点
    // 处理上级节点 所有上级节点都选中
    handleSuperNodeChecked(checkedKeys, info.node.id);
  }
  if (!info.checked) {
    // 处理下级节点
    clearChildren(checkedKeys.checked, info.node.children);

    // 处理上级节点 所有上级节点都选中
    handleSuperNodeUnchecked(checkedKeys, info.node.id, permissionTree.value);
  }
};

function handleSuperNodeChecked(checkedKeys: checkedKeys, currentKey: number) {
  const currentTarget = permissionList.value.find((permission) => {
    return permission.id === currentKey;
  });

  const parentTarget = permissionList.value.find((permission) => {
    return currentTarget?.pid && currentTarget?.pid !== 0 && permission.id === currentTarget?.pid;
  });

  if (parentTarget !== undefined && !checkedKeys.checked.includes(parentTarget.id)) {
    checkedKeys.checked.push(parentTarget.id);
    handleSuperNodeChecked(checkedKeys, parentTarget.id);
  }
}

function handleSuperNodeUnchecked(checkedKeys: checkedKeys, id: number, tree: any) {
  if (tree) {
    for (let index = 0; index < tree.length; index++) {
      const node = tree[index];
      // 直接找到子节点，不对，直接退出
      if (node.id === id) {
        return;
      }
      if (node.children) {
        const ids: number[] = node.children.map((i) => i.id);
        const isClear = ids.every((i) => !checkedKeys.checked.includes(i));
        // 父节点只有一个目标子节点，取消选中该子节点时，同时取消选中该父节点
        if (ids.includes(id) && isClear && node.id) {
          const targetKeyIndex = checkedKeys.checked.findIndex((i) => i === node.id);
          if (targetKeyIndex !== -1) {
            checkedKeys.checked.splice(targetKeyIndex, 1);
          }
          const key = node.id as number;
          // 找到后，下一轮id查询
          handleSuperNodeUnchecked(checkedKeys, key, permissionTree.value);
          return;
        }
        // 没找到，继续这轮
        handleSuperNodeUnchecked(checkedKeys, id, node.children);
      }
    }
  }
}

const getUnSelectedChildIds = (checkedKeys: Key[], children: TreeProps['treeData']) => {
  if (isArray(children) && children.length > 0) {
    children.forEach((item) => {
      if (!checkedKeys.includes(item.id)) {
        checkedKeys.push(item.id);
      }
      getUnSelectedChildIds(checkedKeys, item.children);
    });
  }
};

const clearChildren = (checkedKeys: Key[], children: TreeProps['treeData']) => {
  if (isArray(children) && children.length > 0) {
    children.forEach((item) => {
      roleAuthList.value.checked = roleAuthList.value.checked.filter((key) => {
        return key !== item.id;
      });
      clearChildren(checkedKeys, item.children);
    });
  }
};

function closeModal() {
  dialogVisible.value = false
  emit('refresh');
}

// 保存
async function handleSubmit() {
  try {
    const checkedKeys = roleAuthList.value.checked as number[];
    let checkedPermissionList: {
      permissionId?: number;
      roleId: number;
    }[] = [];
    if (checkedKeys.length > 0) {
      checkedPermissionList = checkedKeys.map((key) => {
        return {
          permissionId: key,
          roleId: props.current.id,
        };
      });
    } else {
      checkedPermissionList = [
        {
          permissionId: undefined,
          roleId: props.current.id,
        },
      ];
    }
    const ids = checkedPermissionList.map(i => i.permissionId)
    if (homePageId && !ids.includes(homePageId.value)) {
      message.warning(t('必选页面（首页）未选择'))
      return
    }
    await setRolePermission(checkedPermissionList)
    message.success(t('修改成功'))
    closeModal()
  } catch {
    closeModal()
  }
}


</script>