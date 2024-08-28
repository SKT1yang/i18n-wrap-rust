use std::collections::HashMap;
use std::path::PathBuf;

use glob::glob;
use oxc_span::SourceType;
use wrap_core::{path::get_language_source_relative_path, SfcDescriptor};
use wrap_script::script::wrap_script;
use wrap_vue::SfcParser;

#[derive(Debug, PartialEq, Eq, Hash, Clone)]
enum Language {
    TS,
    JS,
    JSX,
    TSX,
    VUE,
}

impl Language {
    fn as_str(&self) -> &str {
        match self {
            Language::JS => "js",
            Language::TS => "ts",
            Language::JSX => "jsx",
            Language::TSX => "tsx",
            Language::VUE => "vue",
        }
    }
}

#[derive(Default)]
pub struct WrapConfig {
    pub root_path: PathBuf,
    pub language_path: PathBuf,
    pub include: Vec<String>,
    pub exclude: Vec<String>,
}

#[derive(Default)]
pub struct Wrap {
    pub wrap_config: WrapConfig,
    need_wrap_paths: HashMap<Language, Vec<PathBuf>>,
    needed_ext: Vec<Language>,
}

impl Wrap {
    pub fn new(wrap_config: WrapConfig) -> Wrap {
        Self {
            wrap_config,
            needed_ext: vec![
                Language::JS,
                Language::TS,
                Language::JSX,
                Language::TSX,
                Language::VUE,
            ],
            ..Default::default()
        }
    }
    fn generate_include_paths(&mut self) {
        for include_item in &self.wrap_config.include {
            // todo 有可能不是文件夹 是文件
            let dir = self.wrap_config.root_path.join(include_item);
            if !dir.exists() {
                println!("{}: 路径不存在", dir.display());
                continue;
            }
            if let Some(dir_str) = dir.to_str() {
                for ext in self.needed_ext.clone() {
                    let glob_str = format!("{}/**/*.{}", dir_str, ext.as_str());
                    for entry in glob(glob_str.as_str()).expect("Failed to read glob pattern") {
                        match entry {
                            Ok(path) => {
                                self.need_wrap_paths
                                    .entry(ext.clone())
                                    .or_insert_with(Vec::new)
                                    .push(path);
                            }
                            Err(e) => println!("generate_include_paths: {:?}", e),
                        }
                    }
                }
            }
        }
    }
    fn filter_exclude_paths(&mut self) {
        for exclude_item in &self.wrap_config.exclude {
            // todo 有可能不是文件夹 是文件
            let dir = self.wrap_config.root_path.join(exclude_item);
            if !dir.exists() {
                println!("{}: 路径不存在", dir.display());
                continue;
            }
            if let Some(dir_str) = dir.to_str() {
                for ext in self.needed_ext.clone() {
                    let glob_str = format!("{}/**/*.{}", dir_str, ext.as_str());
                    for entry in glob(glob_str.as_str()).expect("Failed to read glob pattern") {
                        match entry {
                            Ok(path) => {
                                // reloop for each exclude paths
                                if let Some(paths) = self.need_wrap_paths.get_mut(&ext) {
                                    paths.retain(|file_path| file_path != &path);
                                }
                            }
                            Err(e) => println!("filter_exclude_paths: {:?}", e),
                        }
                    }
                }
            }
        }
    }

    pub fn wrap(&mut self) {
        self.generate_include_paths();
        self.filter_exclude_paths();
        for ext in self.needed_ext.clone() {
            if let Some(paths) = self.need_wrap_paths.get(&ext).clone() {
                for path in paths {
                    let source_text = std::fs::read_to_string(&path);
                    match source_text {
                        Ok(source_text) => {
                            let language_path = self.wrap_config.language_path.clone();
                            let source_language =
                                get_language_source_relative_path(&path, &language_path);
                            match source_language.to_str() {
                                Some(source_language) => {
                                    let code;
                                    if ext != Language::VUE {
                                        let source_type = SourceType::from_path(&path)
                                            .unwrap_or_else(|_| {
                                                println!(
                                                    "The type is not supported by oxc SourceType."
                                                );
                                                SourceType::default()
                                            });
                                        code = wrap_script(
                                            &source_text,
                                            source_type,
                                            &source_language.replace("\\", "/"),
                                        );
                                    } else {
                                        code = wrap_vue(
                                            source_text.as_str(),
                                            &source_language.replace("\\", "/"),
                                        )
                                        .wrapped_code;
                                    }
                                    std::fs::write(path.display().to_string(), code)
                                        .expect("写入文件失败");
                                    println!("{:?}", path.display());
                                }
                                None => {
                                    println!("国际化文件夹下language_path解析失败");
                                }
                            }
                        }
                        Err(e) => {
                            println!("Missing '{:?}'", e);
                        }
                    }
                }
            }
        }
    }
}

pub fn wrap(
    user_root_path: String,
    user_language_path: String,
    user_include: Vec<String>,
    user_exclude: Vec<String>,
) -> Result<(), Box<dyn std::error::Error>> {
    // 根路径
    let root = PathBuf::from(user_root_path.as_str());
    if !root.exists() {
        println!("根路径不存在");
        return Ok(());
    }
    // 国际化文件路径
    let language_path = root.join(user_language_path);
    if !language_path.exists() {
        println!("国际化文件路径不存在");
        return Ok(());
    }

    let wrapped_config = WrapConfig {
        root_path: root.clone(),
        language_path: language_path.clone(),
        include: user_include,
        exclude: user_exclude,
    };
    let mut wrap = Wrap::new(wrapped_config);
    wrap.wrap();

    Ok(())
}

fn wrap_vue(source: &str, language_source: &str) -> SfcDescriptor {
    let mut parser = SfcParser::new(source, language_source);
    let result = parser.parse_sfc().unwrap();
    result
}
