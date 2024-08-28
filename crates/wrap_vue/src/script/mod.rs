use crate::SfcParser;
use oxc_span::SourceType;
use swc_atoms::Atom;
use swc_html_ast::{Child, Element, Text};
use wrap_core::{SfcScriptBlock, SfcScriptLang};
use wrap_script::script::wrap_script;

impl SfcParser<'_, '_> {
    /// Parses the `<script>` and `<script setup>`, both in EcmaScript and TypeScript
    pub fn parse_sfc_script_to_wrapped_string(
        &mut self,
        element: Element,
    ) -> Option<SfcScriptBlock> {
        let mut is_setup = false;

        let mut lang = SfcScriptLang::Es;
        for attr in element.attributes.iter() {
            match attr.name.as_str() {
                "setup" => {
                    is_setup = true;
                }
                "lang" => {
                    lang = match attr.value.as_ref().map(|v| v.as_str()) {
                        Some("js" | "javascript") => SfcScriptLang::Es,
                        None | Some("ts" | "typescript") => SfcScriptLang::Ts,
                        Some("jsx") => SfcScriptLang::Jsx,
                        Some("tsx") => SfcScriptLang::Tsx,
                        Some(_) => SfcScriptLang::Es,
                    }
                }
                _ => {}
            }
        }

        if &element.children.len() == &1 {
            match element.children.get(0) {
                Some(text_node) => {
                    match text_node {
                        Child::Text(text_element) => {
                            // 提取script 内容
                            let orignal_content = text_element.data.to_string();
                            //script 内容国际化包裹处理
                            let mut wrapped_script_content =
                                wrap_script(&orignal_content, self.get_source_type(&lang), self.language_source);
                            wrapped_script_content.insert_str(0, "\n");
                            // 复制一个script元素父节点
                            let mut clone_element = element.clone();
                            clone_element.children.clear();

                            let script_text_element = Text {
                                span: text_element.span,
                                data: Atom::new(wrapped_script_content),
                                raw: None,
                            };
                            let script_text_child = Child::Text(script_text_element);
                            clone_element.children.push(script_text_child);

                            let mut content = self.swc_codegen_element_content(&clone_element, None, None);
                            content.push_str("\n");
                            return Some(SfcScriptBlock {
                                is_setup,
                                lang,
                                content,
                            });
                        }
                        _ => None,
                    }
                }
                None => None,
            }
        } else {
            return None;
        }
    }

    fn get_source_type(&self, lang: &SfcScriptLang) -> SourceType {
        match lang {
            SfcScriptLang::Es => SourceType::default(),
            SfcScriptLang::Ts => SourceType::default().with_typescript(true),
            SfcScriptLang::Jsx => SourceType::default().with_jsx(true),
            SfcScriptLang::Tsx => SourceType::default().with_typescript(true).with_jsx(true),
        }
    }
}
