rust 静态链接:
```bash

# windows安装scoop
  iwr -useb get.scoop.sh | iex
  # 或者
  Invoke-Expression (New-Object System.Net.WebClient).DownloadString('https://get.scoop.sh')

# windows安装llvm
  scoop install llvm

# 安装musl
  
  # unbuntu
  sudo apt install build-essential
  sudo apt install musl-tools musl-dev
  # sudo apt install openssl libssl-dev
  
  # centos
  yum install -y musl-tools musl-dev

# 安装rustup
  rustup target add x86_64-unknown-linux-musl
  cargo build --release --target=x86_64-unknown-linux-musl
```

ab 压力测试:
```bash
ab -c100 -n10000 -p /data/software/test.json -T application/json -H "Content-Type: application/json" -H "Cache-Control: no-cache" -H "Bearer eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjlMbW5xaExJVHpLc2tGTy9sY1hScUEiLCJkZXB0X2lkIjoiUi9WSFcwa3pSeEs5dEc4bUlITWRiUSIsInRlbmFudF9pZCI6IlpEYlpsQzFPVDhLYURnNnNveE1DQlEiLCJsYW5nIjoiemgtY24iLCJleHAiOjIwMDAwNDkwOTF9.cvfaeUTk2p28-RPPcfb3DPOQTk54-GdsboJAbeUxq1k" http://localhost:5001/graphql
```

## 换工程名字
1. `ecosystem.config.js`
    - 第3行: `name: "[工程名]"`
    - 第4行: `script: "./[工程名]"`
2. `Cargo.toml`
    - 第1行: `name = "[工程名]"`
    - 第5行: `default-run = "[工程名]"`
    - 第88行: `name = "[工程名]"`
3. `src/main.rs`
    - 第43行: `std::env::set_var("RUST_LOG", "[工程名]=info");`
    - 第54行: `let file_appender = tracing_appender::rolling::daily(log_path, "[工程名].log");`
    - 第75行: `let file_appender = tracing_appender::rolling::daily(log_path, "[工程名].log");`
4. `src\common\script\publish.js`
    - 第69行: ```cmd += ` ; chmod -R 755 ${ publishPath }/rust/[工程名]`;```
5. `src\common\script\build.js`
    - 第77行: ```await remove(`${ buildDir }/rust/[工程名]`);```
    - 第78行: ```await move(`${ cwd }/target/x86_64-unknown-linux-musl/release/[工程名]`, `${ buildDir }/rust/[工程名]`);```
