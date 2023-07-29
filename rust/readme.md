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
