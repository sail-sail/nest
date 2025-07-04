use color_eyre::eyre::{Result, eyre};
use tracing::{info, error};

use std::sync::Arc;
use tokio::sync::Mutex;
use tokio::sync::OnceCell;
use futures::StreamExt;

use chromiumoxide::{
  Browser,
  Page,
  BrowserConfig,
};
use chromiumoxide::cdp::browser_protocol::target::CreateTargetParams;

// 添加在browser.rs中
use std::sync::atomic::{AtomicUsize, Ordering};

pub struct BrowserInstance {
  pub browser: Browser,
  _handler_guard: tokio::task::JoinHandle<()>, // 下划线前缀表示仅用于保持生命周期
}

// 全局浏览器实例
static BROWSER: OnceCell<Arc<Mutex<BrowserInstance>>> = OnceCell::const_new();

const BROWSER_PORT: u16 = 62222;

// 限制最大并发页面数
static CONCURRENT_PAGES: AtomicUsize = AtomicUsize::new(0);
const MAX_CONCURRENT_PAGES: usize = 50; // 根据系统调整

/// 检查并杀掉已有的浏览器实例
// 如果是linux或者macOS系统
#[cfg(unix)]
pub async fn check_and_kill_existing_browser() -> Result<()> {
  // 用命令行通过端口检查是否有浏览器实例在运行
  // 这里可以使用 `pgrep` 或 `lsof` 等命令来检查
  let output = tokio::process::Command::new("lsof")
    .arg("-i")
    .arg(format!(":{}", BROWSER_PORT))
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
    info!("No existing browser instance found on port {}", BROWSER_PORT);
  }
  
  Ok(())
}

/// 检查并杀掉已有的浏览器实例
// 如果是windows系统
#[cfg(windows)]
pub async fn check_and_kill_existing_browser() -> Result<()> {
  
  // 用命令行通过端口检查是否有浏览器实例在运行
  // 这里可以使用 `netstat` 或 `taskkill` 等命令来检查
  let output = tokio::process::Command::new("cmd")
    .arg("/C")
    .arg(format!("netstat -ano | findstr :{BROWSER_PORT}"))
    .output()
    .await?;
  
  if !output.stdout.is_empty() {
    // 如果有输出，说明端口被占用，尝试杀掉进程
    let pid_output = String::from_utf8_lossy(&output.stdout);
  
    for line in pid_output.lines() {
      if line.contains(&format!(":{BROWSER_PORT}")) {
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
    info!("No existing browser instance found on port {}", BROWSER_PORT);
  }
  
  Ok(())
}

async fn initialize_browser() -> Result<Arc<Mutex<BrowserInstance>>> {
  
  let browser_config = BrowserConfig::builder()
    .no_sandbox()
    .arg("--disable-setuid-sandbox")
    .arg("--disable-dev-shm-usage")
    .arg("--disable-gpu")
    .port(BROWSER_PORT)
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
              check_and_kill_existing_browser().await.unwrap_or_else(|e| {
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
          // 处理程序已结束
          info!("Handler stream ended");
          break;
        }
      }
    }
  });
  
  Ok(Arc::new(Mutex::new(BrowserInstance {
    browser,
    _handler_guard: handler_guard,
  })))
}

pub async fn get_browser_instance() -> Result<Arc<Mutex<BrowserInstance>>> {
  Ok(BROWSER.get_or_try_init(initialize_browser).await?.clone())
}

pub async fn new_page<T: Sync + Send>(
  params: impl Into<CreateTargetParams>,
  callback: impl AsyncFnOnce(Arc<Page>) -> Result<T> + Send + 'static,
) -> Result<T> {
  
  // 等待直到并发页面数小于最大值
  while CONCURRENT_PAGES.load(Ordering::SeqCst) >= MAX_CONCURRENT_PAGES {
    tokio::time::sleep(tokio::time::Duration::from_millis(100)).await;
    info!("等待页面槽位, 当前: {}, 最大: {}", 
          CONCURRENT_PAGES.load(Ordering::SeqCst), MAX_CONCURRENT_PAGES);
  }
  
  // 增加并发页面计数
  CONCURRENT_PAGES.fetch_add(1, Ordering::SeqCst);
  info!("正在打开新页面, 当前计数: {}/{}", 
        CONCURRENT_PAGES.load(Ordering::SeqCst), MAX_CONCURRENT_PAGES);
  
  let browser_instance = get_browser_instance().await?;
  let browser_instance = browser_instance.lock().await;
  
  // 创建新页面
  let page = match browser_instance.browser.new_page(params).await {
    Ok(p) => p,
    Err(e) => {
      // 出错时减少计数器
      CONCURRENT_PAGES.fetch_sub(1, Ordering::SeqCst);
      return Err(e.into());
    }
  };
  
  let page_arc = Arc::new(page);
  
  // 执行回调函数
  let res = callback(page_arc.clone()).await;
  
  // 当我们的引用是最后一个引用时，关闭页面
  if Arc::strong_count(&page_arc) == 1 {
    let page = Arc::try_unwrap(page_arc).expect("Failed to unwrap Arc");
    page.close().await?;
  }
  
  // 减少并发页面计数
  CONCURRENT_PAGES.fetch_sub(1, Ordering::SeqCst);
  info!("已关闭页面, 当前计数: {}/{}", 
        CONCURRENT_PAGES.load(Ordering::SeqCst), MAX_CONCURRENT_PAGES);
  
  drop(browser_instance);
  
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

/// 销毁浏览器实例，释放资源
pub async fn destroy_browser() -> Result<()> {
  if let Some(browser_mutex) = BROWSER.get() {
    let mut browser_instance = browser_mutex.lock().await;
    
    // 关闭浏览器
    browser_instance.browser.close().await?;
    
    // 尝试中止处理程序任务
    browser_instance._handler_guard.abort();
    
    // 释放锁，以便后续可以重置 OnceCell
    drop(browser_instance);
    
    info!("Browser instance successfully destroyed");
  }
  
  Ok(())
}
