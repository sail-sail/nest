use color_eyre::eyre::{Result, eyre};
use tracing::{info, error};

use std::sync::Arc;
use tokio::sync::Semaphore;
use futures::StreamExt;

use tokio::net::TcpListener;

use chromiumoxide::{
  Browser,
  Page,
  BrowserConfig,
};
use chromiumoxide::cdp::browser_protocol::target::CreateTargetParams;

pub struct BrowserInstance {
  pub browser: Browser,
  _handler_guard: tokio::task::JoinHandle<()>, // 下划线前缀表示仅用于保持生命周期
}

/// 检查并杀掉已有的浏览器实例
// 如果是linux或者macOS系统
#[cfg(unix)]
pub async fn check_and_kill_existing_browser(
  port: u16,
) -> Result<()> {
  // 用命令行通过端口检查是否有浏览器实例在运行
  // 这里可以使用 `pgrep` 或 `lsof` 等命令来检查
  let output = tokio::process::Command::new("lsof")
    .arg("-i")
    .arg(format!(":{}", port))
    .output()
    .await?;
  
  if !output.stdout.is_empty() {
    // 如果有输出，说明端口被占用，尝试杀掉进程
    let pid_output = String::from_utf8_lossy(&output.stdout);
    
    info!("pid_output: {pid_output}");
    
    if let Some(pid) = pid_output.lines().next() {
      let pid = pid.split_whitespace().nth(1).unwrap_or("");
      tokio::process::Command::new("kill")
        .arg("-9")
        .arg(pid)
        .output()
        .await?;
      info!("Killed existing browser process with PID: {}", pid);
    }
  } else {
    info!("No existing browser instance found on port {}", port);
  }
  
  Ok(())
}

/// 检查并杀掉已有的浏览器实例
// 如果是windows系统
#[cfg(windows)]
pub async fn check_and_kill_existing_browser(
  port: u16,
) -> Result<()> {
  
  // 用命令行通过端口检查是否有浏览器实例在运行
  // 这里可以使用 `netstat` 或 `taskkill` 等命令来检查
  let output = tokio::process::Command::new("cmd")
    .arg("/C")
    .arg(format!("netstat -ano | findstr :{port}"))
    .output()
    .await?;
  
  if !output.stdout.is_empty() {
    // 如果有输出，说明端口被占用，尝试杀掉进程
    let pid_output = String::from_utf8_lossy(&output.stdout);
  
    for line in pid_output.lines() {
      if line.contains(&format!(":{port}")) {
        let parts: Vec<&str> = line.split_whitespace().collect();
        if let Some(pid) = parts.last() {
          tokio::process::Command::new("taskkill")
            .arg("/F")
            .arg("/PID")
            .arg(pid)
            .output()
            .await?;
          info!("Killed existing browser process with PID: {}", pid);
        }
      }
    }
  } else {
    info!("No existing browser instance found on port {}", port);
  }
  
  Ok(())
}

async fn initialize_browser(
  port: u16,
) -> Result<BrowserInstance> {
  
  let browser_config = BrowserConfig::builder()
    .no_sandbox()
    .arg("--disable-setuid-sandbox")
    .arg("--disable-dev-shm-usage")
    .arg("--disable-gpu")
    .port(port)
    .build()
    .map_err(|e| eyre!("{:#?}", e))?;
  
  let (browser, mut handler) = Browser::launch(browser_config).await?;
  
  // 保存 handler 的 JoinHandle
  let handler_guard = tokio::spawn(async move {
    loop {
      let event = handler.next().await;
      match event {
        Some(event) => {
          // 处理事件
          if let Err(e) = event {
            // Ws(Io(Os { code: 10054, kind: ConnectionReset, message: "远程主机强迫关闭了一个现有的连接。" }))
            // Serde(Error("data did not match any variant of untagged enum Message"
            let err_msg = format!("{e:?}");
            if err_msg.contains("Ws(Io(Os { code: 10054,") {
              error!("Unhandled browser event error: {err_msg}");
              std::process::exit(1);
            } else if &err_msg == "Ws(Protocol(ResetWithoutClosingHandshake))" {
              error!("chromiumoxide Browser handler error: {err_msg}");
              check_and_kill_existing_browser(
                port,
              ).await.unwrap_or_else(|e| {
                error!("Failed to destroy browser: {e}");
              });
              std::process::exit(1);
            } else if err_msg.starts_with("Serde(Error(\"data did not match any variant of untagged enum Message\"") {
              info!("chromiumoxide Browser handler error: {err_msg}");
            } else {
              error!("chromiumoxide Browser handler error: {err_msg}");
            }
          } else {
            info!("Received event: {:#?}", event);
          }
        }
        None => {
          break;
        }
      }
    }
  });
  
  Ok(BrowserInstance {
    browser,
    _handler_guard: handler_guard,
  })
}

