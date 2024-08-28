use std::path::PathBuf;
extern crate path_calculate;
use path_calculate::*;
pub fn get_language_source_relative_path(file_path: &PathBuf, language_path: &PathBuf) -> PathBuf {
    let parent_dir = file_path.parent();
    let mut result = PathBuf::new();
    if let Some(parent) = parent_dir {
        let path = language_path.related_to(parent).unwrap();
        if !path.starts_with("../") {
            result = PathBuf::from("./");
        }
        if let Some(extension) = path.extension() {
            // 去除ts扩展名
            if extension == std::ffi::OsStr::new("ts") {
                if let Some(parent) = path.parent() {
                    let file_stem = path.file_stem().unwrap();
                    result = result.join(parent).join(file_stem)
                }
            } else {
                result = result.join(path);
            }
        }
    }
    result
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::path::PathBuf;

    #[test]
    fn language_source_ts_test() {
        let file_path = PathBuf::from("/Users/yangguodong/learn/i18n-wrap-rust/test_projects/temp/event/src/views/audit/It/index.vue");
        let language_path = PathBuf::from(
            "/Users/yangguodong/learn/i18n-wrap-rust/test_projects/temp/event/src/languages/app.ts",
        );
        let relative_path = get_language_source_relative_path(&file_path, &language_path);
        println!("Relative Path: {}", relative_path.display());
        assert_eq!(relative_path, PathBuf::from("../../../languages/app"));
    }
    #[test]
    fn language_source_index_ts_test() {
        let file_path = PathBuf::from("/Users/yangguodong/learn/i18n-wrap-rust/test_projects/temp/event/src/views/audit/It/index.vue");
        let language_path = PathBuf::from("/Users/yangguodong/learn/i18n-wrap-rust/test_projects/temp/event/src/languages/index.ts");
        let relative_path = get_language_source_relative_path(&file_path, &language_path);
        println!("Relative Path: {}", relative_path.display());
        assert_eq!(relative_path, PathBuf::from("../../../languages/index"));
    }

    #[test]
    fn language_source_js_test() {
        let file_path = PathBuf::from("/Users/yangguodong/learn/i18n-wrap-rust/test_projects/temp/event/src/views/audit/It/index.vue");
        let language_path = PathBuf::from("/Users/yangguodong/learn/i18n-wrap-rust/test_projects/temp/event/src/languages/language.js");
        let relative_path = get_language_source_relative_path(&file_path, &language_path);
        println!("Relative Path: {}", relative_path.display());
        assert_eq!(
            relative_path,
            PathBuf::from("../../../languages/language.js")
        );
    }

    #[test]
    fn language_source_outer_test() {
        let file_path = PathBuf::from(
            "/Users/yangguodong/learn/i18n-wrap-rust/test_projects/temp/event/src/index.vue",
        );
        let language_path = PathBuf::from("/Users/yangguodong/learn/i18n-wrap-rust/test_projects/temp/event/src/languages/language.js");
        let relative_path = get_language_source_relative_path(&file_path, &language_path);
        println!("Relative Path: {}", relative_path.display());
        assert_eq!(relative_path, PathBuf::from("./languages/language.js"));
    }

    #[test]
    fn language_source_outer_ts_test() {
        let file_path = PathBuf::from(
            "/Users/yangguodong/learn/i18n-wrap-rust/test_projects/temp/event/src/index.vue",
        );
        let language_path = PathBuf::from("/Users/yangguodong/learn/i18n-wrap-rust/test_projects/temp/event/src/languages/language.ts");
        let relative_path = get_language_source_relative_path(&file_path, &language_path);
        println!("Relative Path: {}", relative_path.display());
        assert_eq!(relative_path, PathBuf::from("./languages/language"));
    }
}
