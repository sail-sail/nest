rust 静态链接:
```bash

#安装musl
  
  # unbuntu
  sudo apt install build-essential
  # sudo apt install musl-tools musl-dev
  # sudo apt install openssl libssl-dev
  
  # centos
  yum install -y musl-tools musl-dev

# 安装rustup
  rustup target add x86_64-unknown-linux-musl
  cargo build --release --target=x86_64-unknown-linux-musl
```