/// 获取可用端口
pub async fn get_available_port() -> Result<u16> {
  let listener = TcpListener::bind("127.0.0.1:0").await?;
  let port = listener.local_addr()?.port();
  drop(listener);
  Ok(port)
}

/// 异步检查端口是否可用
// pub async fn is_port_available_async(port: u16) -> bool {
//   TcpListener::bind(format!("127.0.0.1:{}", port)).await.is_ok()
// }

// 全局信号量，确保同一时间只有一个浏览器实例在运行
static BROWSER_QUEUE: Semaphore = Semaphore::const_new(1);

pub async fn new_page<T: Sync + Send>(
  params: impl Into<CreateTargetParams>,
  timeout: std::time::Duration,
  callback: impl AsyncFnOnce(Arc<Page>) -> Result<T> + Send + 'static,
) -> Result<T> {
  
  // 获取信号量许可，确保串行执行
  let _permit = BROWSER_QUEUE.acquire().await?;
  
  // 随机获取一个可用的端口
  let port = get_available_port().await?;
  
  let browser_instance_res = initialize_browser(
    port,
  ).await;
  
  let mut browser_instance: BrowserInstance = match browser_instance_res {
    Ok(instance) => instance,
    Err(e) => {
      info!("Failed to initialize browser: {e}");
      // 如果是linux, 执行 pgrep chrome, 然后kill第一个pid
      #[cfg(unix)]
      {
        let output = tokio::process::Command::new("pgrep")
          .arg("chrome")
          .output()
          .await?;
        if !output.stdout.is_empty() {
          let output_str = String::from_utf8_lossy(&output.stdout);
          let pid = output_str.lines().next().unwrap_or("");
          tokio::process::Command::new("kill")
            .arg("-9")
            .arg(pid)
            .output()
            .await?;
          info!("Killed existing browser process with PID: {pid}");
        } else {
          return Err(eyre!("Failed to initialize browser"));
        }
      }
      // 如果是windows, 执行 taskkill /F /IM chrome.exe
      #[cfg(windows)]
      {
        let output = tokio::process::Command::new("cmd")
          .arg("/C")
          .arg("taskkill /F /IM chrome.exe")
          .output()
          .await?;
        info!("Killed existing browser processes {output:?}");
      }
      
      initialize_browser(
        port,
      ).await?
      
    }
  };
  
  // 创建新页面
  let page = browser_instance.browser.new_page(params).await?;
  
  let page_arc = Arc::new(page);
  
  // 使用超时包装 callback 执行
  let callback_result = tokio::time::timeout(timeout, callback(page_arc.clone())).await;
  
  let res = match callback_result {
    Ok(result) => result,
    Err(_) => {
      error!("Callback function timed out after {:?}", timeout);
      Err(eyre!("Callback function timed out after {:?}", timeout))
    }
  };
  
  // 关闭页面，必须用原始 page（Arc 不能 move 出 Page）
  if let Ok(page) = Arc::try_unwrap(page_arc) {
    if let Err(e) = page.close().await {
      error!("Failed to close page: {e}");
    }
  } else {
    error!("Failed to unwrap Arc to close page - page may still be referenced");
  }
  
  // 尝试中止处理程序任务
  browser_instance._handler_guard.abort();
  
  // 关闭浏览器
  if let Err(e) = browser_instance.browser.close().await {
    error!("Failed to close browser: {e}");
  }
  
  drop(browser_instance);
  
  // 信号量许可会在 _permit 被 drop 时自动释放
  
  res
}

pub async fn wait_for_selector(page: &Page, selector: &str, timeout: std::time::Duration) -> bool {
  let start = std::time::Instant::now();
  while start.elapsed() < timeout {
    if (page.find_element(selector).await).is_ok() {
      return true;
    }
    tokio::time::sleep(std::time::Duration::from_millis(200)).await;
  }
  false
}
