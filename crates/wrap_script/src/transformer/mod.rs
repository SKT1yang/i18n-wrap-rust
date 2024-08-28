use std::cell::Cell;

use oxc_allocator::Allocator;
use oxc_ast::ast::*;
use oxc_span::{Atom, SPAN};
use oxc_traverse::{Traverse, TraverseCtx};

mod module_imports;
use module_imports::ModuleImports;
use wrap_core::contains_chinese;

pub struct WrapTransformer<'a> {
    pub module_imports: ModuleImports<'a>,
    pub language_source: &'a str,
    // 是否包含需要国际化的中文字符串
    // 默认为 false, 如果遍历过程中发现需要国际化处理的字符串，则设置为 true
    pub is_contains_chinese: bool,
    // 是否存在 wrap import 声明
    pub is_exist_wrap_import_declaration: bool, 
}

// Initialization
impl<'a> WrapTransformer<'a> {
    pub fn new(allocator: &'a Allocator, language_source: &'a str) -> Self {
        Self {
            module_imports: ModuleImports::new(allocator),
            language_source,
            is_contains_chinese: false,
            is_exist_wrap_import_declaration: false,
        }
    }
}

// Entry points
impl<'a> Traverse<'a> for WrapTransformer<'a> {
    fn exit_expression(&mut self, node: &mut Expression<'a>, _ctx: &mut TraverseCtx<'a>) {
        match node {
            // 字符还表达式
            Expression::StringLiteral(string_literal) => {
                let string = string_literal.value.clone();

                // 判断是否是有中文字符串
                if contains_chinese(&string) {
                    self.is_contains_chinese = true;
                }
            }
            // 模版字符串表达式
            Expression::TemplateLiteral(template_literal) => {
                let mut has_chinese = false;

                for template_element in template_literal.quasis.iter() {
                    let raw = template_element.value.raw.to_string();
                    if contains_chinese(raw.as_str()) {
                        has_chinese = true;
                    }
                }

                // 只有 quasis 中有中文字面量才需要国际化处理
                if has_chinese {
                    self.is_contains_chinese = true;
                }
            }
            _ => {}
        }
    }

    fn enter_import_declaration_specifier(
            &mut self,
            node: &mut ImportDeclarationSpecifier<'a>,
            _ctx: &mut TraverseCtx<'a>,
        ) {
        // println!("************enter_import_declaration_specifier****************");
        match node {
            ImportDeclarationSpecifier::ImportSpecifier(specifier) => {
                // println!("************ImportSpecifier****************");
                // println!("{:?}", specifier);
                let name = specifier.local.name.as_str();
                if name == "t" {
                    self.is_exist_wrap_import_declaration = true;
                }
            }
            ImportDeclarationSpecifier::ImportDefaultSpecifier(specifier) => {
                // println!("************ImportDefaultSpecifier****************");
                // println!("{:?}", specifier);
                let name = specifier.local.name.as_str();
                if name == "t" {
                    self.is_exist_wrap_import_declaration = true;
                }
            }
            ImportDeclarationSpecifier::ImportNamespaceSpecifier(specifier) => {
                // println!("************ImportNamespaceSpecifier****************");
                // println!("{:?}", specifier);
                let name = specifier.local.name.as_str();
                if name == "t" {
                    self.is_exist_wrap_import_declaration = true;
                }
            }

        }
    }

    #[inline]
    fn exit_program(&mut self, node: &mut Program<'a>, ctx: &mut TraverseCtx<'a>) {
        // println!("************exit_program****************");
        // 引入国际化的条件是：1. 包含中文字符串 2. 没有引入国际化函数 3. 引入了国际化函数的模块不为空
        println!("is_contains_chinese: {}, is_exist_wrap_import_declaration: {}, language_source: {}", self.is_contains_chinese, self.is_exist_wrap_import_declaration, self.language_source);
        if self.is_contains_chinese & !self.is_exist_wrap_import_declaration & !self.language_source.is_empty() {
            let names = vec!["t"];
            let specifiers = ctx.ast.vec_from_iter(names.into_iter().map(|name| {
                ImportDeclarationSpecifier::ImportSpecifier(ctx.ast.alloc(ImportSpecifier {
                    span: SPAN,
                    imported: ModuleExportName::IdentifierName(IdentifierName::new(
                        SPAN,
                        Atom::from(name),
                    )),
                    local: BindingIdentifier {
                        span: SPAN,
                        name: Atom::from(name),
                        symbol_id: Cell::new(None),
                    },
                    import_kind: ImportOrExportKind::Value,
                }))
            }));
            let source: StringLiteral = StringLiteral::new(SPAN, Atom::from(self.language_source));
            let import_stmt = ctx.ast.module_declaration_import_declaration(
                SPAN,
                Some(specifiers),
                source,
                None,
                ImportOrExportKind::Value,
            );
            node.body
                .insert(0, ctx.ast.statement_module_declaration(import_stmt));
        }
    }
}
