pub fn contains_chinese(s: &str) -> bool {
  s.chars().any(|c| {
      let c_unicode_value = c as u32; // 将字符转换为它的 Unicode 编码值
      (0x4e00..=0x9fff).contains(&c_unicode_value)
          || (0x3400..=0x4dbf).contains(&c_unicode_value)
          || (0x20000..=0x2a6df).contains(&c_unicode_value)
          || (0xf900..=0xfaff).contains(&c_unicode_value)
          || (0x2f800..=0x2fa1f).contains(&c_unicode_value)
  })
}

#[test]
fn test_contains_chinese() {
  assert!(!contains_chinese("Hello, world!")); // 不含中文
  assert!(contains_chinese("你好，世界！")); // 含有中文
  assert!(contains_chinese("这是一个测试。")); // 含有中文
  assert!(contains_chinese("This is a test. 你好。")); // 含有中文
  assert!(!contains_chinese("1234567890")); // 不含中文
  assert!(contains_chinese("一二三四五")); // 含有中文
  assert!(contains_chinese("漢字")); // 含有中文
  assert!(!contains_chinese("")); // 空字符串
  assert!(contains_chinese("繁體字")); // 含有繁体中文
  assert!(contains_chinese("漢")); // 单个汉字
}

// 模版字面量包含{}, 说明该字面量已经被t函数wrap
pub fn contains_template_element_tag(s: &str) -> bool {
  return s.contains("{}");
}
