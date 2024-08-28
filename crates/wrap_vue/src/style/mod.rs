use swc_html_ast::Element;

use crate::SfcParser;
use wrap_core::SfcStyleBlock;

impl SfcParser<'_, '_> {
    pub fn parse_sfc_style_to_wrapped_string(&mut self, element: Element) -> Option<SfcStyleBlock> {
        let mut content = self.swc_codegen_element_content(&element, None, None);
        content.push_str("\n");
        Some(SfcStyleBlock {
            content
        })
    }
}
