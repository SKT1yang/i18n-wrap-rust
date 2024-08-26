/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2024-01-24 16:43:19
 * @path: \feature-vue\platform\front\topology\src\domains\topology\views\list\topology.data.tsx
 */
import type { ColumnProps } from 'ant-design-vue/es/table';
import type { TopologyListItem } from '../../types';
import { isArray, formatToDateTime } from '@guolisec/utils';
import { Tag } from 'ant-design-vue';

function getColumns(): ColumnProps<TopologyListItem>[] {
  return [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      ellipsis: true,
      width: 80,
    },
    {
      title: '拓扑图名称',
      dataIndex: 'topoName',
      key: 'topoName',
      ellipsis: true,
      width: 240,
      customRender({ record }) {
        return (
          <div>
            {record.topoName}
            {record.mainTopo ? (
              <Tag color={'blue'} class="ml-4">
                基线
              </Tag>
            ) : null}
          </div>
        );
      },
    },
    {
      title: '拓扑图说明',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '包含资产组',
      dataIndex: 'assetGroup',
      key: 'assetGroup',
      width: 120,
      ellipsis: true,
      customRender({ text }) {
        return (
          <Tag>
            <span>{text}</span>
            <span> 个</span>
          </Tag>
        );
      },
    },
    {
      title: '创建人',
      dataIndex: 'createBy',
      key: 'createBy',
      ellipsis: true,
      width: 160,
      customRender({ text }) {
        return text || '-';
      },
    },
    {
      title: '更新人',
      dataIndex: 'updateBy',
      key: 'updateBy',
      ellipsis: true,
      width: 160,
      customRender({ text }) {
        return text || '-';
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      ellipsis: true,
      sorter: true,
      width: 200,
      defaultSortOrder: 'descend',
      customRender(opt) {
        return formatToDateTime(opt.record.updateTime);
      },
    },
    {
      title: '操作',
      width: 180,
      key: 'action',
    },
  ];
}

export { getColumns };
