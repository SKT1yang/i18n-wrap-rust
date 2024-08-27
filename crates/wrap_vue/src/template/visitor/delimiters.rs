// 处理 模版内 delimiters Text
pub fn process_template_text(input: &String) -> Vec<String> {
    let chars: Vec<char> = input.chars().collect();
    let mut text_nodes: Vec<String> = Vec::new();

    let mut current = 0;
    let mut state = DelimitersState::Normal;
    let mut start = 0;
    let mut normal_chars: Vec<char> = Vec::new();

    while current < chars.len() {
        let char: char = chars[current];
        match char {
            '{' => {
                match state {
                    DelimitersState::Normal => {
                        start = current;
                        state = DelimitersState::One;
                    }
                    DelimitersState::One => {
                        state = DelimitersState::Two;
                    }
                    _ => {}
                }
                current += 1;
                continue;
            }
            '}' => {
                match state {
                    DelimitersState::Two => {
                        state = DelimitersState::Three;
                    }
                    DelimitersState::Three => {
                        //   处理普通文本
                        if normal_chars.len() > 0 {
                            // 转回字符串
                            let normal_text = normal_chars.iter().collect::<String>();
                            text_nodes.push(normal_text);
                            normal_chars.clear();
                        }
                        // 处理表达式
                        text_nodes.push(
                            chars[start..(current + 1)]
                                .to_vec()
                                .iter()
                                .collect::<String>(),
                        );
                        state = DelimitersState::Normal;
                    }
                    _ => {}
                }
                current += 1;
                continue;
            }
            _ => {
                match state {
                    DelimitersState::Normal => {
                        normal_chars.push(char);
                    }
                    _ => {}
                }
                current += 1;
                continue;
            }
        }
    }
    if normal_chars.len() > 0 {
        let normal_text = normal_chars.iter().collect::<String>();
        text_nodes.push(normal_text);
    }

    text_nodes
}

pub enum DelimitersState {
    One,
    Two,
    Three,
    Normal,
}
