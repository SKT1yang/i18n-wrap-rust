use crate::SfcParser;
use swc_html_codegen::{
    writer::basic::{BasicHtmlWriter, BasicHtmlWriterConfig},
    CodeGenerator, CodegenConfig, Emit,
};
use wrap_core::DocumentType;

impl SfcParser<'_, '_> {
    pub fn parse_document_type(
        &mut self,
        document_type_child: swc_html_ast::DocumentType,
    ) -> Option<DocumentType> {
        let content = self.swc_codegen_document_type_content(&document_type_child, None, None);
        Some(DocumentType { content })
    }

    pub fn swc_codegen_document_type_content(
        &mut self,
        document_type_child: &swc_html_ast::DocumentType,
        writer_config: Option<BasicHtmlWriterConfig>,
        codegen_config: Option<CodegenConfig>,
    ) -> String {
        let writer_config = writer_config.unwrap_or_default();
        let codegen_config = codegen_config.unwrap_or_default();
        let mut content = String::new();
        let wr = BasicHtmlWriter::new(&mut content, None, writer_config);
        let mut gen = CodeGenerator::new(wr, codegen_config);

        gen.emit(&document_type_child).unwrap();
        content
    }
}
