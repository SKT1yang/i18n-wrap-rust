use crate::transformer::WrapTransformer;
use crate::visitor::WrapVisitorMut;
use oxc_codegen::{CodeGenerator, CodegenOptions, CommentOptions};
use oxc_parser::Parser;
use oxc_semantic::SemanticBuilder;
use oxc_span::*;
use oxc_traverse::traverse_mut;
use wrap_core::contains_chinese;

pub fn wrap_script(source_text: &String, source_type: SourceType, language_source: &str) -> String {
    let allocator = Default::default();
    let ret = Parser::new(&allocator, &source_text, source_type).parse();
    let program = allocator.alloc(ret.program);

    // 导入国际化函数
    let (symbols, scopes) = SemanticBuilder::new(source_text, source_type)
        .build(program)
        .semantic
        .into_symbol_table_and_scope_tree();
    let mut traverser = WrapTransformer::new(&allocator, language_source);
    traverse_mut(&mut traverser, &allocator, program, symbols, scopes);

    WrapVisitorMut::new(&allocator).build(program);

    let code = CodeGenerator::new().with_options(CodegenOptions {
        single_quote: false,
        // remove whitespace
        minify: false,
    });
    code.enable_comment(
        &source_text,
        ret.trivias.clone(),
        CommentOptions {
            preserve_annotate_comments: true,
        },
    )
    .build(program)
    .source_text
}

pub fn wrap_expression(source_text: &String, source_type: SourceType) -> String {
    let directive = wrap_pure_directive(source_text, source_type);
    match directive {
        Some(directive) => directive,
        None => {
            let allocator = Default::default();
            let ret = Parser::new(&allocator, &source_text, source_type).parse();
            let program = allocator.alloc(ret.program);

            WrapVisitorMut::new(&allocator).build(program);

            let code = CodeGenerator::new().build(program).source_text;
            code
        }
    }
}

pub fn wrap_pure_directive(source_text: &String, source_type: SourceType) -> Option<String> {
    let allocator = Default::default();
    let ret = Parser::new(&allocator, &source_text, source_type).parse();
    if ret.program.directives.len() == 1 && ret.program.body.is_empty() {
        let content = ret.program.directives[0].directive.to_string();

        if contains_chinese(content.as_str()) {
            return Some(format!("t('{}')", content));
        } else {
            return None;
        }
    } else {
        return None;
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn empty_expression() {
        let source_text = "";
        let source_type = SourceType::default();
        let code = wrap_expression(&source_text.to_string(), source_type);
        assert_eq!(code, "");
    }

    #[test]
    fn empty_script() {
        let source_text = "";
        let source_type = SourceType::default();
        let code = wrap_script(&source_text.to_string(), source_type, "language/index.ts");
        assert_eq!(code, "");
    }

    #[test]
    fn plain_text() {
        let source_text = "'中文文本'";
        let source_type = SourceType::default();
        let code = wrap_script(&source_text.to_string(), source_type, "language/index.ts");
        assert_eq!(code, "\"中文文本\";\n");
    }

    #[test]
    fn plain_template() {
        let source_text = "message.success(`设置成功`)";
        let source_type = SourceType::default();
        let code = wrap_script(&source_text.to_string(), source_type, "language/index.ts");
        assert_eq!(code, "message.success(t('设置成功'));\n");
    }

    #[test]
    fn plain_text_plus() {
        let source_text = "'中文文本' + 'abc'";
        let source_type = SourceType::default();
        let code = wrap_script(&source_text.to_string(), source_type, "language/index.ts");
        assert_eq!(
            code,
            "import { t } from \"language/index.ts\";\nt(\"中文文本\") + \"abc\";\n"
        );
    }
    #[test]
    fn includes_text() {
        let source_text = "['中文文本', 'abc'].includes('中文文本')";
        let source_type = SourceType::default();
        let code = wrap_script(&source_text.to_string(), source_type, "language/index.ts");
        assert_eq!(
            code,
            "import { t } from \"language/index.ts\";\n[t(\"中文文本\"), \"abc\"].includes(t(\"中文文本\"));\n"
        );
    }
    #[test]
    fn plain_function_call() {
        let source_text = "t(\"中文文字\")";
        let source_type = SourceType::default();
        let code = wrap_script(&source_text.to_string(), source_type, "language/index.ts");
        assert_eq!(
            code,
            "import { t } from \"language/index.ts\";\nt(\"中文文字\");\n"
        );
    }
    #[test]
    fn visit_variable() {
        let source_text = "value";
        let source_type = SourceType::default();
        let code = wrap_script(&source_text.to_string(), source_type, "language/index.ts");
        assert_eq!(code, "value;\n");
    }
    #[test]
    fn test_visit_variable_declaration() {
        let source_text = "const value = \"中文文本\"";
        let source_type = SourceType::default();
        let code = wrap_script(&source_text.to_string(), source_type, "language/index.ts");
        assert_eq!(
            code,
            "import { t } from \"language/index.ts\";\nconst value = t(\"中文文本\");\n"
        );
    }
    #[test]
    fn test_visit_template_literal_1() {
        let source_text = "`中 ${value1} 文 ${value2} 文${func('源端口')}本`";
        let source_type = SourceType::default();
        let code = wrap_script(&source_text.to_string(), source_type, "language/index.ts");
        assert_eq!(
            code,
            "import { t } from \"language/index.ts\";\nt(\"中 {} 文 {} 文{}本\", value1, value2, func(t(\"源端口\")));\n"
        );
    }
    #[test]
    fn test_visit_template_literal_2() {
        let source_text = "`命中 ${tableObj.total} 条, 展示10000条`";
        let source_type = SourceType::default().with_typescript(true);
        let code = wrap_script(&source_text.to_string(), source_type, "language/index.ts");
        assert_eq!(code, "import { t } from \"language/index.ts\";\nt(\"命中 {} 条, 展示10000条\", tableObj.total);\n");
    }

    #[test]
    fn test_double_import_declaration() {
        let source_text = "import { t } from \"language/index.ts\";\nconst value = \"中文文本\";";
        let source_type = SourceType::default();
        let code = wrap_script(&source_text.to_string(), source_type, "language/index.ts");
        assert_eq!(
            code,
            "import { t } from \"language/index.ts\";\nconst value = t(\"中文文本\");\n"
        );
    }
    #[test]
    fn all_import_declaration() {
        let source_text = "import 'a';import {} from 'b';import type { c } from 'd';import { e } from 'f';import { g as h } from 'i';import * as j from 'k';import l from 'm'";
        let source_type = SourceType::default().with_typescript(true);
        let code = wrap_script(&source_text.to_string(), source_type, "language/index.ts");
        assert_eq!(code, "import \"a\";\nimport {} from \"b\";\nimport type { c } from \"d\";\nimport { e } from \"f\";\nimport { g as h } from \"i\";\nimport * as j from \"k\";\nimport l from \"m\";\n");
    }
    #[test]
    fn comment() {
        let source_text = r#"
/* #__NO_SIDE_EFFECTS__ */ y => y
// test comment inline
/**
 * test comment multiline
 */
        "#;
        let source_type = SourceType::default();
        let code = wrap_script(&source_text.to_string(), source_type, "language/index.ts");
        assert_eq!(code, "/* #__NO_SIDE_EFFECTS__ */ (y) => y;\n");
    }
}
