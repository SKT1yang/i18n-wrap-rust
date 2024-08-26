use std::collections::HashMap;
use std::path::PathBuf;

use glob::glob;
use oxc_span::SourceType;
use wrap_core::{path::get_language_source_relative_path, SfcDescriptor};
use wrap_script::script::wrap_script;
use wrap_vue::SfcParser;

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
    pub include_paths: HashMap<String, Vec<PathBuf>>,
    pub exclude_paths: HashMap<String, Vec<PathBuf>>,
}

impl Wrap {
    pub fn new(wrap_config: WrapConfig) -> Wrap {
        Self {
            wrap_config,
            ..Default::default()
        }
    }
    fn generate_include_paths(&mut self) {
        let mut js_file_paths: Vec<PathBuf> = vec![];
        let mut ts_file_paths: Vec<PathBuf> = vec![];
        let mut jsx_file_paths: Vec<PathBuf> = vec![];
        let mut tsx_file_paths: Vec<PathBuf> = vec![];
        let mut vue_file_paths: Vec<PathBuf> = vec![];

        for include_item in &self.wrap_config.include {
            // todo 有可能不是文件夹 是文件
            let dir = self.wrap_config.root_path.join(include_item);
            if !dir.exists() {
                println!("{}: 路径不存在", dir.display());
                continue;
            }
            if let Some(dir_str) = dir.to_str() {
                let extends = vec!["js", "ts", "jsx", "tsx", "vue"];
                for ext in extends {
                    let glob_str = format!("{}/**/*.{}", dir_str, ext);
                    for entry in glob(glob_str.as_str()).expect("Failed to read glob pattern") {
                        match entry {
                            Ok(path) => {
                                if ext == "js" {
                                    js_file_paths.push(path);
                                } else if ext == "ts" {
                                    ts_file_paths.push(path);
                                } else if ext == "jsx" {
                                    jsx_file_paths.push(path);
                                } else if ext == "tsx" {
                                    tsx_file_paths.push(path);
                                } else if ext == "vue" {
                                    vue_file_paths.push(path);
                                }
                            }
                            Err(e) => println!("{:?}", e),
                        }
                    }
                }
            }
        }

        self.include_paths.insert(String::from("js"), js_file_paths);
        self.include_paths.insert(String::from("ts"), ts_file_paths);
        self.include_paths
            .insert(String::from("jsx"), jsx_file_paths);
        self.include_paths
            .insert(String::from("tsx"), tsx_file_paths);
        self.include_paths
            .insert(String::from("vue"), vue_file_paths);
    }
    fn generate_exclude_paths(&mut self) {
        let mut js_file_paths: Vec<PathBuf> = vec![];
        let mut ts_file_paths: Vec<PathBuf> = vec![];
        let mut jsx_file_paths: Vec<PathBuf> = vec![];
        let mut tsx_file_paths: Vec<PathBuf> = vec![];
        let mut vue_file_paths: Vec<PathBuf> = vec![];

        for exclude_item in &self.wrap_config.exclude {
            // todo 有可能不是文件夹 是文件
            let dir = self.wrap_config.root_path.join(exclude_item);
            if !dir.exists() {
                println!("{}: 路径不存在", dir.display());
                continue;
            }
            if let Some(dir_str) = dir.to_str() {
                let extends = vec!["js", "ts", "jsx", "tsx", "vue"];
                for ext in extends {
                    let glob_str = format!("{}/**/*.{}", dir_str, ext);
                    for entry in glob(glob_str.as_str()).expect("Failed to read glob pattern") {
                        match entry {
                            Ok(path) => {
                                if ext == "js" {
                                    js_file_paths.push(path);
                                } else if ext == "ts" {
                                    ts_file_paths.push(path);
                                } else if ext == "jsx" {
                                    jsx_file_paths.push(path);
                                } else if ext == "tsx" {
                                    tsx_file_paths.push(path);
                                } else if ext == "vue" {
                                    vue_file_paths.push(path);
                                }
                            }
                            Err(e) => println!("{:?}", e),
                        }
                    }
                }
            }
        }

        self.exclude_paths.insert(String::from("js"), js_file_paths);
        self.exclude_paths.insert(String::from("ts"), ts_file_paths);
        self.exclude_paths
            .insert(String::from("jsx"), jsx_file_paths);
        self.exclude_paths
            .insert(String::from("tsx"), tsx_file_paths);
        self.exclude_paths
            .insert(String::from("vue"), vue_file_paths);
    }

    fn wrap_vue(&mut self, source: &str, language_source: &str) -> SfcDescriptor {
        let mut parser = SfcParser::new(source, language_source);
        let result = parser.parse_sfc().unwrap();
        result
    }

    pub fn wrap(&mut self) {
        self.generate_exclude_paths();
        self.generate_include_paths();
        // 过滤出include_paths中不在exclude_paths中的文件路径
        let mut need_wrap_paths: Vec<PathBuf> = vec![];
        for (_, file_paths) in self.include_paths.iter() {
            for file_path in file_paths {
                if !self
                    .exclude_paths
                    .values()
                    .any(|exclude_paths| exclude_paths.contains(file_path))
                {
                    need_wrap_paths.push(file_path.clone());
                }
            }
        }

        for path in &need_wrap_paths {
            let ext = path.extension().unwrap().to_str().unwrap();
            if ext != "vue" {
                let source_type = SourceType::from_path(path).unwrap();
                let source_text =
                    std::fs::read_to_string(path).map_err(|_| format!("Missing '{:?}'", &path));
                match source_text {
                    Ok(source_text) => {
                        let language_path = self.wrap_config.language_path.clone();
                        let source_language =
                            get_language_source_relative_path(path, &language_path);
                        match source_language.to_str() {
                            Some(source_language) => {
                                let code = wrap_script(&source_text, source_type, source_language);
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
                        println!("{:?}", e);
                    }
                }
            }
            if ext == "vue" {
                let source_text =
                    std::fs::read_to_string(path).map_err(|_| format!("Missing '{:?}'", &path));
                match source_text {
                    Ok(source_text) => {
                        let language_path = self.wrap_config.language_path.clone();
                        let source_language =
                            get_language_source_relative_path(path, &language_path);

                        match source_language.to_str() {
                            Some(source_language) => {
                                let result = self.wrap_vue(source_text.as_str(), source_language);
                                std::fs::write(path.display().to_string(), result.wrapped_code)
                                    .expect("写入文件失败");
                                println!("{:?}", path.display());
                            }
                            None => {
                                println!("国际化文件夹下language_path解析失败");
                            }
                        }
                    }
                    Err(e) => {
                        println!("解析vue文件路径失败: {:?}", e);
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
