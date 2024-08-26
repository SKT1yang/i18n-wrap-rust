#![deny(clippy::all)]

#[macro_use]
extern crate napi_derive;

use wrap::wrap as wrap_api;

#[napi]
pub fn wrap(
  user_root_path: String,
  user_language_path: String,
  user_include: Vec<String>,
  user_exclude: Vec<String>,
) {
  let result = wrap_api::wrap(
    user_root_path,
    user_language_path,
    user_include,
    user_exclude,
  );

  match result {
      Ok(_) => println!("Wrap success"),
      Err(e) => println!("Wrap error: {}", e),
  }
}
