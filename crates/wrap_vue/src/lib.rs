mod custom_block;
mod script;
mod sfc;
mod style;
mod template;

use swc_core::common::comments::SingleThreadedComments;

// Default patterns for interpolation
pub const INTERPOLATION_START_PAT_DEFAULT: &str = "{{";
pub const INTERPOLATION_END_PAT_DEFAULT: &str = "}}";

#[derive(Debug)]
pub struct SfcParser<'i, 'p> {
    input: &'i str,
    language_source: &'i str,
    comments: SingleThreadedComments,
    is_pre: bool,
    interpolation_start_pat: &'p str,
    interpolation_end_pat: &'p str,
    pub ignore_empty: bool,
}

impl<'i, 'e> SfcParser<'i, 'static> {
    pub fn new(input: &'i str, language_source: &'i str) -> Self {
        SfcParser {
            input,
            comments: SingleThreadedComments::default(),
            is_pre: false,
            interpolation_start_pat: INTERPOLATION_START_PAT_DEFAULT,
            interpolation_end_pat: INTERPOLATION_END_PAT_DEFAULT,
            ignore_empty: true,
            language_source,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use wrap_core::SfcDescriptor;
    #[test]
    fn parse_sfc_file() {
        // 获取vue文件内容
        let source = include_str!("./fixture/test.vue");
        println!("source: {:?}", source);
        let result = parse(source, "language/index.ts");
        println!("result: {:?}", result.wrapped_code);
        assert_eq!(source == "1", true);
    }

    fn parse(source: &str, language_source: &str) -> SfcDescriptor {
        let mut parser = SfcParser::new(source, language_source);
        let result = parser.parse_sfc().unwrap();
        result
    }
}
