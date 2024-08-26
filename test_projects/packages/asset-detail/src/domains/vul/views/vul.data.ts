import { computed } from 'vue'
import { ColumnProps } from "ant-design-vue/es/table";
import { formatToDateTime } from "@guolisec/utils";
import { t } from "@/entry/languages/useLanguage";

/**
 * 漏洞信息表格
 * todo
 */
const vulColumns = computed<ColumnProps<{
  pubDate: string;
}>[]>(() => {
  return [
    {
      title: t("序号"),
      width: 50,
      key: "index",
      align: "center",
    },
    {
      title: t("漏洞标题"),
      dataIndex: "title",
    },
    {
      title: t("发布时间"),
      dataIndex: "pubDate",
      customRender(opt) {
        return emptyRender(formatToDateTime(opt.record["pubDate"]));
      },
    },
    {
      title: t("详情"),
      dataIndex: "detail",
      ellipsis: true,
    },
    {
      title: t("解决方案"),
      dataIndex: "solution",
      ellipsis: true,
    },
    {
      title: t("补丁"),
      dataIndex: "patch",
      ellipsis: true,
    },
    {
      title: t("参考 URL"),
      dataIndex: "referenceUrl",
      ellipsis: true,
    },
    {
      title: t("CNNVD 类型"),
      dataIndex: "cnnvdType",
    },
    {
      title: t("CNNVD 威胁类型"),
      dataIndex: "cnnvdThreatType",
    },
    {
      title: t("CNVD 影响"),
      dataIndex: "cnvdImpact",
      ellipsis: true,
    },
  ]
})

function emptyRender(val) {
  return !val ? t("暂无") : val;
}

export {
  vulColumns
}
