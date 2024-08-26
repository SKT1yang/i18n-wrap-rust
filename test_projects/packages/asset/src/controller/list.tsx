/*
 * @name: 资产清单
 * @description: Do not edit
 */
/* 类型文件 */
import type { ColumnProps } from 'ant-design-vue/es/table';
import type { IAsset } from '@guolisec/types';
import type { SortOrder } from 'ant-design-vue/es/table/interface';
/* 第三方模块 */
import { computed } from 'vue';
import { Tag } from 'ant-design-vue';
/* 共享模块 */
import { t } from '@/languages/useLanguage';
/* 业务模块 */

function getColumns(sorted: { field?: string; order?: SortOrder }) {
  return computed<ColumnProps<IAsset>[]>(() => {
    return [
      {
        title: t('序号'),
        fixed: 'left',
        dataIndex: 'index',
        key: 'index',
        ellipsis: true,
        width: 80,
      },
      {
        title: t('资产名称'),
        dataIndex: 'name',
        ellipsis: true,
        sorter: true,
        sortOrder:
          sorted.field === 'name' && sorted.order ? sorted.order : null,
        customRender({ record }) {
          return record?.name || '-';
        },
      },
      {
        title: t('IP 地址'),
        dataIndex: 'assetIp',
        ellipsis: true,
        width: 150,
        sorter: true,
        sortOrder:
          sorted.field === 'assetIp' && sorted.order ? sorted.order : null,
        customRender({ record }) {
          if (!record?.assetIp || record?.assetIp === '0.0.0.0') {
            return '-';
          }
          return record?.assetIp;
        },
      },
      {
        title: t('运行状态'),
        ellipsis: true,
        width: 100,
        sorter: true,
        dataIndex: 'runStatus',
        sortOrder:
          sorted.field === 'runStatus' && sorted.order ? sorted.order : null,
        customRender({ text }) {
          const statusInfo = getAssetStatusInfo(text);
          return statusInfo.text ? (
            <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
          ) : (
            '-'
          );
        },
      },
      {
        title: t('MAC 地址'),
        dataIndex: 'assetMac',
        ellipsis: true,
        width: 150,
        sorter: true,
        sortOrder:
          sorted.field === 'assetMac' && sorted.order ? sorted.order : null,
        customRender({ record }) {
          return record?.assetMac || '-';
        },
      },
      {
        title: t('资产类型'),
        dataIndex: 'assetTypeName',
        ellipsis: true,
        width: 150,
        sorter: true,
        sortOrder:
          sorted.field === 'assetTypeName' && sorted.order
            ? sorted.order
            : null,
        customRender({ record }) {
          return record?.assetTypeName ?? '-';
        },
      },
      {
        title: t('资产品牌'),
        dataIndex: 'trademarkName',
        ellipsis: true,
        width: 150,
        sorter: true,
        sortOrder:
          sorted.field === 'trademarkName' && sorted.order
            ? sorted.order
            : null,
        customRender({ record }) {
          return record?.trademarkName ?? '-';
        },
      },
      {
        title: t('资产系列'),
        dataIndex: 'assetSeriesName',
        ellipsis: true,
        width: 150,
        sorter: true,
        sortOrder:
          sorted.field === 'assetSeriesName' && sorted.order
            ? sorted.order
            : null,
        customRender({ record }) {
          return (
            <div
              title={record?.assetSeriesNameLong}
              class="ant-table-cell-ellipsis"
            >
              {record?.assetSeriesNameLong ?? '-'}
            </div>
          );
        },
      },
      {
        title: t('资产组'),
        dataIndex: 'assetGroup',
        ellipsis: true,
        width: 150,
        sorter: true,
        sortOrder:
          sorted.field === 'assetGroup' && sorted.order ? sorted.order : null,
        customRender({ record }) {
          return record?.assetGroup?.label ?? '-';
        },
      },
      {
        title: t('操作'),
        key: 'action',
        width: 320,
      },
    ];
  });
}

// 获取资产运行状态对象
function getAssetStatusInfo(status: number) {
  let color = '';
  let text = '';
  switch (status) {
    case 0:
      color = 'red';
      text = t('离线');
      break;
    case 1:
      color = 'green';
      text = t('在线');
      break;
    case 2:
      color = 'default';
      text = t('闲置');
      break;
  }
  return {
    color: color,
    text: text,
  };
}

export { getColumns };
