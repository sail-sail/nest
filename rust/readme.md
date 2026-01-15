rust 静态链接:
```bash

# wsl中安装rustup
  rustup target add x86_64-unknown-linux-musl
  cargo build --release --target=x86_64-unknown-linux-musl

# wsl中安装 aws-lc-sys 工具链
  sudo apt-get install -y build-essential cmake libclang-dev golang perl

# windows中安装 aws-lc-sys 工具链
  # 打开 Visual Studio Installer
  # MSVC v143 - VS 2022 C++ x64/x86 生成工具
  # C++ Clang Compiler for Windows （如果使用 ClangCL）
  # Windows 11 SDK
  # CMake tools for Windows
  # https://cmake.org/download/ 下载安装 CMake
```

ab 压力测试:
```bash
ab -c100 -n10000 -p /data/software/test.json -T application/json -H "Content-Type: application/json" -H "Cache-Control: no-cache" -H "Bearer eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjlMbW5xaExJVHpLc2tGTy9sY1hScUEiLCJkZXB0X2lkIjoiUi9WSFcwa3pSeEs5dEc4bUlITWRiUSIsInRlbmFudF9pZCI6IlpEYlpsQzFPVDhLYURnNnNveE1DQlEiLCJsYW5nIjoiemgtY24iLCJleHAiOjIwMDAwNDkwOTF9.cvfaeUTk2p28-RPPcfb3DPOQTk54-GdsboJAbeUxq1k" http://localhost:5001/graphql
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
