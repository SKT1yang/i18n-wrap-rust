use oxc_allocator::Allocator;
use oxc_ast::{ast::*, visit::walk_mut::*, AstBuilder, VisitMut};
use oxc_span::SPAN;
use wrap_core::{contains_chinese, contains_template_element_tag};

pub struct WrapVisitorMut<'a> {
    ast_builder: AstBuilder<'a>,
}

impl<'a> VisitMut<'a> for WrapVisitorMut<'a> {
    fn visit_expression(&mut self, it: &mut Expression<'a>) {
        // println!("***** visit_expression *****");
        // println!("{:?}", it);
        match it {
            // 字符还表达式
            Expression::StringLiteral(string_literal) => {
                let string = string_literal.value.clone();

                // 判断是否是有中文字符串
                if contains_chinese(&string) && !contains_template_element_tag(&string) {
                    *it = self.ast_builder.expression_call(
                        SPAN,
                        self.ast_builder.expression_identifier_reference(SPAN, "t"),
                        Option::<TSTypeParameterInstantiation>::None,
                        {
                            let mut items = self.ast_builder.vec();
                            items.push(self.ast_builder.argument_expression(
                                self.ast_builder.expression_string_literal(SPAN, string),
                            ));
                            items
                        },
                        false,
                    )
                }
            }
            // 模版字符串表达式
            Expression::TemplateLiteral(template_literal) => {
                let mut string = String::new();
                let mut string_template_elements: Vec<String> = vec![];
                let mut has_chinese = false;

                for template_element in template_literal.quasis.iter() {
                    let raw = template_element.value.raw.to_string();
                    if contains_chinese(raw.as_str()) {
                        has_chinese = true;
                    }
                }

                // 只有 quasis 中有中文字面量才需要国际化处理
                if has_chinese {
                    for template_element in template_literal.quasis.iter_mut() {
                        let raw = template_element.value.raw.to_string();
                        string_template_elements.push(raw);
                    }
                    for (index, string_template_element) in
                        string_template_elements.iter_mut().enumerate()
                    {
                        string.push_str(string_template_element);
                        if index < template_literal.expressions.len() {
                            string.push_str("{}");
                        }
                    }

                    let call_expression = self.ast_builder.expression_call(
                        SPAN,
                        self.ast_builder.expression_identifier_reference(SPAN, "t"),
                        Option::<TSTypeParameterInstantiation>::None,
                        {
                            let mut items = self.ast_builder.vec();
                            items.push(self.ast_builder.argument_expression(
                                self.ast_builder.expression_string_literal(SPAN, string),
                            ));
                            for expression in template_literal.expressions.iter_mut() {
                                let expr = self.ast_builder.move_expression(expression);
                                items.push(self.ast_builder.argument_expression(expr));
                            }
                            items
                        },
                        false,
                    );
                    *it = call_expression;
                    match it {
                        Expression::CallExpression(call_expression) => {
                            walk_call_expression(self, call_expression);
                        }
                        _ => {}
                    }
                } else {
                    walk_expression(self, it);
                }
            }
            _ => {
                walk_expression(self, it);
            }
        }
    }

    fn visit_call_expression(&mut self, expr: &mut CallExpression<'a>) {
        // println!("***** visit_call_expression *****");
        // println!("{:?}", expr);
        if let Some(ident) = expr.callee.get_identifier_reference() {
            // 判断是否是 t 函数, 是的话不处理
            if ident.name == "t" {
                return;
            }
        }
        walk_call_expression(self, expr);
    }
}

impl<'a> WrapVisitorMut<'a> {
    pub fn new(allocator: &'a Allocator) -> Self {
        let ast_builder = AstBuilder::new(allocator);
        Self {
            ast_builder,
        }
    }

    pub fn build(&mut self, program: &mut Program<'a>) {
        self.visit_program(program);
    }
}
