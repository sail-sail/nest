rust 静态链接:
```bash

# wsl中安装rustup
  rustup target add x86_64-unknown-linux-musl
  cargo build --release --target=x86_64-unknown-linux-musl

# windows中安装 rg
  winget install BurntSushi.ripgrep.MSVC
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
5. `.env.prod`
    - `RUST_LOG="[工程名]=info"`
    - `server_title = "[工程名]4prod"`
