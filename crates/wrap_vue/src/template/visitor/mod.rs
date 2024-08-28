mod delimiters;

use oxc_span::SourceType;
use swc_atoms::Atom;
use swc_html_ast::{Attribute, Element, Text};
use swc_html_visit::{VisitMut, VisitMutWith};
use wrap_core::contains_chinese;
use wrap_script::script::wrap_expression;

pub struct FunctionWrapper<'a> {
    input: &'a str,
}

impl<'a> FunctionWrapper<'a> {
    pub fn new(input: &'a str) -> Self {
        FunctionWrapper { input }
    }
}

impl<'a> VisitMut for FunctionWrapper<'a> {
    // html 语言规范不允许大写字母的元素，因此需要将由大写字母的元素名转换为小写字母的转换回去
    fn visit_mut_element(&mut self, node: &mut swc_html_ast::Element) {
        let raw_idx_start = node.span.lo.0 as usize;
        let raw_idx_end = raw_idx_start + node.tag_name.len();
        let raw_name = &self.input[raw_idx_start..raw_idx_end];
        node.tag_name = Atom::new(format!("{}", raw_name));
        <Element as VisitMutWith<Self>>::visit_mut_children_with(node, self)
    }
    fn visit_mut_text(&mut self, n: &mut Text) {
        let value = n.data.to_string();
        let text_nodes = delimiters::process_template_text(&value);
        let wrapped_text_nodes: Vec<String> = text_nodes
            .iter()
            .map(|node| {
                if node.starts_with("{{") && node.ends_with("}}") {
                    let extract_content = &node[2..node.len() - 2];
                    let source_text = extract_content.to_string();
                    let mut content = wrap_expression(&source_text, SourceType::default());
                    if content.ends_with(";\n") {
                        content = content.replace(";\n", "")
                    }
                    let new_content = format!(r#"{{{{ {} }}}}"#, content);
                    new_content
                } else {
                    if contains_chinese(node) {
                        let new_value = format!(
                            r#"{{{{ t("{}") }}}}"#,
                            node.replace("\n", "").replace(" ", "")
                        );
                        new_value
                    } else {
                        node.to_string()
                    }
                }
            })
            .collect();
        let result = wrapped_text_nodes.join("");
        n.data = Atom::new(result);
    }

    fn visit_mut_attribute(&mut self, n: &mut Attribute) {
        // println!("visit_mut_attribute {:?}", n);
        if let Some(value) = &n.value {
            let name = n.name.to_string();
            let value = value.to_string();
            // vue 表达式属性
            if n.name.starts_with(':') {
                if contains_chinese(&value) {
                    let mut content = wrap_expression(&value, SourceType::default());
                    if content.ends_with(";\n") {
                        content = content.replace(";\n", "")
                    }

                    n.value = Some(content.into());
                }
            }
            // vue 事件
            else if n.name.starts_with('@') {
            }
            // vue 插槽
            else if n.name.starts_with('#') {
            }
            // vue 指令
            else if n.name.starts_with("v-") {
                // v-text、v-html、v-show、v-if、v-else-if、v-bind存在国际化处理
                if name == "v-text"
                    || name == "v-html"
                    || name == "v-show"
                    || name == "v-if"
                    || name == "v-else-if"
                    || name == "v-bind"
                {
                    if contains_chinese(&value) {
                        let mut content = wrap_expression(&value, SourceType::default());
                        if content.ends_with(";\n") {
                            content = content.replace(";\n", "")
                        }

                        n.value = Some(content.into());
                    }
                }
            }
            // 普通属性
            else {
                if contains_chinese(&value) {
                    let new_name = format!(":{}", name);
                    let new_value = format!(r#"t('{}')"#, value);
                    n.value = Some(new_value.into());
                    n.name = new_name.into()
                }
            }
        }
    }
}

// 判断text_nodes字符串开头是不是{{且结尾是}}
// fn is_plain_text(text_nodes: &Vec<String>) -> bool {
//     text_nodes.len() == 1 && !text_nodes[0].starts_with("{{") && !text_nodes[0].ends_with("}}")
// }

// fn extract_bracket_content(text: &str) {
//     if text.starts_with("{{") && text.ends_with("}}") {
//         let content = &text[2..text.len() - 2];
//     }
// }
