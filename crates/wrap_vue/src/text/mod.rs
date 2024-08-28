use swc_html_codegen::{
    writer::basic::{BasicHtmlWriter, BasicHtmlWriterConfig},
    CodeGenerator, CodegenConfig, Emit,
};
use crate::SfcParser;
use wrap_core::Text;

impl SfcParser<'_, '_> {
    pub fn parse_text(&mut self, text_child: swc_html_ast::Text) -> Option<Text> {
        let mut content = self.swc_codegen_text_content(&text_child, None, None);
        Some(Text { content })
    }

    pub fn swc_codegen_text_content(
        &mut self,
        text_child: &swc_html_ast::Text,
        writer_config: Option<BasicHtmlWriterConfig>,
        codegen_config: Option<CodegenConfig>,
    ) -> String {
        let writer_config = writer_config.unwrap_or_default();
        let codegen_config = codegen_config.unwrap_or_default();
        let mut content = String::new();
        let wr = BasicHtmlWriter::new(&mut content, None, writer_config);
        let mut gen = CodeGenerator::new(wr, codegen_config);

        gen.emit(&text_child).unwrap();
        content
    }
}
