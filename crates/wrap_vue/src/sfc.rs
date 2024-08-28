use crate::SfcParser;
use core::fmt::Error;
use swc_common::input::StringInput;
use swc_core::common::{BytePos, DUMMY_SP};
use swc_html_ast::{Child, DocumentFragment, DocumentMode, Element, Namespace};
use swc_html_codegen::{
    writer::basic::{BasicHtmlWriter, BasicHtmlWriterConfig},
    CodeGenerator, CodegenConfig, Emit,
};
use swc_html_parser::{
    lexer::Lexer,
    parser::{Parser, ParserConfig},
};
use wrap_core::SfcDescriptor;

type SwcHtmlParserError = swc_html_parser::error::Error;

/// Parses `self.input` as an SFC, producing an `SfcDescriptor`.
impl SfcParser<'_, '_> {
    pub fn parse_sfc(&mut self) -> Result<SfcDescriptor, Error> {
        let parsed_html = self.parse_html_document_fragment();
        if let Ok(parsed_html) = parsed_html {
            let mut sfc_descriptor = SfcDescriptor::default();
            for root_node in parsed_html.children.into_iter() {
                println!("root_node: {:?}", root_node);
                match root_node {
                    Child::Element(root_element) => {
                        let tag_name = &root_element.tag_name;

                        if tag_name.eq("template") {
                            let template_result =
                                self.parse_sfc_template_to_wrapped_string(root_element, self.input);
                            sfc_descriptor.template = template_result;
                            if let Some(template_block) = sfc_descriptor.template.clone() {
                                sfc_descriptor
                                    .wrapped_code
                                    .push_str(template_block.content.as_str());
                            } else {
                                continue;
                            }
                        } else if tag_name.eq("script") {
                            let sfc_script_result =
                                self.parse_sfc_script_to_wrapped_string(root_element);
                            if let Some(sfc_script_block) = sfc_script_result {
                                if sfc_script_block.is_setup {
                                    sfc_descriptor.script_setup = Some(sfc_script_block.clone());
                                } else {
                                    sfc_descriptor.script_legacy = Some(sfc_script_block.clone());
                                }
                                sfc_descriptor
                                    .wrapped_code
                                    .push_str(sfc_script_block.content.as_str());
                            } else {
                                continue;
                            }
                        } else if tag_name.eq("style") {
                            if let Some(style_block) =
                                self.parse_sfc_style_to_wrapped_string(root_element)
                            {
                                sfc_descriptor.styles.push(style_block.clone());
                                sfc_descriptor
                                    .wrapped_code
                                    .push_str(style_block.content.as_str());
                            }
                        } else {
                            if let Some(custom_block) =
                                self.parse_sfc_custom_block_to_wrapped_string(root_element)
                            {
                                sfc_descriptor.custom_blocks.push(custom_block.clone());
                                sfc_descriptor
                                    .wrapped_code
                                    .push_str(custom_block.content.as_str());
                            }
                        }
                    }
                    Child::Comment(comment_child) => {
                        if let Some(comment) = self.parse_comment(comment_child) {
                            sfc_descriptor.comments.push(comment.clone());
                            sfc_descriptor
                                .wrapped_code
                                .push_str(comment.content.as_str());
                        }
                    }
                    Child::Text(text_child) => {
                        if let Some(text) = self.parse_text(text_child) {
                            sfc_descriptor.texts.push(text.clone());
                            sfc_descriptor
                                .wrapped_code
                                .push_str(text.content.as_str());
                        }
                    }
                    Child::DocumentType(document_type_child) => {
                        if let Some(document_type) = self.parse_document_type(document_type_child) {
                            sfc_descriptor.document_type = Some(document_type.clone());
                            sfc_descriptor
                                .wrapped_code
                                .push_str(document_type.content.as_str());
                        }
                    }
                }
            }

            Ok(sfc_descriptor)
        } else {
            return Err(Error);
        }
    }

    /// Adapted from `swc_html_parser`
    #[inline]
    pub fn parse_html_document_fragment(&mut self) -> Result<DocumentFragment, SwcHtmlParserError> {
        let lexer = Lexer::new(StringInput::new(
            self.input,
            BytePos(1),
            BytePos(self.input.len() as u32),
        ));

        let parser_config = ParserConfig {
            scripting_enabled: true,
            iframe_srcdoc: false,
            allow_self_closing: true,
        };
        let mut parser = Parser::new(lexer, parser_config);

        let ctx_element = Element {
            span: DUMMY_SP,
            tag_name: "div".into(),
            namespace: Namespace::HTML,
            attributes: vec![],
            children: vec![],
            content: None,
            is_self_closing: false,
        };

        let result = parser.parse_document_fragment(ctx_element, DocumentMode::NoQuirks, None);
        result
    }

    pub fn swc_codegen_element_content(
        &mut self,
        element_child: &Element,
        writer_config: Option<BasicHtmlWriterConfig>,
        codegen_config: Option<CodegenConfig>,
    ) -> String {
        let writer_config = writer_config.unwrap_or_default();
        let codegen_config = codegen_config.unwrap_or_default();
        let mut content = String::new();
        let wr = BasicHtmlWriter::new(&mut content, None, writer_config);
        let mut gen = CodeGenerator::new(wr, codegen_config);

        gen.emit(&element_child).unwrap();
        content
            .replace("&quot;", "'")
            .replace("&amp;", "&")
            .replace("&nbsp;", " ")
            .replace("&lt;", "<")
            .replace("&gt;", ">")
    }
}
