export interface BaseOptionType {
  disabled?: boolean;
  [name: string]: any;
}
export interface DefaultOptionType extends BaseOptionType {
  label?: any;
  value?: string | number | null;
  children?: Omit<DefaultOptionType, "children">[];
}
interface FieldNames {
  label: string;
  value: string;
  children: string;
  disabled: string;
}

/**
 * 选择器搜索过滤通用函数
 * @param inputValue 用户输入
 * @param option 选择项
 * @param fieldNames 自定义字段
 */
function filterOption(
  inputValue: string,
  option?: DefaultOptionType,
  fieldNames?: Partial<FieldNames>
) {
  const { label = "label" } = fieldNames || {};
  if (option) {
    return option[label].toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
  } else {
    return true;
  }
}

/**
 * 选择器搜索过滤通用函数
 * @param inputValue 用户输入
 * @param option 选择项
 * @param fieldNames 自定义字段
 */
function filterOptionMultiple(
  inputValue: string,
  option?: DefaultOptionType,
  fieldNames?: Partial<FieldNames>
) {
  const { label = "title" } = fieldNames || {};
  if (option) {
    return option[label].toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
  } else {
    return true;
  }
}

export { filterOption, filterOptionMultiple };
