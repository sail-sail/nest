use std::process::Command;
use std::env;

fn main() {
  if std::env::var_os("RUST_MIN_STACK").is_none() {
    println!("cargo:rustc-env=RUST_MIN_STACK=20971520");
  }
  if env::var("PROFILE").unwrap() == "release" {
    let output = Command::new("git")
      .args(["log", "-n", "1", "--pretty=format:%h"])
      .output();
    if let Ok(output) = output {
      let git_hash = String::from_utf8(output.stdout).unwrap();
      println!("cargo:rustc-env=GIT_HASH={git_hash}");
    }
  }
}
