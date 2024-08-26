#[derive(Debug, Default)]
pub struct SfcDescriptor {
    pub source: String,
    pub template: Option<SfcTemplateBlock>,
    pub script_legacy: Option<SfcScriptBlock>,
    pub script_setup: Option<SfcScriptBlock>,
    pub styles: Vec<SfcStyleBlock>,
    pub custom_blocks: Vec<SfcCustomBlock>,
    pub wrapped_code: String,
}

#[derive(Clone, Debug)]
pub struct SfcTemplateBlock {
    pub lang: String,
    pub content: String,
}

#[derive(Clone, Debug)]
pub struct SfcScriptBlock {
    pub content: String,
    pub lang: SfcScriptLang,
    pub is_setup: bool,
}

#[derive(Clone, Debug)]
pub struct SfcStyleBlock {
    // pub lang: String,
    pub content: String,
    // pub is_scoped: bool,
    // pub is_module: bool,
}

#[derive(Clone, Debug)]
pub struct SfcCustomBlock {
    pub content: String,
}

#[derive(Clone, Debug)]
pub enum SfcScriptLang {
    Es,
    Ts,
    Tsx,
    Jsx,
}
