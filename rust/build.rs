use std::process::Command;
use std::env;

fn main() {
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
