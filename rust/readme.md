```bash
# wsl 中安装 rustup
rustup target add x86_64-unknown-linux-musl
cargo build --release --target=x86_64-unknown-linux-musl

# windows 中安装 rg
winget install BurntSushi.ripgrep.MSVC

# windows 中安装 sccache
winget install Mozilla.sccache

# linux 中安装 sccache, 先装 cargo-binstall
curl -L --proto '=https' --tlsv1.2 -sSf \
https://raw.githubusercontent.com/cargo-bins/cargo-binstall/main/install-from-binstall-release.sh | bash

cargo binstall sccache -y

# vscode 启用 cargo-subspace
cargo install cargo-subspace

# settings.json
{
  "rust-analyzer.workspace.discoverConfig": {
    "command": [
      "cargo-subspace",
      "discover",
      "{arg}"
    ],
    "progressLabel": "cargo-subspace",
    "filesToWatch": [
      "Cargo.toml"
    ]
  },
  "rust-analyzer.check.overrideCommand": [
    "cargo-subspace",
    "check", // You can also use "clippy" here
    "$saved_file",
  ],
}
```

## 换工程名字

1. `ecosystem.config.json`
   - apps: `name: "[工程名]"`
   - apps: `script: "./[工程名]"`
2. `Cargo.toml`
   - [package]: `name = "[工程名]"`
   - [package]: `default-run = "[工程名]"`
   - [[bin]]: `name = "[工程名]"`
3. `.vscode\launch.json`
   - configurations: `"name": "[工程名]",`
   - inputs: `"filter": "[工程名]"`
4. `.env`
   - `RUST_LOG="[工程名]=info"`
   - `server_title = "[工程名]4dev"`
5. `.env.test`
   - `RUST_LOG="[工程名]=info"`
   - `server_title = "[工程名]4test"`
6. `.env.prod`
   - `RUST_LOG="[工程名]=info"`
   - `server_title = "[工程名]4prod"`
