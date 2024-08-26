mod visitor;
use crate::SfcParser;
use swc_html_ast::Element;
use swc_html_visit::VisitMutWith;
use swc_atoms::Atom;
use visitor::FunctionWrapper;
use wrap_core::SfcTemplateBlock;

impl SfcParser<'_, '_> {
    pub fn parse_sfc_template_to_wrapped_string(&mut self, mut root_element: Element) -> Option<SfcTemplateBlock> {
        root_element.visit_mut_with(&mut FunctionWrapper);
        let mut content = self.swc_codegen_content(&root_element, None, None);
        content.push_str("\n");

        let lang_atom = Atom::from("lang");
        let lang = root_element
            .attributes
            .into_iter()
            .find_map(|attr| {
                if attr.name == lang_atom {
                    Some(match attr.value {
                        Some(v) => {
                            let trimmed = v.trim();
                            if trimmed.is_empty() {
                                String::from("html")
                            } else {
                                Atom::from(trimmed).to_string()
                            }
                        }
                        None => String::from("html"),
                    })
                } else {
                    None
                }
            });

        return Some(SfcTemplateBlock {
            lang: lang.unwrap_or_default(),
            content,
        });
    }
}
