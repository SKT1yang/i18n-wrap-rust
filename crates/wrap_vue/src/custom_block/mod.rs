use swc_html_ast::Element;

use crate::SfcParser;
use wrap_core::SfcCustomBlock;

impl SfcParser<'_, '_> {
    pub fn parse_sfc_custom_block_to_wrapped_string(&mut self, element: Element) -> Option<SfcCustomBlock> {
        let mut content = self.swc_codegen_element_content(&element, None, None);
        content.push_str("\n");
        Some(SfcCustomBlock {
            content
        })
    }
}
