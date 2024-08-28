use swc_html_codegen::{
    writer::basic::{BasicHtmlWriter, BasicHtmlWriterConfig},
    CodeGenerator, CodegenConfig, Emit,
};
use crate::SfcParser;
use wrap_core::Comment;

impl SfcParser<'_, '_> {
    pub fn parse_comment(&mut self, comment_child: swc_html_ast::Comment) -> Option<Comment> {
        let content = self.swc_codegen_comment_content(&comment_child, None, None);
        Some(Comment { content })
    }

    pub fn swc_codegen_comment_content(
        &mut self,
        comment_child: &swc_html_ast::Comment,
        writer_config: Option<BasicHtmlWriterConfig>,
        codegen_config: Option<CodegenConfig>,
    ) -> String {
        let writer_config = writer_config.unwrap_or_default();
        let codegen_config = codegen_config.unwrap_or_default();
        let mut content = String::new();
        let wr = BasicHtmlWriter::new(&mut content, None, writer_config);
        let mut gen = CodeGenerator::new(wr, codegen_config);

        gen.emit(&comment_child).unwrap();
        content
    }
}
