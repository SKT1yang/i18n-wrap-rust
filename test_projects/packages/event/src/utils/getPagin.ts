import { t } from "..\\languages\\index";
import { computed, reactive } from "vue";
const getPagin = () => {
	const tableObj = reactive<{
		list: any[];
		current: number;
		pageSize: number;
		total: number;
		sort?: string;
	}>({
		list: [],
		current: 1,
		pageSize: 10,
		total: 0,
		sort: undefined
	});
	return {
		tableData: tableObj,
		pagin: computed(() => ({
			current: tableObj.current,
			showSizeChanger: true,
			defaultPageSize: tableObj.pageSize,
			total: tableObj.total > 10000 ? 10000 : tableObj.total,
			showQuickJumper: true,
			showTotal: () => tableObj.total > 10000 ? t("命中 {} 条, 展示10000条", tableObj.total) : t("共 {} 条", tableObj.total)
		}))
	};
};
export { getPagin };
